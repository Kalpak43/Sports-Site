"use client";

import ChatInput from "@/components/ChatInput/ChatInput";
import { useAuthContext } from "@/contexts/AuthContext";
import { db } from "@/firebase/firebase";
import { MessageData } from "@/types/MessageData";
import { DocumentData } from "firebase-admin/firestore";
import { collection, doc, onSnapshot, Timestamp } from "firebase/firestore";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ChatPage() {
  const { user } = useAuthContext();
  const { id } = useParams();
  const [docData, setDocData] = useState<MessageData[]>([]);
  const [message, setMessage] = useState("Loading...");

  const [user1Messages, setUser1Messages] = useState<MessageData[]>([]);
  const [user2Messages, setUser2Messages] = useState<MessageData[]>([]);

  useEffect(() => {
    const colRef = collection(db, "chats");
    const docRef = doc(colRef, id as string);
    const messagesRef = collection(docRef, "messages");

    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      const docs = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as MessageData;
      });

      docs.sort((a, b) => {
        const dateA =
          (a.createdAt as Timestamp).seconds * 1000 +
          (a.createdAt as Timestamp).nanoseconds / 1000000;
        const dateB =
          (b.createdAt as Timestamp).seconds * 1000 +
          (b.createdAt as Timestamp).nanoseconds / 1000000;
        return dateA - dateB;
      });

      setDocData(docs);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-4 pb-20">
      {docData.map((message, index) => {
        return (
          <div key={index}>
            <div
              key={index}
              className={`chat ${
                message.sender === user?.uid ? "chat-end" : "chat-start"
              }`}
            >
              <div className="chat-footer">
                <time className="text-xs opacity-50">
                  {(() => {
                    const now = new Date().getTime();
                    const messageTime = (message.createdAt as Timestamp)
                      .toDate()
                      .getTime();
                    const diffInSeconds = Math.floor(
                      (now - messageTime) / 1000
                    );

                    if (diffInSeconds < 60) {
                      return `${diffInSeconds} seconds ago`;
                    } else if (diffInSeconds < 3600) {
                      const diffInMinutes = Math.floor(diffInSeconds / 60);
                      return `${diffInMinutes} minutes ago`;
                    } else if (diffInSeconds < 86400) {
                      const diffInHours = Math.floor(diffInSeconds / 3600);
                      return `${diffInHours} hours ago`;
                    } else {
                      const diffInDays = Math.floor(diffInSeconds / 86400);
                      return `${diffInDays} days ago`;
                    }
                  })()}
                </time>
              </div>
              <div className="chat-bubble">{message.message}</div>
            </div>
          </div>
        );
      })}
      <ChatInput chatId={id as string} />
    </div>
  );
}
