// pages/reset-password.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import SideBar from "@/components/nav/sidebar";
import Loader from "@/components/loader";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Si pas de token, on prévient l'utilisateur
  useEffect(() => {
    if (token === undefined) return;
    if (!token) {
      setErrorMsg("Lien invalide ou expiré.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!password || !confirm) {
      setErrorMsg("Veuillez remplir tous les champs.");
      return;
    }
    if (password !== confirm) {
      setErrorMsg("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsSubmitting(true);
    // Appel Supabase pour réinitialiser — type 'recovery'
    const { error } = await supabase.auth.verifyOtp({
      type: "recovery",
      token: /** @type {string} */ (token),
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setIsSubmitting(false);
    } else {
      setSuccessMsg("Ton mot de passe a bien été mis à jour ! Redirection…");
      // Après 2 s, redirection vers la connexion
      setTimeout(() => {
        router.replace("/login");
      }, 2000);
    }
  };

  // Affichage loader si on attend le token ou qu'on soumet
  if (token === undefined || isSubmitting) {
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
            Réinitialiser le mot de passe
          </h1>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-6"
          >
            {errorMsg && <p className="text-red-600 text-center">{errorMsg}</p>}
            {successMsg && (
              <p className="text-green-600 text-center">{successMsg}</p>
            )}

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Nouveau mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              />
            </div>

            <div>
              <label
                htmlFor="confirm"
                className="block text-sm font-medium text-gray-700"
              >
                Confirme le mot de passe
              </label>
              <input
                id="confirm"
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
            >
              {isSubmitting ? "Validation en cours…" : "Mettre à jour"}
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
