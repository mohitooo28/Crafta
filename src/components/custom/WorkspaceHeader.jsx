"use client";
import React, { useContext, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { MessagesContext } from "@/context/MessagesContext";
import { useWorkspaceFiles } from "@/context/WorkspaceFilesContext";
import { downloadWorkspaceAsZip } from "@/utils/downloadUtils";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { useSandpackContext } from "@/context/SandpackContext";

function WorkspaceHeader({ isCodeGenerating }) {
  const { messages } = useContext(MessagesContext);
  const { currentFiles } = useWorkspaceFiles();
  const { sandpackInstance } = useSandpackContext();
  const router = useRouter();
  const previewRef = useRef();
  const [isPublishing, setIsPublishing] = useState(false);

  let workspaceTitle = "";
  if (messages && messages.length > 0 && messages[0]?.content) {
    const maxLen = 100;
    workspaceTitle =
      messages[0].content.length > maxLen
        ? messages[0].content.slice(0, maxLen) + "..."
        : messages[0].content;
  }

  const handleDownload = async () => {
    if (!currentFiles || Object.keys(currentFiles).length === 0) {
      toast.error("No files available to download");
      return;
    }

    try {
      const success = await downloadWorkspaceAsZip(
        currentFiles,
        workspaceTitle || "Crafta-Workspace"
      );
      if (success) {
        toast.success("Workspace downloaded successfully!");
      } else {
        toast.error("Failed to download workspace");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download workspace");
    }
  };

  const handlePublish = async () => {
    if (isPublishing) return;

    setIsPublishing(true);
    try {
      if (!sandpackInstance) {
        toast.error("Code editor is not ready yet. Please wait a moment.");
        return;
      }

      const clients = Object.values(sandpackInstance.clients);
      if (clients.length === 0) {
        toast.error("Code editor is still initializing. Please wait a moment.");
        return;
      }

      const client = clients[0];
      console.log("Sandpack client:", client);

      toast.info("Publishing to CodeSandbox...");

      const result = await client.getCodeSandboxURL();
      console.log("CodeSandbox URL:", result);

      if (result?.sandboxId) {
        const url = `https://${result.sandboxId}.csb.app/`;
        toast.success("Published successfully! Opening in new tab...");
        window.open(url, "_blank");
      } else {
        toast.error("Failed to get CodeSandbox URL. Please try again.");
      }
    } catch (error) {
      console.error("Publish error:", error);
      toast.error("Failed to publish. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <header className="relative flex h-14 w-full items-center justify-between bg-transparent px-6">
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
        <button
          type="button"
          onClick={() => router.replace("/")}
          className="focus:outline-none"
          aria-label="Go to home"
        >
          <Image
            src="/logo.svg"
            alt="Logo"
            width={28}
            height={28}
            className="h-8 w-8 ml-1 cursor-pointer"
          />
        </button>
      </div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <h1 className="hidden text-lg font-medium text-gray-300 sm:block truncate max-w-[400px]">
          {workspaceTitle || "Crafta"}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-sm font-medium hover:bg-accent/50"
          onClick={handleDownload}
          disabled={
            !currentFiles ||
            Object.keys(currentFiles).length === 0 ||
            isCodeGenerating
          }
        >
          <Download />
        </Button>
        <Button
          size="sm"
          className="h-8 px-4 text-sm font-medium bg-custom-blue hover:bg-primary/90 text-white shadow-sm"
          onClick={handlePublish}
          disabled={isPublishing || isCodeGenerating}
        >
          {isPublishing ? "Publishing..." : "Publish"}
        </Button>
      </div>
    </header>
  );
}

export default WorkspaceHeader;
