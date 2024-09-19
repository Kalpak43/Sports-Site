"use client";

import ChatInput from "@/components/ChatInput/ChatInput";
import { useParams } from "next/navigation";
import React, { useState } from "react";

export default function ChatPage() {
  const { id } = useParams();
  const [docData, setDocData] = useState();



  return <div>
    <ChatInput />
  </div>;
}
