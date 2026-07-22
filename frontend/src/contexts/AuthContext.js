import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import {
  clearAuthTokens,
  hasAuthTokens,
  isAuthTokenStorageKey,
  setAuthTokens,
  subscribeToAuthTokens,
} from "../services/authTokens";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(hasAuthTokens);

  useEffect(() => {
    const syncFromStorage = () => {
      setIsAuthenticated(hasAuthTokens());
    };

    const unsubscribe = subscribeToAuthTokens(syncFromStorage);

    const handleStorage = (event) => {
      if (isAuthTokenStorageKey(event.key)) {
        syncFromStorage();
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      unsubscribe();
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const login = useCallback((tokens) => {
    setAuthTokens(tokens);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    clearAuthTokens();
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
    }),
    [isAuthenticated, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
