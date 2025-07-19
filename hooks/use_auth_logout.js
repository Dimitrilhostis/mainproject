// hooks/useAutoLogout.js
import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/auth_context";

export default function useAutoLogout(timeout = 15 * 60 * 1000) {
  const { signOut, user } = useAuth();
  const timer = useRef();

  useEffect(() => {
    if (!user) return;
    const reset = () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        signOut();
        // Optionnel : notif d’expiration
        alert("Déconnecté pour cause d’inactivité.");
      }, timeout);
    };

    ["mousemove", "keydown", "click", "scroll", "touchstart"].forEach(evt =>
      window.addEventListener(evt, reset)
    );
    reset();
    return () => {
      clearTimeout(timer.current);
      ["mousemove", "keydown", "click", "scroll", "touchstart"].forEach(evt =>
        window.removeEventListener(evt, reset)
      );
    };
  }, [user, signOut, timeout]);
}
