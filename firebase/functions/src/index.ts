/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { getUserDoc } from "./requests/getUserDoc";
import { setupChat } from "./requests/chatRequests";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript


const admin = require('firebase-admin');
const app = admin.initializeApp();

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});


export const getUserDocFromUID = onRequest(async (request, response) => {
  const {uid} = request.query;
  const doc = await getUserDoc(uid as string);

  response.send(doc);
});

export const getChat = onRequest(async (request, response) => {
  const { uid1, uid2 } = request.query;

  const chatId = await setupChat(app, uid1 as string, uid2 as string);

  response.send({ chatId });
});
