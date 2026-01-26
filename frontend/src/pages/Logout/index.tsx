import { useState } from "react";
import { supabase } from "../../lib/supabase";
import "./index.css";

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

  useState(() => {
    handleLogout();
  });

  return (
    <div className="reactTrackerPage_main">
      <div className="reactTrackerPage_leftPane">
        <div className="reactTrackerPage_buttonsContainer">
          <div className="reactTrackerPage_buttonsInner">
            <header className="reactTrackerPage_header">Logout</header>
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
              textAlign: "center",
            }}
          >
            <h2 style={{ marginBottom: 10, fontWeight: 700, color: "#333" }}>
              Signing you out...
            </h2>

            {status === "pending" && (
              <p style={{ marginTop: 12, color: "#555" }}>
                Kicking your session out the door… hold up.
              </p>
            )}

            {status === "done" && (
              <p style={{ marginTop: 12, color: "#4caf50", fontWeight: 500 }}>
                ✔ You're logged out! <br /> 
                Taking you to the login page…
              </p>
            )}

            {status === "error" && (
              <p style={{ marginTop: 12, color: "red" }}>
                Something went sideways: {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;
