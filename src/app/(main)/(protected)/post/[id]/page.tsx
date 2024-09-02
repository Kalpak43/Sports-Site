"use client";

import CommentBox from "@/components/CommentBox";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  addComment,
  dislikePost,
  getSinglePost,
  likePost,
} from "@/firebase/db";
import { PostData } from "@/types/PostData";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { BiCommentDetail } from "react-icons/bi";
import { FaChevronLeft, FaChevronRight, FaRegHeart } from "react-icons/fa6";

export default function PostPage() {
  const { user, isProfileCreated, userData } = useAuthContext();

  const router = useRouter();
  const { id } = useParams();
  const [post, setPost] = React.useState<PostData | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [likesDisabled, setLikesDisabled] = React.useState<boolean>(false);
  const [commentInput, setCommentInput] = React.useState<string>("");
  const [commentLoading, setCommentLoading] = React.useState<boolean>(false);
  const [refresh, setRefresh] = React.useState<boolean>(false);

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
      result?.userProfile;
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

  const handleDislike = async () => {
    if (!user) router.push("/login");

    const { result, error } = await dislikePost(
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
            liked: false,
            likes: prev.likes - 1,
          };
        }

        return prev;
      });
    }
  };

  const handleLikeClick = async () => {
    if (likesDisabled) return;

    setLikesDisabled(true);

    post &&
      setTimeout(async () => {
        try {
          post.liked ? await handleDislike() : await handleLike();
        } catch (error) {
          alert(error);
        } finally {
          setLikesDisabled(false);
        }
      }, 1000);
  };

  const handleComment = async () => {
    setCommentLoading(true);

    const tempComment: CommentData = {
      uid: user?.uid as string,
      userHandle: userData?.name as string,
      userProfile: userData?.profilePhoto as string,
      comment: commentInput,
      createdAt: new Date().toISOString(),
    };

    const { result, error } = await addComment(post?.id as string, tempComment);
    if (error) {
      alert(error);
      return;
    }

    if (result) {
      setPost((prev) => {
        if (prev) {
          return {
            ...prev,
            comments: prev.comments + 1,
          };
        }

        return prev;
      });
    }

    setCommentInput("");
    setRefresh((prev) => !prev);
    setCommentLoading(false);
  };

  return (
    <div className="px-0 md:px-8 md:px-20 py-10 min-h-[90dvh]">
      {loading ? (
        <span className="block w-fit loading loading-spinner loading-lg mx-auto"></span>
      ) : (
        post && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mx-auto space-y-2 max-w-[800px]">
            <div className="space-y-2">
              <Link
                href={"/user/" + post.userHandle}
                className="btn btn-block btn-outline h-fit rounded-full py-2 "
              >
                <Image
                  src={
                    post.userProfile
                      ? "data:image/png;base64," + post.userProfile
                      : "/placeholder.jpeg"
                  }
                  alt="Post Media"
                  width={50}
                  height={50}
                  className="rounded-full aspect-square object-cover"
                />
                <p className="font-bold">{post.userHandle}</p>
              </Link>
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
                <button
                  className="text-center flex items-center gap-2"
                  onClick={handleLikeClick}
                  disabled={likesDisabled}
                >
                  {likesDisabled ? (
                    <span className="loading loading-spinner loading-md"></span>
                  ) : (
                    <FaRegHeart
                      size={30}
                      className={post.liked ? "text-[#ff00ff]" : "text-[#fff]"}
                    />
                  )}
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
            </div>
            <div className="relative h-full">
              <div className="lg:absolute inset-0 space-y-2 border-2 border-neutral rounded-2xl p-4 flex flex-col">
                <p className="font-bold">Comments:</p>
                {user && isProfileCreated && (
                  <form
                    action=""
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleComment();
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Type here"
                      className="input input-bordered w-full"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                    />
                    <button
                      className="btn btn-primary btn-block mt-2"
                      disabled={commentLoading}
                    >
                      {commentLoading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        "Comment"
                      )}
                    </button>
                  </form>
                )}
                <div className="p-4 space-y-2 divide-y-2 divide-neutral flex-1 overflow-y-scroll">
                  <CommentBox
                    id={post.id as string}
                    refresh={refresh}
                    setRefresh={setRefresh}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
