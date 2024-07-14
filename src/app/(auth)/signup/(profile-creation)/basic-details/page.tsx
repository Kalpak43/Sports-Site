"use client";
import { useSignUpDataContext } from "@/contexts/SignupDataContext";
import { SignUpData } from "@/types/SignUpData";
import { convertToBase64 } from "@/utils/base64";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export default function page() {
  const router = useRouter();


  const { signUpData, setSignUpData, setSessionStorage } =
    useSignUpDataContext() || {};

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSessionStorage &&
      setSessionStorage({
        ...signUpData,
      } as SignUpData);

    router.push("/signup/personal-details");
  };

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center px-8 md:px-20 py-10">
      {" "}
      <h1 className="text-2xl font-[600] text-center">Basic Details</h1>
      <br />
      <div className="px-4 md:px-8 py-10 md:border-2 border-gray-600 rounded-2xl md:min-w-[400px]">
        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">What is your name?</span>
            </div>
            <input
              type="text"
              placeholder="eg. John Doe"
              className="input input-bordered grow"
              value={signUpData?.name}
              onChange={(e) =>
                setSignUpData &&
                setSignUpData({
                  ...signUpData,
                  name: e.target.value,
                } as SignUpData)
              }
              required
            />
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Set your Username</span>
            </div>
            <input
              type="text"
              placeholder="eg. JohnDoe@123"
              className="input input-bordered grow"
              value={signUpData?.username}
              onChange={(e) =>
                setSignUpData &&
                setSignUpData({
                  ...signUpData,
                  username: e.target.value,
                } as SignUpData)
              }
              required
            />
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Set your Bio</span>
            </div>
            <input
              type="text"
              placeholder="eg. Hi! I am John Doe"
              className="input input-bordered grow"
              maxLength={100}
              value={signUpData?.bio}
              onChange={(e) =>
                setSignUpData &&
                setSignUpData({
                  ...signUpData,
                  bio: e.target.value,
                } as SignUpData)
              }
              required
            />
          </label>
          <label className="form-control">
            <div className="label">
              <span className="label-text">Upload your Profile Photo</span>
            </div>
            <input
              type="file"
              className="file-input file-input-bordered file-input-md grow"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  convertToBase64(e.target.files[0]).then((res) => {
                    setSignUpData &&
                      setSignUpData({
                        ...signUpData,
                        profilePhoto: res,
                      } as SignUpData);
                  });
                }
              }}
            />
          </label>
          <button
            type="submit"
            //   disabled={loading}
            className="btn btn-primary w-full"
          >
            Next
          </button>
        </form>
      </div>
      {/* <Image
        src={"data:image/png;base64," + signUpData?.profilePhoto}
        alt=""
        width={500}
        height={500}
      /> */}
    </main>
  );
}
