"use client";
import { useAuthContext } from "@/contexts/AuthContext";
import { SignUpDataProvider } from "@/contexts/SignupDataContext";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

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

  useEffect(() => {
    if (user) {
      if (!isProfileCreated) {
        router.replace("/signup/basic-details");
      } else {
        router.replace("/");
      }
    }
  }, [user, isProfileCreated, router]);

  return <>{children}</>;
}
