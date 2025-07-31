'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout';
import { useAuth } from '@/contexts/auth_context';
import { supabase } from '@/lib/supabaseClient';
import NutritionCard from '@/components/cards/card_nutrition';
import SportCard from '@/components/cards/card_sport';
import Loader from '@/components/loader';
import Link from 'next/link';

export default function UserProgramsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { user_uuid } = router.query;

  const [nutItems, setNutItems] = useState([]);
  const [sportItems, setSportItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      // Pas connecté
      setLoading(false);
      return;
    }
    if (user.id !== user_uuid) {
      // Utilisateur pas autorisé
      setLoading(false);
      return;
    }
    // Fetch programmes
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
    return <Layout><Loader /></Layout>;
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl">Connectez-vous pour voir vos programmes, ou <Link href="/signup" className="text-purple-600 underline">inscrivez-vous</Link> pour les créer !</p>
        </div>
      </Layout>
    );
  }

  if (user.id !== user_uuid) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl text-red-600">Accès non autorisé.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-center">Mes Programmes</h1>

        <section className="mb-12">
          <h2 className="text-2xl mb-4">Nutrition</h2>
          {nutItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {nutItems.map(item => <NutritionCard key={item.id} item={item} />)}
            </div>
          ) : (
            <p className="text-center text-gray-600">Aucun plan nutritionnel trouvé.</p>
          )}
        </section>

        <section>
          <h2 className="text-2xl mb-4">Sport</h2>
          {sportItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sportItems.map(item => <SportCard key={item.id} item={item} />)}
            </div>
          ) : (
            <p className="text-center text-gray-600">Aucun programme sportif trouvé.</p>
          )}
        </section>
      </div>
    </Layout>
  );
}