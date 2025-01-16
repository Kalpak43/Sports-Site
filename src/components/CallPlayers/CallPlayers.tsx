"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

export default function CallPlayers() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [center, setCenter] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    if (!navigator.geolocation) {
      throw new Error("Geolocation not supported");
    }

    navigator.geolocation.getCurrentPosition((pos) => {
      setCenter({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });
  }, []);

  return (
    <div className="px-4 md:px-8 py-16 bg-base-100 rounded-3xl w-full lg:w-[900px] relative overflow-hidden shadow-md">
      <form action="" className="grid md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Title</span>
            </div>
            <input
              type="text"
              placeholder="Add Title Here"
              className="input input-bordered grow"
              onChange={(e) => {
                // setNewPostData((x) => ({ ...x, caption: e.target.value }));
              }}
              required
            />
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Description</span>
            </div>
            <textarea
              placeholder="Add Title Here"
              className="textarea textarea-bordered grow"
              rows={3}
              onChange={(e) => {
                // setNewPostData((x) => ({ ...x, caption: e.target.value }));
              }}
              required
            />
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Select a Sport</span>
            </div>
            <select className="select select-bordered grow">
              <option disabled selected>
                Select a Sport
              </option>
              <option value="Badminton">Badminton</option>
              <option value="Cricket">Cricket</option>
              <option value="Football">Football</option>
            </select>
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">
                Select Number of Players Needed
              </span>
            </div>
            <input
              type="number"
              placeholder="4"
              className="input input-bordered grow"
              onChange={(e) => {
                // setNewPostData((x) => ({ ...x, caption: e.target.value }));
              }}
              required
            />
          </label>
        </div>

        <div className="space-y-4 flex flex-col justify-between">
          <label className="form-control w-full ">
            <div className="label">
              <span className="label-text">Set a Location</span>
            </div>
            <input
              type="text"
              placeholder="Search a Location"
              className="input input-bordered grow"
              onChange={(e) => {
                // setNewPostData((x) => ({ ...x, caption: e.target.value }));
              }}
              required
            />
          </label>
          <div className="flex-1">
            <APIProvider
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
            >
              <Map
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: "200px",
                  maxHeight: "300px",
                  borderRadius: "1rem",
                  overflow: "hidden",
                }}
                defaultCenter={center}
                mapId={"745289b5d20e8fbc"}
                defaultZoom={10}
                gestureHandling={"greedy"}
                disableDefaultUI={true}
                
              />
              <Marker position={center} />
            </APIProvider>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className="btn border-primary w-full"
              disabled={loading}
              onClick={() => {
                router.back();
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "SET EVENT"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
