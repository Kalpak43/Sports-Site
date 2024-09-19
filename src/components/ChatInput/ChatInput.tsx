import React from "react";
import { IoSend } from "react-icons/io5";
import Button from "../Button/Button";

export default function ChatInput() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-secondary py-4 px-4 rounded-t-2xl">
      <label className="input input-bordered flex items-center gap-2 max-w-[400px] mx-auto">
        <input type="text" className="grow" placeholder="Type Your Message" />
        <Button onClick={() => {}}>
          <IoSend size={20} />
        </Button>
      </label>
    </div>
  );
}
