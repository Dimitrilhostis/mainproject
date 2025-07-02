'use client';
import { useState, useEffect } from 'react';
import Layout from '@/components/layout';
import SideBar from '@/components/nav/sidebar';
import MobileNav from '@/components/nav/mobile_nav';
import Loader from '@/components/loader';
import { useAuth } from '@/contexts/auth_context';
import { supabase } from '@/lib/supabaseClient';
import NutritionCard from '@/components/cards/card_nutrition';
import NutritionForm from '@/components/forms/nutrition_form';
import SportCard from '@/components/cards/card_sport';
import SportForm from '@/components/forms/sport_form';
import Link from 'next/link';

export default function ProgramsPersoPage() {
  const { user, loading: authLoading } = useAuth();
  const [nutItems, setNut] = useState([]);
  const [sportItems, setSport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editNutId, setEditNut] = useState(null);
  const [editSportId, setEditSport] = useState(null);

  useEffect(() => {
    if (authLoading || !user) return;
    (async () => {
      setLoading(true);
      const { data: nuts } = await supabase.from('program_perso_nutrition').select('*').eq('user_id', user.id);
      const { data: sports } = await supabase.from('program_perso_sport').select('*').eq('user_id', user.id);
      setNut(nuts || []);
      setSport(sports || []);
      setLoading(false);
    })();
  }, [authLoading, user]);

  if (authLoading || loading) return <Layout><Loader/></Layout>;

  const refresh = () => window.location.reload();
  const nutToEdit = nutItems.find(i => i.id === editNutId);
  const sportToEdit = sportItems.find(i => i.id === editSportId);

  return (
    <Layout>
      <div className="flex h-screen w-screen">
        <aside className="hidden md:flex"><SideBar/></aside>
        <main className="flex-1 overflow-auto p-6 bg-gray-50 space-y-8">
          <h1 className="text-3xl font-bold mb-4 text-center">Programmes Personnalisés</h1>

          {/* Nutrition */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Nutrition</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <NutritionForm user={user} onSuccess={refresh} toEdit={nutToEdit} />
              {nutItems.map(item => (
                <div key={item.id} onClick={() => setEditNut(item.id)}>
                  <NutritionCard item={item} />
                </div>
              ))}
            </div>
          </section>

          {/* Sport */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Sport</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <SportForm user={user} onSuccess={refresh} toEdit={sportToEdit} />
              {sportItems.map(item => (
                <div key={item.id} onClick={() => setEditSport(item.id)}>
                  <SportCard item={item} />
                </div>
              ))}
            </div>
          </section>

          <Link href={`/programs/perso/${user.id}`}>Voir les programmes perso</Link>

        </main>
        <MobileNav />
      </div>
    </Layout>
  );
}