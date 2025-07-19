import { useState } from "react";
import { useAuth } from "@/contexts/auth_context";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export default function AuthForm() {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState("login"); // login | signup | forgot
  const [form, setForm] = useState({ email: "", password: "", name: "", last_name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setInfo(""); setLoading(true);
    const { error: signInError } = await signIn(form.email, form.password);
    setLoading(false);
    if (signInError) setError(signInError.message);
    else router.push("/");
  };

  // SIGNUP
  const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); setInfo(""); setLoading(true);
    const { data, error: signUpError } = await signUp(form.email, form.password);
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }
    // Ajoute le profil
    if (data?.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        email: form.email,
        name: form.name,
        last_name: form.last_name,
        providers: ["email"],
      });
      if (profileError) {
        setError("Erreur profil : " + profileError.message);
        setLoading(false);
        return;
      }
    }
    setLoading(false);
    setInfo("Inscription réussie, tu peux te connecter !");
    setMode("login");
  };

  // MOT DE PASSE OUBLIÉ
  const handleForgot = async (e) => {
    e.preventDefault();
    setError(""); setInfo(""); setLoading(true);
    const { error: forgotError } = await supabase.auth.resetPasswordForEmail(form.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_URL}/reset-password`,
    });
    setLoading(false);
    if (forgotError) setError(forgotError.message);
    else setInfo("Un email de réinitialisation vient d’être envoyé !");
  };

  // GOOGLE
  const handleGoogle = async () => {
    setError(""); setInfo(""); setLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-gray-100 to-yellow-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          {mode === "login"
            ? "Connexion"
            : mode === "signup"
            ? "Créer un compte"
            : "Mot de passe oublié"}
        </h2>

        <button
          onClick={handleGoogle}
          className="flex items-center w-full py-3 mb-5 rounded-xl border border-gray-300 hover:bg-gray-50 justify-center text-lg font-medium"
        >
          <FcGoogle className="mr-2 text-2xl" />
          Continuer avec Google
        </button>

        <div className="flex items-center mb-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-3 text-gray-400 text-sm">ou</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              name="email"
              placeholder="Email"
              type="email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              onChange={handleChange}
              required
            />
            <input
              name="password"
              placeholder="Mot de passe"
              type="password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              onChange={handleChange}
              required
            />
            {error && <div className="text-red-600 text-center">{error}</div>}
            {info && <div className="text-green-600 text-center">{info}</div>}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 mt-2 rounded-lg font-bold hover:bg-purple-700 transition"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        )}

        {mode === "signup" && (
          <form onSubmit={handleSignup} className="space-y-4">
            <input
              name="name"
              placeholder="Prénom"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              onChange={handleChange}
              required
            />
            <input
              name="last_name"
              placeholder="Nom"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              onChange={handleChange}
              required
            />
            <input
              name="email"
              placeholder="Email"
              type="email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              onChange={handleChange}
              required
            />
            <input
              name="password"
              placeholder="Mot de passe"
              type="password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              onChange={handleChange}
              required
            />
            {error && <div className="text-red-600 text-center">{error}</div>}
            {info && <div className="text-green-600 text-center">{info}</div>}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 mt-2 rounded-lg font-bold hover:bg-purple-700 transition"
              disabled={loading}
            >
              {loading ? "Création..." : "Créer un compte"}
            </button>
          </form>
        )}

        {mode === "forgot" && (
          <form onSubmit={handleForgot} className="space-y-4">
            <input
              name="email"
              placeholder="Ton email"
              type="email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              onChange={handleChange}
              required
            />
            {error && <div className="text-red-600 text-center">{error}</div>}
            {info && <div className="text-green-600 text-center">{info}</div>}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 mt-2 rounded-lg font-bold hover:bg-purple-700 transition"
              disabled={loading}
            >
              {loading ? "Envoi..." : "Réinitialiser mon mot de passe"}
            </button>
          </form>
        )}

        {/* Liens de navigation */}
        <div className="text-center mt-6 text-gray-500 space-y-1 text-base">
          {mode === "login" && (
            <>
              <button
                className="hover:underline text-purple-700"
                onClick={() => setMode("forgot")}
              >
                Mot de passe oublié ?
              </button>
              <br />
              <span>
                Pas de compte ?{" "}
                <button
                  className="hover:underline text-purple-700"
                  onClick={() => setMode("signup")}
                >
                  S&apos;inscrire
                </button>
              </span>
            </>
          )}
          {mode === "signup" && (
            <span>
              Déjà inscrit ?{" "}
              <button
                className="hover:underline text-purple-700"
                onClick={() => setMode("login")}
              >
                Se connecter
              </button>
            </span>
          )}
          {mode === "forgot" && (
            <span>
              <button
                className="hover:underline text-purple-700"
                onClick={() => setMode("login")}
              >
                Retour à la connexion
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
