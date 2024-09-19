

export const getUserDoc = async (app: any ,uid: string) => {
    const db = app.firestore();
    const doc = await db.collection('users').doc(uid).get();

    return doc.data();
}





