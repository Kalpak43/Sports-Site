import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
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

export async function editUserData(uid: string, userData: UserData) {
  let result: string | null = null,
    error: FirebaseError | null = null;

  try {
    const docRef = doc(db, "users", uid);
    await setDoc(docRef, userData);

    result = "Data edited successfully!";
  } catch (e) {
    error = e as FirebaseError;
  }

  return { result, error };
}

export async function searchUsers(searchQuery: string) {
  let result: UserData[] = [],
    error: FirebaseError | null = null;

  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", searchQuery));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      result.push(doc.data() as UserData);
    });

    console.log(result);
  } catch (e) {
    error = e as FirebaseError;
  }

  return { result, error };
}

export async function searchUser(searchQuery: string) {
  let result: UserData | null = null,
    error: FirebaseError | null = null;

  try {
    const usersRef = collection(db, "users");
    // only get one document
    const q = query(usersRef, where("username", "==", searchQuery));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      result = doc.data() as UserData;
    });
  } catch (e) {
    error = e as FirebaseError;
  }

  return { result, error };
}
