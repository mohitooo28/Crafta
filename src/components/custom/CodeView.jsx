"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import Lookup from "@/data/Lookup";

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

function CodeView() {
  const [activeTab, setActiveTab] = useState("code");
  const [files, setFiles] = useState(Lookup?.DEFAULT_FILE);

  const [animationClass, setAnimationClass] = useState("animate-fadeIn");
  const prevTab = usePrevious(activeTab);

  useEffect(() => {
    if (prevTab === "code" && activeTab === "preview") {
      setAnimationClass("animate-slideInFromRight");
    } else if (prevTab === "preview" && activeTab === "code") {
      setAnimationClass("animate-slideInFromLeft");
    }
  }, [activeTab, prevTab]);

  return (
    <div className="w-full max-w-full bg-[#0d1117] rounded-xl overflow-hidden border border-gray-800/50 shadow-2xl">
      <div className="bg-gradient-to-r from-[#1c1c1c] to-[#161616] border-b border-gray-800/50 px-4 py-2">
        <div className="flex items-center justify-between">
          <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="flex items-center space-x-4">
            <span className="hidden sm:block text-gray-400 text-sm font-medium">
              {activeTab === "code" ? "Code Editor" : "Live Preview"}
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
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
            bundlerURL: undefined,
            startRoute: "/",
            recompileMode: "immediate",
            recompileDelay: 500,
          }}
        >
          <SandpackLayout
            style={{
              minHeight: "calc(100vh - 200px)",
              height: "80vh",
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
                      height: "100%",
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
                      height: "100%",
                      backgroundColor: "#0d1117",
                      border: "none",
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
                    height: "100%",
                    backgroundColor: "#ffffff",
                    border: "none",
                  }}
                  showNavigator={true}
                  showRefreshButton={true}
                  showOpenInCodeSandbox={true}
                />
              )}
            </div>
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>
  );
}

export default CodeView;
