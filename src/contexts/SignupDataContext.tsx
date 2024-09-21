"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const signUpDataContext = createContext<{
  signUpData: SignUpData;
  setSignUpData: React.Dispatch<React.SetStateAction<SignUpData>>;
  setSessionStorage: (data: SignUpData) => void;
} | null>(null);

export const useSignUpDataContext = () => useContext(signUpDataContext);

export function SignUpDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [signUpData, setSignUpData] = useState<SignUpData>({
    name: "",
    username: "",
    bio: "",
    profilePhoto: "",
    dob: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    preferences: [],
  });

  useEffect(() => {
    const details = sessionStorage.getItem("details");

    if (details) {
      const parsedDetails = JSON.parse(details);

      setSignUpData({
        ...signUpData,
        ...parsedDetails,
      });
    }
  }, []);

  const setSessionStorage = (data: SignUpData) => {
    sessionStorage.setItem("details", JSON.stringify(data));
  };

  return (
    <signUpDataContext.Provider
      value={{ signUpData, setSignUpData, setSessionStorage }}
    >
      {children}
    </signUpDataContext.Provider>
  );
}
