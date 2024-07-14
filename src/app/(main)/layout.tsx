"use client";
import Navbar from "@/components/Navbar";
import React from "react";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
// TODO: Not really protected


  return (
    <main className="bg-neutral">
      <Navbar />
      {children}
    </main>
  );
}
