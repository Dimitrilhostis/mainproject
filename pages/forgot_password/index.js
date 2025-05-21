"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import { motion } from "framer-motion";
import Link from "next/link";
import Loader from "@/components/loader";
import useAuth from "@/hooks/use_auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { user, resetPassword, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Redirect if logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/discover");
    }
  }, [authLoading, user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setMessage("");
    setIsSubmitting(true);

    const { error } = await resetPassword(email);
    if (error) {
      setErrorMsg(error.message);
    } else {
      setMessage(
        "Si un compte existe, un email de réinitialisation a été envoyé."
      );
    }
    setIsSubmitting(false);
  };

  if (authLoading || (isSubmitting && !user)) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center h-screen">
          <Loader />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full p-20 max-w-lg mx-auto bg-gradient-to-br from-pink-100 via-violet-50 to-purple-100 backdrop-blur-lg rounded-3xl shadow-2xl space-y-6"
        >
          <h1 className="text-4xl font-extrabold text-center text-purple-700">
            Mot de passe oublié
          </h1>
          {errorMsg && (
            <p className="text-center text-red-600 animate-shake">{errorMsg}</p>
          )}
          {message && <p className="text-center text-green-600">{message}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <label
                htmlFor="email"
                className="absolute -top-3 left-4 bg-white/70 rounded-md px-1 text-sm text-purple-600"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-transparent focus:border-purple-400 rounded-xl bg-white focus:outline-none transition"
              />
            </motion.div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className="w-full py-3 mt-3 bg-purple-600 text-white font-semibold rounded-xl shadow hover:bg-purple-700 transition disabled:opacity-50"
            >
              {isSubmitting
                ? "Envoi en cours…"
                : "Envoyer le lien de réinitialisation"}
            </motion.button>
          </form>

          <p className="text-center text-gray-600">
            <Link href="/login">
              <p className="text-purple-600 hover:underline">-&gt; Retour à la connexion</p>
            </Link>
          </p>
        </motion.div>
      </div>
    </Layout>
  );
}
