"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { editUserData } from "@/firebase/db";
import { convertToBase64 } from "@/utils/base64";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect } from "react";
import { BiMessageSquareEdit } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";

export default function EditPage() {
  const router = useRouter();
  const { user, userData, setUserData } = useAuthContext();
  const [loading, setLoading] = React.useState(false);

  let date = new Date();
  date.setFullYear(date.getFullYear() - 18);
  1;
  const sports = [
    "Cricket",
    "Football",
    "Basketball",
    "Tennis",
    "Badminton",
    "Table Tennis",
    "Hockey",
    "Volleyball",
    "Baseball",
    "Rugby",
  ];

  const [updatedData, setUpdatedData] = React.useState<UserData | null>(null);

  useEffect(() => {
    if (userData) {
      setUpdatedData(userData);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (updatedData && updatedData?.preferences.length <= 4) {
      alert("Please select atleast 4 interests");
      return;
    }

    setLoading(true);
    const { result, error } = await editUserData(
      user?.uid as string,
      updatedData as UserData
    );

    if (error) {
      alert("Something went wrong! Please try again");
      return;
    }

    alert(result);
    setUserData(updatedData as UserData);
    setLoading(false);
    router.push("/profile");
  };

  return (
    <div className="px-0 md:px-8 md:px-20 py-10">
      <form action="" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="px-4 md:px-8 py-10 md:border-2 border-gray-600 rounded-2xl space-y-4">
          <div className="rounded-full max-w-[130px] p-2 aspect-square relative mx-auto">
            <Image
              src={
                updatedData?.profilePhoto
                  ? "data:image/png;base64," + updatedData?.profilePhoto
                  : "/placeholder.jpeg"
              }
              alt="Profile Picture"
              width={200}
              height={200}
              className="h-full w-full object-cover rounded-full border-2"
            />
            <div className="absolute top-0 right-0 cursor-pointer">
              <button type="button">
                <BiMessageSquareEdit size={20} className="text-secondary" />
              </button>
              <input
                type="file"
                className="opacity-0 absolute top-0 left-0 w-full h-full cursor-pointer"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    convertToBase64(e.target.files[0]).then((res) => {
                      setUpdatedData((prev) => ({
                        ...(prev as UserData),
                        profilePhoto: res,
                      }));
                    });
                  }
                }}
              />
            </div>
            <button
              type="button"
              className="absolute bottom-0 right-0"
              onClick={() => {
                setUpdatedData((prev) => {
                  return {
                    ...(prev as UserData),
                    profilePhoto: null,
                  };
                });
              }}
            >
              <MdDeleteForever size={20} className="text-error" />
            </button>
          </div>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Name</span>
            </div>
            <input
              type="text"
              placeholder="eg. John Doe"
              className="input input-bordered grow"
              value={updatedData?.name}
              onChange={(e) => {
                setUpdatedData((prev) => {
                  return {
                    ...(prev as UserData),
                    name: e.target.value,
                  };
                });
              }}
              required
            />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Username</span>
            </div>
            <input
              type="text"
              placeholder="eg. JohnDoe@123"
              className="input input-bordered grow"
              value={updatedData?.username}
              onChange={(e) => {
                setUpdatedData((prev) => {
                  return {
                    ...(prev as UserData),
                    username: e.target.value,
                  };
                });
              }}
              required
            />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Bio</span>
            </div>
            <input
              type="text"
              placeholder="eg. Hi! I am John Doe"
              className="input input-bordered grow"
              maxLength={100}
              value={updatedData?.bio}
              onChange={(e) => {
                setUpdatedData((prev) => {
                  return {
                    ...(prev as UserData),
                    bio: e.target.value,
                  };
                });
              }}
              required
            />
          </label>
        </div>
        <div className="px-4 md:px-8 py-10 md:border-2 border-gray-600 rounded-2xl space-y-4">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Date of Birth</span>
            </div>
            <input
              type="date"
              placeholder="eg. John Doe"
              className="input input-bordered  grow"
              max={date.toISOString().split("T")[0]}
              value={updatedData?.dob}
              onChange={(e) => {
                setUpdatedData((prev) => {
                  return {
                    ...(prev as UserData),
                    dob: e.target.value,
                  };
                });
              }}
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
                  checked={updatedData?.gender === "male"}
                  onChange={() => {
                    setUpdatedData((prev) => {
                      return {
                        ...(prev as UserData),
                        gender: "male",
                      };
                    });
                  }}
                  required
                />
                <span> Male</span>
              </label>
              <label htmlFor="" className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  className="radio radio-xs radio-primary"
                  checked={updatedData?.gender === "female"}
                  onChange={() => {
                    setUpdatedData((prev) => {
                      return {
                        ...(prev as UserData),
                        gender: "female",
                      };
                    });
                  }}
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
              className="input input-bordered w-full"
              value={updatedData?.address}
              onChange={(e) => {
                setUpdatedData((prev) => {
                  return {
                    ...(prev as UserData),
                    address: e.target.value,
                  };
                });
              }}
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
              className="input input-bordered w-full"
              value={updatedData?.city}
              onChange={(e) => {
                setUpdatedData((prev) => {
                  return {
                    ...(prev as UserData),
                    city: e.target.value,
                  };
                });
              }}
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
              className="input input-bordered w-full"
              value={updatedData?.state}
              onChange={(e) => {
                setUpdatedData((prev) => {
                  return {
                    ...(prev as UserData),
                    state: e.target.value,
                  };
                });
              }}
              required
            />
          </label>
        </div>
        <div className="px-4 md:px-8 py-10 md:border-2 border-gray-600 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="label-text">Your Interests</span>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mx-auto">
              {sports.map((sport, index) => (
                <button
                  type="button"
                  key={index}
                  className={`btn ${
                    updatedData?.preferences.includes(sport)
                      ? "btn-success"
                      : "btn-outline btn-secondary"
                  }`}
                  onClick={() => {
                    setUpdatedData((prev) => {
                      if (prev?.preferences.includes(sport)) {
                        return {
                          ...(prev as UserData),
                          preferences: prev?.preferences.filter(
                            (preference) => preference !== sport
                          ),
                        };
                      }
                      return {
                        ...(prev as UserData),
                        preferences: [
                          ...(prev?.preferences as string[]),
                          sport,
                        ],
                      };
                    });
                  }}
                >
                  {sport}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="btn btn-primary block mx-auto w-full"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Save Changes "
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
