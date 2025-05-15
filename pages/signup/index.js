// pages/signup.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import Loader from "@/components/loader";
import useAuth from "@/hooks/use_auth";

export default function SignUpPage() {
  const router = useRouter();
  const { user } = useAuth();

  // 1. State unique pour tout le formulaire
  const [formState, setFormState] = useState({
    name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 2. Si déjà connecté, on renvoie sur /discover
  useEffect(() => {
    if (user) {
      router.replace("/discover");
    }
  }, [user, router]);

  // 3. Handler pour mettre à jour formState
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // 4. Submit : on récupère bien name, last_name, email, password
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    const { name, last_name, email, password } = formState;

    // Appel à ton endpoint serverless
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, last_name, email, password }),
    });
    const { error } = await res.json();

    if (error) {
      setErrorMsg(error);
      setIsSubmitting(false);
    } else {
      router.push("/login");
    }
  };

  // 5. Affichage
  if (isSubmitting) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-center">Créer un compte</h1>
        {errorMsg && <p className="text-red-600 text-center">{errorMsg}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Prénom
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formState.name}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              required
              value={formState.last_name}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formState.email}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formState.password}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700 transition"
          >
            {isSubmitting ? "En cours..." : "Créer mon compte"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
