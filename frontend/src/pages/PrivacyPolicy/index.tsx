import { Box, Container, Typography, Divider, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
    const navigate = useNavigate();

    return (
        <Box
        sx={{
            minHeight: "100vh",
            bgcolor: "background.default",
            color: "text.primary",
            py: 8,
        }}
        >
        <Container maxWidth="md">
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            Privacy Policy
            </Typography>

            <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
            Last updated: January 2026
            </Typography>

            <Divider sx={{ mb: 4 }} />

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            1. Information We Collect
            </Typography>
            <Typography sx={{ mb: 4, lineHeight: 1.7 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. We may collect
            personal information such as email addresses and usage data to provide
            and improve the service.
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            2. How We Use Information
            </Typography>
            <Typography sx={{ mb: 4, lineHeight: 1.7 }}>
            Sed posuere consectetur est at lobortis. Praesent commodo cursus magna,
            vel scelerisque nisl consectetur et. Donec sed odio dui.
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            3. Data Storage and Security
            </Typography>
            <Typography sx={{ mb: 4, lineHeight: 1.7 }}>
            We take reasonable measures to protect your information. However, no
            method of transmission over the Internet is 100% secure.
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            4. Third-Party Services
            </Typography>
            <Typography sx={{ mb: 4, lineHeight: 1.7 }}>
            We may rely on third-party services to operate parts of the application.
            These services are governed by their own privacy policies.
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            5. Your Rights
            </Typography>
            <Typography sx={{ mb: 6, lineHeight: 1.7 }}>
            You may request access to or deletion of your personal information
            subject to applicable laws and regulations.
            </Typography>

            <Divider />

            <Typography variant="body2" sx={{ mt: 4, color: "text.secondary" }}>
            If you have privacy concerns, please contact us.
            </Typography>
        </Container>

        <Box sx={{ textAlign: "center", mt: 6 }}>
            <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate(-1)} // goes back one page
            sx={{
                px: 6,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                borderRadius: 3,
                boxShadow: "0px 4px 15px rgba(0,0,0,0.25)",
                "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0px 6px 20px rgba(0,0,0,0.35)",
                },
                transition: "all 0.3s ease",
            }}
            >
            Back
            </Button>
        </Box>
        </Box>
    );
}
