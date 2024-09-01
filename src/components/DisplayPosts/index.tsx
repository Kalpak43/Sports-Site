

import { PostData } from "@/types/PostData";
import { FirebaseError } from "firebase/app";
import Image from "next/image";
import React, { useEffect } from "react";
import { FaRegHeart } from "react-icons/fa";
import { BiCommentDetail } from "react-icons/bi";
import Link from "next/link";

export default function DisplayPosts({
  getPosts,
}: {
  getPosts: () => Promise<{
    result: PostData[];
    error: FirebaseError | null;
  }>;
}) {
  const [posts, setPosts] = React.useState<PostData[]>([]);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const { result, error } = await getPosts();
      if (error) {
        alert(error);
      } else {
        setPosts(result.sort((a, b) => Number(b.createdAt) - Number(a.createdAt)));
      }
      setLoading(false);
    }

    fetchPosts();
  }, []);

  return (
    <>
      {loading ? (
        "Loading..."
      ) : (
        <>
          {posts.map((p, index) => {
            return (
              <Link href={`/post/${p.id}`}
                key={index}
                className="w-full aspect-square relative rounded-2xl group overflow-hidden"
              >
                <div className="w-full h-full carousel">
                  {p.media.map((m, index) => {
                    return (
                      <Image
                        key={index}
                        src={m}
                        alt="Post Media"
                        width={500}
                        height={500}
                        className="carousel-item w-full h-full object-cover rounded-2xl"
                      />
                    );
                  })}
                </div>
                <div className="bg-black opacity-0 group-hover:opacity-100 bg-opacity-0 group-hover:bg-opacity-40 group-hover:backdrop-blur absolute inset-0 rounded-2xl transition-all duration-200 flex items-center justify-center gap-4">
                  <button className="text-center">
                    <FaRegHeart size={30} className="text-[#ff00ff]" />
                    {p.likes}
                  </button>
                  <button className="text-center">
                    <BiCommentDetail size={30} className="text-white" />
                    {p.comments}
                  </button>
                </div>
              </Link>
            );
          })}
        </>
      )}
    </>
  );
}
