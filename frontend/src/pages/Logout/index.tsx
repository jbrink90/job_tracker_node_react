import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { 
  Paper,
  Typography,
  Box,
  Alert,
  CircularProgress
} from "@mui/material";
import "./index.css";
import { PageFooter } from "../../components";

const Logout = () => {
  const [status, setStatus] = useState<"pending" | "done" | "error">("pending");
  const [error, setError] = useState("");

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error.message);
      setStatus("error");
      return;
    }

    setStatus("done");

    setTimeout(() => {
      window.location.href = "/";
    }, 1200);
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return (
    <>
      <Box sx={{ mt: 4, mb: 4, display: "flex", justifyContent: "center" }}>
        <Paper sx={{ p: 4, width: "100%", maxWidth: 420, textAlign: 'center' }}>
          <Typography component="h1" variant="h5" fontWeight="bold" gutterBottom>
            Log out
          </Typography>

          {status === "pending" && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
              <CircularProgress size={40} sx={{ mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Kicking your session out the door, please hold.
              </Typography>
            </Box>
          )}

          {status === "done" && (
            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="body1" fontWeight={500}>
                ✔ You're logged out! <br /> 
                Hang tight while we take you home.
              </Typography>
            </Alert>
          )}

          {status === "error" && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <Typography variant="body1">
                Something went wrong: {error}
              </Typography>
            </Alert>
          )}
        </Paper>
      </Box>
      <PageFooter />
    </>
  );
};

export default Logout;
