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

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterDifficulty !== "all") count++;
    if (filterDuration !== "all") count++;
    if (filterCertified) count++;
    return count;
  }, [filterDifficulty, filterDuration, filterCertified]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?from=discover");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (authLoading || !user) return;
    setLoading(true);
    supabase
      .from("programs")
      .select("uuid, title, short_description, image, duration_weeks, difficulty_rating, is_published")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setPrograms(data || []);
        setLoading(false);
      });
  }, [authLoading, user]);

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

        <main className="flex-1 flex flex-col h-screen overflow-hidden w-full">
          <header className="flex-shrink-0 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-3 bg-white shadow-sm">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-0">Nos Programmes</h1>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 sm:flex-none px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-64"
              />
              <div className="relative">
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="p-2 bg-white border rounded-lg hover:bg-gray-100 transition"
                >
                  <FaFilter className="h-5 w-5 text-gray-600" />
                </button>
                {activeFiltersCount > 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center h-5 w-5 text-xs font-bold bg-purple-600 text-white rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 p-4 sm:p-6">
              <AnimatePresence>
                {rows.flat().map((program) => (
                  <ProgramCard key={program.uuid} program={program} />
                ))}
              </AnimatePresence>
            </div>
            <footer className="mb-14 lg:mb-0">
              <p></p>
            </footer>
          </div>

          <MobileNav />

          <AnimatePresence>
            {drawerOpen && (
              <motion.aside
                className="fixed inset-0 z-50 flex"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div
                  className="absolute inset-0"
                  onClick={() => setDrawerOpen(false)}
                />
                <motion.div
                  className="relative ml-auto w-full sm:w-80 bg-white flex flex-col rounded-l-2xl overflow-hidden border-l-1"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'tween', duration: 0.3 }}
                >
                  <div className="flex items-center justify-between px-6 py-5 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">Filtres</h2>
                    <button
                      onClick={() => setDrawerOpen(false)}
                      className="h-10 w-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition"
                    >
                      <FaTimes className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 uppercase mb-2">Difficulté</label>
                      <select
                        value={filterDifficulty}
                        onChange={(e) => setFilterDifficulty(e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="all">Toutes</option>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <option key={i} value={i.toString()}>
                            {i} étoile{i > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 uppercase mb-2">Durée</label>
                      <select
                        value={filterDuration}
                        onChange={(e) => setFilterDuration(e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="all">Toutes</option>
                        <option value="short">&lt; 4 semaines</option>
                        <option value="medium">4–8 semaines</option>
                        <option value="long">&gt; 8 semaines</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="certified"
                        type="checkbox"
                        checked={filterCertified}
                        onChange={() => setFilterCertified(!filterCertified)}
                        className="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <label htmlFor="certified" className="ml-3 text-gray-700 font-medium">
                        Programmes certifiés
                      </label>
                    </div>
                  </div>
                </motion.div>
              </motion.aside>
            )}
          </AnimatePresence>
        </main>
      </div>
    </Layout>
  );
}
