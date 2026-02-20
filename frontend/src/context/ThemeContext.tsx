import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

type Theme = "light" | "dark" | "system";

interface ThemeContextProps {
  siteTheme: Theme;
  resolvedTheme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  siteTheme: "system",
  resolvedTheme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

const getSystemTheme = (): "light" | "dark" => {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light";
};

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteTheme, setSiteTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("theme") as Theme;
    return stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
  });

  const resolvedTheme = siteTheme === "system" ? getSystemTheme() : siteTheme;

  const toggleTheme = () => {
    setSiteTheme((prev) => {
      if (prev === "light") return "dark";
      if (prev === "dark") return "system";
      return "light";
    });
  };

  const setTheme = (theme: Theme) => setSiteTheme(theme);

  useEffect(() => {
    localStorage.setItem("theme", siteTheme);
  }, [siteTheme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (siteTheme === "system") {
        // Force re-render when system theme changes
        setSiteTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [siteTheme]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: resolvedTheme,
          background: {
            default: resolvedTheme === "dark" ? "#242424" : "#f5f5f5",
            paper: resolvedTheme === "dark" ? "#3a3a3a" : "#ffffff",
          },
          primary: { main: "#1976d2" },
          success: { main: "#24b14f" },
        },
        shape: { borderRadius: 7 },
        typography: { button: { textTransform: "none" } },
      }),
    [resolvedTheme]
  );

  return (
    <ThemeContext.Provider value={{ siteTheme, resolvedTheme, toggleTheme, setTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
