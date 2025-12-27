
"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAllRequireUsers, setOpenAllRequireUsers] = useState(false);
  const [openNotificationUI, setOpenNotificationUI] = useState(false);

  useEffect(() => {
    fetch("/api/me")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setUser(data?.user || null);
        setLoading(false);
      });
  }, []);


  return (
    <AuthContext.Provider value={{ user, loading, allUsers, setAllUsers, openAllRequireUsers, setOpenAllRequireUsers, openNotificationUI, setOpenNotificationUI }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
