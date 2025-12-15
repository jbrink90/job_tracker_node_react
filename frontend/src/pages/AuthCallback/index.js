import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
export default function AuthCallback() {
    const navigate = useNavigate();
    useEffect(() => {
        const doCallback = async () => {
            // 1️⃣ Check hash parameters
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const queryParams = new URLSearchParams(window.location.search);
            const access_token = hashParams.get("access_token") || queryParams.get("access_token");
            const refresh_token = hashParams.get("refresh_token") || queryParams.get("refresh_token");
            const code = hashParams.get("code") || queryParams.get("code");
            const redirectTo = hashParams.get("redirect") || queryParams.get("redirect") || "/dashboard";
            try {
                // 2️⃣ Magic link / access_token flow
                if (access_token && refresh_token) {
                    const { error } = await supabase.auth.setSession({ access_token, refresh_token });
                    if (error)
                        throw error;
                    navigate(redirectTo, { replace: true });
                    return;
                }
                // 3️⃣ OAuth code flow
                if (code) {
                    const { error } = await supabase.auth.exchangeCodeForSession(code);
                    if (error)
                        throw error;
                    navigate(redirectTo, { replace: true });
                    return;
                }
                // 4️⃣ Fallback: already logged in?
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    navigate(redirectTo, { replace: true });
                    return;
                }
                console.error("No login parameters found and user not logged in.");
            }
            catch (err) {
                console.error("Auth callback error:", err);
            }
        };
        doCallback();
    }, [navigate]);
    return _jsx("p", { children: "Logging you in\u2026" });
}
