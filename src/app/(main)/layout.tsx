"use client";
import Modal from "@/components/Modal";
import Navbar from "@/components/Navbar";
import NewPostForm from "@/components/NewPostForm";
import { useAuthContext } from "@/contexts/AuthContext";
import { User } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // TODO: Not really protected
  const searchParams = useSearchParams();
  const new_post = searchParams.get("new_post");

  return (
    <main className="bg-neutral">
      <Navbar />{" "}
      <Modal show={new_post === "true"}>
        <NewPostForm />
      </Modal>
      <main className="min-h-[90vh] rounded-t-3xl bg-base-100 p-4 relative overflow-clip">
        {children}
      </main>
    </main>
  );
}
