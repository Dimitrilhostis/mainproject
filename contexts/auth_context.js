// contexts/AuthContext.jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

// 1) Création et export du contexte
export const AuthContext = createContext({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  sendMagicLink: async () => {},
  resetPassword: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupère la session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });
    // Écoute les changements
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Méthodes d’authent
  const signIn       = (email, pw) => supabase.auth.signInWithPassword({ email, password: pw });
  const signUp       = (email, pw) => supabase.auth.signUp({ email, password: pw });
  const signOut      = () => supabase.auth.signOut();
  const sendMagicLink= (email) => supabase.auth.signInWithOtp({ email });
  const resetPassword = (email) =>
    supabase.auth.resetPasswordForEmail(email, { redirectTo: `${process.env.NEXT_PUBLIC_URL}/reset-password` });

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, sendMagicLink, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

// 2) Hook “officiel” fourni par le contexte
export function useAuth() {
  return useContext(AuthContext);
}
