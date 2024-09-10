

const admin = require('firebase-admin');

admin.initializeApp();

export const getUserDoc = async (uid: string) => {
    const db = admin.firestore();
    const doc = await db.collection('users').doc(uid).get();

    return doc.data();
}