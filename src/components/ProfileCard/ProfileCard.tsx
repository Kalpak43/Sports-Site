"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BiMessageSquareEdit } from "react-icons/bi";
import { FaCakeCandles, FaLocationArrow } from "react-icons/fa6";

export default function ProfileCard() {
  const { userData } = useAuthContext();

  return (
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
      <div className="flex justify-center gap-4">
        <div className="w-fit text-center">
          <p className="text-sm font-bold ">Followers</p>
          <Link href={""} className="btn btn-square btn-ghost">
            {String(userData?.followers || 0)}
          </Link>
        </div>
        <div className="w-fit text-center">
          <p className="text-sm font-bold ">Following</p>
          <Link href={""} className="btn btn-square btn-ghost">
            {String(userData?.following || 0)}
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ProfileCardSkeleton() {
  return (
    <div className="w-full p-8 rounded-3xl space-y-8 relative skeleton-bg max-md:h-[50vh]"></div>
  );
}
