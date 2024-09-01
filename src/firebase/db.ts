import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, storage } from "./firebase";
import { SignUpData } from "@/types/SignUpData";
import { FirebaseError } from "firebase/app";
import { UserData } from "@/types/UserData";
import { PostData } from "@/types/PostData";
import { mediaUpload } from "./storage";
import {
  deleteObject,
  getDownloadURL,
  ref,
  StorageReference,
} from "firebase/storage";

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

export async function makePost(post: PostData, uid: string) {
  let result: string | null = null,
    error: FirebaseError | null = null;

  let mediaUrls: StorageReference[] = [];

  try {
    await Promise.all(
      post.media.map(async (m) => {
        const { result, error } = await mediaUpload(m, "user-posts");
        if (result) {
          mediaUrls.push(result);
        } else {
          throw error;
        }
      })
    );

    await Promise.all(
      mediaUrls.map(async (m, i) => {
        const url = await getDownloadURL(m);
        post.media[i] = url;
      })
    );

    const collectionRef = collection(db, "posts");
    const postDocRef = await addDoc(collectionRef, {
      uid: uid,
      ...post,
    });

    const likesCollectionRef = collection(postDocRef, "likes");
    const initialLike = doc(likesCollectionRef, uid);
    await setDoc(initialLike, {
      createdAt: new Date().toISOString(),
    });

    result = "Post made successfully!";
  } catch (e) {
    error = e as FirebaseError;
    await Promise.all(
      mediaUrls.map(async (m) => {
        await deleteObject(m);
      })
    );
  }

  return { result, error };
}

export async function getAllPosts() {
  let result: PostData[] = [],
    error: FirebaseError | null = null;

  try {
    const postsRef = collection(db, "posts");
    const querySnapshot = await getDocs(postsRef);
    querySnapshot.forEach((doc) => {
      result.push({
        id: doc.id,
        ...doc.data(),
      } as PostData);
    });
  } catch (e) {
    error = e as FirebaseError;
  }

  return { result, error };
}

export async function getAllPostsByUser(uid: string) {
  let result: PostData[] = [],
    error: FirebaseError | null = null;

  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      result.push({
        id: doc.id,
        ...doc.data(),
      } as PostData);
    });
  } catch (e) {
    error = e as FirebaseError;
  }

  return { result, error };
}

export async function getSinglePost(id: string, uid: string) {
  let result: PostData | null = null,
    error: FirebaseError | null = null;

  try {
    const postRef = doc(db, "posts", id);
    const postDoc = await getDoc(postRef);

    if (postDoc.exists()) {
      result = {
        id: postDoc.id,
        ...postDoc.data(),
      } as PostData;

      result.liked = await checkLiked(id, uid)
        .then((res) => res.result)
        .catch((e) => {
          throw e;
        });

      const userDoc = await getUserData(result.uid as string);

      if (userDoc.error) {
        throw userDoc.error;
      }

      if (userDoc.result) {
        result.userHandle = userDoc.result.username;
        result.userProfile = userDoc.result.profilePhoto;
      }
    }
  } catch (e) {
    error = e as FirebaseError;
  }

  return { result, error };
}

export async function likePost(id: string, uid: string) {
  let result: string | null = null,
    error: FirebaseError | null = null;

  try {
    const postRef = doc(db, "posts", id);
    const likesDocRef = doc(db, "posts", id, "likes", uid);
    await setDoc(likesDocRef, {
      createdAt: new Date().toISOString(),
    });

    await updateDoc(postRef, {
      likes: increment(1),
    });

    result = "Post liked successfully!";
  } catch (e) {
    error = e as FirebaseError;
  }

  return { result, error };
}

export async function checkLiked(id: string, uid: string) {
  let result: boolean = false,
    error: FirebaseError | null = null;

  try {
    if (uid !== "") {
      const likesDocRef = doc(db, "posts", id, "likes", uid);
      const likesDoc = await getDoc(likesDocRef);

      result = likesDoc.exists();
    }
  } catch (e) {
    error = e as FirebaseError;
  }

  return { result, error };
}

export async function dislikePost(id: string, uid: string) {
  let result: string | null = null,
    error: FirebaseError | null = null;

  try {
    const postRef = doc(db, "posts", id);
    const likesDocRef = doc(db, "posts", id, "likes", uid);
    await deleteDoc(likesDocRef);
    
    await updateDoc(postRef, {
      likes: increment(-1),
    });

    result = "Post disliked successfully!";
  } catch (e) {
    error = e as FirebaseError;
  }

  return { result, error };
}
