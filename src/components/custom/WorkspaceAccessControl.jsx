"use client";
import { useContext, useEffect, useState } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useRouter, useParams } from "next/navigation";
import { useConvex } from "convex/react";
import { api } from "../../../convex/_generated/api";
import WorkspaceSkeleton from "./WorkspaceSkeleton";
import { toast } from "sonner";

function WorkspaceAccessControl({ children }) {
  const { userDetails } = useContext(UserDetailContext);
  const router = useRouter();
  const { id: workspaceId } = useParams();
  const convex = useConvex();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkWorkspaceAccess = async () => {
      if (!userDetails || !workspaceId) {
        setIsCheckingAccess(false);
        return;
      }

      try {
        const workspace = await convex.query(api.workspace.GetWorkspace, {
          workspaceId: workspaceId,
        });

        if (!workspace) {
          toast.error("Workspace not found");
          setTimeout(() => router.push("/"), 1500);
          return;
        }

        if (workspace.userId === userDetails._id) {
          setHasAccess(true);
        } else {
          toast.error("You don't have access to this workspace");
          setTimeout(() => router.push("/"), 1500);
          return;
        }
      } catch (error) {
        console.error("Error checking workspace access:", error);
        toast.error("Error accessing workspace");
        setTimeout(() => router.push("/"), 1500);
        return;
      } finally {
        setIsCheckingAccess(false);
      }
    };

    if (userDetails && workspaceId) {
      checkWorkspaceAccess();
    } else if (!userDetails) {
      setIsCheckingAccess(false);
    } else {
      setIsCheckingAccess(false);
    }
  }, [userDetails, workspaceId, convex, router]);

  if (isCheckingAccess) {
    return <WorkspaceSkeleton />;
  }

  if (!hasAccess) {
    return null;
  }

  return children;
}

export default WorkspaceAccessControl;
