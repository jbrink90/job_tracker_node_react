import { useState } from "react";
import { supabase } from "../../lib/supabase";
import "./index.css";
import { 
  Button, 
  Paper, 
  Typography, 
  TextField, 
  Box, 
  Alert,
  CircularProgress,
  Divider
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PageFooter } from "../../components";


const frontEndUrl = import.meta.env.VITE_FRONTEND_BASE_URL || "http://localhost:5173";

const Login = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${frontEndUrl}/dashboard`,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    const {error} = await supabase.auth.signInWithPassword({
      email: "demo@jobtrackr.online",
      password: import.meta.env.VITE_DEMO_PASSWORD,
    });

    setLoading(false);

    if (error) {
      console.error(error);
      setError(error.message);
    } else {
      navigate("/dashboard", { replace: false });
    }
  };

  return (
    <>
      <Box sx={{ mt: 4, mb: 4, display: "flex", justifyContent: "center" }}>
        <Paper sx={{ p: 4, width: "100%", maxWidth: 420 }}>
          <Typography component="h1" variant="h5" fontWeight="bold" gutterBottom>
            Sign in
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            We'll send you a magic login link. No password needed!
          </Typography>

          {!sent ? (
            <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
              <TextField
                fullWidth
                id="email"
                label="Email address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                disabled={loading}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
              >
                {loading ? 'Sending...' : 'Send Magic Link'}
              </Button>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              <Button
                fullWidth
                variant="contained"
                color="success"
                size="large"
                onClick={handleDemoLogin}
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
              >
                {loading ? 'Signing in...' : 'Try the Demo Account'}
              </Button>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Alert severity="success">
                <Typography variant="body1" fontWeight={500}>
                  ✔ Magic link sent! <br/> Check your inbox and click the link to sign in.
                </Typography>
              </Alert>
            </Box>
          )}
        </Paper>
      </Box>
      <PageFooter />
    </>
  );
};

export default Login;
