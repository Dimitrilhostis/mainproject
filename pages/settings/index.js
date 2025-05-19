// pages/settings.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import SideBar from "@/components/sidebar";
import Loader from "@/components/loader";
import MobileNav from "@/components/mobile_nav";
import { useAuth } from "@/contexts/auth_context";
import { supabase } from "@/lib/supabaseClient";

export default function SettingsPage() {
  const router = useRouter();
  const { user, signOut, loading: authLoading } = useAuth();

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) router.replace("/login?from=settings");
  }, [authLoading, user, router]);

  // onglets
  const TABS = [
    { key: "profile",   label: "Profil"       },
    { key: "stats",     label: "Statistiques" },
    { key: "notif",     label: "Notifications"},
    { key: "friends",   label: "Relations"    },
    { key: "security",  label: "Sécurité"     },
    { key: "account",   label: "Compte"       },
  ];
  const [active, setActive] = useState("profile");

  // chargement global / données
  const [loading, setLoading] = useState(true);

  // Profil
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // Stats
  const [nutCount, setNutCount] = useState(0);
  const [sportCount, setSportCount] = useState(0);

  // Notifications
  const [notif, setNotif] = useState({
    workoutReminder: true,
    nutritionAlerts: true,
    newsletter: false,
  });

  // Relations
  const [friends, setFriends] = useState(["Alice", "Bob"]);
  const [newFriend, setNewFriend] = useState("");

  // Sécurité
  const [newPwd, setNewPwd] = useState("");
  const [secMsg, setSecMsg] = useState("");
  const [secErr, setSecErr] = useState("");
  const [secLoading, setSecLoading] = useState(false);

  // load initial
  useEffect(() => {
    if (authLoading || !user) return;
    (async () => {
      setLoading(true);
      setEmail(user.email);
      const { count: n } = await supabase
        .from("personal_nutrition_plans")
        .select("id", { count: "exact", head: true });
      const { count: s } = await supabase
        .from("personal_sport_plans")
        .select("id", { count: "exact", head: true });
      setNutCount(n || 0);
      setSportCount(s || 0);
      setLoading(false);
    })();
  }, [authLoading, user]);

  // handlers
  const handleEmail = async (e) => {
    e.preventDefault();
    setErr(""); setMsg("");
    const { error } = await supabase.auth.updateUser({ email });
    if (error) setErr(error.message);
    else setMsg("Email mis à jour !");
  };

  const toggleNotif = (k) =>
    setNotif((n) => ({ ...n, [k]: !n[k] }));

  const addFriend = () => {
    const f = newFriend.trim();
    if (f && !friends.includes(f)) {
      setFriends([...friends, f]);
      setNewFriend("");
    }
  };
  const removeFriend = (f) =>
    setFriends((list) => list.filter((x) => x !== f));

  const handlePwd = async (e) => {
    e.preventDefault();
    setSecErr(""); setSecMsg(""); setSecLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPwd });
    setSecLoading(false);
    if (error) setSecErr(error.message);
    else setSecMsg("Mot de passe mis à jour !");
  };

  if (authLoading || loading) {
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
      <div className="flex w-full min-h-screen bg-gray-50 dark:bg-gray-900">
        <aside className="hidden md:block">
          <SideBar />
        </aside>
        <div className="flex-1 p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-4">Paramètres</h1>

          {/* Tabs */}
          <nav className="border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
            <ul className="flex space-x-4">
              {TABS.map(({ key, label }) => (
                <li key={key}>
                  <button
                    onClick={() => setActive(key)}
                    className={`pb-2 px-1 text-sm font-medium transition 
                      ${active === key
                        ? "border-b-2 border-indigo-600 text-indigo-600"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                      }`}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <div className="max-w-4xl mx-auto space-y-6">
            {active === "profile" && (
              <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                {err && <p className="text-red-600 mb-2">{err}</p>}
                {msg && <p className="text-green-600 mb-2">{msg}</p>}
                <form onSubmit={handleEmail} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition">
                    Mettre à jour
                  </button>
                </form>
              </section>
            )}

            {active === "stats" && (
              <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center">
                  <p className="text-4xl font-bold">{nutCount}</p>
                  <p>Plans nutritionnels</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center">
                  <p className="text-4xl font-bold">{sportCount}</p>
                  <p>Programmes sportifs</p>
                </div>
              </section>
            )}

            {active === "notif" && (
              <section className="space-y-4 max-w-md mx-auto">
                {Object.entries(notif).map(([k, v]) => (
                  <label
                    key={k}
                    className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
                  >
                    <span className="capitalize text-gray-700 dark:text-gray-300">
                      {k === "workoutReminder"
                        ? "Rappels d’entraînements"
                        : k === "nutritionAlerts"
                        ? "Alertes nutritionnelles"
                        : "Newsletter mensuelle"}
                    </span>
                    <input
                      type="checkbox"
                      checked={v}
                      onChange={() => toggleNotif(k)}
                      className="h-5 w-5 text-indigo-600"
                    />
                  </label>
                ))}
              </section>
            )}

            {active === "friends" && (
              <section className="max-w-md mx-auto space-y-4">
                <h2 className="text-xl font-semibold">Mes Amis</h2>
                <ul className="space-y-2">
                  {friends.map((f) => (
                    <li
                      key={f}
                      className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded shadow"
                    >
                      <span>{f}</span>
                      <button
                        onClick={() => removeFriend(f)}
                        className="text-red-600 hover:text-red-400"
                      >
                        Suppr.
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nouvel ami"
                    value={newFriend}
                    onChange={(e) => setNewFriend(e.target.value)}
                    className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  <button
                    onClick={addFriend}
                    className="px-4 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition"
                  >
                    Ajouter
                  </button>
                </div>
              </section>
            )}

            {active === "security" && (
              <section className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
                {secErr && <p className="text-red-600">{secErr}</p>}
                {secMsg && <p className="text-green-600">{secMsg}</p>}
                <form onSubmit={handlePwd} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      value={newPwd}
                      onChange={(e) => setNewPwd(e.target.value)}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={secLoading}
                    className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition disabled:opacity-50"
                  >
                    {secLoading ? "..." : "Changer"}
                  </button>
                </form>
              </section>
            )}

            {active === "account" && (
              <section className="max-w-md mx-auto space-y-4">
                <button
                  onClick={() => signOut()}
                  className="w-full py-2 flex items-center justify-center gap-2 bg-red-600 text-white rounded hover:bg-red-500 transition"
                >
                  Déconnexion
                </button>
                <button
                  onClick={() => router.push("/login")}
                  className="w-full py-2 flex items-center justify-center gap-2 bg-green-600 text-white rounded hover:bg-green-500 transition"
                >
                  Ajouter un compte
                </button>
              </section>
            )}
          </div>
        </div>
        <MobileNav />
      </div>
    </Layout>
  );
}
