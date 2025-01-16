"use client";

import {
  DetailsEditForm,
  InputSkeleton,
  InterestsEditForm,
  ProfileEditForm,
  SaveButton,
} from "@/components/EditForm";
import SkeletonWrapper from "@/components/SkeletonWrapper/SkeletonWrapper";
import { useAuthContext } from "@/contexts/AuthContext";
import { UserData } from "@/types/UserData";
import React, { useEffect, useState } from "react";

export default function EditPage() {
  const { userData } = useAuthContext();

  const [profile, setProfile] = useState<Pick<
    UserData,
    "name" | "username" | "bio" | "profilePhoto"
  > | null>(null);
  const [details, setDetails] = useState<Pick<
    UserData,
    "dob" | "gender" | "address" | "city" | "state"
  > | null>(null);
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    if (userData) {
      setProfile({
        name: userData.name,
        username: userData.username,
        bio: userData.bio,
        profilePhoto: userData.profilePhoto,
      });
      setDetails({
        dob: userData.dob,
        gender: userData.gender,
        address: userData.address,
        city: userData.city,
        state: userData.state,
      });
      setInterests(userData.preferences);
    }
  }, [userData]);

  return (
    <div className="px-0 md:px-8 md:px-20 py-10">
      <form action="" className="grid grid-cols-1 lg:grid-cols-3 lg:gap-4">
        <ProfileEditForm profile={profile} setProfile={setProfile} />
        <DetailsEditForm details={details} setDetails={setDetails} />
        <div className="px-4 md:px-8 py-10 md:border-2 border-gray-600 rounded-2xl space-y-4 flex flex-col justify-between">
          <InterestsEditForm
            interests={interests}
            setInterests={setInterests}
          />
          <SkeletonWrapper show={<InputSkeleton variant="badge" />}>
            <SaveButton
              updatedData={{
                ...(userData as UserData),
                ...profile,
                ...details,
                preferences: interests,
              }}
            />
          </SkeletonWrapper>
        </div>
      </form>
    </div>
  );
}
