"use client";

import { isSignedUp } from "@/firebase/db";
import { auth } from "@/firebase/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  isProfileCreated: boolean;
} | null>(null);

export const useAuthContext = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isProfileCreated, setIsProfileCreated] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const res = await isSignedUp(user.uid);
        setIsProfileCreated(res);
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

  return (
    <AuthContext.Provider value={{ user, loading, isProfileCreated }}>
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
