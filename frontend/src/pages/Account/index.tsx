import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getCurrentUser } from "../../lib/supabase";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";

const Account = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    load();
  }, []);

  const formatDate = (iso?: string | null) => {
    if (!iso) return "Unknown";
    const date = new Date(iso);
    return date.toLocaleDateString(undefined, {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (iso?: string | null) => {
    if (!iso) return "Unknown";
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

  // const handleDeleteAccount = async () => {
  //   setDeleting(true);

  //   // Requires RPC you define (security definer)
  //   const { error } = await supabase.rpc("delete_user_self");

  //   setDeleting(false);

  //   if (error) {
  //     alert("Error deleting account: " + error.message);
  //   } else {
  //     await supabase.auth.signOut();
  //     window.location.href = "/";
  //   }
  // };

  if (loading) {
    return (
      <Box sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Typography sx={{ mt: 8, textAlign: "center" }}>
        You must be logged in to view this page.
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
      <Paper sx={{ p: 4, width: "100%", maxWidth: 420 }}>
        {/* Back Button */}
        <Button
          variant="outlined"
          sx={{ mb: 2 }}
          onClick={() => window.history.back()}
        >
          &larr; Back
        </Button>

        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Your Account
        </Typography>

        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              User ID
            </Typography>
            <Typography style={{userSelect: 'all'}}>{user.id}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Email
            </Typography>
            <Typography>{user.email ?? "Unknown"}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Joined
            </Typography>
            <Typography>{formatDate(user.created_at)}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Last Sign-In
            </Typography>
            <Typography>{formatDateTime(user.last_sign_in_at)}</Typography>
          </Box>

          {/* <Button
            variant="contained"
            color="error"
            onClick={handleDeleteAccount}
            disabled={deleting}
            sx={{ mt: 2 }}
          >
            {deleting ? "Deleting..." : "Delete My Account"}
          </Button> */}
        </Stack>
      </Paper>
    </Box>
  );
};

export default Account;
