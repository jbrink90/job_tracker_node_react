import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const doCallback = async () => {
      try {
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const queryParams = new URLSearchParams(window.location.search);

        const access_token = hashParams.get("access_token") ?? queryParams.get("access_token");
        const refresh_token = hashParams.get("refresh_token") ?? queryParams.get("refresh_token");
        const code = hashParams.get("code") ?? queryParams.get("code");
        const redirectTo = hashParams.get("redirect") ?? queryParams.get("redirect") ?? "/dashboard";

        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          if (error) throw error;
        } else if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else {
          throw new Error("No auth parameters found");
        }

        const safeRedirect = redirectTo.startsWith("/")
          ? redirectTo
          : "/dashboard";

        navigate(safeRedirect, { replace: true });
      } catch (err) {
        console.error("Auth callback error:", err);
        navigate("/login", { replace: true });
      }
    };

    doCallback();
  }, [navigate]);

  return <p>Logging you in…</p>;
}
