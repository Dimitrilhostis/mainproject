"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import { motion } from "framer-motion";
import Link from "next/link";
import Loader from "@/components/loader";
import useAuth from "@/hooks/use_auth";

export default function SignUpPage() {
  const router = useRouter();
  const { user, signUp, loading: authLoading } = useAuth();
  const [formState, setFormState] = useState({ name: "", last_name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!authLoading && user) router.replace("/discover");
  }, [user, authLoading, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);
    const { name, last_name, email, password } = formState;
    // appel correct: email et password en paramètres, metadata séparée
    const { error } = await signUp(email, password, { data: { name, last_name } });
    setIsSubmitting(false);
    if (error) setErrorMsg(error.message || "Erreur lors de la création");
    else router.push("/login");
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
            Créer un compte
          </h1>
          {errorMsg && <p className="text-center text-red-600 animate-shake">{errorMsg}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {['name','last_name','email','password'].map((field, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="relative"
              >
                <label
                  htmlFor={field}
                  className="absolute -top-3 left-4 bg-white/70 rounded-md px-1 text-sm text-purple-600"
                >
                  {field === 'name'
                    ? 'Prénom'
                    : field === 'last_name'
                    ? 'Nom'
                    : field === 'email'
                    ? 'Email'
                    : 'Mot de passe'}
                </label>
                <input
                  id={field}
                  name={field}
                  type={field === 'password' ? 'password' : 'text'}
                  required
                  value={formState[field]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-purple-300 hover:border-purple-400 focus:border-purple-500 rounded-xl bg-white focus:outline-none transition"
                />
              </motion.div>
            ))}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className="w-full py-3 mt-3 bg-purple-600 text-white font-semibold rounded-xl shadow hover:bg-purple-700 transition disabled:opacity-50"
            >
              {isSubmitting ? 'En cours...' : 'Créer mon compte'}
            </motion.button>
          </form>

          <p className="text-center text-gray-600">
            <Link href="/login">
              <p className="text-purple-600 hover:underline">-&gt; J&apos;ai déjà un compte</p>
            </Link>
          </p>
        </motion.div>
      </div>
    </Layout>
  );
}
