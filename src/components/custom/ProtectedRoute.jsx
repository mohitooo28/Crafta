"use client";
import { useContext, useEffect } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useRouter } from "next/navigation";
import WorkspaceSkeleton from "./WorkspaceSkeleton";

function ProtectedRoute({ children }) {
  const { userDetails } = useContext(UserDetailContext);
  const router = useRouter();

  useEffect(() => {
    if (userDetails === null) {
      router.push("/");
    }
  }, [userDetails, router]);

  if (userDetails === undefined) {
    return <WorkspaceSkeleton />;
  }

  if (!userDetails) {
    return null;
  }

  return children;
}

export default ProtectedRoute;
