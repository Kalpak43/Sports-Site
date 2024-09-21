"use client";

import { useSignUpDataContext } from "@/contexts/SignupDataContext";
import { useRouter } from "next/navigation";
import React from "react";

export default function PersonalDetailsPage() {
  const router = useRouter();

  let date = new Date();
  date.setFullYear(date.getFullYear() - 18);
  1;
  const { signUpData, setSignUpData, setSessionStorage } =
    useSignUpDataContext() || {};

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSessionStorage &&
      setSessionStorage({
        ...signUpData,
      } as SignUpData);

    router.push("/signup/preferences");
  };

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center px-8 md:px-20 py-10">
      {" "}
      <h1 className="text-2xl font-[600] text-center">Personal Details</h1>
      <br />
      <div className="md:px-8 py-10 md:border-2 border-gray-600 rounded-2xl md:min-w-[400px] w-full md:w-auto">
        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Date of Birth</span>
            </div>
            <input
              type="date"
              placeholder="eg. John Doe"
              className="input input-bordered  grow"
              max={date.toISOString().split("T")[0]}
              value={signUpData?.dob}
              onChange={(e) =>
                setSignUpData &&
                setSignUpData({
                  ...signUpData,
                  dob: e.target.value,
                } as SignUpData)
              }
              required
            />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Gender</span>
            </div>
            <div className="flex gap-8">
              <label htmlFor="" className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  className="radio radio-xs radio-primary"
                  checked={signUpData?.gender === "male"}
                  onChange={() =>
                    setSignUpData &&
                    setSignUpData({
                      ...signUpData,
                      gender: "male",
                    } as SignUpData)
                  }
                  required
                />
                <span> Male</span>
              </label>
              <label htmlFor="" className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  className="radio radio-xs radio-primary"
                  checked={signUpData?.gender === "female"}
                  onChange={() =>
                    setSignUpData &&
                    setSignUpData({
                      ...signUpData,
                      gender: "female",
                    } as SignUpData)
                  }
                  required
                />
                <span>Female</span>
              </label>
            </div>
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Address line 1</span>
            </div>
            <input
              type="text"
              placeholder="eg. Flat no. 101, Building Name"
              className="input input-bordered w-full max-w-xs"
              value={signUpData?.address}
              onChange={(e) =>
                setSignUpData &&
                setSignUpData({
                  ...signUpData,
                  address: e.target.value,
                } as SignUpData)
              }
              required
            />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">City</span>
            </div>
            <input
              type="text"
              placeholder="eg. Mumbai"
              className="input input-bordered w-full max-w-xs"
              value={signUpData?.city}
              onChange={(e) =>
                setSignUpData &&
                setSignUpData({
                  ...signUpData,
                  city: e.target.value,
                } as SignUpData)
              }
              required
            />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">State</span>
            </div>
            <input
              type="text"
              placeholder="eg. Maharashtra"
              className="input input-bordered w-full max-w-xs"
              value={signUpData?.state}
              onChange={(e) =>
                setSignUpData &&
                setSignUpData({
                  ...signUpData,
                  state: e.target.value,
                } as SignUpData)
              }
              required
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
    </main>
  );
}
