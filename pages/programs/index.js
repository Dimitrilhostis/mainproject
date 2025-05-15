// pages/programs.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import SideBar from "@/components/sidebar";
import Card, { CardSpecial } from "@/components/cards/card_program";
import Loader from "@/components/loader";
import { useAuth } from "@/contexts/auth_context";
import { supabase } from "@/lib/supabaseClient";
import MobileNav from "@/components/mobile_nav";

export default function ProgramsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [nutritionPlans, setNutritionPlans] = useState([]);
  const [sportPlans, setSportPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1️⃣ Auth guard : redirige vers /login si non connecté
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?from=programs");
    }
  }, [authLoading, user, router]);

  // 2️⃣ Récupère les données une fois l’utilisateur disponible
  useEffect(() => {
    if (authLoading || !user) return;

    async function fetchPlans() {
      setLoading(true);

      // Plans nutritionnels
      const { data: nuts, error: errNut } = await supabase
        .from("personal_nutrition_plans")
        .select("*")
        .eq("user_id", user.id);
      if (errNut) console.error("Nutrition fetch error:", errNut);

      // Plans sportifs
      const { data: sports, error: errSport } = await supabase
        .from("personal_sport_plans")
        .select("*")
        .eq("user_id", user.id);
      if (errSport) console.error("Sport fetch error:", errSport);

      setNutritionPlans(nuts || []);
      setSportPlans(sports || []);
      setLoading(false);
    }

    fetchPlans();
  }, [authLoading, user]);

  // 3️⃣ Affiche un loader tant que c’est en cours
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
      <div className="flex w-screen h-scree flex-col md:flex-rown">
      <aside className="hidden md:flex">
        <SideBar />
      </aside>

        <div className="flex-1 overflow-auto bg-gray-50 p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-12 text-center">
            Tes Programmes Personnalisés
          </h1>

          {/* Section Nutrition */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Plan Nutritionnel
            </h2>
            {nutritionPlans.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {nutritionPlans.map((plan) => (
                  <CardSpecial
                    key={plan.id}
                    title={plan.meal}
                    content={plan.description}
                    extra={`~ ${plan.calories} kcal`}
                    category="nutrition"
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Aucun plan nutritionnel disponible.</p>
            )}
          </section>

          {/* Section Sport */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Programme Sportif
            </h2>
            {sportPlans.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sportPlans.map((plan) => (
                  <Card
                    key={plan.id}
                    title={plan.session_name}
                    content={plan.exercises}
                    category="sport"
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Aucun programme sportif disponible.</p>
            )}
          </section>
        </div>
        <MobileNav />
      </div>
    </Layout>
  );
}
