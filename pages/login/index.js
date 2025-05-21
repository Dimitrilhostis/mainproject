"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import { motion } from "framer-motion";
import Link from "next/link";
import Loader from "@/components/loader";
import useAuth from "@/hooks/use_auth";

export default function LoginPage() {
  const router = useRouter();
  const { user, signIn, sendMagicLink, loading: authLoading } = useAuth();

  const [method, setMethod] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

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
    if (error) setErrorMsg(error.message);
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setMessage("");
    setIsSubmitting(true);
    const { error } = await sendMagicLink(email);
    setIsSubmitting(false);
    if (error) setErrorMsg(error.message);
    else setMessage(
      "Un email avec votre Magic Link a été envoyé – vérifiez votre boîte !"
    );
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
            Se connecter
          </h1>
          {errorMsg && <p className="text-center text-red-600 animate-shake">{errorMsg}</p>}
          {message && <p className="text-center text-green-600">{message}</p>}

          {/* Method Switch */}
          <div className="flex justify-center gap-4 mb-6">
            {['password', 'magic'].map((m) => (
              <button
                key={m}
                onClick={() => { setMethod(m); setErrorMsg(''); setMessage(''); }}
                className={`px-4 py-2 mb-5 rounded-full font-medium transition-shadow shadow-sm 
                  ${method === m ? 'bg-purple-600 text-white shadow-lg' : 'bg-purple-200 text-purple-500 hover:bg-purple-300'}`}
              >
                {m === 'password' ? 'Email & Mot de passe' : 'Magic Link'}
              </button>
            ))}
          </div>

          <form
            onSubmit={method === 'password' ? handlePasswordLogin : handleMagicLink}
            className="space-y-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <label htmlFor="email" className="absolute -top-3 left-4 bg-white/70 rounded-md px-1 text-sm text-purple-600">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-300 hover:border-purple-400 focus:border-purple-500 rounded-xl bg-white focus:outline-none transition"
              />
            </motion.div>

            {method === 'password' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <label htmlFor="password" className="absolute -top-3 left-4 bg-white/70 rounded-md px-1 text-sm text-purple-600">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-purple-300 hover:border-purple-400 focus:border-purple-500 rounded-xl bg-white focus:outline-none transition"
                />
              </motion.div>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className="w-full py-3 mt-3 bg-purple-600 text-white font-semibold rounded-xl shadow hover:bg-purple-700 transition disabled:opacity-50"
            >
              {isSubmitting
                ? 'Traitement…'
                : method === 'password'
                ? 'Se connecter'
                : 'Envoyer Magic Link'}
            </motion.button>
          </form>

          <p className="text-center flex">
            <Link href="/forgot_password">
              <p className="text-purple-600 hover:underline">Mot de passe oublié ?</p>
            </Link> 
            <p className="text-purple-600 px-2">|</p>
            <Link href="/signup">
              <p className="text-purple-600 hover:underline">Créer un compte</p>
            </Link>
          </p>
        </motion.div>
      </div>
    </Layout>
  );
}
