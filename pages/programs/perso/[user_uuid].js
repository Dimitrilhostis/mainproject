"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout';
import Header from '@/components/header';
import Loader from '@/components/loader';
import NutritionCard from '@/components/cards/card_nutrition';
import SportCard from '@/components/cards/card_sport';
import { useAuth } from '@/contexts/auth_context';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function UserProgramsPage() {
  const router = useRouter();
  const { user_uuid } = router.query;
  const { user, loading: authLoading } = useAuth();

  const [nutItems, setNutItems] = useState([]);
  const [sportItems, setSportItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    if (user.id !== user_uuid) {
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      const { data: nuts } = await supabase
        .from('program_perso_nutrition')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      const { data: sports } = await supabase
        .from('program_perso_sport')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setNutItems(nuts || []);
      setSportItems(sports || []);
      setLoading(false);
    })();
  }, [authLoading, user, user_uuid]);

  if (authLoading || loading) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="pt-24 min-h-screen flex items-center justify-center bg-[var(--background)]">
          <p className="text-lg text-[var(--text2)]">
            Connectez-vous pour voir vos programmes, ou{' '}
            <Link href="/signup">
              <a className="text-[var(--green2)] underline">inscrivez-vous</a>
            </Link>
          </p>
        </div>
      </Layout>
    );
  }

  if (user.id !== user_uuid) {
    return (
      <Layout>
        <div className="pt-24 min-h-screen flex items-center justify-center bg-[var(--background)]">
          <p className="text-lg text-red-500">Accès non autorisé.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="pt-24 pb-12 bg-[var(--background)] text-[var(--text1)] min-h-screen">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-[var(--green2)] mb-12 text-center">
            Mes Programmes Personnalisés
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Nutrition Section */}
            <section>
              <h2 className="text-2xl font-semibold text-[var(--green2)] mb-4">Nutrition</h2>
              {nutItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {nutItems.map(item => (
                    <NutritionCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <p className="mb-4 text-[var(--text2)]">Aucun plan nutritionnel trouvé.</p>
                  <Link href="/form">
                    <a className="inline-block px-6 py-3 bg-[var(--green2)] text-[var(--background)] rounded-lg font-medium hover:bg-[var(--green3)] transition">
                      Créer mon programme Nutrition
                    </a>
                  </Link>
                </div>
              )}
            </section>

            {/* Sport Section */}
            <section>
              <h2 className="text-2xl font-semibold text-[var(--green2)] mb-4">Sport</h2>
              {sportItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {sportItems.map(item => (
                    <SportCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <p className="mb-4 text-[var(--text2)]">Aucun programme sportif trouvé.</p>
                  <Link href="/form">
                    <a className="inline-block px-6 py-3 bg-[var(--green2)] text-[var(--background)] rounded-lg font-medium hover:bg-[var(--green3)] transition">
                      Créer mon programme Sport
                    </a>
                  </Link>
                </div>
              )}
            </section>
          </div>

          {/* Optional: Back to discover or other nav */}
        </div>
      </main>
    </Layout>
  );
}
