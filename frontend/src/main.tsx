import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Home, SimpleDashboard, Dashboard, Table, Map, Login, AuthCallback } from "./pages";
import { MuiTableTest } from "./components";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { supabase } from "./lib/supabase";
import { User } from "@supabase/supabase-js";
import "./main.css";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  if (!user || user === null) return <Navigate to="/login" />;

  return children;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/simpledashboard" element={<SimpleDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/table" element={<Table />} />
        <Route path="/map" element={<Map />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </Router>
  </LocalizationProvider>
);
