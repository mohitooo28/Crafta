import React from "react";

const WorkspaceSkeleton = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#101010] animate-pulse">
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
          <div className="h-8 w-8 rounded-md bg-gray-700/50 ml-1"></div>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-6 w-32 bg-gray-700/50 rounded-md"></div>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gray-700/50 rounded-md"></div>
          <div className="h-8 w-20 bg-gray-700/50 rounded-md"></div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden p-4 pl-16">
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
            <div className="w-full max-w-full h-[90vh] bg-[#0d1117] rounded-xl overflow-hidden border border-gray-800/50 shadow-2xl">
              <div className="w-full h-full grid grid-rows-[auto_1fr]">
                <div className="bg-gradient-to-r from-[#1c1c1c] to-[#161616] border-b border-gray-800/50 px-4 py-2">
                  <div className="flex items-center justify-between">
                    <div className="h-8 w-40 bg-gray-700/50 rounded-lg"></div>
                    <div className="flex items-center space-x-4">
                      <div className="hidden sm:block h-4 w-24 bg-gray-700/50 rounded-md"></div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-gray-700/50"></div>
                        <div className="w-3 h-3 rounded-full bg-gray-700/50"></div>
                        <div className="w-3 h-3 rounded-full bg-gray-700/50"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden">
                  <div className="flex w-full h-full">
                    <div className="w-[200px] h-full bg-gray-700/50 border-r border-gray-800/30"></div>
                    <div className="flex-1 h-full bg-gray-700/50"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed left-5 bottom-1 -translate-y-1/2 z-50">
        <div className="h-10 w-10 bg-gray-700/50 rounded-lg"></div>
      </div>
    </div>
  );
};

export default WorkspaceSkeleton;
