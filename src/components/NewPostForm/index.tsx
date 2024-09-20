"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { IoAdd } from "react-icons/io5";
import MediaInputArray from "../MediaInputArray/MediaInputArray";
import { fetchBlobFromUrl } from "@/utils/fetchBlob";
import { makePost } from "@/firebase/db";
import { useAuthContext } from "@/contexts/AuthContext";

export default function NewPostForm() {
  const router = useRouter();

  const { user } = useAuthContext();
  const [newPostData, setNewPostData] = useState({
    createdAt: new Date(),
    media: [],
    tags: [],
    caption: "",
    likes: 0,
    comments: 0,
  } as PostData);

  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    setNewPostData((x) => ({
      ...x,
      createdAt: new Date(),
    }));

    const { result, error } = await makePost(newPostData, user?.uid as string);

    if (error) {
      alert(error);
    }

    if (result) {
      alert("Post Created");
      router.back();
    }

    setLoading(false);
  };

  return (
    <div className="px-4 md:px-8 py-16 bg-base-100 rounded-2xl w-full lg:w-[400px] relative overflow-hidden shadow-md">
      <br />
      <form action="" className="space-y-4" onSubmit={handleSubmit}>
        <MediaInputArray
          media={newPostData.media}
          setNewPostData={setNewPostData}
        />
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Caption</span>
          </div>
          <input
            type="text"
            placeholder="Add Caption Here"
            className="input input-bordered grow"
            onChange={(e) => {
              setNewPostData((x) => ({ ...x, caption: e.target.value }));
            }}
            required
          />
        </label>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="btn border-primary w-full"
            disabled={loading}
            onClick={() => {
              router.back();
            }}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Post"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
