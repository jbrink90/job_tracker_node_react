import { Box, Typography, Divider, Button, Paper, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
      <Paper sx={{ p: 4, width: "100%", maxWidth: '65%' }}>

        <Button
          variant="outlined"
          sx={{ mb: 2 }}
          onClick={() => navigate(-1)}
        >
          &larr; Back
        </Button>

        <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
          Privacy Policy
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          Last updated: January 2026.
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={2}>
          <Typography>
            JobTrackr.online ("we," "us") respects your privacy and explains how
            we collect, use, and protect your information.
          </Typography>

          <Box>
            <Typography variant="h6" gutterBottom>
              Information We Collect
            </Typography>
            <Typography>
              We collect information you provide directly, like your email and
              account data, as well as usage data such as IP address and
              browser/device info. We do not knowingly collect data from minors
              under 18.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              How We Use Your Information
            </Typography>
            <Typography>
              To provide, improve, and maintain JobTrackr services, manage
              accounts, communicate updates, and ensure security. We never sell
              your data.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              Third-Party Services
            </Typography>
            <Typography>
              We use services like Supabase for authentication and Google
              Analytics for basic analytics. These providers follow their own
              privacy policies.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              Your Rights
            </Typography>
            <Typography>
              You can review, update, or delete your account data anytime.
              Residents of certain regions (EEA, UK, US states) have additional
              privacy rights. Contact us at jobtrackr.online/contact.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              Security
            </Typography>
            <Typography>
              We take reasonable measures to protect your information, but no
              system is 100% secure. Use the Services in a secure environment.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              Updates to This Policy
            </Typography>
            <Typography>
              We may update this Privacy Policy occasionally. Changes will be
              posted here with a revised date.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
