"use client";

import DisplayPosts from "@/components/DisplayPosts";
import { getAllPosts } from "@/firebase/db";
import Link from "next/link";
import React from "react";
import { FaPlus } from "react-icons/fa6";

export default function page() {
  return (
    <main className="px-0 md:px-8 md:px-20 py-10">
      <div className="p-8 border-2 border-gray-600 rounded-3xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Link
          href={"?new_post=true"}
          className="group py-2 lg:aspect-square flex flex-col items-center justify-center border-2 border-primary rounded-2xl"
        >
          <span className="block w-fit mx-auto p-2 rounded-full  group-hover:bg-primary transition-all duration-200">
            <FaPlus
              size={30}
              className="text-primary group-hover:text-base-300 transition-all duration-200"
            />
          </span>
          New Post
        </Link>
        <DisplayPosts getPosts={getAllPosts} />
      </div>
    </main>
  );
}
