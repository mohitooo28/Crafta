"use client";
import React, { createContext, useContext, useState } from "react";

const WorkspaceFilesContext = createContext();

export const useWorkspaceFiles = () => {
  const context = useContext(WorkspaceFilesContext);
  if (!context) {
    throw new Error(
      "useWorkspaceFiles must be used within a WorkspaceFilesProvider"
    );
  }
  return context;
};

export const WorkspaceFilesProvider = ({ children }) => {
  const [currentFiles, setCurrentFiles] = useState(null);

  return (
    <WorkspaceFilesContext.Provider value={{ currentFiles, setCurrentFiles }}>
      {children}
    </WorkspaceFilesContext.Provider>
  );
};
