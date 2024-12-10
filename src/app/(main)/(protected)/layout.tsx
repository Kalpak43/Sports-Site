"use client";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const { user, isProfileCreated, loading } = useAuthContext();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else {
        if (!isProfileCreated) {
          router.replace("/signup/basic-details");
        }
      }
    }
  }, [user, isProfileCreated, loading]);

  
  return <>{children}</>;
}
