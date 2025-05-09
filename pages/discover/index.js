"use client";

import { useState, useEffect } from 'react';
import Layout from '../components/layout';
import SideBar from '../components/sidebar';
import Card, { CardSpecial } from '../components/cards/card_program';
import { supabase } from '../../lib/supabaseClient';

export default function DiscoveryPage() {
  const [filter, setFilter] = useState('all');
  const [programs, setPrograms] = useState([]);
  const [specialPrograms, setSpecialPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chargement depuis Supabase
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Récupère tous les programmes “simples”
      const { data: progData, error: err1 } = await supabase
        .from('programs')
        .select('*');
      if (err1) console.error('Erreur programs:', err1);

      // Récupère tous les programmes “spéciaux”
      const { data: specData, error: err2 } = await supabase
        .from('special_programs')
        .select('*');
      if (err2) console.error('Erreur special_programs:', err2);

      setPrograms(progData || []);
      setSpecialPrograms(specData || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Filtrage
  const filtered = programs.filter(
    p => filter === 'all' || p.category === filter
  );
  const filteredSpecials = specialPrograms.filter(
    p => filter === 'all' || p.category === filter
  );

  // Découpage en lignes
  const simplePerRow = 5, specialPerRow = 4;
  const simpleChunks = [], specialChunks = [];
  for (let i = 0; i < filtered.length; i += simplePerRow) {
    simpleChunks.push(filtered.slice(i, i + simplePerRow));
  }
  for (let i = 0; i < filteredSpecials.length; i += specialPerRow) {
    specialChunks.push(filteredSpecials.slice(i, i + specialPerRow));
  }
  const maxRows = Math.max(simpleChunks.length, specialChunks.length);

  if (loading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          Chargement…
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex w-screen h-screen">
        <SideBar minWidth={65} maxWidth={250} defaultWidth={65} />
        <div className="flex-1 flex flex-col bg-gray-100">
          <div className="relative flex items-center py-6">
            <div className="absolute left-8 flex gap-4">
              {['all','nutrition','sport','both'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded ${
                    filter===cat ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                  } shadow`}
                >
                  {cat==='all' ? 'Tous' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
            <h1 className="mx-auto text-4xl font-bold">Nos Programmes</h1>
          </div>
          <div className="flex-1 overflow-auto p-8">
            {Array.from({ length: maxRows * 2 }).map((_, r) => {
              const isSimple = r % 2 === 0;
              const idx = Math.floor(r/2);
              const rowItems = isSimple ? simpleChunks[idx]||[] : specialChunks[idx]||[];
              if (!rowItems.length) return null;
              const cols = isSimple ? 'lg:grid-cols-5' : 'lg:grid-cols-4';
              return (
                <div
                  key={r}
                  className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${ isSimple ? 5 : 4 } ${cols} gap-6 justify-items-center mb-8`}
                >
                  {rowItems.map(p =>
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
        </div>
      </div>
    </Layout>
  );
}
