// pages/index.jsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout';
import SideBar from '@/components/sidebar';
import Card, { CardSpecial } from '@/components/cards/card_program';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth_context';
import Loader from '@/components/loader';
import MobileNav from '@/components/mobile_nav';

// Variants Framer Motion pour les sections
const sectionVariant = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function HomePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [programs, setPrograms] = useState([]);
  const [specials, setSpecials] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1️⃣ Auth guard + redirection si pas connecté
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace('/login');
      }
    }
  }, [user, authLoading, router]);

  // 2️⃣ Chargement des programmes une fois l’auth validée
  useEffect(() => {
    if (authLoading || !user) return;

    async function load() {
      setLoading(true);
      const { data: progData } = await supabase
        .from('programs')
        .select('*');
      setPrograms(progData || []);
      setLoading(false);
    }
    load();
  }, [authLoading, user]);

  // 3️⃣ Affichage du loader pendant l’authentification ou le fetch
  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <Loader />
        </div>
      </Layout>
    );
  }

  // 4️⃣ Même découpage et rendu qu’avant
  const simplePerRow = 5, specialPerRow = 4;
  const simpleChunks = [], specialChunks = [];
  for (let i = 0; i < programs.length; i += simplePerRow)
    simpleChunks.push(programs.slice(i, i + simplePerRow));
  const maxRows = Math.max(simpleChunks.length);

  return (
    <Layout>
      <div className="flex w-screen h-screen flex-col md:flex-row">
      <aside className="hidden md:flex">
        <SideBar />
      </aside>
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* HERO */}
          <motion.section
            className="relative h-[70vh] flex items-center justify-center bg-gradient-to-r from-gray-500 to-gray-400 text-white py-5"
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="relative z-10 text-center px-6">
              <h1 className="text-5xl font-extrabold mb-4">Atteins Tes Objectifs</h1>
              <p className="text-xl mb-6 max-w-2xl mx-auto">
                Coaching sportif et nutritionnel sur mesure pour transformer ton corps et ta vie.
              </p>
              <button className="px-10 py-5 bg-gray-100 text-gray-800 font-semibold rounded-4xl hover:bg-white">
                Découvrir nos offres
              </button>
            </div>
          </motion.section>

          {/* SERVICES */}
          <motion.section
            className="py-20 bg-gray-100"
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-center mb-12">Nos Services</h2>
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
              <CardSpecial
                title="Coaching Sportif"
                content="Programmes personnalisés, suivi intensif et corrections en vidéo."
                extra="Séances en ligne ou en présentiel"
                category="sport"
              />
              <CardSpecial
                title="Nutrition Sur Mesure"
                content="Plans alimentaires adaptés à tes objectifs et préférences."
                extra="Recettes et listes de courses incluses"
                category="nutrition"
              />
              <CardSpecial
                title="Suivi & Motivation"
                content="Bilan hebdo, challenges et groupe privé pour rester motivé."
                extra="Accès à la communauté"
                category="both"
              />
            </div>
          </motion.section>

          {/* PROGRAMMES */}
          <motion.section
            className="py-20"
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-center mb-12">Programmes Phare</h2>
            <div className="px-6">
              {Array.from({ length: maxRows * 2 }).map((_, r) => {
                const isSimple = r % 2 === 0;
                const idx = Math.floor(r / 2);
                const row = isSimple ? simpleChunks[idx] || [] : specialChunks[idx] || [];
                if (!row.length) return null;
                const cols = isSimple ? 'lg:grid-cols-5' : 'lg:grid-cols-4';
                return (
                  <div
                    key={r}
                    className={`grid grid-cols-1 sm:grid-cols-2 ${cols} gap-6 justify-items-center mb-8`}
                  >
                    {row.map(p =>
                      isSimple ? (
                        <Card
                          key={p.id}
                          title={p.title}
                          content={p.description}
                          category={p.category}
                        />
                      ) : (
                        <CardSpecial
                          key={p.id}
                          title={p.title}
                          content={p.description}
                          extra={p.extra}
                          category={p.category}
                        />
                      )
                    )}
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* TESTIMONIALS */}
          <motion.section
            className="py-20 bg-gray-100"
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-center mb-12">Ils Ont Transformé Leur Vie</h2>
            <div className="max-w-4xl mx-auto space-y-8 px-4">
              <blockquote className="bg-white p-6 rounded shadow">
                <p className="italic">
                  « Grâce à leur méthode, j’ai perdu 8 kg en 2 mois et retrouvé confiance en moi. »
                </p>
                <footer className="mt-4 font-semibold text-right">— Camille, 29 ans</footer>
              </blockquote>
              <blockquote className="bg-white p-6 rounded shadow">
                <p className="italic">
                  « Programme nutrition au top, je n’ai jamais été aussi énergique. »
                </p>
                <footer className="mt-4 font-semibold text-right">— Alex, 34 ans</footer>
              </blockquote>
            </div>
          </motion.section>

          {/* CALL TO ACTION */}
          <motion.section
            className="py-20 text-center"
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-4xl font-bold mb-6">Prêt·e à commencer ?</h2>
            <p className="mb-8 text-lg">Rejoins-nous et passe à l’étape supérieure.</p>
            <button className="px-10 py-4 bg-gray-500 text-white font-semibold rounded shadow hover:bg-gray-600">
              Lance Ton Coaching
            </button>
          </motion.section>
        </div>
        <MobileNav />
      </div>
    </Layout>
  );
}
