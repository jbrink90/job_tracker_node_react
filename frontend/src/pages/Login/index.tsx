import { useState } from "react";
import { supabase } from "../../lib/supabase";
import "./index.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `http://localhost:5173/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  };

  return (
    <>
      <div className="reactTrackerPage_main">
        <div className="reactTrackerPage_leftPane">
          <div className="reactTrackerPage_buttonsContainer">
            <div className="reactTrackerPage_buttonsInner">
              <header className="reactTrackerPage_header">Login</header>
            </div>
          </div>

          <div className="reactTrackerPage_tableContainer">
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

                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      padding: "12px",
                      fontSize: "1rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      borderRadius: 8,
                      border: "none",
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#1565c0")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#1976d2")
                    }
                  >
                    Send Magic Link
                  </button>

                  {error && (
                    <p style={{ color: "red", marginTop: 12 }}>{error}</p>
                  )}
                </form>
              ) : (
                <div>
                  <p
                    style={{
                      color: "#4caf50",
                      fontWeight: 500,
                      marginTop: 12,
                    }}
                  >
                    ✔ Magic link sent! Check your inbox and click the link to sign
                    in.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
