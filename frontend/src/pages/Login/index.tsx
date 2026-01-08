import { useState } from "react";
import { supabase } from "../../lib/supabase";
import isDev from "../../lib/is_dev";
import "./index.css";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";


const frontEndUrl =
  (isDev()
    ? import.meta.env.VITE_FRONTEND_BASE_URL_DEV
    : import.meta.env.VITE_FRONTEND_BASE_URL_PROD) || "http://localhost:5173";

const Login = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${frontEndUrl}/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  };

  const handleDemoLogin = async () => {
    const {error} = await supabase.auth.signInWithPassword({
      email: "demo@jobtrackr.online",
      password: import.meta.env.VITE_DEMO_PASSWORD,
    });

    if (error) {
      console.error(error);
    } else {
      navigate("/dashboard", { replace: false });
    }
  };

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
            backgroundColor: "#fff",
          }}
        >
          <h2 style={{ marginBottom: 10, fontWeight: 700, color: "#333" }}>
            Sign in
          </h2>
          <p style={{ marginBottom: 20, color: "#555" }}>
            We'll send you a magic login link. No password needed!
          </p>

          {!sent ? (
            <>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  marginBottom: "12px",
                  fontSize: "1rem",
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                  color: 'white',
                }}
                
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "#1976d2")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "#ccc")
                }
                required
              />

              <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    padding: "12px",
                    fontWeight: 600,
                    fontSize: "1rem",
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                >
                  Send Magic Link
                </Button>

              {error && (
                <p style={{ color: "red", marginTop: 12 }}>{error}</p>
              )}
            </form>

            <div className="or-divider">OR</div>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  fullWidth
                  sx={{
                    padding: "12px",
                    fontWeight: 600,
                    fontSize: "1rem",
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                  onClick={handleDemoLogin}
                >
                  Try the Demo Account
                </Button>
            </>
          ) : (
            <div>
              <p
                style={{
                  color: "#4caf50",
                  fontWeight: 500,
                  marginTop: 12,
                }}
              >
                ✔ Magic link sent! Check your inbox and click the link to sign in.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
