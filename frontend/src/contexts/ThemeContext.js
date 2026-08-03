import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

const THEME_STORAGE_KEY = "secora.theme";
const THEME_OPTIONS = ["light", "dark"];

export const ThemeContext = createContext(null);

function getStoredTheme() {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return THEME_OPTIONS.includes(stored) ? stored : "light";
}

function applyTheme(theme) {
  const root = document.documentElement;

  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getStoredTheme);

  const setTheme = useCallback((nextTheme) => {
    const safeTheme = THEME_OPTIONS.includes(nextTheme) ? nextTheme : "light";

    localStorage.setItem(THEME_STORAGE_KEY, safeTheme);
    setThemeState(safeTheme);
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      options: THEME_OPTIONS,
      resolvedTheme: theme,
      setTheme,
      theme,
    }),
    [setTheme, theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export { THEME_STORAGE_KEY };
