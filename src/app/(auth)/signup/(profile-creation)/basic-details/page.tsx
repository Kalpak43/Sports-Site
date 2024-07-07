"use client";
import { convertToBase64 } from "@/utils/base64";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export default function page() {
  const router = useRouter();
  const [detailsObject, setDetailsObject] = useState({
    name: "",
    username: "",
    bio: "",
    profilePhoto: "",
  });

  useEffect(() => {
    const details = sessionStorage.getItem("details");
    if (details) {
      const parsedDetails = JSON.parse(details);
      setDetailsObject({
        name: parsedDetails.name,
        username: parsedDetails.username,
        bio: parsedDetails.bio,
        profilePhoto: parsedDetails.profilePhoto,
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sessionStorage.setItem("details", JSON.stringify(detailsObject));

    router.push("/signup/personal-details");
  };

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center px-8 md:px-20">
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
              value={detailsObject.name}
              onChange={(e) =>
                setDetailsObject({ ...detailsObject, name: e.target.value })
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
              value={detailsObject.username}
              onChange={(e) =>
                setDetailsObject({ ...detailsObject, username: e.target.value })
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
              value={detailsObject.bio}
              onChange={(e) =>
                setDetailsObject({ ...detailsObject, bio: e.target.value })
              }
              required
            />
          </label>
          <label className="form-control w-full">
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
                    setDetailsObject({
                      ...detailsObject,
                      profilePhoto: res,
                    });
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

      {/* <Image src={"data:image/png;base64," + detailsObject.profilePhoto} alt="" width={500} height={500} /> */}
    </main>
  );
}
