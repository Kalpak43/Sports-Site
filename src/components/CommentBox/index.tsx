"use client";

import { getComments } from "@/firebase/db";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function CommentBox({
  id,
  refresh,
  setRefresh,
}: {
  id: string;
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const populateComments = async () => {
      setLoading(true);
      const { result, error } = await getComments(id as string);

      if (error) {
        alert(error);
      }

      setComments(result);
      setRefresh(false);
      setLoading(false);
    };

    refresh && populateComments();
  }, [refresh]);

  return loading ? (
    <div className="text-center">
      <span className="loading loading-spinner loading-md"></span>
    </div>
  ) : (
    <>
      {comments.map((comment) => (
        <div key={comment.cid} className="space-y-2 py-2">
          <Link
            href={`/user/${comment.userHandle}`}
            className="flex gap-2 items-center"
          >
            {comment.userProfile ? (
              <Image
                src={"data:image/png;base64," + comment.userProfile}
                alt={comment.userHandle}
                width={50}
                height={50}
                className="rounded-full aspect-square object-cover max-w-[30px]"
              />
            ) : (
              <Image
                src={"/placeholder.jpeg"}
                alt={comment.userHandle}
                width={50}
                height={50}
                className="rounded-full aspect-square object-cover max-w-[30px]"
              />
            )}
            <p className="text-xs font-bold">{comment.userHandle}</p>
          </Link>
          <p className="">{comment.comment}</p>
        </div>
      ))}
    </>
  );
}
