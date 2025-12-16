import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import isDev from "../../lib/is_dev";
import "./index.css";
const frontEndUrl = (isDev()
    ? import.meta.env.VITE_FRONTEND_BASE_URL_DEV
    : import.meta.env.VITE_FRONTEND_BASE_URL_PROD) || "http://localhost:5173";
const Login = () => {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");
    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: frontEndUrl,
            },
        });
        if (error) {
            setError(error.message);
            return;
        }
        setSent(true);
    };
    return (_jsx(_Fragment, { children: _jsx("div", { className: "reactTrackerPage_main", children: _jsxs("div", { className: "reactTrackerPage_leftPane", children: [_jsx("div", { className: "reactTrackerPage_buttonsContainer", children: _jsx("div", { className: "reactTrackerPage_buttonsInner", children: _jsx("header", { className: "reactTrackerPage_header", children: "Login" }) }) }), _jsx("div", { className: "reactTrackerPage_tableContainer", children: _jsxs("div", { style: {
                                maxWidth: 400,
                                margin: "40px auto",
                                padding: 30,
                                borderRadius: 12,
                                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                                backgroundColor: "#fff",
                            }, children: [_jsx("h2", { style: { marginBottom: 10, fontWeight: 700, color: "#333" }, children: "Sign in" }), _jsx("p", { style: { marginBottom: 20, color: "#555" }, children: "We'll send you a magic login link. No password needed!" }), !sent ? (_jsxs("form", { onSubmit: handleLogin, children: [_jsx("input", { type: "email", placeholder: "you@example.com", value: email, onChange: (e) => setEmail(e.target.value), style: {
                                                width: "100%",
                                                padding: "12px 14px",
                                                marginBottom: "12px",
                                                fontSize: "1rem",
                                                borderRadius: 8,
                                                border: "1px solid #ccc",
                                                outline: "none",
                                                transition: "border-color 0.2s",
                                                boxSizing: "border-box",
                                                color: 'white',
                                            }, onFocus: (e) => (e.currentTarget.style.borderColor = "#1976d2"), onBlur: (e) => (e.currentTarget.style.borderColor = "#ccc"), required: true }), _jsx("button", { type: "submit", style: {
                                                width: "100%",
                                                padding: "12px",
                                                fontSize: "1rem",
                                                fontWeight: 600,
                                                cursor: "pointer",
                                                borderRadius: 8,
                                                border: "none",
                                                backgroundColor: "#1976d2",
                                                color: "#fff",
                                                transition: "all 0.3s",
                                            }, onMouseEnter: (e) => (e.currentTarget.style.backgroundColor = "#1565c0"), onMouseLeave: (e) => (e.currentTarget.style.backgroundColor = "#1976d2"), children: "Send Magic Link" }), error && (_jsx("p", { style: { color: "red", marginTop: 12 }, children: error }))] })) : (_jsx("div", { children: _jsx("p", { style: {
                                            color: "#4caf50",
                                            fontWeight: 500,
                                            marginTop: 12,
                                        }, children: "\u2714 Magic link sent! Check your inbox and click the link to sign in." }) }))] }) })] }) }) }));
};
export default Login;
