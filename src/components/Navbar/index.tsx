"use client";
import { useAuthContext } from "@/contexts/AuthContext";
import { logOut } from "@/firebase/auth";
import { getUserData } from "@/firebase/db";
import { User } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { FaGithub } from "react-icons/fa6";
import SearchBar from "../SearchBar/SearchBar";
import SkeletonWrapper from "../SkeletonWrapper/SkeletonWrapper";

export default function Navbar() {
  const { user, userData, loading } = useAuthContext();

  return (
    <div className="navbar p-4 bg-inherit sticky top-0 z-50">
      <div className="flex-1">
        <Link href={"/"} className="btn btn-ghost font-[700] md:text-xl">
          Project Sports
        </Link>
      </div>
      {loading ? (
        <NavSkeleton />
        // <div className="loading loading-spinner loading-xl text-info" />
      ) : (
        <div className="flex-none gap-2">
          {user ? (
            <>
              <SearchBar />

              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full">
                    <Image
                      alt="Profile Photo"
                      src={"data:image/png;base64," + userData?.profilePhoto}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                >
                  <li>
                    <Link href={"/feed"} className="justify-between">
                      Feed
                      <span className="badge">New</span>
                    </Link>
                  </li>
                  <li>
                    <Link href={"/profile"} className="justify-between">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link href={"?new_post=true"} className="justify-between">
                      New Post
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={"?call_players=true"}
                      className="justify-between"
                    >
                      Call Players
                    </Link>
                  </li>
                  <li>
                    <a>Settings</a>
                  </li>
                  <li>
                    <button onClick={logOut}>Log out</button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <nav className="flex gap-2">
                <Link href="/login" className="font-[600] btn btn-ghost">
                  Login
                </Link>
                <Link href="/signup" className="font-[600] btn btn-ghost">
                  Signup
                </Link>
              </nav>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function NavSkeleton() {
  return (
    <div className="flex-none gap-2">
      <div className="btn btn-ghost btn-circle avatar aspect-square skeleton-bg rounded-full"></div>
    </div>
  );
}
