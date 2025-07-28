"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth_context";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import Layout from '@/components/layout';
import Link from 'next/link';

export default function AuthForm() {
  const { signInWithGoogle } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    const { error } = await signInWithGoogle();
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      // after Google auth, user is redirected; just push home
      router.push("/");
    }
  };

  const titleText = mode === "login" ? "Connectez-vous" : "Créer un compte";
  const buttonText = loading ? "Chargement..." : (mode === "login" ? "Se connecter avec Google" : "S'inscrire avec Google");

  return (
    <Layout>
      <main className="w-screen h-screen relative flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-[var(--background)]/80" />

        {/* Card Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-sm w-full bg-transparent backdrop-blur-2xl rounded-3xl p-8 shadow-2xl flex flex-col items-center border border-[var(--text3)]/30"
        >
          <h2 className="text-3xl font-extrabold text-[var(--text1)] mb-4">
            {titleText}
          </h2>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 mb-2">
              {error}
            </motion.div>
          )}

          <motion.button
            onClick={handleGoogle}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-full py-3 bg-gradient-to-r from-[var(--green2)] to-[var(--green3)] text-[var(--background)] rounded-full font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-50"
          >
            <FcGoogle className="mr-3 text-2xl" />
            {buttonText}
          </motion.button>

          {/* Toggle Mode Link */}
          <div className="mt-6 text-[var(--text2)] text-center">
            {mode === "login" ? (
              <p>
                Pas de compte ?{' '}
                <button onClick={() => setMode("signup")} className="underline hover:text-[var(--text1)]">
                  Inscrivez-vous
                </button>
              </p>
            ) : (
              <p>
                Déjà un compte ?{' '}
                <button onClick={() => setMode("login")} className="underline hover:text-[var(--text1)]">
                  Connectez-vous
                </button>
              </p>
            )}
          </div>

          <Link href="/" className="mt-4 text-[var(--text2)] hover:text-[var(--text1)] transition">
            Retour à l&apos;accueil
          </Link>
        </motion.div>
      </main>
    </Layout>
  );
}
