import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "./firebase";
import { FirebaseError } from "firebase/app";

export async function signUpWithEmail(email: string, password: string) {
  let result: UserCredential | null = null,
    error: FirebaseError | null = null;

  try {
    result = await createUserWithEmailAndPassword(auth, email, password);
    await sendVerifyEmail();
  } catch (e) {
    error = e as FirebaseError;
  }

  return { result, error };
}

export async function sendVerifyEmail() {
  let result: string | null = null,
    error: FirebaseError | null = null;

  try {
    await sendEmailVerification(auth.currentUser!);
    result = "Email sent!";
  } catch (e) {
    error = e as FirebaseError;
  }

  return { result, error };
}

export async function signInWithEmail(email: string, password: string) {
  let result: UserCredential | null = null,
    error: FirebaseError | null = null;

  try {
    result = await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    error = e as FirebaseError;
  }

  return { result, error };
}

export async function signInWithGoogle() {
  let result: UserCredential | null = null,
    error: FirebaseError | null = null;

  try {
    const provider = new GoogleAuthProvider();
    result = await signInWithPopup(auth, provider);
  } catch (e) {
    error = e as FirebaseError;
  }

  return { result, error };
}

export async function logOut() {
  let result: string | null = null,
    error: FirebaseError | null = null;

  try {
    await signOut(auth);
    result = "success";
  } catch (e) {
    error = e as FirebaseError;
  }

  return { result, error };
}

export async function forgotPassword(email: string) {
  let result: string | null = null,
    error: FirebaseError | null = null;

  try {
    await sendPasswordResetEmail(auth, email);
    result = "success";
  } catch (e) {
    error = e as FirebaseError;
  }

  return { result, error };
}
