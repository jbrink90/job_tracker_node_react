import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useTheme } from "@mui/material";
import "./index.css";
import { PageFooter } from "../../components";

const Logout = () => {
  const theme = useTheme();
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
      <div className="reactTrackerPage_main">
        <div
          style={{
            maxWidth: 400,
            margin: "40px auto",
            padding: 30,
            borderRadius: 12,
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <h2 style={{ marginBottom: 10, fontWeight: 700, color: theme.palette.text.primary }}>
            Log out
          </h2>

          {status === "pending" && (
            <p style={{ marginTop: 12, color: theme.palette.text.secondary }}>
              Kicking your session out the door, please hold.
            </p>
          )}

          {status === "done" && (
            <p style={{ marginTop: 12, color: theme.palette.success.main, fontWeight: 500 }}>
              ✔ You're logged out! <br /> 
              Hang tight while we take you home.
            </p>
          )}

          {status === "error" && (
            <p style={{ marginTop: 12, color: theme.palette.error.main }}>
              Something went wrong: {error}
            </p>
          )}
        </div>
      <PageFooter />
      </div>
    </>
  );
};

export default Logout;
