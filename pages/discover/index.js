// pages/discover.jsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import Layout from "@/components/layout";
import SideBar from "@/components/sidebar";
import MobileNav from "@/components/mobile_nav";
import Loader from "@/components/loader";
import { useAuth } from "@/contexts/auth_context";
import { motion, AnimatePresence } from "framer-motion";
import { FaFilter, FaTimes } from "react-icons/fa";
import ProgramCard from "@/components/cards/card_program";

// Framer Motion variants
const fadeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function DiscoverPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [filterDuration, setFilterDuration] = useState("all");
  const [filterCertified, setFilterCertified] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);


  // 1. Calcul du nombre de filtres actifs
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterDifficulty !== "all") count++;
    if (filterDuration   !== "all") count++;
    if (filterCertified)           count++;
    return count;
  }, [filterDifficulty, filterDuration, filterCertified]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?from=discover");
    }
  }, [authLoading, user, router]);

  // Fetch programs
  useEffect(() => {
    if (authLoading || !user) return;
    setLoading(true);
    supabase
      .from("programs")
      .select(
        "uuid, title, short_description, image, duration_weeks, difficulty_rating, is_published"
      )
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setPrograms(data || []);
        setLoading(false);
      });
  }, [authLoading, user]);

  // Combined filter
  const filtered = useMemo(
    () =>
      programs.filter((p) => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
        const matchesDifficulty =
          filterDifficulty === "all" ||
          Math.round(p.difficulty_rating).toString() === filterDifficulty;
        const matchesDuration =
          filterDuration === "all" ||
          (filterDuration === "short" && p.duration_weeks < 4) ||
          (filterDuration === "medium" && p.duration_weeks >= 4 && p.duration_weeks <= 8) ||
          (filterDuration === "long" && p.duration_weeks > 8);
        const matchesCertified = !filterCertified || p.is_published;
        return matchesSearch && matchesDifficulty && matchesDuration && matchesCertified;
      }),
    [programs, search, filterDifficulty, filterDuration, filterCertified]
  );

  // Grid rows
  const rows = useMemo(() => {
    const perRow = 4;
    const result = [];
    for (let i = 0; i < filtered.length; i += perRow) {
      result.push(filtered.slice(i, i + perRow));
    }
    return result;
  }, [filtered]);

  if (authLoading || loading) {
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
      <div className="flex h-screen w-screen overflow-hidden">
        <aside className="hidden md:flex">
          <SideBar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden w-full">
          {/* Header */}
          <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-white shadow-sm">
            <h1 className="text-3xl font-bold">Nos Programmes</h1>
            <div className="flex items-center space-x-4">
              {/* Search Input */}
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-3 py-2 border rounded-lg w-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* Filter Button avec badge */}
             <div className="relative">
               <button
                 onClick={() => setDrawerOpen(true)}
                 className="btn-icon"
               >
                 <FaFilter className="h-5 w-5 text-gray-600" />
               </button>
               {activeFiltersCount > 0 && (
                 <span
                   className="
                     absolute top-0 right-0
                     transform translate-x-1/2 -translate-y-1/2
                     inline-flex items-center justify-center
                     h-5 w-5 text-xs font-bold
                     bg-blue-600 text-white rounded-full
                   "
                 >
                   {activeFiltersCount}
                 </span>
               )}
             </div>
            </div>
          </header>

          {/* Programs Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 p-6">
            <AnimatePresence>
              {rows.flat().map(program => (
                <ProgramCard key={program.uuid} program={program} />
              ))}
            </AnimatePresence>

            </div>
          </div>
        </main>

        {/* Mobile Navigation */}
        <MobileNav />

        {/* Filter Drawer */}
        <AnimatePresence>
          {drawerOpen && (
            <motion.aside
            className="
              fixed top-0 right-0 bottom-0 w-80
              bg-white/95 backdrop-blur-md
              shadow-2xl z-50
              flex flex-col
              rounded-l-2xl 
              overflow-hidden
            "
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 tracking-wide">Filtres</h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="
                  h-10 w-10 flex items-center justify-center
                  bg-gray-100 hover:bg-gray-200
                  rounded-full transition
                "
              >
                <FaTimes className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          
            {/* Contenu défilant */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              
              {/* Difficulté */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <label className="block text-sm font-medium text-gray-500 uppercase mb-2">Difficulté</label>
                <select
                  value={filterDifficulty}
                  onChange={e => setFilterDifficulty(e.target.value)}
                  className="
                    w-full px-4 py-2 bg-white border border-gray-300 rounded-lg
                    shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    text-gray-700 transition
                  "
                >
                  <option value="all">Toutes</option>
                  {[1,2,3,4,5].map(i => (
                    <option key={i} value={i.toString()}>
                      {i} étoile{i>1?'s':''}
                    </option>
                  ))}
                </select>
              </div>
          
              {/* Durée */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <label className="block text-sm font-medium text-gray-500 uppercase mb-2">Durée</label>
                <select
                  value={filterDuration}
                  onChange={e => setFilterDuration(e.target.value)}
                  className="
                    w-full px-4 py-2 bg-white border border-gray-300 rounded-lg
                    shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    text-gray-700 transition
                  "
                >
                  <option value="all">Toutes</option>
                  <option value="short">&lt; 4 semaines</option>
                  <option value="medium">4–8 semaines</option>
                  <option value="long">&gt; 8 semaines</option>
                </select>
              </div>
          
              {/* Certifié */}
              <div className="p-4 bg-gray-50 rounded-xl flex items-center">
                <input
                  id="certified"
                  type="checkbox"
                  checked={filterCertified}
                  onChange={() => setFilterCertified(!filterCertified)}
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded transition"
                />
                <label htmlFor="certified" className="ml-3 text-gray-700 font-medium">
                  Programmes certifiés
                </label>
              </div>
            </div>
          </motion.aside>
          
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
