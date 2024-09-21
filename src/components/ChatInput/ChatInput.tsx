import React, { useState } from "react";
import { IoSend } from "react-icons/io5";
import Button from "../Button/Button";
import { sendMessage } from "@/firebase/db";
import { useAuthContext } from "@/contexts/AuthContext";

export default function ChatInput({ chatId }: { chatId: string }) {
  const { user } = useAuthContext();
  const [message, setMessage] = useState("");

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-secondary py-4 px-4 rounded-t-2xl">
      <label className="input input-bordered flex items-center gap-2 max-w-[400px] mx-auto">
        <input
          type="text"
          className="grow"
          placeholder="Type Your Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          onClick={async () => {
            await sendMessage(chatId, {
              message: message,
              sender: user?.uid as string,
              createdAt: new Date(),
            });
            setMessage("");
          }}
        >
          <IoSend size={20} />
        </Button>
      </label>
    </div>
  );
}
