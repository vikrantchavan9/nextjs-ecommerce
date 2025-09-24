
"use client";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // check cookie on mount
    const roleCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("role="));
    if (roleCookie) {
      const role = roleCookie.split("=")[1];
      setUser({ role });
    }
  }, []);

  const login = (userData) => setUser(userData);
  const logout = () => {
    document.cookie = "role=; Max-Age=0; path=/"; // clear cookie
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
