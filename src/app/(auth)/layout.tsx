"use client";
import { useAuthContext } from "@/contexts/AuthContext";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useAuthContext() as {
    user: User | null;
    loading: boolean;
  };
  const router = useRouter();

  if (user) {
    console.log("Auth: ", user);
    router.replace("/");

    return <></>;
  }

  return <>{children}</>;
}
