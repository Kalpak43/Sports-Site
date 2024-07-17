"use client";

import { logOut } from "@/firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa6";
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
    <div className="">
      <div className="absolute top-0 left-0 bottom-0 right-0 z-20 m-auto px-8 md:px-20 w-fit h-fit  text-center space-y-4">
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
      <Link
        href="https://github.com/Kalpak43/Sports-Site"
        target="_blank"
        className="fixed bottom-0 right-0 m-4 btn btn-square btn-primary"
      >
        <FaGithub size={30} />
      </Link>
    </div>
  );
}
