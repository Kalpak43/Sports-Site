import { User } from "firebase/auth";
import { UserData } from "./UserData";


export interface AuthData {
  user: User | null;
  loading: boolean;
  isProfileCreated: boolean;
  userData: UserData | null;
  setDataUploaded: (data: boolean) => void;
  setUserData: (data: UserData) => void;
}
