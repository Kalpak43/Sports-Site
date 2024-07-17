"use client";
import Navbar from "@/components/Navbar";
import { useAuthContext } from "@/contexts/AuthContext";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // TODO: Not really protected

  return (
    <main className="bg-neutral">
      <Navbar />
      <main className="min-h-[90vh] rounded-t-3xl bg-base-100 p-4 relative overflow-clip">
        {children}
      </main>
    </main>
  );
}
