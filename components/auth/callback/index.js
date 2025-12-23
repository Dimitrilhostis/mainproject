"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      try {
        // Important: échange le "code" en session (PKCE).
        // On utilise l'URL complète, même si elle contient un hash.
        const href = window.location.href;

        const { error } = await supabase.auth.exchangeCodeForSession(href);
        if (error) {
          console.error("exchangeCodeForSession error:", error);
        }
      } finally {
        // Revenir où on était
        const returnTo = localStorage.getItem("auth:returnTo") || "/roadmaps";
        localStorage.removeItem("auth:returnTo");
        router.replace(returnTo);
      }
    };

    run();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Connexion en cours…
    </div>
  );
}
