import { Box, Typography, Divider, Button, Paper, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Terms() {
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
          Terms of Service
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          Last updated: January 2026.
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={2}>
          <Typography>
            Welcome to JobTrackr.online ("we," "us," or "our"). By using our
            services ("Services"), you agree to these Terms of Service. If you
            do not agree, please do not use our Services.
          </Typography>

          <Box>
            <Typography variant="h6" gutterBottom>
              1. Using the Services
            </Typography>
            <Typography>
              You agree to use JobTrackr responsibly and in compliance with all
              applicable laws.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              2. Accounts
            </Typography>
            <Typography>
              You must be at least 18 years old to create an account. You are
              responsible for all activity under your account. We may suspend or
              terminate accounts that violate these Terms or are inactive for a
              long period.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              3. Content
            </Typography>
            <Typography>
              You retain ownership of content you upload, but by using the
              Services, you grant us a license to operate, display, and manage
              your content as needed to provide our Services.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              4. Acceptable Use
            </Typography>
            <Typography>
              You may not use the Services for illegal activities, to harm
              others, or to disrupt our systems. We reserve the right to remove
              content or suspend accounts that violate these rules.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              5. Payments
            </Typography>
            <Typography>
              If you use paid features, you agree to pay the applicable fees. All
              payments are non-refundable unless otherwise stated. We may change
              fees with prior notice.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              6. Disclaimers
            </Typography>
            <Typography>
              The Services are provided "as is" without warranties of any kind.
              We do not guarantee uninterrupted or error-free service. You use
              the Services at your own risk.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              7. Limitation of Liability
            </Typography>
            <Typography>
              To the maximum extent permitted by law, JobTrackr will not be
              liable for indirect, incidental, or consequential damages arising
              from your use of the Services.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              8. Termination
            </Typography>
            <Typography>
              We may suspend or terminate your access at any time for violation
              of these Terms or for other reasons. Upon termination, your rights
              to use the Services immediately cease.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              9. Changes to Terms
            </Typography>
            <Typography>
              We may update these Terms occasionally. The revised date will be
              updated at the top. Continued use of the Services after updates
              constitutes acceptance of the new Terms.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              10. Contact
            </Typography>
            <Typography>
              Questions about these Terms? Contact us at
              jobtrackr.online/contact.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
