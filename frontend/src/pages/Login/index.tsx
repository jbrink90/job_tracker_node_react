import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { NavBar } from "../../components";
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
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  };

  return  (<>
  <div className="reactTrackerPage_main">
    <div className="reactTrackerPage_leftPane">
      <NavBar isUserLoggedIn={false} />

      <div className="reactTrackerPage_buttonsContainer">
        <div className="reactTrackerPage_buttonsInner">
          <header className="reactTrackerPage_header">Login</header>
        </div>
        <div className="reactTrackerPage_buttonsInner">
        </div>
      </div>
      <div className="reactTrackerPage_tableContainer">
      <div style={{ maxWidth: 400, margin: "40px auto", padding: 20 }}>
      <h2>Sign in</h2>
      <p>We'll send you a magic login link.</p>

      {!sent ? (
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              fontSize: "1rem",
            }}
            required
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Send Magic Link
          </button>

          {error && (
            <p style={{ color: "red", marginTop: "10px" }}>
              {error}
            </p>
          )}
        </form>
      ) : (
        <div>
          <p>
            ✔ Magic link sent!  
            Check your inbox and click the link to sign in.
          </p>
        </div>
      )}
    </div>
      </div>
    </div>
  </div>
</>)
};
export default Login;
