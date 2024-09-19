

export const setupChat = async (app: any, uid1: string, uid2: string) => {
    const chatId = await getChatId(app, uid1, uid2);
    if(chatId) {
        return chatId;
    }

    const db = app.firestore();
    const chat = await db.collection('chats').add({
        createdAt: app.firestore.FieldValue.serverTimestamp(),
        members: [uid1, uid2],
    });

    // add messages subcollection
    await chat.collection("messages").add({
        createdAt: app.firestore.FieldValue.serverTimestamp(),
        content: "CREATED ON " + new Date().toISOString(),
        owner: "ADMIN"
    })

    return chat.id;
}

export const getChatId = async (app: any, uid1: string, uid2: string) => {
    const db = app.firestore();
    
    const querySnapshot = await db.collection('chats')
        .where('members', 'array-contains', uid1)
        .get();


    if (querySnapshot.empty) {
        return null;
    }

    const chatDoc = querySnapshot.docs.find((doc:any) => {
        const members = doc.data().members;
        return members.includes(uid1) && members.includes(uid2);
      });

    if(!chatDoc) {
        return null;
    }

    return chatDoc.id;
}