// pages/settings.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import SideBar from "@/components/sidebar";
import Loader from "@/components/loader";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/auth_context";

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // === auth guard ===
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?from=settings");
    }
  }, [authLoading, user, router]);

  // === tabs ===
  const tabs = ["Profil", "Statistiques", "Notifications", "Préférences"];
  const [activeTab, setActiveTab] = useState("Profil");

  // === global loading ===
  const [loading, setLoading] = useState(true);

  // --- Profil state ---
  const [email, setEmail] = useState("");
  const [profileMsg, setProfileMsg] = useState("");
  const [profileError, setProfileError] = useState("");

  // --- Stats state ---
  const [nutCount, setNutCount] = useState(0);
  const [sportCount, setSportCount] = useState(0);

  // --- Notifications state ---
  const [notifSettings, setNotifSettings] = useState({
    workoutReminder: true,
    nutritionAlerts: true,
    newsletter: true,
  });

  // --- Preferences state ---
  const [preferences, setPreferences] = useState({
    theme: "Clair",
    language: "Français",
  });

  // === initial data load ===
  useEffect(() => {
    if (authLoading || !user) return;
    async function loadData() {
      setLoading(true);

      // Profil
      setEmail(user.email);

      // Statistiques : head:true => renvoie count
      const { count: nCount } = await supabase
        .from("personal_nutrition_plans")
        .select("id", { count: "exact", head: true });
      const { count: sCount } = await supabase
        .from("personal_sport_plans")
        .select("id", { count: "exact", head: true });
      setNutCount(nCount || 0);
      setSportCount(sCount || 0);

      setLoading(false);
    }
    loadData();
  }, [authLoading, user]);

  // === handlers ===

  // Mettre à jour l'email
  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileMsg("");
    const { error } = await supabase.auth.updateUser({ email });
    if (error) setProfileError(error.message);
    else setProfileMsg("Adresse email mise à jour !");
  };

  // Toggle notifications
  const toggleNotif = (key) => {
    setNotifSettings((s) => ({ ...s, [key]: !s[key] }));
    // à persister en base si tu crées une table plus tard
  };

  // Changer preferences
  const handlePrefChange = (e) => {
    const { name, value } = e.target;
    setPreferences((p) => ({ ...p, [name]: value }));
    // idem : persister si besoin
  };

  // === rendu loader global ===
  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <Loader />
        </div>
      </Layout>
    );
  }

  // === contenu par onglet ===
  const renderContent = () => {
    switch (activeTab) {
      case "Profil":
        return (
          <form
            onSubmit={handleEmailUpdate}
            className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto space-y-4"
          >
            {profileError && (
              <p className="text-red-600 text-center">{profileError}</p>
            )}
            {profileMsg && (
              <p className="text-green-600 text-center">{profileMsg}</p>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              />
            </div>
            <button className="w-full px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">
              Mettre à jour
            </button>
          </form>
        );

      case "Statistiques":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-2xl font-bold text-gray-800">{nutCount}</h3>
              <p className="text-gray-600">Plans nutritionnels</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-2xl font-bold text-gray-800">{sportCount}</h3>
              <p className="text-gray-600">Programmes sportifs</p>
            </div>
          </div>
        );

      case "Notifications":
        return (
          <div className="space-y-4 max-w-md mx-auto">
            {[
              { key: "workoutReminder", label: "Rappels d’entraînements" },
              { key: "nutritionAlerts", label: "Alertes nutritionnelles" },
              { key: "newsletter", label: "Newsletter mensuelle" },
            ].map(({ key, label }) => (
              <div
                key={key}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-lg"
              >
                <span className="text-gray-700">{label}</span>
                <input
                  type="checkbox"
                  checked={notifSettings[key]}
                  onChange={() => toggleNotif(key)}
                  className="h-5 w-5 text-gray-800 focus:ring-gray-400 transition"
                />
              </div>
            ))}
          </div>
        );

      case "Préférences":
        return (
          <form className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto space-y-6">
            <div>
              <label
                htmlFor="theme"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Thème
              </label>
              <select
                id="theme"
                name="theme"
                value={preferences.theme}
                onChange={handlePrefChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              >
                <option>Clair</option>
                <option>Sombre</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="language"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Langue
              </label>
              <select
                id="language"
                name="language"
                value={preferences.language}
                onChange={handlePrefChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              >
                <option>Français</option>
                <option>Anglais</option>
              </select>
            </div>
          </form>
        );

      default:
        return null;
    }
  };

  // === rendu principal ===
  return (
    <Layout>
      <div className="flex w-screen h-screen">
        <SideBar minWidth={65} maxWidth={250} defaultWidth={65} />
        <div className="flex-1 p-8 bg-gray-50 overflow-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Paramètres
          </h1>

          {/* onglets */}
          <div className="flex justify-center space-x-4 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setProfileMsg("");
                  setProfileError("");
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  activeTab === tab
                    ? "bg-gray-800 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* contenu onglet */}
          {renderContent()}
        </div>
      </div>
    </Layout>
  );
}
