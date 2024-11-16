import { Timestamp } from "firebase/firestore";

export interface MessageData {
  id?: string;
  createdAt: Date | Timestamp;
  message: string | null;
  image: string | null;
  sender: string;
}
