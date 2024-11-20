"use client";

import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from "react";

const loader = new Loader({
  apiKey: "",
  version: "weekly",
});

const defaultOptions = {
  zoom: 20,
};

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log("Loading Google Maps...");
    loader
      .importLibrary("maps")
      .then(({ Map }) => {
        if (!mapRef.current) {
          throw new Error("Map ref not found");
        }

        const map = new Map(mapRef.current, defaultOptions);

        if (!navigator.geolocation) {
          throw new Error("Geolocation not supported");
        }

        navigator.geolocation.getCurrentPosition((position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          map.setCenter(pos);

          loader.importLibrary("marker").then(({ Marker }) => {
            new Marker({
              position: pos,
              map,
              title: "You are here",
            });
          });
        });
      })
      .catch((e) => {
        console.error("Error loading Google Maps:", e);
      });
  }, [mapRef]);

  return (
    <div>
      <div ref={mapRef} id="map" className="w-[300px] aspect-square"></div>
    </div>
  );
}
