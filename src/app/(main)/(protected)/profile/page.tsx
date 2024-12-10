"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import React from "react";
import { FaPlus } from "react-icons/fa6";
import Link from "next/link";
import DisplayPosts from "@/components/DisplayPosts";
import { getAllPostsByUser } from "@/firebase/db";
import ProfileCard, {
  ProfileCardSkeleton,
} from "@/components/ProfileCard/ProfileCard";
import SkeletonWrapper from "@/components/SkeletonWrapper/SkeletonWrapper";

export default function ProfilePage() {
  const { user, userData } = useAuthContext();

  return (
    <div className="px-0 md:px-8 md:px-20 py-10 grid grid-cols-1 lg:grid-cols-2 lg:grid-cols-3 gap-8">
      <SkeletonWrapper show={<ProfileCardSkeleton />}>
        <ProfileCard />
      </SkeletonWrapper>
      <div className="w-full space-y-8 relative lg:col-span-2">
        <div className="p-8 border-2 border-gray-600 rounded-3xl flex gap-2 flex-wrap justify-center">
          <SkeletonWrapper
            show={
              <>
                <span className="inline-block bg-secondary text-white rounded-full px-10 py-4 text-sm font-semibold mr-2 skeleton-bg"></span>
                <span className="inline-block bg-secondary text-white rounded-full px-10 py-4 text-sm font-semibold mr-2 skeleton-bg"></span>
                <span className="inline-block bg-secondary text-white rounded-full px-10 py-4 text-sm font-semibold mr-2 skeleton-bg"></span>
              </>
            }
          >
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
          </SkeletonWrapper>
        </div>

        <SkeletonWrapper
          show={<div className="p-8 skeleton-bg rounded-3xl min-h-[80vh]" />}
        >
          <div className="p-8 border-2 border-gray-600 rounded-3xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
            <DisplayPosts
              getPosts={() => {
                return getAllPostsByUser(user?.uid as string);
              }}
            />
          </div>
        </SkeletonWrapper>
      </div>
    </div>
  );
}
