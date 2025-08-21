import { UserDetailContext } from "@/context/UserDetailContext";
import { useConvex } from "convex/react";
import React, { useContext, useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import { useSidebar } from "../ui/sidebar";

function WorkspaceHistory() {
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const [workspaceList, setWorkspaceList] = useState();
  const { toggleSidebar } = useSidebar();
  const convex = useConvex();

  useEffect(() => {
    userDetails && GetAllWorkspace();
  }, [userDetails]);

  const GetAllWorkspace = async () => {
    const result = await convex.query(api.workspace.GetAllWorkspaces, {
      userId: userDetails?._id,
    });
    setWorkspaceList(result);
  };

  return (
    <div>
      <h2 className="font-medium text-lg">Your Chats</h2>
      {workspaceList &&
        workspaceList?.map((workspace, index) => (
          <Link key={index} href={`/workspace/${workspace._id}`}>
            <h2
              className="text-sm text-gray-400 mt-2 font-light hover:text-white cursor-pointer"
              onClick={toggleSidebar}
            >
              {workspace?.messages[0]?.content || "Untitled Chat"}
            </h2>
          </Link>
        ))}
    </div>
  );
}

export default WorkspaceHistory;
