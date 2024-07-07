import SignupForm from "@/components/SignupForm";
import React from "react";

export default function page() {
  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center px-8 md:px-20">
      <h1 className="text-2xl font-[600] text-center">
        Join Millions of Sports Enthusiasts!!!
      </h1>
      <br />
      <SignupForm />
    </main>
  );
}
