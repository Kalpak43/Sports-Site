"use client";

import SkeletonWrapper from "@/components/SkeletonWrapper/SkeletonWrapper";
import { useAuthContext } from "@/contexts/AuthContext";
import { editUserData } from "@/firebase/db";
import { UserData } from "@/types/UserData";
import { convertToBase64 } from "@/utils/base64";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, {
  FormEvent,
  memo,
  useCallback,
  useMemo,
} from "react";
import { BiMessageSquareEdit } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";

type ProfileEditFormProps = {
  profile: Pick<UserData, "name" | "username" | "bio" | "profilePhoto"> | null;
  setProfile: React.Dispatch<
    React.SetStateAction<Pick<
      UserData,
      "name" | "username" | "bio" | "profilePhoto"
    > | null>
  >;
};

export const ProfileEditForm = memo(
  ({ profile, setProfile }: ProfileEditFormProps) => {
    return (
      <div className="px-4 md:px-8 lg:py-10 md:border-2 border-gray-600 rounded-2xl space-y-4">
        <SkeletonWrapper show={<InputSkeleton variant="image" />}>
          <div className="rounded-full max-w-[130px] p-2 aspect-square relative mx-auto">
            <Image
              src={
                profile?.profilePhoto
                  ? "data:image/png;base64," + profile?.profilePhoto
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
                      setProfile((prev) => ({
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
                setProfile((prev) => {
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
        </SkeletonWrapper>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Name</span>
          </div>
          <SkeletonWrapper show={<InputSkeleton variant="text" />}>
            <input
              type="text"
              placeholder="eg. John Doe"
              className="input input-bordered grow"
              value={profile?.name}
              onChange={(e) => {
                setProfile((prev) => {
                  return {
                    ...(prev as UserData),
                    name: e.target.value,
                  };
                });
              }}
              required
            />
          </SkeletonWrapper>
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Username</span>
          </div>
          <SkeletonWrapper show={<InputSkeleton variant="text" />}>
            <input
              type="text"
              placeholder="eg. JohnDoe@123"
              className="input input-bordered grow"
              value={profile?.username}
              onChange={(e) => {
                setProfile((prev) => {
                  return {
                    ...(prev as UserData),
                    username: e.target.value,
                  };
                });
              }}
              required
            />
          </SkeletonWrapper>
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Bio</span>
          </div>
          <SkeletonWrapper show={<InputSkeleton variant="text" />}>
            <input
              type="text"
              placeholder="eg. Hi! I am John Doe"
              className="input input-bordered grow"
              maxLength={100}
              value={profile?.bio}
              onChange={(e) => {
                setProfile((prev) => {
                  return {
                    ...(prev as UserData),
                    bio: e.target.value,
                  };
                });
              }}
              required
            />
          </SkeletonWrapper>
        </label>
      </div>
    );
  }
);

ProfileEditForm.displayName = "ProfileEditForm";

type DetailsEditFormProps = {
  details: Pick<
    UserData,
    "dob" | "gender" | "address" | "city" | "state"
  > | null;
  setDetails: React.Dispatch<
    React.SetStateAction<Pick<
      UserData,
      "dob" | "gender" | "address" | "city" | "state"
    > | null>
  >;
};

export const DetailsEditForm = memo(
  ({ details, setDetails }: DetailsEditFormProps) => {
    const date = useMemo(() => {
      let d = new Date();
      d.setFullYear(d.getFullYear() - 18);
      return d;
    }, []);

    return (
      <div className="px-4 md:px-8 lg:py-10 md:border-2 border-gray-600 rounded-2xl space-y-4">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Date of Birth</span>
          </div>
          <SkeletonWrapper show={<InputSkeleton variant="date" />}>
            <input
              type="date"
              placeholder="eg. John Doe"
              className="input input-bordered  grow"
              max={date.toISOString().split("T")[0]}
              value={details?.dob}
              onChange={(e) => {
                setDetails((prev) => {
                  return {
                    ...(prev as UserData),
                    dob: e.target.value,
                  };
                });
              }}
              required
            />
          </SkeletonWrapper>
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Gender</span>
          </div>
          <div className="flex gap-8">
            <SkeletonWrapper show={<InputSkeleton variant="radio" />}>
              <label htmlFor="" className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  className="radio radio-xs radio-primary"
                  checked={details?.gender === "male"}
                  onChange={() => {
                    setDetails((prev) => {
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
            </SkeletonWrapper>
            <SkeletonWrapper show={<InputSkeleton variant="radio" />}>
              <label htmlFor="" className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  className="radio radio-xs radio-primary"
                  checked={details?.gender === "female"}
                  onChange={() => {
                    setDetails((prev) => {
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
            </SkeletonWrapper>
          </div>
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Address line 1</span>
          </div>
          <SkeletonWrapper show={<InputSkeleton variant="text" />}>
            <input
              type="text"
              placeholder="eg. Flat no. 101, Building Name"
              className="input input-bordered w-full"
              value={details?.address}
              onChange={(e) => {
                setDetails((prev) => {
                  return {
                    ...(prev as UserData),
                    address: e.target.value,
                  };
                });
              }}
              required
            />
          </SkeletonWrapper>
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">City</span>
          </div>
          <SkeletonWrapper show={<InputSkeleton variant="text" />}>
            <input
              type="text"
              placeholder="eg. Mumbai"
              className="input input-bordered w-full"
              value={details?.city}
              onChange={(e) => {
                setDetails((prev) => {
                  return {
                    ...(prev as UserData),
                    city: e.target.value,
                  };
                });
              }}
              required
            />
          </SkeletonWrapper>
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">State</span>
          </div>
          <SkeletonWrapper show={<InputSkeleton variant="text" />}>
            <input
              type="text"
              placeholder="eg. Maharashtra"
              className="input input-bordered w-full"
              value={details?.state}
              onChange={(e) => {
                setDetails((prev) => {
                  return {
                    ...(prev as UserData),
                    state: e.target.value,
                  };
                });
              }}
              required
            />
          </SkeletonWrapper>
        </label>
      </div>
    );
  }
);

DetailsEditForm.displayName = "DetailsEditForm";

type InterestsEditFormProps = {
  interests: string[];
  setInterests: React.Dispatch<React.SetStateAction<string[]>>;
};

export const InterestsEditForm = memo(
  ({ interests, setInterests }: InterestsEditFormProps) => {
    const sports = useMemo(
      () => [
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
      ],
      []
    );

    return (
      <div className="space-y-4">
        <span className="label-text">Your Interests</span>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mx-auto">
          {sports.map((sport, index) => (
            <SkeletonWrapper
              key={index}
              show={<InputSkeleton variant="badge">{sport}</InputSkeleton>}
            >
              <button
                type="button"
                key={index}
                className={`btn ${
                  interests?.includes(sport)
                    ? "btn-success"
                    : "btn-outline btn-secondary"
                }`}
                onClick={() => {
                  setInterests((prev) => {
                    if (prev?.includes(sport)) {
                      return {
                        ...prev,
                        preferences: prev.filter(
                          (preference) => preference !== sport
                        ),
                      };
                    }
                    return [...prev, sport];
                  });
                }}
              >
                {sport}
              </button>
            </SkeletonWrapper>
          ))}
        </div>
      </div>
    );
  }
);

InterestsEditForm.displayName = "InterestsEditForm";

export const SaveButton = memo(
  ({ updatedData }: { updatedData: UserData | null }) => {
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();
    const { user, setUserData } = useAuthContext();

    const handleSubmit = useCallback(
      async (e: FormEvent) => {
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
      },
      [updatedData, user?.uid, setUserData, router]
    );
    return (
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
    );
  }
);

SaveButton.displayName = "SaveButton";

type InputSkeletonProps = {
  variant: "text" | "date" | "image" | "radio" | "badge";
  children?: React.ReactNode;
};

export function InputSkeleton({ variant, children }: InputSkeletonProps) {
  if (variant == "text" || variant == "date") {
    return <div className="input skeleton-bg" />;
  } else if (variant == "image") {
    return (
      <div className="rounded-full max-w-[130px] p-2 aspect-square relative mx-auto">
        <div className="skeleton-bg h-full w-full object-cover rounded-full border-2" />
      </div>
    );
  } else if (variant == "radio") {
    return (
      <div className="flex gap-4 items-center">
        <div className="skeleton-bg radio radio-xs" />
        <div className="px-8 py-2 skeleton-bg" />
      </div>
    );
  } else if (variant == "badge") {
    return <div className="btn skeleton-bg">{children}</div>;
  }
}
