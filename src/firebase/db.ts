import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { SignUpData } from "@/types/SignUpData";
import { FirebaseError } from "firebase/app";
import { UserData } from "@/types/UserData";

export async function uploadSignupData(signUpData: SignUpData, uid: string) {
  let result: string | null = null,
    error: FirebaseError | null = null;

  try {
    const docRef = doc(db, "users", uid);
    await setDoc(docRef, signUpData);

    result = "Data uploaded successfully!";
  } catch (e) {
    error = e as FirebaseError;
  }

  return { result, error };
}

export async function isSignedUp(uid: string) {
  try {
    const docRef = doc(db, "users", uid);
    const userDoc = await getDoc(docRef);

    return userDoc.exists();
  } catch (e) {
    throw e;
  }
}

export async function getUserData(uid: string) {
  let result: UserData | null = null,
    error: FirebaseError | null = null;

  try {
    const docRef = doc(db, "users", uid);
    const userDoc = await getDoc(docRef);

    if (userDoc.exists()) {
      result = userDoc.data() as UserData;
    }
  } catch (e) {
    error = e as FirebaseError;
  }

  return { result, error };
}
