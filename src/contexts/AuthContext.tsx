"use client";

import { isSignedUp } from "@/firebase/db";
import { auth } from "@/firebase/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileCreated, setIsProfileCreated] = useState(false);

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
