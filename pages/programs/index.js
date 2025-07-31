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

  // Hooks (always same order)
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

  // Load user personal profiles
  useEffect(() => {
    if (!user) return;
    (async () => {
      const id = user.id;
      const { data: nut } = await supabase.from('nutrition_profiles').select('*').eq('user_id', id).maybeSingle();
      setNutritionProfile(nut);
      const { data: sport } = await supabase.from('sport_profiles').select('*').eq('user_id', id).maybeSingle();
      setSportProfile(sport);
    })();
  }, [user]);

  // Load liked programs
  useEffect(() => {
    if (!user) return;
    (async () => {
      const id = user.id;
      const { data } = await supabase.from('liked_programs').select('program(*)').eq('user_id', id);
      setLikedPrograms(data.map(r => r.program).filter(p => p && p.uuid));
    })();
  }, [user]);

  // Discover pagination/load
  const loadMore = useCallback(async () => {
    setLoadingDiscover(true);
    const { data } = await supabase.from('programs')
      .select('uuid, title, short_description, image, duration_weeks, difficulty_rating, is_published')
      .order('created_at', { ascending: false })
      .range((page - 1) * 20, page * 20 - 1);
    setPrograms(prev => [...prev, ...(data || [])]);
    setLoadingDiscover(false);
  }, [page]);
  useEffect(() => { loadMore(); }, [loadMore]);

  // Infinite scroll
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setPage(p => p + 1));
    if (loaderRef.current) obs.observe(loaderRef.current);
    return () => obs.disconnect();
  }, []);

  // Filter discover
  const filtered = useMemo(() => programs.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchDiff = filterDifficulty === 'all' || Math.round(p.difficulty_rating).toString() === filterDifficulty;
    const matchDur = filterDuration === 'all' ||
      (filterDuration === 'short' && p.duration_weeks < 4) ||
      (filterDuration === 'medium' && p.duration_weeks >= 4 && p.duration_weeks <= 8) ||
      (filterDuration === 'long' && p.duration_weeks > 8);
    const matchCert = !filterCertified || p.is_published;
    return matchSearch && matchDiff && matchDur && matchCert;
  }), [programs, search, filterDifficulty, filterDuration, filterCertified]);

  // Auth guard
  if (authLoading || !user) return (<Layout><Loader /></Layout>);

  // Determine link for personal program
  const hasPersonal = nutritionProfile || sportProfile;
  const personalLink = hasPersonal ? `/programs/perso/${user.id}` : `/programs/perso/form`;

  return (
    <Layout>
      <Header />
      <main className="relative w-screen min-h-screen bg-[var(--background)] text-[var(--text1)] pt-24 pb-24">

        {/* Top: two blocks */}
        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Block 1: Personal program */}
          <Link href={personalLink}>
            <a className="block bg-[var(--light-dark)] p-8 rounded-2xl hover:shadow-xl transition">
              <h3 className="text-2xl font-bold text-[var(--green2)] mb-4">Mon Programme</h3>
              {hasPersonal ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {nutritionProfile && <NutritionCard item={nutritionProfile} />}
                  {sportProfile && <SportCard item={sportProfile} />}
                </div>
              ) : (
                <p className="text-[var(--text2)]">Créer mon programme perso</p>
              )}
            </a>
          </Link>

          {/* Block 2: Liked programs */}
          <div>
            <h3 className="text-2xl font-bold text-[var(--green2)] mb-4">Mes Programmes Likés</h3>
            {likedPrograms.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {likedPrograms.map(p => <ProgramCard key={p.uuid} program={p} />)}
              </div>
            ) : (
              <p className="text-[var(--text2)]">Aucun programme liké pour le moment.</p>
            )}
          </div>
        </section>

        {/* Bottom: Discover list */}
        <section className="mt-8 px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <input
              type="text"
              placeholder="Rechercher des programmes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-4 py-2 bg-[var(--light-dark)] rounded-lg w-full sm:w-1/3 focus:outline-none"
            />
            <div className="flex space-x-4">
              <select value={filterDifficulty} onChange={e => setFilterDifficulty(e.target.value)} className="px-3 py-2 bg-[var(--light-dark)] rounded-lg">
                <option value="all">Toutes difficultés</option>
                {[1,2,3,4,5].map(i => <option key={i} value={i}>{i}★</option>)}
              </select>
              <select value={filterDuration} onChange={e => setFilterDuration(e.target.value)} className="px-3 py-2 bg-[var(--light-dark)] rounded-lg">
                <option value="all">Toutes durées</option>
                <option value="short">&lt;4 sem.</option>
                <option value="medium">4-8 sem.</option>
                <option value="long">&gt;8 sem.</option>
              </select>
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={filterCertified} onChange={() => setFilterCertified(!filterCertified)} className="h-4 w-4" />
                <span>Certifiés</span>
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
