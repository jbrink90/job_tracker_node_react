import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

type Theme = "light" | "dark";

interface ThemeContextProps {
  siteTheme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  siteTheme: "light",
  toggleTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteTheme, setSiteTheme] = useState<Theme>(() => (localStorage.getItem("theme") as Theme) ?? "light");

  const toggleTheme = () => setSiteTheme((prev) => (prev === "light" ? "dark" : "light"));

  useEffect(() => {
    localStorage.setItem("theme", siteTheme);
  }, [siteTheme]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: siteTheme,
          background: {
            default: siteTheme === "dark" ? "#242424" : "#f5f5f5",
            paper: siteTheme === "dark" ? "#3a3a3a" : "#ffffff",
          },
          primary: { main: "#1976d2" },
          success: { main: "#24b14f" },
        },
        shape: { borderRadius: 7 },
        typography: { button: { textTransform: "none" } },
      }),
    [siteTheme]
  );

  return (
    <ThemeContext.Provider value={{ siteTheme, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
