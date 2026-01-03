import { useEffect, useState, useMemo } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Home, SimpleDashboard, Map, Login, Logout, AuthCallback, Account } from "./pages";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { supabase } from "./lib/supabase";
import { User } from "@supabase/supabase-js";
import "./main.css";
import { ThemeProvider, createTheme, CssBaseline, useMediaQuery } from "@mui/material";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  // Loading state (prevents instant redirect)
  if (user === undefined) return <p>Loading...</p>;

  // Not logged in
  if (!user) return <Navigate to="/login" />;

  // Logged in
  return children;
}

function AppWrapper() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [siteTheme, setSiteTheme] = useState<"light" | "dark" | "system">("system");
  
  const resolvedMode =
  siteTheme === "system" ? (prefersDarkMode ? "dark" : "light") : siteTheme;
  
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: resolvedMode,
          background: {
            default: resolvedMode === "dark" ? "#242424" : "#f5f5f5",
            paper: resolvedMode === "dark" ? "#3a3a3a" : "#ffffff",
          },
          primary: { main: "#1976d2" },
          success: { main: "#24b14f" },
        },
        shape: { borderRadius: 7 },
        typography: { button: { textTransform: "none" } },
      }),
    [resolvedMode]
  );
  

return (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <SimpleDashboard siteTheme={siteTheme} setSiteTheme={setSiteTheme} />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/map" element={<Map />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </LocalizationProvider>
  </ThemeProvider>
);
}

ReactDOM.createRoot(document.getElementById("root")!).render(<AppWrapper />);

