"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { User } from "firebase/auth";
import React from "react";

export default function page() {
  const { user } = useAuthContext() as {
    user: User | null;
  };
  return <div>{user?.email}</div>;
}
