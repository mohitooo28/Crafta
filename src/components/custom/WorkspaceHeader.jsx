"use client";
import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";

function WorkspaceHeader() {
  const projectTitle = "Crafta";

  return (
    <header className="relative flex h-14 w-full items-center justify-between bg-transparent px-5">
      <div
        style={{
          position: "absolute",
          left: 36,
          right: 18,
          bottom: 0,
          height: "1.5px",
          background: "rgba(31,41,55,0.5)",
          zIndex: 10,
        }}
      />
      <div className="flex items-center gap-2">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={28}
          height={28}
          className="h-8 w-8 ml-4"
        />
      </div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <h1 className="hidden text-lg font-medium text-gray-300 sm:block truncate">
          {projectTitle}
        </h1>
      </div>

      <div className="flex items-center">
        <Button
          size="sm"
          className="h-8 px-4 text-sm font-medium bg-accent/50 hover:bg-custom-blue text-gray-300 hover:text-white"
        >
          Publish
        </Button>
      </div>
    </header>
  );
}

export default WorkspaceHeader;
