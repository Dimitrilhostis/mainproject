// pages/forgot-password.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import SideBar from "@/components/sidebar";
import Loader from "@/components/loader";
import { useAuth } from "@/contexts/auth_context";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { user, resetPassword, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Si déjà connecté, on redirige
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/discover");
    }
  }, [user, authLoading, router]);

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
        "Si un compte existe à cette adresse, un email vient de partir pour réinitialiser ton mot de passe."
      );
    }
    setIsSubmitting(false);
  };

  // Loader global ou pendant l'envoi
  if (authLoading || isSubmitting) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <Loader />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex w-screen h-screen">
        <SideBar minWidth={65} maxWidth={250} defaultWidth={65} />
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Mot de passe oublié
          </h1>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-6"
          >
            {errorMsg && (
              <p className="text-red-600 text-center">{errorMsg}</p>
            )}
            {message && (
              <p className="text-green-600 text-center">{message}</p>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
            >
              {isSubmitting
                ? "Envoi en cours…"
                : "Envoyer le lien de réinitialisation"}
            </button>
          </form>

          <p className="mt-4 text-gray-600">
            <Link
              href="/login"
              className="text-gray-800 underline hover:text-gray-600"
            >
              Retour à la connexion
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
