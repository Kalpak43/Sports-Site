"use client";

import { logOut } from "@/firebase/auth";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const handleLogout = async () => {
    const { result, error } = await logOut();

    if (error) {
      console.error(error);
    } else {
      console.log(result);
    }
  };

  return (
    <main className="min-h-[90vh] rounded-t-3xl bg-base-100 p-4 relative overflow-clip">
      <div className="absolute top-0 left-0 bottom-0 right-0 z-20 m-auto w-fit h-fit  text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-[600]">
          Unite with Fellow Sports Enthusiasts - Your Game, Your Community.
        </h1>
        <Link href="/signup" className="btn btn-primary">
          Join Today
        </Link>
      </div>
      <Image
        src={"/hero-image.webp"}
        alt="Hero Image"
        width={1920}
        height={1080}
        className="absolute top-0 left-0 bottom-0 right-0 -z-1 object-cover w-full md:w-1/2 aspect-video m-auto rounded-2xl brightness-50 grayscale"
      />
    </main>
  );
}
