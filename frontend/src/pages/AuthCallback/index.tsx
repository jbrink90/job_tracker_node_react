import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function AuthCallback() {
    const navigate = useNavigate();

    function getHashParams() {
        const hash = window.location.hash.substring(1);
        return new URLSearchParams(hash);
    }


  useEffect(() => {
    const doCallback = async () => {
    const params = getHashParams(); 
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");
    //const type = params.get("type");
    const code = params.get("code");
    const redirectTo = params.get("redirect") || "/table";

    try {
        if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
            });
            if (error) throw error;

            navigate(redirectTo);
            return;
        }

        // OAuth PKCE (uses exchangeCodeForSession)
        if (code) {
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            if (error) throw error;

            navigate(redirectTo);
            return;
        }

        console.error("No login parameters found.");
    } catch (err) {
        console.error("Auth callback error:", err);
    }
};

    doCallback();
  }, [navigate]);

  return <p>Logging you in…</p>;
}
