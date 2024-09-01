"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import Image from "next/image";
import React, { useEffect } from "react";
import { FaCakeCandles, FaPlus } from "react-icons/fa6";
import { FaLocationArrow } from "react-icons/fa";
import { BiMessageSquareEdit } from "react-icons/bi";
import Link from "next/link";
import DisplayPosts from "@/components/DisplayPosts";
import { getAllPosts, getAllPostsByUser } from "@/firebase/db";

export default function ProfilePage() {
  const { user, userData } = useAuthContext();

  return (
    <div className="px-0 md:px-8 md:px-20 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div className="w-full p-8 border-2 border-gray-600 rounded-3xl space-y-8 relative">
        <Link href="/profile/edit" className="absolute top-0 right-0 m-4">
          <BiMessageSquareEdit size={30} className="text-primary" />
        </Link>

        <div>
          <div className="flex justify-center items-center">
            <Image
              src={"data:image/png;base64," + userData?.profilePhoto}
              alt="Profile Picture"
              width={100}
              height={100}
              className="rounded-full aspect-square object-cover "
            />
          </div>
          <h1 className="text-center text-2xl font-semibold mt-4">
            {userData?.username}
          </h1>
          <p className="text-center text-lg text-gray-500">{userData?.bio}</p>
        </div>
        <div className="space-y-2">
          <p className="text-center text-lg text-gray-500 flex items-center justify-center gap-2">
            <FaCakeCandles className="inline text-secondary" />
            {userData?.dob.split("-").reverse().join("/")}
          </p>
          <p className="text-center text-lg text-gray-500 flex items-center justify-center gap-2">
            <FaLocationArrow className="inline text-secondary" />
            {userData?.city}, {userData?.state}
          </p>
        </div>
      </div>
      <div className="w-full space-y-8 relative lg:col-span-2">
        <div className="p-8 border-2 border-gray-600 rounded-3xl flex gap-2 flex-wrap justify-center">
          {userData?.preferences.map((preference, index) => {
            return (
              <span
                key={index}
                className="inline-block bg-secondary text-white rounded-full px-4 py-1 text-sm font-semibold mr-2"
              >
                {preference}
              </span>
            );
          })}
        </div>
        <div className="p-8 border-2 border-gray-600 rounded-3xl grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <Link href={"?new_post=true"} className="group py-2 lg:aspect-square flex flex-col items-center justify-center border-2 border-primary rounded-2xl">
            <span className="block w-fit mx-auto p-2 rounded-full  group-hover:bg-primary transition-all duration-200">
              <FaPlus
                size={30}
                className="text-primary group-hover:text-base-300 transition-all duration-200"
              />
            </span>
            New Post
          </Link>
          <DisplayPosts getPosts={() => {
            return getAllPostsByUser(user?.uid as string);
          }} />
        </div>
      </div>
    </div>
  );
}
