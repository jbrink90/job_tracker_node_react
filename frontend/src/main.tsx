import { useEffect, useState, useMemo } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Home, SimpleDashboard, Map, Login, Logout, AuthCallback, Account, PrivacyPolicy, Terms } from "./pages";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { supabase } from "./lib/supabase";
import { User } from "@supabase/supabase-js";
import "./main.css";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { SnackbarProvider } from 'notistack';

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

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      console.log('Service worker registered:', reg);

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        newWorker?.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // a new servicewroker is available; prompt the user to refresh and
            // call navigator.serviceWorker.controller.postMessage({type: 'SKIP_WAITING'})
          }
        });
      });
    } catch (err) {
      console.error('SW registration failed:', err);
    }
  });
}

function AppWrapper() {
  type Theme = "light" | "dark";

  const [siteTheme, setSiteTheme] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) ?? "light";
  });
  
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
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <SnackbarProvider maxSnack={3}>
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
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
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
      </SnackbarProvider>
    </LocalizationProvider>
  </ThemeProvider>
);
}

ReactDOM.createRoot(document.getElementById("root")!).render(<AppWrapper />);

