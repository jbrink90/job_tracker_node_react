import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Typography, Paper, Grid, useTheme } from "@mui/material";
import { AccessTime, Edit, TrackChanges } from "@mui/icons-material";
export default function Home() {
    const navigate = useNavigate();
    const theme = useTheme();
    const bgColor = theme.palette.mode === "dark"
        ? theme.palette.background.default
        : theme.palette.primary.light;
    const textColor = theme.palette.mode === "dark"
        ? theme.palette.text.primary
        : theme.palette.primary.contrastText;
    const panels = [
        {
            title: "Update with Markdown ✍️",
            description: "Easily update your job postings with Markdown for rich formatting without the hassle.",
            icon: _jsx(Edit, { sx: { fontSize: 40, color: theme.palette.primary.main } }),
        },
        {
            title: "Track Status ⏱️",
            description: "Keep tabs on every job posting's progress, deadlines, and changes in one place.",
            icon: _jsx(TrackChanges, { sx: { fontSize: 40, color: theme.palette.primary.main } }),
        },
        {
            title: "Magic Login 🔑",
            description: "No passwords required. Securely login using just your email — hassle-free and safe.",
            icon: _jsx(AccessTime, { sx: { fontSize: 40, color: theme.palette.primary.main } }),
        },
    ];
    return (_jsx(Box, { sx: {
            minHeight: "100vh",
            backgroundColor: bgColor,
            color: textColor,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
        }, children: _jsxs(Container, { maxWidth: "md", sx: { textAlign: "center", py: 8 }, children: [_jsx(Typography, { variant: "h2", component: "h1", gutterBottom: true, sx: { fontWeight: 700 }, children: "Track Your Job Postings" }), _jsx(Typography, { variant: "h5", component: "p", gutterBottom: true, sx: { mb: 4 }, children: "Organize, update, and monitor your job postings effortlessly \u2014 all without passwords." }), _jsx(Button, { variant: "contained", color: "secondary", size: "large", onClick: () => navigate("/dashboard"), sx: {
                        fontWeight: 600,
                        px: 5,
                        py: 1.5,
                        fontSize: "1.1rem",
                        borderRadius: 3,
                        boxShadow: "0px 4px 15px rgba(0,0,0,0.3)",
                        "&:hover": {
                            transform: "scale(1.05)",
                            boxShadow: "0px 6px 20px rgba(0,0,0,0.35)",
                        },
                        transition: "all 0.3s ease",
                    }, children: "Start Using Now" }), _jsx(Grid, { container: true, spacing: 4, sx: { mt: 8, justifyContent: "center" }, children: panels.map((panel) => (_jsxs(Paper, { sx: {
                            flex: "1 1 300px", // flex-basis + grow/shrink
                            maxWidth: 360,
                            minWidth: 280,
                            p: 4,
                            m: 2,
                            textAlign: "center",
                            borderRadius: 3,
                            transition: "transform 0.3s ease",
                            "&:hover": { transform: "translateY(-8px)" },
                        }, children: [_jsx(Box, { sx: { mb: 2 }, children: panel.icon }), _jsx(Typography, { variant: "h6", gutterBottom: true, children: panel.title }), _jsx(Typography, { variant: "body2", children: panel.description })] }, panel.title))) })] }) }));
}
