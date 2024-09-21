import Image from "next/image";
import React, { useEffect } from "react";
import { FaPlus } from "react-icons/fa6";

export default function MediaInputArray({
  media,
  setNewPostData,
}: {
  media: string[];
  setNewPostData: React.Dispatch<React.SetStateAction<any>>;
}) {
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    imageInputRef.current?.scrollTo({
      left: imageInputRef.current.scrollWidth,
      behavior: "smooth",
    });
  }, [media]);

  return (
    <div
      ref={imageInputRef}
      className="flex items-center gap-x-2 w-full overflow-x-scroll"
    >
      {media.map((m, index) => {
        return (
          <div
            key={index}
            className="h-[100px] aspect-square rounded-lg border-2 border-neutral"
          >
            <Image
              src={m}
              alt="Post Image"
              width={100}
              height={100}
              className="object-cover h-full w-full rounded-lg"
            />
          </div>
        );
      })}

      <div className="group flex items-center h-[80px] aspect-square rounded-full border-2 border-primary hover:bg-primary transition-all duration-200 relative">
        <span className="block w-fit mx-auto p-2 rounded-lg">
          <FaPlus
            size={40}
            className="text-primary group-hover:text-base-300 transition-all duration-200"
          />
        </span>
        <input
          type="file"
          className="opacity-0 absolute top-0 left-0 right-0 bottom-0 cursor-pointer"
          accept="image/*,video/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setNewPostData((x: PostData) => ({
                ...x,
                media: [...x.media, URL.createObjectURL(e.target.files![0])],
              }));
            }
          }}
        />
      </div>
    </div>
  );
}
