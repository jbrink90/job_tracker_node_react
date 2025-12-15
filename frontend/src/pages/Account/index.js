import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { getCurrentUser, supabase } from "../../lib/supabase";
import { Box, Typography, Paper, Button, Stack, CircularProgress, } from "@mui/material";
const AccountPage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    useEffect(() => {
        const load = async () => {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
            setLoading(false);
        };
        load();
    }, []);
    const formatDate = (iso) => {
        if (!iso)
            return "Unknown";
        const date = new Date(iso);
        return date.toLocaleDateString(undefined, {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
        });
    };
    const formatDateTime = (iso) => {
        if (!iso)
            return "Unknown";
        const date = new Date(iso);
        return date.toLocaleString(undefined, {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        });
    };
    const handleDeleteAccount = async () => {
        setDeleting(true);
        // Requires RPC you define (security definer)
        const { error } = await supabase.rpc("delete_user_self");
        setDeleting(false);
        if (error) {
            alert("Error deleting account: " + error.message);
        }
        else {
            await supabase.auth.signOut();
            window.location.href = "/";
        }
    };
    if (loading) {
        return (_jsx(Box, { sx: { mt: 8, display: "flex", justifyContent: "center" }, children: _jsx(CircularProgress, {}) }));
    }
    if (!user) {
        return (_jsx(Typography, { sx: { mt: 8, textAlign: "center" }, children: "You must be logged in to view this page." }));
    }
    return (_jsx(Box, { sx: { mt: 4, display: "flex", justifyContent: "center" }, children: _jsxs(Paper, { sx: { p: 4, width: "100%", maxWidth: 420 }, children: [_jsx(Button, { variant: "outlined", sx: { mb: 2 }, onClick: () => window.history.back(), children: "\u2190 Back" }), _jsx(Typography, { variant: "h5", sx: { mb: 3, fontWeight: 600 }, children: "Your Account" }), _jsxs(Stack, { spacing: 2, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "User ID" }), _jsx(Typography, { style: { userSelect: 'all' }, children: user.id })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Email" }), _jsx(Typography, { children: user.email ?? "Unknown" })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Joined" }), _jsx(Typography, { children: formatDate(user.created_at) })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Last Sign-In" }), _jsx(Typography, { children: formatDateTime(user.last_sign_in_at) })] }), _jsx(Button, { variant: "contained", color: "error", onClick: handleDeleteAccount, disabled: deleting, sx: { mt: 2 }, children: deleting ? "Deleting..." : "Delete My Account" })] })] }) }));
};
export default AccountPage;
