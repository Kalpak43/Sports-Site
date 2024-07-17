"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { SignUpDataProvider } from "@/contexts/SignupDataContext";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProfileCreationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isProfileCreated } = useAuthContext() as {
    user: User | null;
    loading: boolean;
    isProfileCreated: boolean;
  };
  const router = useRouter();

  if (isProfileCreated) {
    router.replace("/");

    return <></>;
  }

  return <SignUpDataProvider>{children}</SignUpDataProvider>;
}
