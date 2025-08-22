"use client";
import React, { useState, useEffect } from "react";
import ChatView from "@/components/custom/ChatView";
import CodeView from "@/components/custom/CodeView";
import WorkspaceSkeleton from "@/components/custom/WorkspaceSkeleton";
import WorkspaceHeader from "@/components/custom/WorkspaceHeader";
import HoverSidebar from "@/components/custom/HoverSidebar";
import ProtectedRoute from "@/components/custom/ProtectedRoute";
import { SandpackProvider } from "@/context/SandpackContext";

function Workspace() {
  const [isLoading, setIsLoading] = useState(true);
  const [isCodeGenerating, setIsCodeGenerating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <WorkspaceSkeleton />;
  }

  return (
    <SandpackProvider>
      <div className="flex flex-col h-screen overflow-hidden bg-[#101010] text-foreground">
        <WorkspaceHeader isCodeGenerating={isCodeGenerating} />
        <main className="flex-1 overflow-hidden p-4 pl-16">
          <div className="grid grid-cols-1 md:grid-cols-12 h-full w-full gap-4">
            <div className="md:col-span-4 lg:col-span-3 h-full min-h-0">
              <ChatView isCodeGenerating={isCodeGenerating} />
            </div>
            <div className="hidden md:block md:col-span-8 lg:col-span-9 h-full min-h-0">
              <CodeView
                isCodeGenerating={isCodeGenerating}
                setIsCodeGenerating={setIsCodeGenerating}
              />
            </div>
          </div>
        </main>
        <HoverSidebar />
      </div>
    </SandpackProvider>
  );
}

export default function WorkspacePage() {
  return (
    <ProtectedRoute>
      <Workspace />
    </ProtectedRoute>
  );
}
