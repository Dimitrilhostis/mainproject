// pages/login.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import SideBar from "@/components/sidebar";
import Loader from "@/components/loader";
import { useAuth } from "@/contexts/auth_context";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { user, signIn, sendMagicLink, loading: authLoading } = useAuth();

  const [method, setMethod] = useState("password"); // "password" | "magic"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Si déjà connecté, on renvoie vers /discover
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/discover");
    }
  }, [authLoading, user, router]);

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);
    const { error } = await signIn(email, password);
    setIsSubmitting(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      // Supabase mettra à jour le contexte et redirigera
    }
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setMessage("");
    setIsSubmitting(true);
    const { error } = await sendMagicLink(email);
    setIsSubmitting(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      setMessage(
        "Un email vient de partir avec ton Magic Link – vérifie ta boîte de réception !"
      );
    }
  };

  if (authLoading || (isSubmitting && !user)) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <Loader />
        </div>
      </Layout>
    );
  }

  return (
      <div className="flex w-screen h-screen">
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Se connecter
          </h1>

          {/* Switch méthodes */}
          <div className="flex space-x-4 mb-8">
            {["password", "magic"].map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMethod(m);
                  setErrorMsg("");
                  setMessage("");
                }}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  method === m
                    ? "bg-gray-800 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {m === "password" ? "Email & Mot de passe" : "Magic Link"}
              </button>
            ))}
          </div>

          {/* Formulaire */}
          <form
            onSubmit={method === "password" ? handlePasswordLogin : handleMagicLink}
            className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-6"
          >
            {errorMsg && (
              <p className="text-red-600 text-center">{errorMsg}</p>
            )}
            {message && (
              <p className="text-green-600 text-center">{message}</p>
            )}

            {/* Email commun */}
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

            {method === "password" && (
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mot de passe
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
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
            >
              {isSubmitting
                ? "Traitement…"
                : method === "password"
                ? "Se connecter"
                : "Envoyer Magic Link"}
            </button>
          </form>

          <p className="mt-4 text-gray-600">
            {!user && method === "password" && (
              <>
                <Link
                  href="/forgot-password"
                  className="text-gray-800 underline hover:text-gray-600"
                >
                  Mot de passe oublié ?
                </Link>
                {"  "}|{"  "}
                <Link
                  href="/signup"
                  className="text-gray-800 underline hover:text-gray-600"
                >
                  Créer un compte
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
  );
}
