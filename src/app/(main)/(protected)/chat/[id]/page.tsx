"use client";

import ChatInput from "@/components/ChatInput/ChatInput";
import { useAuthContext } from "@/contexts/AuthContext";
import { db } from "@/firebase/firebase";
import { MessageData } from "@/types/MessageData";
import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  Timestamp,
} from "firebase/firestore";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { DocumentData } from "firebase-admin/firestore";

export default function ChatPage() {
  const { user } = useAuthContext();
  const { id } = useParams();
  const [docData, setDocData] = useState<MessageData[]>([]);
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null); // Tracks the last visible document
  const [loadingMore, setLoadingMore] = useState(false); // Prevents multiple fetches
  const chatContainerRef = useRef<HTMLDivElement>(null); // Ref for the scrollable chat container
  const [newMessage, setNewMessage] = useState(true);

  useEffect(() => {
    const colRef = collection(db, "chats");
    const docRef = doc(colRef, id as string);
    const messagesRef = collection(docRef, "messages");

    const q = query(messagesRef, orderBy("createdAt", "desc"), limit(10));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot
        .docChanges()
        .filter((change) => {
          return change.type === "added";
        })
        .map((change) => ({
          id: change.doc.id,
          ...change.doc.data(),
        })) as MessageData[];

      docs.sort((a, b) => {
        return (
          (a.createdAt as Timestamp).toDate().getTime() -
          (b.createdAt as Timestamp).toDate().getTime()
        );
      });

      setDocData((x) => [...x, ...docs]);
      setNewMessage(true);

      if (docs.length > 1) {
        console.log(snapshot.docs.length);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Scroll event listener
  useEffect(() => {
    const loadOlderMessages = async () => {
      if (!lastVisible || loadingMore) return;

      setLoadingMore(true);

      const colRef = collection(db, "chats");
      const docRef = doc(colRef, id as string);
      const messagesRef = collection(docRef, "messages");

      const q = query(
        messagesRef,
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(10)
      );

      const snapshot = await getDocs(q);

      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MessageData[];

      docs.sort((a, b) => {
        return (
          (a.createdAt as Timestamp).toDate().getTime() -
          (b.createdAt as Timestamp).toDate().getTime()
        );
      });

      setDocData((prev) => [...docs.reverse(), ...prev]); // Prepend new messages
      setLoadingMore(false);

      // Update the last visible document
      if (snapshot.docs.length > 0) {
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      }
    };

    const handleScroll = () => {
      if (document.documentElement.scrollTop === 0) {
        loadOlderMessages(); // Trigger when user reaches the top
      }
    };

    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [lastVisible, loadingMore]);

  useEffect(() => {
    newMessage &&
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });

    setNewMessage(false);
  }, [docData, newMessage]);

  return (
    <div className="p-4 pb-20 chat-container" ref={chatContainerRef}>
      {docData.map((message, index) => {
        return (
          <div
            key={index}
            className={`${index === docData.length - 1} && recent`}
          >
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
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
                className="chat-bubble space-y-2"
              >
                {message.image && (
                  <Image
                    src={message.image}
                    alt="image"
                    width={100}
                    height={100}
                    className="aspect-square max-w-[200px] w-full h-full rounded-xl"
                  />
                )}
                {message.message}
              </motion.div>
            </div>
          </div>
        );
      })}
      <ChatInput chatId={id as string} />
    </div>
  );
}
