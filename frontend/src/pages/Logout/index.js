import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import "./index.css";
const Logout = () => {
    const [status, setStatus] = useState("pending");
    const [error, setError] = useState("");
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            setError(error.message);
            setStatus("error");
            return;
        }
        setStatus("done");
        // Give the UI a moment to show the message
        setTimeout(() => {
            window.location.href = "/";
        }, 1200);
    };
    useState(() => {
        handleLogout();
    });
    return (_jsx("div", { className: "reactTrackerPage_main", children: _jsxs("div", { className: "reactTrackerPage_leftPane", children: [_jsx("div", { className: "reactTrackerPage_buttonsContainer", children: _jsx("div", { className: "reactTrackerPage_buttonsInner", children: _jsx("header", { className: "reactTrackerPage_header", children: "Logout" }) }) }), _jsx("div", { className: "reactTrackerPage_tableContainer", children: _jsxs("div", { style: {
                            maxWidth: 400,
                            margin: "40px auto",
                            padding: 30,
                            borderRadius: 12,
                            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                            backgroundColor: "#fff",
                            textAlign: "center",
                        }, children: [_jsx("h2", { style: { marginBottom: 10, fontWeight: 700, color: "#333" }, children: "Signing you out..." }), status === "pending" && (_jsx("p", { style: { marginTop: 12, color: "#555" }, children: "Kicking your session out the door\u2026 hold up." })), status === "done" && (_jsx("p", { style: { marginTop: 12, color: "#4caf50", fontWeight: 500 }, children: "\u2714 You're logged out! Taking you to the login page\u2026" })), status === "error" && (_jsxs("p", { style: { marginTop: 12, color: "red" }, children: ["Something went sideways: ", error] }))] }) })] }) }));
};
export default Logout;
