"use client";

import { getUserData, isSignedUp } from "@/firebase/db";
import { auth } from "@/firebase/firebase";
import { AuthData } from "@/types/AuthData";
import { UserData } from "@/types/UserData";
import { User, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export const AuthContext = createContext<AuthData | null>(null);

export const useAuthContext = () => useContext(AuthContext) as AuthData;

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isProfileCreated, setIsProfileCreated] = useState<boolean>(false);
  const [dataUploaded, setDataUploaded] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        console.log(user);
        const res = await isSignedUp(user.uid);

        if (res) {
          setIsProfileCreated(res);
          const { result, error } = await getUserData(user.uid);
          result && setUserData(result);
          error && alert(error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && user && !isProfileCreated) {
      router.push("/signup/basic-details");
    }
  }, [loading, user, isProfileCreated, router]);

  useEffect(() => {
    const setData = async () => {
      if (user && dataUploaded) {
        setIsProfileCreated(true);
        const { result, error } = await getUserData(user.uid);
        result && setUserData(result);
        error && alert(error);
      }
    };

    setData();
  }, [dataUploaded]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isProfileCreated,
        userData,
        setUserData,
        setDataUploaded,
      }}
    >
      {loading ? (
        <div className="min-h-[100dvh] flex items-center justify-center">
          <span className="loading loading-bars loading-lg"></span>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
