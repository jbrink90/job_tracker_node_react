import { Box, Container, Typography, Divider, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Terms() {
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
          Terms & Conditions
        </Typography>

        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
          Last updated: January 2026
        </Typography>

        <Divider sx={{ mb: 4 }} />

        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          1. Acceptance of Terms
        </Typography>
        <Typography sx={{ mb: 4, lineHeight: 1.7 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. By accessing
          or using this application, you agree to be bound by these Terms and
          Conditions. If you do not agree, you should not use the service.
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          2. Use of the Service
        </Typography>
        <Typography sx={{ mb: 4, lineHeight: 1.7 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
          ullamcorper nulla non metus auctor fringilla. Etiam porta sem
          malesuada magna mollis euismod.
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          3. User Responsibilities
        </Typography>
        <Typography sx={{ mb: 4, lineHeight: 1.7 }}>
          Curabitur blandit tempus porttitor. Integer posuere erat a ante
          venenatis dapibus posuere velit aliquet. Donec sed odio dui.
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          4. Limitation of Liability
        </Typography>
        <Typography sx={{ mb: 4, lineHeight: 1.7 }}>
          Nulla vitae elit libero, a pharetra augue. Maecenas faucibus mollis
          interdum. Cras mattis consectetur purus sit amet fermentum.
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          5. Changes to These Terms
        </Typography>
        <Typography sx={{ mb: 6, lineHeight: 1.7 }}>
          We reserve the right to modify these Terms at any time. Continued use
          of the service after changes constitutes acceptance of the revised
          Terms.
        </Typography>

        <Divider />

        <Typography variant="body2" sx={{ mt: 4, color: "text.secondary" }}>
          Questions about these Terms? Contact us for clarification.
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
