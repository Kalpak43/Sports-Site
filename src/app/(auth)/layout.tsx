"use client";
import { useAuthContext } from "@/contexts/AuthContext";
import { SignUpDataProvider } from "@/contexts/SignupDataContext";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isProfileCreated } = useAuthContext() as {
    user: User | null;
    loading: boolean;
    isProfileCreated: boolean;
  };
  const router = useRouter();

  if (user) {
    console.log("Auth: ", user);

    if (!isProfileCreated) {
      router.push("/signup/basic-details");
    } else {
      router.replace("/");
      return <></>;
    }
  }

  return <>{children}</>;
}
