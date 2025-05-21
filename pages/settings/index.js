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
import { RiDeleteBinLine } from "react-icons/ri";
import { IoPersonAddOutline } from "react-icons/io5";
import ProfileSection from "@/components/settings/profile";


export default function SettingsPage() {
  const router = useRouter();
  const { user, signOut, loading: authLoading } = useAuth();

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) router.replace("/login?from=settings");
  }, [authLoading, user, router]);

  // onglets
  const TABS = [
    { key: "stats",     label: "Statistiques" },
    { key: "notif",     label: "Notifications"},
    { key: "friends",   label: "Relations"    },
    { key: "security",  label: "Sécurité"     },
    { key: "account",   label: "Compte"       },
  ];
  const [active, setActive] = useState("stats");

  // chargement global / données
  const [loading, setLoading] = useState(true);

  // Profil
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("hidden")

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


  if (authLoading || loading || !user) {
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
        <aside className="hidden md:flex">
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
          <div className="w-full mx-auto space-y-6">

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
              <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
                {[
                  { title: "Mes Amis", type: "friends" },
                  { title: "Following", type: "following" },
                  { title: "Followers", type: "followers" },
                ].map(({ title, type }) => (
                  <div key={type} className="p-5 rounded-2xl bg-gray-200 flex flex-col">
                    <h2 className="text-xl font-semibold mb-4">{title}</h2>
                    <ul className="space-y-2 overflow-auto flex-1">
                      {friends.map((f) => (
                        <li
                          key={f}
                          className="flex justify-between items-center bg-white p-3 rounded shadow"
                        >
                          <span>{f}</span>
                          <div className="flex gap-2">
                            {(type === "following" || type === "followers") && (
                              <button
                                onClick={() => addFriend(f)}
                                className="text-blue-600 hover:text-blue-400"
                              >
                                <IoPersonAddOutline className="text-xl" />
                              </button>
                            )}
                            <button
                              onClick={() => removeFriend(f)}
                              className="text-red-600 hover:text-red-400"
                            >
                              <RiDeleteBinLine className="text-xl" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            )}


            {active === "security" && (
              <section className="max-w-md mx-auto bg-white p-6 rounded-lg shadow space-y-4">
              </section>
            )}

            {active === "account" && (
              <ProfileSection 
              user={user}
              signOut={signOut}
              friends={friends}
              addFriend={addFriend}
              removeFriend={removeFriend}
            />
            )}
          </div>
        </div>
        <MobileNav />
      </div>
    </Layout>
  );
}
