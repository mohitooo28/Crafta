import React from "react";

const WorkspaceSkeleton = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#111111] animate-pulse">
      <header className="relative flex h-14 w-full items-center justify-between border-b border-gray-800/50 bg-transparent px-4 flex-shrink-0">
        <div className="h-8 w-8 rounded-md bg-gray-700/50"></div>
        <div className="h-8 w-24 rounded-md bg-gray-700/50"></div>
      </header>

      <main className="flex-1 overflow-hidden p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 h-full w-full gap-4">
          <div className="md:col-span-4 lg:col-span-3 h-full min-h-0">
            <div className="w-full h-full bg-[#1c1c1c] rounded-lg flex flex-col p-3 gap-3">
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="h-4 w-1/4 rounded bg-gray-700/50"></div>
                  <div className="h-10 w-full rounded bg-gray-700/50"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-1/4 rounded bg-gray-700/50 ml-auto"></div>
                  <div className="h-16 w-full rounded bg-gray-700/50"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-1/4 rounded bg-gray-700/50"></div>
                  <div className="h-12 w-full rounded bg-gray-700/50"></div>
                </div>
              </div>
              <div className="h-12 w-full bg-gray-700/50 rounded-md"></div>
            </div>
          </div>

          <div className="hidden md:block md:col-span-8 lg:col-span-9 h-full min-h-0">
            <div className="w-full h-full bg-[#1c1c1c] rounded-lg overflow-hidden flex flex-col">
              <div className="bg-[#222222] border-b border-gray-800/50 px-4 py-2 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-40 bg-gray-700/50 rounded-lg"></div>
                  <div className="flex items-center space-x-2">
                    <div className="hidden sm:block h-4 w-24 bg-gray-700/50 rounded-md"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-700/50"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-700/50"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-700/50"></div>
                  </div>
                </div>
              </div>
              <div className="flex-1 p-4 flex gap-4">
                <div className="w-[200px] h-full bg-gray-700/50 rounded-md"></div>
                <div className="flex-1 h-full bg-gray-700/50 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkspaceSkeleton;
