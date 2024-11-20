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
import { db, functions, storage } from "./firebase";
import { FirebaseError } from "firebase/app";
import { mediaUpload } from "./storage";
import {
  deleteObject,
  getDownloadURL,
  ref,
  StorageReference,
} from "firebase/storage";
import { httpsCallable } from "firebase/functions";
import { MessageData } from "@/types/MessageData";

// User functions
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
      result = {
        uid: doc.id,
        ...doc.data(),
      } as UserData;
    });
  } catch (e) {
    error = e as FirebaseError;
  }

  return { result, error };
}

// Post functions
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

    // const likesCollectionRef = collection(postDocRef, "likes");
    // const initialLike = doc(likesCollectionRef, uid);
    // await setDoc(initialLike, {
    //   createdAt: new Date().toISOString(),
    // });

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

// like and dislike post
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

// comment functions
export async function addComment(id: string, comment: CommentData) {
  let result: string | null = null,
    error: FirebaseError | null = null;

  try {
    const postRef = doc(db, "posts", id);
    const commentsCollectionRef = collection(postRef, "comments");

    await addDoc(commentsCollectionRef, {
      ...comment,
    });

    await updateDoc(postRef, {
      comments: increment(1),
    });

    result = "Comment added successfully!";
  } catch (e) {
    error = e as FirebaseError;
  }

  return { result, error };
}

export async function getComments(id: string) {
  let result: CommentData[] = [],
    error: FirebaseError | null = null;

  try {
    const postRef = doc(db, "posts", id);
    const commentsCollectionRef = collection(postRef, "comments");
    const querySnapshot = await getDocs(commentsCollectionRef);

    querySnapshot.forEach((doc) => {
      result.push({
        cid: doc.id,
        ...doc.data(),
      } as CommentData);
    });
  } catch (e) {
    error = e as FirebaseError;
  }

  return { result, error };
}

// following system

export async function followUser(uid: string, followerUid: string) {
  let result: string | null = null,
    error: FirebaseError | null = null;

  try {
    const userRef = doc(db, "users", uid);
    const followersCollectionRef = collection(userRef, "followers");

    const followerRef = doc(db, "users", followerUid);
    const followingCollectionRef = collection(followerRef, "following");

    // add doc with id of followerUid
    await setDoc(doc(followersCollectionRef, followerUid), {
      createdAt: new Date().toISOString(),
    });

    await setDoc(doc(followingCollectionRef, uid), {
      createdAt: new Date().toISOString(),
    });

    await updateDoc(userRef, {
      followers: increment(1),
    });

    await updateDoc(followerRef, {
      following: increment(1),
    });

    result = "Followed successfully!";
  } catch (e) {
    error = e as FirebaseError;
  }

  return { result, error };
}

export async function checkFollow(uid: string, followingUid: string) {
  let result: boolean = false,
    error: FirebaseError | null = null;

  try {
    const userRef = doc(db, "users", uid);

    const followingCollectionRef = collection(userRef, "following");
    const followingDocRef = doc(followingCollectionRef, followingUid);

    const followingDoc = await getDoc(followingDocRef);
    console.log(followingDoc);
    result = followingDoc.exists();
  } catch (e) {
    error = e as FirebaseError;
  }

  return { result, error };
}

export async function unfollowUser(uid: string, followerUid: string) {
  let result: string | null = null,
    error: FirebaseError | null = null;

  try {
    const userRef = doc(db, "users", uid);
    const followersCollectionRef = collection(userRef, "followers");

    const followerRef = doc(db, "users", followerUid);
    const followingCollectionRef = collection(followerRef, "following");

    await deleteDoc(doc(followersCollectionRef, followerUid));
    await deleteDoc(doc(followingCollectionRef, uid));

    await updateDoc(userRef, {
      followers: increment(-1),
    });

    await updateDoc(followerRef, {
      following: increment(-1),
    });

    result = "Unfollowed successfully!";
  } catch (e) {
    error = e as FirebaseError;
  }

  return { result, error };
}

// // Chat sysytem
// export async function createChat(uid1: string, uid2: string) {
//   let result: ChatData | null = null,
//     error: FirebaseError | null = null;

//   try {
//     const chatsCollectionRef = collection(db, "chats");
//     const chatDocRef = await addDoc(chatsCollectionRef, {
//       createdAt: new Date().toISOString(),
//       members: [uid1, uid2],
//     });

//     result = {
//       id: chatDocRef.id,
//       createdAt: new Date(),
//       members: [uid1, uid2],
//     };
//   } catch (e) {
//     error = e as FirebaseError;
//   }

//   return { result, error };
// }

// export async function getChat(uid1: string, uid2: string) {
//   let result: ChatData | null = null,
//     error: FirebaseError | null = null;

//   try {

//     const chatsCollectionRef = collection(db, "chats");
//     const q = query(
//       chatsCollectionRef,
//       where("members", "array-contains-any", [uid1, uid2])
//     );

//     const querySnapshot = await getDocs(q);

//     result = {
//       id: querySnapshot.docs[0].id,
//       ...querySnapshot.docs[0].data(),
//     } as ChatData;
//   } catch (e) {
//     error = e as FirebaseError;
//   }

//   return { result, error };
// }

export async function setupChat(uid1: string, uid2: string) {
  let result: ChatData | null = null,
    error: FirebaseError | null = null;

  try {
    const getChat = httpsCallable(functions, "getChat");

    const res = await getChat({ uid1, uid2 });
    if (res) {
      result = res.data as ChatData;
    }
  } catch (e) {
    error = e as FirebaseError;
  }

  return { result, error };
}

export async function sendMessage(chatId: string, message: MessageData) {
  let result: string | null = null,
    error: FirebaseError | null = null;

  try {
    const chatRef = doc(db, "chats", chatId);
    const messagesCollectionRef = collection(chatRef, "messages");

    if (message.image) {
      const { result, error } = await mediaUpload(message.image, "chats");
      if (result) {
        message.image = await getDownloadURL(result);
      } else {
        throw error;
      }
    }

    await addDoc(messagesCollectionRef, {
      ...message,
    });

    result = "Message sent successfully!";
  } catch (e) {
    error = e as FirebaseError;
  }

  return { result, error };
}
