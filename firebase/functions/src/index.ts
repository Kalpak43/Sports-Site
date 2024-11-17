/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onCall, onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { getUserDoc } from "./requests/getUserDoc";
import { setupChat } from "./requests/chatRequests";
import { sendEmailNotification } from "./requests/sendEmailNotification";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

const admin = require("firebase-admin");
const app = admin.initializeApp();
const functions = require("firebase-functions");

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const getUserDocFromUID = onRequest(async (request, response) => {
  const { uid } = request.query;
  const doc = await getUserDoc(app, uid as string);

  response.send(doc);
});

// export const getChat = onRequest(async (request, response) => {
//   const { uid1, uid2 } = request.query;

//   const chatId = await setupChat(app, uid1 as string, uid2 as string);

//   response.send({ chatId });
// });

export const getChat = onCall(async (request) => {
  const { uid1, uid2 } = request.data;

  const chatId = await setupChat(app, uid1, uid2);

  return { ...chatId };
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
