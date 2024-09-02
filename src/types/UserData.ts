export interface UserData {
  uid?: string;
  address: string;
  bio: string;
  city: string;
  dob: string;
  gender: "male" | "female" | "other";
  name: string;
  preferences: string[];
  profilePhoto: string | null;
  state: string;
  username: string;
}
