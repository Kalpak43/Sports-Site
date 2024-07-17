"use client";
import { useAuthContext } from "@/contexts/AuthContext";
import { useSignUpDataContext } from "@/contexts/SignupDataContext";
import { uploadSignupData } from "@/firebase/db";
import { SignUpData } from "@/types/SignUpData";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Preferences() {
  const router = useRouter();

  const { signUpData, setSignUpData, setSessionStorage } =
    useSignUpDataContext() || {};

  const { user, setDataUploaded } = useAuthContext();
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async () => {
    if ((signUpData?.preferences.length ?? 0) < 4) {
      alert("Please select at least 4 preferences.");
      return;
    }

    setLoading(true);

    setSessionStorage?.({ ...signUpData } as SignUpData);

    const { result, error } = await uploadSignupData(
      signUpData as SignUpData,
      user?.uid || ""
    );

    if (error) {
      alert("An error occurred. Please try again.");
      console.log(error);
      setLoading(false);
      return;
    }

    alert("Preferences saved successfully.");
    alert("You will be redirected to the home page.");
    setDataUploaded?.(true);
    setLoading(false);

    router.replace("/");
  };

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center px-8 md:px-20 py-10">
      <h1 className="text-2xl font-[600] text-center">Preferences</h1>
      <br />
      <div className="md:px-8 py-10 md:border-2 border-gray-600 rounded-2xl md:max-w-[400px] w-full md:w-auto">
        <h4 className="text-xs text-center">What are your interests?</h4>
        <br />
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mx-auto">
          {sports.map((sport, index) => (
            <button
              key={index}
              className={`btn ${
                signUpData?.preferences.includes(sport)
                  ? "btn-success"
                  : "btn-outline btn-secondary"
              }`}
              onClick={() => {
                setSignUpData?.((prev) => {
                  if (prev.preferences.includes(sport)) {
                    return {
                      ...prev,
                      preferences: prev.preferences.filter(
                        (preference) => preference !== sport
                      ),
                    };
                  }
                  return {
                    ...prev,
                    preferences: [...prev.preferences, sport],
                  };
                });
              }}
            >
              {sport}
            </button>
          ))}
        </div>
        <br />

        <button
          onClick={handleSubmit}
          className="btn btn-primary block mx-auto w-full"
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "continue"
          )}
        </button>
      </div>
    </main>
  );
}
