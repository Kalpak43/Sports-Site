import { User } from "firebase/auth";


interface AuthData {
  user: User | null;
  loading: boolean;
  isProfileCreated: boolean;
  userData: UserData | null;
  setDataUploaded: (data: boolean) => void;
  setUserData: (data: UserData) => void;
}
