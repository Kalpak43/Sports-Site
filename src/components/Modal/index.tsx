"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Modal({
  show,
  children,
}: {
  show: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [show]);

  return (
    show && (
      <div className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-neutral bg-opacity-40 backdrop-blur flex flex-col items-center justify-center p-4">
        {children}
      </div>
    )
  );
}
