import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Home, SimpleDashboard, Map, Login, Logout, AuthCallback, Account } from "./pages";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { supabase } from "./lib/supabase";
import "./main.css";
export function ProtectedRoute({ children }) {
    const [user, setUser] = useState(undefined);
    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
        });
    }, []);
    // Loading state (prevents instant redirect)
    if (user === undefined)
        return _jsx("p", { children: "Loading..." });
    // Not logged in
    if (!user)
        return _jsx(Navigate, { to: "/login" });
    // Logged in
    return children;
}
ReactDOM.createRoot(document.getElementById("root")).render(_jsx(LocalizationProvider, { dateAdapter: AdapterDayjs, children: _jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { children: _jsx(SimpleDashboard, {}) }) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/logout", element: _jsx(Logout, {}) }), _jsx(Route, { path: "/map", element: _jsx(Map, {}) }), _jsx(Route, { path: "/auth/callback", element: _jsx(AuthCallback, {}) }), _jsx(Route, { path: "/account", element: _jsx(ProtectedRoute, { children: _jsx(Account, {}) }) })] }) }) }));
