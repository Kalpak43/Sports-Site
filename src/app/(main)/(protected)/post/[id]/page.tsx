"use client";

import CommentBox from "@/components/CommentBox";
import {
  PostCardFull,
  PostCardFullSkeleton,
} from "@/components/DisplayPosts/PostCard";
import { useAuthContext } from "@/contexts/AuthContext";
import { addComment, getSinglePost } from "@/firebase/db";
import { PostData } from "@/types/PostData";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function PostPage() {
  const { user, isProfileCreated, userData } = useAuthContext();

  const router = useRouter();
  const { id } = useParams();
  const [post, setPost] = React.useState<PostData | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [commentInput, setCommentInput] = React.useState<string>("");
  const [commentLoading, setCommentLoading] = React.useState<boolean>(false);
  const [refresh, setRefresh] = React.useState<boolean>(true);

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

  const handleComment = async () => {
    setCommentLoading(true);

    const tempComment: CommentData = {
      uid: user?.uid as string,
      userHandle: userData?.username as string,
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
      {!user || !userData || loading ? (
        <PostCardFullSkeleton />
      ) : (
        post && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mx-auto space-y-2 max-w-[800px]">
            <PostCardFull post={post} setPost={setPost} />
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
                    id={id as string}
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
