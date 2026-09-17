import { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, CircularProgress, Alert } from "@mui/material";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import { PageFooter } from "../../components";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setName(session.user?.user_metadata?.full_name || "");
        setEmail(session.user?.email || "");
      }
    };
    getSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/${import.meta.env.VITE_SUPABASE_CONTACT_FUNCTION}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apiKey": `${import.meta.env.VITE_SUPABASE_ANON}`,
          },
          body: JSON.stringify({ name, email, message }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setSubmitStatus("success");
      setMessage("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Box sx={{ p: 4, maxWidth: 800, mx: "auto", color: "text.primary" }}>
        <Typography variant="h4" gutterBottom>
          Contact Us
        </Typography>
        <Typography>
          Have a question or feedback? Fill out the form below and we'll get
          back to you.
        </Typography>

        {submitStatus === "success" && (
          <Alert severity="success" sx={{ mt: 3 }}>
            Message sent successfully! We'll get back to you soon.
          </Alert>
        )}

        {submitStatus === "error" && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {errorMessage}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 3 }}
        >
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            multiline
            minRows={4}
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="success"
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
            Send Message
          </Button>
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate(-1)}
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
      </Box>

      <PageFooter />
    </>
  );
}
