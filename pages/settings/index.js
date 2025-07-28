"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout";
import Loader from "@/components/loader";
import MobileNav from "@/components/nav/mobile_nav";
import { useAuth } from "@/contexts/auth_context";
import { supabase } from "@/lib/supabaseClient";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoPersonAddOutline } from "react-icons/io5";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const router = useRouter();
  const { user, signOut, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("stats");
  const [loading, setLoading] = useState(true);

  // Stats counts
  const [nutCount, setNutCount] = useState(0);
  const [sportCount, setSportCount] = useState(0);

  // Notifications
  const [notifications, setNotifications] = useState({
    workoutReminder: true,
    nutritionAlerts: true,
    newsletter: false,
  });

  // Friends
  const [friends, setFriends] = useState(["Alice", "Bob"]);
  const [newFriend, setNewFriend] = useState("");

  // Redirect if not authed
  useEffect(() => {
    if (!authLoading && !user) router.replace("/login?from=settings");
  }, [authLoading, user]);

  // Load data
  useEffect(() => {
    if (authLoading || !user) return;
    (async () => {
      setLoading(true);
      setNotifications(notifications);
      const { count: n } = await supabase
        .from("personal_nutrition_plans")
        .select("id", { head: true, count: "exact" });
      const { count: s } = await supabase
        .from("personal_sport_plans")
        .select("id", { head: true, count: "exact" });
      setNutCount(n || 0);
      setSportCount(s || 0);
      setLoading(false);
    })();
  }, [authLoading, user]);

  // Toggle notifications
  const toggleNotification = key =>
    setNotifications(n => ({ ...n, [key]: !n[key] }));

  // Friends handlers
  const addFriend = () => {
    const f = newFriend.trim();
    if (f && !friends.includes(f)) {
      setFriends([...friends, f]);
      setNewFriend("");
    }
  };
  const removeFriend = f => setFriends(list => list.filter(x => x !== f));

  // Tabs config
  const TABS = [
    { key: "stats", label: "Statistiques" },
    { key: "notif", label: "Notifications" },
    { key: "friends", label: "Relations" },
    { key: "security", label: "Sécurité" },
    { key: "account", label: "Compte" },
  ];

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen w-screen bg-[var(--background)]">
          <Loader />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="w-screen h-screen relative overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-[var(--background)]/80" />

        {/* Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-4xl mx-auto my-12 bg-transparent backdrop-blur-2xl border border-[var(--text3)]/30 rounded-3xl p-8 flex flex-col"
        >
          <h1 className="text-4xl font-extrabold text-[var(--text1)] mb-6">
            Paramètres
          </h1>

          {/* Tabs */}
          <nav className="mb-6 overflow-x-auto">
            <ul className="flex space-x-4">
              {TABS.map(tab => (
                <li key={tab.key}>
                  <button
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-3 pb-1 text-lg font-medium transition \$
                      {activeTab === tab.key
                        ? 'border-b-2 border-[var(--green2)] text-[var(--green2)]'
                        : 'text-[var(--text2)] hover:text-[var(--text1)]'}
                    `}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === 'stats' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-[var(--light-dark)] text-center">
                  <p className="text-5xl font-bold text-[var(--green2)]">{nutCount}</p>
                  <p className="text-[var(--text2)]">Plans nutritionnels</p>
                </div>
                <div className="p-6 rounded-xl bg-[var(--light-dark)] text-center">
                  <p className="text-5xl font-bold text-[var(--green2)]">{sportCount}</p>
                  <p className="text-[var(--text2)]">Programmes sportifs</p>
                </div>
              </div>
            )}

            {activeTab === 'notif' && (
              <div className="grid grid-cols-1 gap-4">
                {Object.entries(notifications).map(([key, val]) => (
                  <label
                    key={key}
                    className="flex items-center justify-between p-4 bg-[var(--light-dark)] rounded-xl"
                  >
                    <span className="capitalize text-[var(--text1)]">
                      {key === 'workoutReminder'
                        ? 'Rappels d’entraînements'
                        : key === 'nutritionAlerts'
                        ? 'Alertes nutritionnelles'
                        : 'Newsletter mensuelle'}
                    </span>
                    <input
                      type="checkbox"
                      checked={val}
                      onChange={() => toggleNotification(key)}
                      className="h-6 w-6 accent-[var(--green2)]"
                    />
                  </label>
                ))}
              </div>
            )}

            {activeTab === 'friends' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {['Mes Amis', 'Following', 'Followers'].map(title => (
                  <div key={title} className="p-4 bg-[var(--light-dark)] rounded-xl">
                    <h2 className="text-xl font-semibold text-[var(--text1)] mb-4">{title}</h2>
                    <ul className="space-y-2 max-h-48 overflow-auto">
                      {friends.map(f => (
                        <li key={f} className="flex justify-between items-center">
                          <span className="text-[var(--text2)]">{f}</span>
                          <div className="flex space-x-2">
                            <button
                              onClick={addFriend}
                              className="text-[var(--green2)] hover:text-[var(--green3)]"
                            >
                              <IoPersonAddOutline size={20} />
                            </button>
                            <button
                              onClick={() => removeFriend(f)}
                              className="text-red-500 hover:text-red-400"
                            >
                              <RiDeleteBinLine size={20} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex">
                      <input
                        type="text"
                        value={newFriend}
                        onChange={e => setNewFriend(e.target.value)}
                        placeholder="Ajouter un ami"
                        className="flex-1 px-3 py-2 rounded-l-lg bg-[var(--background)] text-[var(--text1)] placeholder-[var(--text2)]"
                      />
                      <button
                        onClick={addFriend}
                        className="px-4 bg-[var(--green2)] text-[var(--background)] rounded-r-lg hover:bg-[var(--green3)] transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="p-6 bg-[var(--light-dark)] rounded-xl text-[var(--text1)] text-center">
                Section Sécurité à venir
              </div>
            )}

            {activeTab === 'account' && (
              <div className="p-6 bg-[var(--light-dark)] rounded-xl space-y-4">
                <p className="text-[var(--text1)]">Email : {user.email}</p>
                <button
                  onClick={signOut}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </motion.div>

        <MobileNav />
      </main>
    </Layout>
  );
}
