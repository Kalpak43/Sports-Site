"use client";
import Modal from "@/components/Modal";
import NewPostForm from "@/components/NewPostForm";
import { useAuthContext } from "@/contexts/AuthContext";
import { User } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
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
  return (
    <>
      {children}
    </>
  );
}
