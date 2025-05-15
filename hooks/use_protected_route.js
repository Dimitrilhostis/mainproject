// hooks/useProtectedRoute.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import useAuth from "./useAuth";

export default function useProtectedRoute(redirectTo = "/login") {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Dès que l’auth est connue et qu’il n’y a pas d’utilisateur, on redirige
    if (!loading && !user) {
      router.replace(redirectTo);
    }
  }, [user, loading, router, redirectTo]);
}
