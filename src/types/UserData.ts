export interface UserData {
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
