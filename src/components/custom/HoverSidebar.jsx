"use client";
import React, { useState, useContext, useEffect } from "react";
import Image from "next/image";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useRouter } from "next/navigation";
import { useConvex } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Settings,
  HelpCircle,
  CreditCard,
  LogOut,
  LogIn,
  MessageCircle,
  ChevronRight,
  Plus,
  Sidebar,
} from "lucide-react";
import SignInDialog from "./SignInDialog";
import Lookup from "@/data/Lookup";

function HoverSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const router = useRouter();
  const convex = useConvex();
  const [workspaceList, setWorkspaceList] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (userDetails) {
      GetAllWorkspaces();
    }
  }, [userDetails]);

  const GetAllWorkspaces = async () => {
    try {
      const result = await convex.query(api.workspace.GetAllWorkspaces, {
        userId: userDetails?._id,
      });
      setWorkspaceList(result || []);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      setWorkspaceList([]);
    }
  };

  const handleLogout = () => {
    setUserDetails(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
    router.push("/");
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleNewChat = () => {
    router.push("/");
  };

  const handleWorkspaceClick = (workspaceId) => {
    router.push(`/workspace/${workspaceId}`);
  };

  const getMenuItems = () => {
    const baseItems = [
      {
        icon: Settings,
        label: "Settings",
        action: () => console.log("Settings clicked"),
      },
      {
        icon: HelpCircle,
        label: "Help Center",
        action: () => console.log("Help clicked"),
      },
      {
        icon: CreditCard,
        label: "Subscriptions",
        action: () => console.log("Subscriptions clicked"),
      },
    ];

    if (userDetails) {
      return [
        ...baseItems,
        { icon: LogOut, label: "Sign Out", action: handleLogout },
      ];
    } else {
      return [
        ...baseItems,
        { icon: LogIn, label: "Sign In", action: handleOpenDialog },
      ];
    }
  };

  const handleMouseEnter = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setIsOpen(true);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleMouseLeave = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setIsOpen(false);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <>
      <div
        className="fixed left-0 top-0 h-full w-3 bg-transparent z-40 cursor-pointer"
        onMouseEnter={handleMouseEnter}
        title="Hover to open sidebar"
      />

      <div
        className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`fixed left-0 top-0 h-full z-50 transition-all duration-300 ease-in-out ${
          isOpen ? "w-80 translate-x-0" : "w-80 -translate-x-full"
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="h-full  backdrop-blur-xl shadow-2xl border-r border-white/10">
          <div className="flex flex-col h-full p-6">
            <div
              className={`flex items-center space-x-3 mb-8 group flex-shrink-0 transition-all duration-300 ${
                isOpen
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-4"
              }`}
              style={{ transitionDelay: isOpen ? "150ms" : "0ms" }}
            >
              <Image
                src="/logo.svg"
                alt="Crafta"
                width={32}
                height={32}
                className="h-8 w-8"
              />
            </div>

            <div
              className={`h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6 flex-shrink-0 transition-all duration-300 ${
                isOpen ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
              }`}
              style={{ transitionDelay: isOpen ? "200ms" : "0ms" }}
            />

            <div
              className={`mb-6 flex-shrink-0 transition-all duration-300 ${
                isOpen
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-4"
              }`}
              style={{ transitionDelay: isOpen ? "250ms" : "0ms" }}
            >
              <button
                onClick={handleNewChat}
                className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:text-primary transition-colors text-white font-medium group"
              >
                <Plus className="h-4 w-4" />
                <span>New Project</span>
              </button>
            </div>

            <div
              className={`flex-1 flex flex-col min-h-0 transition-all duration-300 ${
                isOpen
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-4"
              }`}
              style={{ transitionDelay: isOpen ? "300ms" : "0ms" }}
            >
              <h3 className="text-sm font-semibold text-white/80 mb-4 uppercase tracking-wider ml-2 flex-shrink-0">
                Your Chats
              </h3>
              <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30 pr-2 space-y-2">
                  {workspaceList && workspaceList.length > 0 ? (
                    workspaceList.map((workspace, index) => (
                      <div
                        key={index}
                        onClick={() => handleWorkspaceClick(workspace._id)}
                        className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-all duration-200 cursor-pointer sidebar-item-hover"
                      >
                        <MessageCircle className="h-4 w-4 text-white/60 group-hover:text-white/80 transition-colors flex-shrink-0" />
                        <span className="text-sm text-white/80 group-hover:text-white transition-colors truncate flex-1">
                          {workspace?.messages?.[0]?.content || "Untitled Chat"}
                        </span>
                        <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-white/60 transition-colors opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 flex-shrink-0" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-white/60">No chats yet</p>
                      <p className="text-xs text-white/40 mt-1">
                        Start a new conversation!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              className={`mt-auto flex-shrink-0 transition-all duration-300 ${
                isOpen
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-4"
              }`}
              style={{ transitionDelay: isOpen ? "350ms" : "0ms" }}
            >
              <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4" />

              <div className="space-y-1">
                {getMenuItems().map((item, index) => (
                  <button
                    key={index}
                    onClick={item.action}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-all duration-200 text-left group sidebar-item-hover"
                  >
                    <item.icon className="h-4 w-4 text-white/60 group-hover:text-white/80 transition-colors" />
                    <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>

              {userDetails && (
                <div className="pt-4 border-t border-white/10 mt-4">
                  <div className="flex items-center space-x-3 mb-3 group">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-white/40 transition-colors">
                      <Image
                        src={userDetails.picture || "/default-avatar.png"}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/90 truncate group-hover:text-white transition-colors">
                        {userDetails.email}
                      </p>
                      <p className="text-xs text-white/60 group-hover:text-white/80 transition-colors">
                        Credits: {userDetails.credits || 100}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!userDetails && (
                <div className="pt-4 border-t border-white/10 mt-4">
                  <div className="text-center">
                    <p className="text-sm text-white/60 mb-2">Not signed in</p>
                    <button
                      onClick={handleOpenDialog}
                      className="text-xs text-white/40 hover:text-white/60 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
                    >
                      Sign in to continue
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed left-7 bottom-8 z-30 transition-all duration-300 ${
          !isOpen && !isAnimating
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-4"
        }`}
      >
        <div className="p-2 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors cursor-pointer border border-white/20">
          <Sidebar className="h-5 w-5 text-white/80" />
        </div>
      </div>
      <SignInDialog
        openDialog={dialogOpen}
        closeDialog={() => setDialogOpen(false)}
        heading={Lookup.DIALOGS["SIGNIN"].HEADING}
        subheading={Lookup.DIALOGS["SIGNIN"].SUBHEADING}
      />
    </>
  );
}

export default HoverSidebar;
