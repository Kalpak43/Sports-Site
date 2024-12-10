import { useAuthContext } from "@/contexts/AuthContext";
import React from "react";

export default function SkeletonWrapper({
  show,
  children,
}: {
  show: React.ReactNode;
  children: React.ReactNode;
}) {
  const { loading, user } = useAuthContext();

  return <>{(loading || !user) ? show : children}</>;
}
