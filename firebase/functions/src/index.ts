import {onCall, onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {getUserDoc} from "./requests/getUserDoc";
import {setupChat} from "./requests/chatRequests";
import {sendEmailNotification} from "./requests/sendEmailNotification";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as cors from "cors";

const app = admin.initializeApp();
const corsHandler = cors({origin: true});

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

export const getUserDocFromUID = onRequest(async (request, response) => {
  const {uid} = request.query;
  const doc = await getUserDoc(app, uid as string);

  response.send(doc);
});

// export const getChat = onRequest(async (request, response) => {
//   const { uid1, uid2 } = request.query;

//   const chatId = await setupChat(app, uid1 as string, uid2 as string);

//   response.send({ chatId });
// });

export const getChat = onCall(async (request) => {
  const {uid1, uid2} = request.data;

  const chatId = await setupChat(app, uid1, uid2);

  return {...chatId};
});

export const NotifyUser = functions.firestore
  .document("chats/{chatId}/messages/{messageId}")
  .onCreate(async (snapshot: any, context: any) => {
    const message = snapshot.data();

    const chatId = context.params.chatId;
    const chatDoc = await admin
      .firestore()
      .collection("chats")
      .doc(chatId)
      .get();
    const chatData = chatDoc.data();

    if (!chatData) {
      return;
    }

    const receiverId: string | null = chatData.members.filter(
      (member: string) => member !== message.sender
    )[0];

    if (!receiverId) {
      return;
    }

    const userRecord = await admin.auth().getUser(receiverId);
    const receiverEmail = userRecord.email;

    if (!receiverEmail) {
      logger.warn(`Receiver email not found for UID: ${receiverId}`);
      return;
    }

    // You can now use the receiverEmail for further processing
    logger.info(`Receiver email: ${receiverEmail}`);

    const senderId = message.sender;
    const senderRecord = await admin.auth().getUser(senderId);
    const senderName = senderRecord.displayName;

    if (!senderName) {
      logger.warn(`Sender name not found for UID: ${senderId}`);
      return;
    }

    logger.info(`Sender name: ${senderName}`);
    const senderDoc = await admin
      .firestore()
      .collection("users")
      .doc(senderId)
      .get();
    const senderData = senderDoc.data();

    if (!senderData) {
      logger.warn(`Sender data not found for UID: ${senderId}`);
      return;
    }

    const senderUsername = senderData.username;

    if (!senderUsername) {
      logger.warn(`Sender username not found for UID: ${senderId}`);
      return;
    }

    logger.info(`Sender username: ${senderUsername}`);

    await sendEmailNotification(receiverEmail, {
      ...message,
      sender: senderUsername,
    });

    return;
  });

export const createMapsSession = functions.https.onRequest(
  async (req: any, res: any) => {
    corsHandler(req, res, async () => {
      const apiKey = functions.config().googlemaps.apikey;
      const googleMapsUrl = `https://tile.googleapis.com/v1/createSession?key=${apiKey}`;

      try {
        const response = await fetch(googleMapsUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mapType: "roadmap",
            language: "en",
            region: "us",
          }),
        });

        const data = await response.json();

        console.log(data);

        res.status(200).send("Session created");
      } catch (e: any) {
        res.send("Error creating session");
        res.status(500).send("Error creating session");
      }
    });
  }
);
