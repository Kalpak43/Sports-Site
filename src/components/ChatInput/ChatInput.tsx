import React, { useState } from "react";
import { IoSend, IoImages } from "react-icons/io5";
import Button from "../Button/Button";
import { sendMessage } from "@/firebase/db";
import { useAuthContext } from "@/contexts/AuthContext";
import Image from "next/image";
import { motion } from "framer-motion";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/firebase/firebase";

export default function ChatInput({ chatId }: { chatId: string }) {
  const { user, userData } = useAuthContext();
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<string | null>(null);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-secondary py-4 px-4 rounded-t-2xl flex justify-center gap-4">
      <form className="input input-bordered flex items-center gap-4 flex-1 max-w-[500px] relative">
        {image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-0 -translate-y-[101%] mb-4 preview-container p-4 bg-base-200 inset-x-0 rounded-2xl border-2"
          >
            <Image
              src={image}
              alt="image-preview"
              width={100}
              height={100}
              className="aspect-square w-full h-full"
            />
          </motion.div>
        )}
        <label htmlFor="" className="relative">
          <input
            type="file"
            className="grow absolute inset-0 opacity-0"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                let url = URL.createObjectURL(file);
                console.log(url);
                setImage(url);
              }
            }}
          />
          <IoImages size={20} />
        </label>
        <input
          type="text"
          className="grow"
          placeholder="Type Your Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          onClick={async (e) => {
            e.preventDefault();
            await sendMessage(chatId, {
              message: message,
              image: image,
              sender: user?.uid as string,
              createdAt: new Date(),
            });

            setMessage("");

            setImage(null);
          }}
        >
          <IoSend size={20} />
        </Button>
      </form>
    </div>
  );
}
