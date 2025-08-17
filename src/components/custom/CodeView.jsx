"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackPreview,
  useSandpack,
} from "@codesandbox/sandpack-react";
import Lookup from "@/data/Lookup";
import axios from "axios";
import Prompt from "@/data/Prompt";
import { useConvex, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { MessagesContext } from "@/context/MessagesContext";

const TabSwitcher = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "code", label: "Code" },
    { id: "preview", label: "Preview" },
  ];
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
  return (
    <div className="relative flex items-center bg-gray-600/40 rounded-lg p-1 text-primary">
      <span
        className="absolute left-0 top-0 h-full w-1/2 bg-gray-900 rounded-md shadow-inner transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
        aria-hidden="true"
      />
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`relative z-10 w-20 text-center px-3 py-1 text-xs font-medium rounded-md transition-colors duration-300 focus:outline-none ${
            activeTab === tab.id
              ? "text-[--primary-color]"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const SandpackUI = () => {
  const { sandpack } = useSandpack();
  const [activeTab, setActiveTab] = useState("code");
  const [animationClass, setAnimationClass] = useState("animate-fadeIn");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const prevTab = usePrevious(activeTab);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await sandpack.runSandpack();
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (prevTab === "code" && activeTab === "preview") {
      setAnimationClass("animate-slideInFromRight");
      sandpack.runSandpack();
    } else if (prevTab === "preview" && activeTab === "code") {
      setAnimationClass("animate-slideInFromLeft");
    }
  }, [activeTab, prevTab, sandpack]);

  return (
    <div className="w-full h-full grid grid-rows-[auto_1fr]">
      <div className="bg-gradient-to-r from-[#1c1c1c] to-[#161616] border-b border-gray-800/50 px-4 py-2">
        <div className="flex items-center justify-between">
          <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="flex items-center space-x-4">
            <span className="hidden sm:block text-gray-400 text-sm font-medium">
              {activeTab === "code" ? (
                "Code Editor"
              ) : (
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="hover:text-gray-200 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </button>
              )}
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <SandpackLayout
          style={{
            height: "100%",
            backgroundColor: "transparent",
            border: "none",
          }}
        >
          <div
            key={activeTab}
            className={`flex w-full h-full ${animationClass}`}
          >
            {activeTab === "code" ? (
              <>
                <SandpackFileExplorer
                  style={{
                    height: "90vh",
                    backgroundColor: "#0d1117",
                    border: "none",
                    borderRight: "1px solid rgba(55, 65, 81, 0.3)",
                    flex: "0 0 200px",
                    minWidth: "150px",
                    maxWidth: "350px",
                  }}
                />
                <SandpackCodeEditor
                  style={{
                    height: "90vh",
                    backgroundColor: "#0d1117",
                    border: "none",
                    overflow: "auto",
                  }}
                  showTabs
                  showLineNumbers
                  showInlineErrors
                  wrapContent
                  closableTabs
                />
              </>
            ) : (
              <SandpackPreview
                style={{
                  height: "90vh",
                  backgroundColor: "#ffffff",
                  border: "none",
                }}
                showNavigator={true}
                showRefreshButton={false}
                showOpenInCodeSandbox={true}
                key={sandpack.status}
              />
            )}
          </div>
        </SandpackLayout>
      </div>
    </div>
  );
};

function CodeView({ setIsCodeGenerating }) {
  const { id } = useParams();
  const [files, setFiles] = useState(Lookup?.DEFAULT_FILE);
  const { messages } = useContext(MessagesContext);
  const UpdateFiles = useMutation(api.workspace.UpdateFiles);
  const convex = useConvex();

  useEffect(() => {
    if (id) GetFiles();
  }, [id]);

  const GetFiles = async () => {
    setIsCodeGenerating(true);
    const result = await convex.query(api.workspace.GetWorkspace, {
      workspaceId: id,
    });
    const mergedFiles = { ...Lookup.DEFAULT_FILE, ...result?.fileData };
    setFiles(mergedFiles);
    setIsCodeGenerating(false);
  };

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages.length - 1].role;
      if (role === "user") {
        GenerateAiCode();
      }
    }
  }, [messages]);

  const GenerateAiCode = async () => {
    setIsCodeGenerating(true);
    const PROMPT = JSON.stringify(messages) + " " + Prompt.CODE_GEN_PROMPT;
    const result = await axios.post("/api/gen-ai-code", {
      prompt: PROMPT,
    });
    const aiResp = result.data;
    const mergedFiles = { ...Lookup.DEFAULT_FILE, ...aiResp?.files };
    setFiles(mergedFiles);
    await UpdateFiles({
      workspaceId: id,
      files: aiResp?.files,
    });
    setIsCodeGenerating(false);
  };

  return (
    <div className="w-full max-w-full h-[90vh] bg-[#0d1117] rounded-xl overflow-hidden border border-gray-800/50 shadow-2xl">
      <SandpackProvider
        theme="dark"
        files={files}
        customSetup={{
          entry: "/src/main.jsx",
          dependencies: {
            react: "18.2.0",
            "react-dom": "18.2.0",
            ...Lookup.DEPENDANCY,
          },
        }}
        options={{
          externalResources: ["https://cdn.tailwindcss.com"],
          recompileMode: "manual",
          recompileDelay: 500,
        }}
      >
        <SandpackUI />
      </SandpackProvider>
    </div>
  );
}

export default CodeView;
