"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout';
import Header from '@/components/header';
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
  const router = useRouter();
  const [nutItems, setNutItems] = useState([]);
  const [sportItems, setSportItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editNutId, setEditNutId] = useState(null);
  const [editSportId, setEditSportId] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      let nutQuery = supabase.from('program_perso_nutrition').select('*');
      let sportQuery = supabase.from('program_perso_sport').select('*');
      if (user) {
        nutQuery = nutQuery.eq('user_id', user.id);
        sportQuery = sportQuery.eq('user_id', user.id);
      }
      const [{ data: nuts }, { data: sports }] = await Promise.all([
        nutQuery,
        sportQuery,
      ]);
      setNutItems(nuts || []);
      setSportItems(sports || []);
      setLoading(false);
    })();
  }, [authLoading, user]);

  // 1. Auth loading
  if (authLoading) {
    return (
      <Layout>
        <Header />
        <main className="w-screen h-screen flex justify-center items-center">
          <Loader />
        </main>
      </Layout>
    );
  }

  // 2. Not authenticated
  if (!user) {
    return (
      <Layout>
        <Header />
        <main
          className="w-screen h-screen bg-cover bg-center relative flex flex-col justify-center items-center text-white p-6"
        >
          {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-[var(--background)]/80" />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="relative z-10 text-center space-y-4">
            <p className="text-2xl font-bold">
              Vous devez vous connecter pour accéder aux programmes personnalisés.
            </p>
            <Link href="/login">
              <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                Se connecter
              </button>
            </Link>
          </div>
        </main>
      </Layout>
    );
  }

  // 3. Data loading
  if (loading) {
    return (
      <Layout>
        <Header />
        <main className="w-screen h-screen flex justify-center items-center">
          <Loader />
        </main>
      </Layout>
    );
  }

  // 4. Render content
  const refreshPage = () => window.location.reload();
  const nutToEdit = nutItems.find(item => item.id === editNutId);
  const sportToEdit = sportItems.find(item => item.id === editSportId);

  return (
    <Layout>
      <Header />
      <main className="relative w-screen min-h-screen flex justify-center items-start p-6 pt-24">
        <div className="w-full max-w-4xl bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-8">
          <h1 className="text-4xl font-extrabold text-white text-center">
            Programmes Personnalisés
          </h1>

          {/* Nutrition Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-green-300">Nutrition</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4">
                <NutritionForm user={user} toEdit={nutToEdit} onSuccess={refreshPage} />
              </div>
              {nutItems.map(item => (
                <div key={item.id} onClick={() => setEditNutId(item.id)} className="cursor-pointer">
                  <NutritionCard item={item} className="bg-white bg-opacity-20 rounded-xl p-4" />
                </div>
              ))}
            </div>
          </section>

          {/* Sport Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-green-300">Sport</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4">
                <SportForm user={user} toEdit={sportToEdit} onSuccess={refreshPage} />
              </div>
              {sportItems.map(item => (
                <div key={item.id} onClick={() => setEditSportId(item.id)} className="cursor-pointer">
                  <SportCard item={item} className="bg-white bg-opacity-20 rounded-xl p-4" />
                </div>
              ))}
            </div>
          </section>

          <div className="text-center">
            <Link href={`/programs/perso/${user.id}`}>Voir les programmes complets</Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}
