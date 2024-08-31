import { FirebaseError } from "firebase/app";
import { getDownloadURL, ref, StorageReference, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { storage } from "./firebase";
import { fetchBlobFromUrl } from "@/utils/fetchBlob";

export async function mediaUpload(media: string, route: string) {
  let result: StorageReference | null = null;
  let error: FirebaseError | null = null;

  const mediaBlob = await fetchBlobFromUrl(media);

  try {
    const mediaRef = ref(storage, `${route}/${uuidv4()}`);
    const snapshot = await uploadBytes(mediaRef, mediaBlob);


    result = mediaRef;
  } catch (e) {
    error = e as FirebaseError;
  }

  return { result, error };
}
