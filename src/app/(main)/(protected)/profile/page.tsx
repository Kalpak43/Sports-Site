"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { User } from "firebase/auth";
import Image from "next/image";
import React from "react";
import { IoLocation } from "react-icons/io5";
import { FaUserPen, FaUser } from "react-icons/fa6";

export default function ProfilePage() {
  const { user, userData } = useAuthContext();
  return (
    <div className="px-8 md:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center py-10">
      <div className="">
        <Image
          src={"data:image/png;base64," + userData?.profilePhoto}
          alt="Profile Picture"
          width={200}
          height={200}
          className="rounded-full aspect-square object-center object-cover max-w-[150px]"
        />
      </div>
      <div className="lg:col-span-2 w-full">
        <h3 className="font-[700] flex items-start gap-2">
          <FaUser className="inline text-accent" size={20} />
          <span className="text-xl">{userData?.username}</span>
        </h3>
        <p className="flex items-start gap-2">
          <FaUserPen className="inline text-accent" size={20} />
          {userData?.bio}
        </p>
        <br />
        <p className="flex items-start gap-2">
          <IoLocation className="inline text-accent" size={20} />
          {userData?.address} ,{userData?.city}, {userData?.state}
        </p>
      </div>
    </div>
  );
}
