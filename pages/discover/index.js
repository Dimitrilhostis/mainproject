// pages/discover.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import SideBar from "@/components/sidebar";
import Card, { CardSpecial } from "@/components/cards/card_program";
import { supabase } from "@/lib/supabaseClient";
import Loader from "@/components/loader";
import { useAuth } from "@/contexts/auth_context";
import { motion } from "framer-motion";
import MobileNav from "@/components/mobile_nav";

// Variants Framer Motion pour les sections
const sectionVariant = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function DiscoverPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [filter, setFilter] = useState("all");
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auth guard : redirige vers login si pas connecté
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?from=discover");
    }
  }, [authLoading, user, router]);

  // Chargement des données
  useEffect(() => {
    if (authLoading || !user) return;
  
    async function fetchData() {
      setLoading(true);
      try {
        const { data: progData, error: err1 } = await supabase
          .from("programs")
          .select("*");
        if (err1) throw err1;
  
        setPrograms(progData || []);
      } catch (err) {
        console.error("Fetch Discover error:", err);
        // optionnel : afficher un message d’erreur à l’utilisateur
      } finally {
        setLoading(false);
      }
    }
  
    fetchData();
  }, [authLoading, user]);
  

  // Affiche loader pendant auth ou fetch
  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <Loader />
        </div>
      </Layout>
    );
  }

  // Filtrage
  const filtered = programs.filter(
    (p) => filter === "all" || p.category === filter
  );

  // Découpage en lignes
  const simplePerRow = 5;
  const simpleChunks = [];
  for (let i = 0; i < filtered.length; i += simplePerRow) {
    simpleChunks.push(filtered.slice(i, i + simplePerRow));
  }
  const maxRows = Math.max(simpleChunks.length);

  return (
    <Layout>
      <div className="flex w-screen h-screen flex-col md:flex-row">
      <aside className="hidden md:flex">
        <SideBar />
      </aside>
        <div className="flex-1 flex flex-col bg-gray-100">

          {/* Header filtres */}
          <div className="relative flex items-center py-6 bg-white shadow">
            <div className="absolute left-8 flex gap-4">
              {["all", "nutrition", "sport"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-full transition ${
                    filter === cat
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {cat === "all"
                    ? "Tous"
                    : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
            <h1 className="mx-auto text-4xl font-bold text-gray-800">
              Nos Programmes
            </h1>
          </div>

          {/* Contenu */}
          <div className="flex-1 overflow-auto p-8">
            {Array.from({ length: maxRows * 2 }).map((_, r) => {
              const idx = Math.floor(r / 2);
              const rowItems = simpleChunks[idx] || []
              if (!rowItems.length) return null;
              return (
                <motion.div
                  key={r}
                  className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 justify-items-center mb-8`}
                  variants={sectionVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  {rowItems.map((p) =>
                      <Card
                        key={p.id}
                        title={p.title}
                        content={p.description}
                        category={p.category}
                      />
                    )
                  }
                </motion.div>
              );
            })}
          </div>
        </div>
        <MobileNav />
      </div>
    </Layout>
  );
}
