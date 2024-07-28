"use client";

import { searchUser } from "@/firebase/db";
import { UserData } from "@/types/UserData";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { FaCakeCandles, FaLocationArrow, FaPlus } from "react-icons/fa6";

export default function UserPage() {
  const { username } = useParams();
  const [search, setSearch] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<UserData | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    async function makeQuery() {
      if (username) {
        setLoading(true);
        const { result, error } = await searchUser(username as string);
        if (error) {
          alert(error);
          return;
        }

        setResult(result);
        setLoading(false);
      }
    }

    makeQuery();
  }, [search]);

  return (
    <div className="px-0 md:px-8 md:px-20 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {loading ? (
        <p>Loading...</p>
      ) : result ? (
        <>
          <div className="w-full p-8 border-2 border-gray-600 rounded-3xl space-y-8 relative">
            <div>
              <div className="flex justify-center items-center">
                <Image
                  src={"data:image/png;base64," + result.profilePhoto}
                  alt="Profile Picture"
                  width={100}
                  height={100}
                  className="rounded-full aspect-square object-cover "
                />
              </div>
              <h1 className="text-center text-2xl font-semibold mt-4">
                {result.username}
              </h1>
              <p className="text-center text-lg text-gray-500">{result.bio}</p>
            </div>
            <div className="space-y-2">
              <p className="text-center text-lg text-gray-500 flex items-center justify-center gap-2">
                <FaCakeCandles className="inline text-secondary" />
                {result.dob.split("-").reverse().join("/")}
              </p>
              <p className="text-center text-lg text-gray-500 flex items-center justify-center gap-2">
                <FaLocationArrow className="inline text-secondary" />
                {result.city}, {result.state}
              </p>
            </div>
          </div>
          <div className="w-full space-y-8 relative lg:col-span-2">
            <div className="p-8 border-2 border-gray-600 rounded-3xl flex gap-2 flex-wrap justify-center">
              {result?.preferences.map((preference, index) => {
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
          </div>
        </>
      ) : (
        <p>User not found!</p>
      )}
    </div>
  );
}
