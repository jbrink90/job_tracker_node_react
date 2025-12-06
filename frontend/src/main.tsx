import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Home, SimpleDashboard, Table, Map, Login, Logout, AuthCallback, Account } from "./pages";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { supabase } from "./lib/supabase";
import { User } from "@supabase/supabase-js";
import "./main.css";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
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


ReactDOM.createRoot(document.getElementById("root")!).render(
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<ProtectedRoute><SimpleDashboard /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/table" element={<Table />} />
        <Route path="/map" element={<Map />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
      </Routes>
    </Router>
  </LocalizationProvider>
);
