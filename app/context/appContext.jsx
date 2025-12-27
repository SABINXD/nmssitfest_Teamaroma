"use client";

import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [appName, setAppName] = useState("Blood Flow");

  return (
    <AppContext.Provider value={{ appName, setAppName }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
