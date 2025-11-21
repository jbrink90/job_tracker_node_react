import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./index.css";
import { Home, ReactTracker, Test, Map, Login, AuthCallback } from "./pages";
import { MuiTableTest } from "./components";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { supabase } from "./lib/supabase";
import { User } from "@supabase/supabase-js";


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
        <Route path="/table" element={<MuiTableTest />} />
        <Route path="/reacttracker" element={<ProtectedRoute><ReactTracker /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/test" element={<Test />} />
        <Route path="/map" element={<Map />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </Router>
  </LocalizationProvider>
);
