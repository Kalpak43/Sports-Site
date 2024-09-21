"use client";

import DisplayPosts from "@/components/DisplayPosts";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  checkFollow,
  followUser,
  getAllPostsByUser,
  searchUser,
  setupChat,
  unfollowUser,
} from "@/firebase/db";
import { UserData } from "@/types/UserData";
import Image from "next/image";
import Link from "next/link";
import { redirect, useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { FaCakeCandles, FaLocationArrow, FaPlus } from "react-icons/fa6";
import { BsChatLeftTextFill } from "react-icons/bs";
import Button from "@/components/Button/Button";

export default function UserPage() {
  const { username } = useParams();
  const { user, isProfileCreated } = useAuthContext();
  const [search, setSearch] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<UserData | null>(null);
  const [isFollowing, setIsFollowing] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [followLoading, setFollowLoading] = React.useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    async function makeQuery() {
      if (username) {
        setLoading(true);
        const { result, error } = await searchUser(
          decodeURIComponent(username as string)
        );
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

  useEffect(() => {
    if (result && user) {
      if (result.uid === user.uid) {
        redirect("/profile");
      }
    }

    async function checkFollowing() {
      await checkFollow(user?.uid as string, result?.uid as string).then(
        (res) => {
          setIsFollowing(res.result);
        }
      );
    }

    result && checkFollowing();
  }, [result]);

  const handleFollow = async () => {
    setFollowLoading(true);
    await followUser(result?.uid as string, user?.uid as string)
      .then(() => {
        setIsFollowing(true);
        setResult((prevState) => {
          if (prevState) {
            return {
              ...prevState,
              followers: Number(prevState.followers) + 1,
            };
          }
          return prevState;
        });
        alert("Followed!");
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setFollowLoading(false);
      });
  };

  const handleUnfollow = async () => {
    setFollowLoading(true);
    await unfollowUser(result?.uid as string, user?.uid as string)
      .then(() => {
        setIsFollowing(false);
        setResult((prevState) => {
          if (prevState) {
            return {
              ...prevState,
              followers: Number(prevState.followers) - 1,
            };
          }
          return prevState;
        });
        alert("Unfollowed!");
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setFollowLoading(false);
      });
  };

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
                  src={
                    result.profilePhoto
                      ? "data:image/png;base64," + result.profilePhoto
                      : "/placeholder.jpeg"
                  }
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

            <div>
              <div className="flex justify-center gap-4">
                <div className="w-fit text-center">
                  <p className="text-sm font-bold ">Followers</p>
                  <Link href={""} className="btn btn-square btn-ghost">
                    {String(result.followers || 0)}
                  </Link>
                </div>
                <div className="w-fit text-center">
                  <p className="text-sm font-bold ">Following</p>
                  <Link href={""} className="btn btn-square btn-ghost">
                    {String(result.following || 0)}
                  </Link>
                </div>
              </div>
              {user?.uid !== result.uid && (
                <div className="flex justify-center gap-4">
                  <Button
                    className="btn btn-square btn-ghost text-center"
                    onClick={async () => {
                      await setupChat(
                        user?.uid as string,
                        result.uid as string
                      ).then((res) => {
                        if (res.error) {
                          alert(res.error);
                          return;
                        }
                        router.push(`/chat/${res.result?.id}`);
                      });
                    }}
                  >
                    <BsChatLeftTextFill size={24} />
                  </Button>
                </div>
              )}
            </div>

            {user &&
              isProfileCreated &&
              user.uid !== result.uid &&
              (isFollowing ? (
                <button
                  className="btn btn-primary btn-block mt-2"
                  onClick={handleUnfollow}
                  disabled={followLoading}
                >
                  {followLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Unfollow"
                  )}
                </button>
              ) : (
                <button
                  className="btn btn-primary btn-block mt-2"
                  onClick={handleFollow}
                  disabled={followLoading}
                >
                  {followLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      <FaPlus className="inline" /> Follow
                    </>
                  )}
                </button>
              ))}
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
            <div className="p-8 border-2 border-gray-600 rounded-3xl grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              <DisplayPosts
                getPosts={() => {
                  return getAllPostsByUser(result.uid as string);
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <p>User not found!</p>
      )}
    </div>
  );
}
