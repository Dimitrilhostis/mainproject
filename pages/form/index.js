// pages/form.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import SideBar from "@/components/sidebar";
import Loader from "@/components/loader";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/auth_context";

export default function ProfileFormPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [profile, setProfile] = useState({
    age: "",
    weight_kg: "",
    height_cm: "",
    goal: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 1️⃣ Auth guard : si pas connecté, redirige vers /login
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?from=form");
    }
  }, [authLoading, user, router]);

  // 2️⃣ Chargement du profil existant
  useEffect(() => {
    if (authLoading || !user) return;

    async function loadProfile() {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url, name, last_name")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows found
        console.error("Fetch profile error:", error);
        setErrorMsg("Impossible de charger ton profil.");
      } else if (data) {
        setProfile({
          email: data.ameil || "",
          avatar_url: data.avatar_url || "",
          name: data.name || "",
          last_name: data.last_name || "",
        });
      }
      setLoading(false);
    }

    loadProfile();
  }, [authLoading, user]);

  // 3️⃣ Gestion de la saisie
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  // 4️⃣ Soumission : upsert en user_profiles
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setMessage("");
    setSaving(true);

    const payload = {
      user_id: user.id,
      email: user.email,
      avatar_url: profile.avatar_url,
      name: profile.name,
      last_name: profile.last_name,
    };

    const { error } = await supabase
      .from("profiles")
      .upsert(payload, { returning: "minimal" });

    if (error) {
      console.error("Upsert profile error:", error);
      setErrorMsg("Échec de la sauvegarde, réessaie plus tard.");
    } else {
      setMessage("Profil mis à jour ! Tu peux maintenant passer aux programmes.");
    }
    setSaving(false);
  };

  // Loader si on attend auth ou le fetch initial
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
      <div className="flex w-screen h-screen">
        <SideBar minWidth={65} maxWidth={250} defaultWidth={65} />
        <div className="flex-1 flex flex-col items-center justify-start bg-gray-50 p-8 overflow-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Ton Profil
          </h1>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg space-y-6"
          >
            {errorMsg && (
              <p className="text-red-600 text-center">{errorMsg}</p>
            )}
            {message && (
              <p className="text-green-600 text-center">{message}</p>
            )}

            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ton Mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                />
              </div>
              <div>
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ton Avatar
                </label>
                <input
                  id="avatr_url"
                  name="avatar url"
                  type="text"
                  value={profile.avatar_url}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                />
              </div>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={profile.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                />
              </div>
              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={profile.last_name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full px-6 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
            >
              {saving ? "Sauvegarde…" : "Mettre à jour mon profil"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
