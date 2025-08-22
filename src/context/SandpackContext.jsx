"use client";
import React, { createContext, useContext, useState } from "react";

const SandpackContext = createContext();

export const useSandpackContext = () => {
  const context = useContext(SandpackContext);
  if (!context) {
    throw new Error(
      "useSandpackContext must be used within a SandpackProvider"
    );
  }
  return context;
};

export const SandpackProvider = ({ children }) => {
  const [sandpackInstance, setSandpackInstance] = useState(null);

  return (
    <SandpackContext.Provider value={{ sandpackInstance, setSandpackInstance }}>
      {children}
    </SandpackContext.Provider>
  );
};
