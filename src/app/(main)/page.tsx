"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useRef } from "react";
import { FaGithub } from "react-icons/fa6";
import { motion, useInView } from "framer-motion";

export default function Home() {
  const heroRef = useRef<HTMLImageElement | null>(null);
  const isInView = useInView(heroRef, { once: true });

  return (
    <div className="">
      <section className="relative min-h-[90vh]">
        <div className="absolute top-0 left-0 bottom-0 right-0 z-20 m-auto px-8 md:px-20 w-fit h-fit  text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-[600]">
            Unite with Fellow Sports Enthusiasts - Your Game, Your Community.
          </h1>
          <Link href="/signup" className="btn btn-primary">
            Join Today
          </Link>
        </div>
        <motion.img
          src={"/hero-image.webp"}
          alt="Hero Image"
          width={1920}
          height={1080}
          ref={heroRef}
          className="absolute top-0 left-0 bottom-0 right-0 -z-1 object-cover w-full md:w-1/2 aspect-[3/4] lg:aspect-video m-auto rounded-2xl brightness-50 grayscale"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          style={{
            background: "#ff5733",
            margin: "auto",
            borderRadius: "16px",
          }}
        />
      </section>
      <section className="grid lg:grid-cols-2 px-8 md:px-20 py-16 gap-12 place-items-center">
        <div className="aspect-video overflow-clip rounded-2xl max-w-[500px]">
          <Image
            src={"/main-1.webp"}
            alt="Main Image 1"
            width={1920}
            height={1080}
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
        <div className="text-center">
          <h2 className="font-[600] text-2xl md:text-3xl">CONNECT</h2>
        </div>
      </section>
      <section className="grid lg:grid-cols-2 px-8 md:px-20 py-16 gap-12 place-items-center">
        <div className="aspect-video overflow-clip rounded-2xl max-w-[500px] md:order-2">
          <Image
            src={"/main-2.webp"}
            alt="Main Image 1"
            width={1920}
            height={1080}
            className="w-full h-full object-cover rounded-2xl "
          />
        </div>
        <div className="text-center md:order-1">
          <h2 className="font-[600] text-2xl md:text-3xl">ENGAGE</h2>
        </div>
      </section>
      <section className="grid lg:grid-cols-2 px-8 md:px-20 py-16 gap-12 place-items-center">
        <div className="aspect-video overflow-clip rounded-2xl max-w-[500px]">
          <Image
            src={"/main-3.webp"}
            alt="Main Image 1"
            width={1920}
            height={1080}
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
        <div className="text-center">
          <h2 className="font-[600] text-2xl md:text-3xl">ORGANISE</h2>
        </div>
      </section>
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
