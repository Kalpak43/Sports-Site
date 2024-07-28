import { searchUsers } from "@/firebase/db";
import { UserData } from "@/types/UserData";
import Link from "next/link";
import React, { useEffect } from "react";

export default function SearchBar() {
  const [search, setSearch] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<UserData[] | null>(null);

  useEffect(() => {
    async function makeQuery() {
      if (search) {
        const { result, error } = await searchUsers(search);
        if (error) {
          alert(error);
          return;
        }

        if (result.length > 0) {
          setResult(result);
        } else {
          setResult(null);
        }
      }
    }

    // Debounce the search query
    const timeout = setTimeout(() => {
      makeQuery();
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="form-control hidden md:block relative">
      <input
        type="text"
        placeholder="Search"
        className="peer input input-bordered w-62"
        value={search || ""}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div
        id="search__result"
        className="rounded-xl absolute top-full left-0 right-0 p-4 bg-base-300 my-2 border-2 border-gray-600 hidden peer-focus:block"
      >
        {search ? (
          <>
            <div className="space-y-2">
              {result ? (
                result.map((user) => (
                  <Link
                    href={`/user/${user.username}`}
                    key={user.username}
                    className="flex items-center space-x-2 p-2 hover:bg-neutral rounded-xl"
                  >
                    <img
                      src={
                        user?.profilePhoto
                          ? "data:image/png;base64," + user.profilePhoto
                          : "/placeholder.jpeg"
                      }
                      alt="User"
                      className="w-8 h-8 rounded-full"
                    />
                    <p className="font-[700]">{user.username}</p>
                  </Link>
                ))
              ) : (
                <p className="text-center text-sm">No users found</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-sm">??? Search Users by Username</p>
        )}
      </div>
    </div>
  );
}
