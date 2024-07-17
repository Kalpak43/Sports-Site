"use client";
import { useAuthContext } from "@/contexts/AuthContext";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const { user, isProfileCreated } = useAuthContext() as {
    user: User | null;
    isProfileCreated: boolean;
  };

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else {
      if (!isProfileCreated) {
        router.replace("/signup/basic-details");
      }
    }
  }, [user, isProfileCreated]);
  return <>{children}</>;
}
