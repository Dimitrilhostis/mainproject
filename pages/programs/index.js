"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '@/components/layout';
import Header from '@/components/header';
import Loader from '@/components/loader';
import NutritionCard from '@/components/cards/card_nutrition';
import SportCard from '@/components/cards/card_sport';
import ProgramCard from '@/components/cards/card_program';
import { useAuth } from '@/contexts/auth_context';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

// Framer Motion variants
const fadeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function ProgramsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // State hooks (always called in same order)
  const [nutritionProfile, setNutritionProfile] = useState(null);
  const [sportProfile, setSportProfile] = useState(null);
  const [likedPrograms, setLikedPrograms] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loadingDiscover, setLoadingDiscover] = useState(true);
  const [page, setPage] = useState(1);
  const loaderRef = useRef(null);
  const [search, setSearch] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterDuration, setFilterDuration] = useState('all');
  const [filterCertified, setFilterCertified] = useState(false);

  // Load user profiles
  useEffect(() => {
    if (!user) return;
    (async () => {
      const userId = user.id;
      const { data: nut, error: nutError } = await supabase
        .from('nutrition_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      if (nutError) console.error('Nutrition fetch error:', nutError.message);
      setNutritionProfile(nut || null);

      const { data: sport, error: sportError } = await supabase
        .from('sport_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      if (sportError) console.error('Sport fetch error:', sportError.message);
      setSportProfile(sport || null);
    })();
  }, [user]);

  // Load liked programs
  useEffect(() => {
    if (!user) return;
    (async () => {
      const userId = user.id;
      const { data, error } = await supabase
        .from('liked_programs')
        .select('program(*)')
        .eq('user_id', userId);
      if (error) {
        console.error('Liked programs fetch error:', error.message);
        setLikedPrograms([]);
      } else {
        setLikedPrograms(data.map(r => r.program).filter(p => p && p.uuid));
      }
    })();
  }, [user]);

  // Discover pagination loader
  const loadMore = useCallback(async () => {
    setLoadingDiscover(true);
    const { data, error } = await supabase
      .from('programs')
      .select('uuid, title, short_description, image, duration_weeks, difficulty_rating, is_published')
      .order('created_at', { ascending: false })
      .range((page - 1) * 20, page * 20 - 1);
    if (error) {
      console.error('Discover fetch error:', error.message);
    } else {
      setPrograms(prev => [...prev, ...(data || [])]);
    }
    setLoadingDiscover(false);
  }, [page]);

  useEffect(() => { loadMore(); }, [loadMore]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) setPage(p => p + 1);
    });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, []);

  // Filtered discover list
  const filtered = useMemo(() => programs.filter(p => {
    if (!p) return false;
    const ms = p.title.toLowerCase().includes(search.toLowerCase());
    const md = filterDifficulty === 'all' || Math.round(p.difficulty_rating).toString() === filterDifficulty;
    const du = filterDuration === 'all' ||
      (filterDuration === 'short' && p.duration_weeks < 4) ||
      (filterDuration === 'medium' && p.duration_weeks >= 4 && p.duration_weeks <= 8) ||
      (filterDuration === 'long' && p.duration_weeks > 8);
    const mc = !filterCertified || p.is_published;
    return ms && md && du && mc;
  }), [programs, search, filterDifficulty, filterDuration, filterCertified]);

  // Authentication guard after hooks
  if (authLoading) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }
  if (!user) {
    router.replace(`/login?from=${router.pathname}`);
    return null;
  }

  // Main render
  return (
    <Layout>
      <Header />
      <main className="relative w-screen min-h-screen bg-[var(--background)] text-[var(--text1)] pt-24 pb-24">

        {/* Mon programme - 2 cartes */}
        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link href={`/programs/perso/${user.id}`}>
            <a className="block bg-[var(--light-dark)] p-6 rounded-lg hover:shadow-lg transition">
              {nutritionProfile ? (
                <>
                  <h3 className="text-xl font-semibold text-[var(--green2)] mb-4">Mon programme Nutrition</h3>
                  <NutritionCard item={nutritionProfile} />
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-[var(--green2)] mb-2">Commencer Nutrition</h3>
                  <p className="text-[var(--text2)]">Crée ton profil pour générer un programme nutrition personnalisé.</p>
                </>
              )}
            </a>
          </Link>
          <Link href={`/programs/perso/${user.id}`}>
            <a className="block bg-[var(--light-dark)] p-6 rounded-lg hover:shadow-lg transition">
              {sportProfile ? (
                <>
                  <h3 className="text-xl font-semibold text-[var(--green2)] mb-4">Mon programme Sport</h3>
                  <SportCard item={sportProfile} />
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-[var(--green2)] mb-2">Commencer Sport</h3>
                  <p className="text-[var(--text2)]">Crée ton profil pour générer un programme sport personnalisé.</p>
                </>
              )}
            </a>
          </Link>
        </section>

        {/* Mes programmes likés */}
        <section className="max-w-7xl mx-auto px-6 mb-12">
          <h2 className="text-2xl font-semibold text-[var(--green2)] mb-4">Mes programmes likés</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {likedPrograms.map(p => <ProgramCard key={p.uuid} program={p} />)}
          </div>
        </section>

        {/* Découvrir */}
        <section className="mt-8 px-6">
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-3 py-2 bg-[var(--light-dark)] rounded-lg focus:outline-none"
            />
            <div className="flex items-center space-x-4">
              <select
                value={filterDifficulty}
                onChange={e => setFilterDifficulty(e.target.value)}
                className="px-2 py-1 bg-[var(--light-dark)] rounded"
              >
                <option value="all">Toutes difficultés</option>
                {[1,2,3,4,5].map(i => <option key={i} value={i}>{i}★</option>)}
              </select>
              <select
                value={filterDuration}
                onChange={e => setFilterDuration(e.target.value)}
                className="px-2 py-1 bg-[var(--light-dark)] rounded"
              >
                <option value="all">Toutes durées</option>
                <option value="short">&#60;4 sem.</option>
                <option value="medium">4-8 sem.</option>
                <option value="long">&#62;8 sem.</option>
              </select>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filterCertified}
                  onChange={() => setFilterCertified(!filterCertified)}
                  className="mr-2"
                />
                Certifiés
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {filtered.map(program => (
                <motion.div key={program.uuid} variants={fadeVariants} initial="hidden" animate="visible" exit="hidden">
                  <ProgramCard program={program} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {loadingDiscover && <div className="text-center py-6"><Loader /></div>}
          <div ref={loaderRef} />
        </section>
      </main>
    </Layout>
  );
}
