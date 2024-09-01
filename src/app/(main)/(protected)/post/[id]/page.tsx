"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { getSinglePost, likePost } from "@/firebase/db";
import { PostData } from "@/types/PostData";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { BiCommentDetail } from "react-icons/bi";
import { FaChevronLeft, FaChevronRight, FaRegHeart } from "react-icons/fa6";

export default function PostPage() {
  const { user, isProfileCreated } = useAuthContext();

  const router = useRouter();
  const { id } = useParams();
  const [post, setPost] = React.useState<PostData | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const carouselRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      const { result, error } = await getSinglePost(
        id as string,
        user?.uid as string
      );

      if (error) {
        alert(error);
        router.back();
      }

      setPost(result);
      setLoading(false);
    };

    getPosts();
  }, []);

  const handleCarousel = (direction: "left" | "right") => {
    const carousel = carouselRef.current;
    if (carousel) {
      if (direction === "left") {
        carousel.scrollLeft -= 300;
      } else {
        carousel.scrollLeft += 300;
      }
    }
  };

  const handleLike = async () => {
    if (!user) router.push("/login");

    const { result, error } = await likePost(
      post?.id as string,
      user?.uid as string
    );

    if (error) {
      alert(error);
    }

    if (result) {
      setPost((prev) => {
        if (prev) {
          return {
            ...prev,
            liked: true,
            likes: prev.likes + 1,
          };
        }

        return prev;
      });
    }
  };

  return (
    <div className="px-0 md:px-8 md:px-20 py-10 h-[90dvh]">
      {loading ? (
        <span className="block w-fit loading loading-spinner loading-lg mx-auto"></span>
      ) : (
        post && (
          <div className="max-w-[400px] mx-auto space-y-2">
            <div className="w-full aspect-square overflow-hidden relative">
              <div ref={carouselRef} className="w-full h-full carousel ">
                {post.media.map((m, index) => {
                  return (
                    <Image
                      key={index}
                      src={m}
                      alt="Post Media"
                      width={1000}
                      height={1000}
                      className="carousel-item w-full h-full object-cover rounded-2xl"
                    />
                  );
                })}
              </div>
              <button
                onClick={() => handleCarousel("right")}
                className="absolute top-0 bottom-0 mx-2 right-0 my-auto z-50"
              >
                <FaChevronRight size={30} className="text-[#fff]" />
              </button>
              <button
                onClick={() => handleCarousel("left")}
                className="absolute top-0 bottom-0 mx-2 left-0 my-auto z-50"
              >
                <FaChevronLeft size={30} className="text-[#fff]" />
              </button>
            </div>
            <div className="py-2 flex gap-4">
              <button className="text-center flex items-center gap-2" disabled={post.liked} onClick={() => {
                handleLike();
              }}>
                <FaRegHeart size={30} className="text-[#ff00ff] text-[#ff00ff]" />
                <span className="text-lg">{post.likes}</span>
              </button>
              <button className="text-center flex items-center gap-2">
                <BiCommentDetail size={30} className="text-[#fff]" />
                <span className="text-lg">{post.comments}</span>
              </button>
            </div>
            <p>
              <span className="font-bold">Caption: </span>
              {post.caption}
            </p>
            <p className="font-bold">Comments:</p>
            {user && isProfileCreated && (
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
              />
            )}
            <div className="p-2 border-2 rounded-2xl"></div>
          </div>
        )
      )}
    </div>
  );
}
