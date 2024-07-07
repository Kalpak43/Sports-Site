"use client";
import { useAuthContext } from "@/contexts/AuthContext";
import { User } from "firebase/auth";
import Link from "next/link";
import React from "react";

export default function Navbar() {
  const { user } = useAuthContext() as {
    user: User | null;
    loading: boolean;
  };

  return (
    <div className="navbar p-4 bg-inherit sticky top-0 z-50">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Project Sports</a>
      </div>
      <div className="flex-none gap-2">
        {user ? (
          <>
            <div className="form-control">
              <input
                type="text"
                placeholder="Search"
                className="input input-bordered w-24 md:w-auto"
              />
            </div>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <a className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </a>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a>Logout</a>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <nav className="flex gap-4">
              <Link href="/login" className="font-[600] btn btn-ghost">Login</Link>
              <Link href="/signup" className="font-[600] btn btn-ghost">Signup</Link>
            </nav>
          </>
        )}
      </div>
    </div>
  );
}
