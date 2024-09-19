import { Timestamp } from "firebase-admin/firestore";


export const setupChat = async (app: any, uid1: string, uid2: string) => {
  const chatDoc = await getChatId(app, uid1, uid2);
  if (chatDoc) {
    return chatDoc;
  }

  const db = app.firestore();
  const chatRef = {
    createdAt: Timestamp.now(),
    members: [uid1, uid2],
  };
  const chat = await db.collection("chats").add(chatRef);

  return {
    id: chat.id,
    ...chatRef,
  };
};

export const getChatId = async (app: any, uid1: string, uid2: string) => {
  const db = app.firestore();

  const querySnapshot = await db
    .collection("chats")
    .where("members", "array-contains", uid1)
    .get();

  if (querySnapshot.empty) {
    return null;
  }

  const chatDoc = querySnapshot.docs.find((doc: any) => {
    const members = doc.data().members;
    return members.includes(uid1) && members.includes(uid2);
  });

  if (!chatDoc) {
    return null;
  }

  return {
    id: chatDoc.id,
    ...chatDoc.data(),
  };
};
