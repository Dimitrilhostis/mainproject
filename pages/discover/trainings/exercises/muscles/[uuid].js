"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import Loader from "@/components/loader";
import BackButton from "@/components/buttons/back_button";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function MusclePage() {
  const router = useRouter();
  const { uuid } = router.query;
  const [muscle, setMuscle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;
    (async () => {
      setLoading(true);
      const { data: m, error } = await supabase
        .from("muscles")
        .select("*")
        .eq("uuid", uuid)
        .maybeSingle();
      if (error) {
        console.error("Fetch muscle error", error);
        setLoading(false);
        return;
      }
      setMuscle(m);
      setLoading(false);
    })();
  }, [router.isReady, uuid]);

  if (loading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center h-screen">
          <Loader />
        </div>
      </Layout>
    );
  }

  if (!muscle) {
    return (
      <Layout>
        <BackButton />
        <div className="p-8 text-center">Muscle non trouvé.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex w-screen h-screen">
        <main className="flex-1 overflow-auto bg-gray-50">
          {/* Back button aligned at top-left */}
          <div className="px-6 py-4">
            <BackButton />
          </div>

          {/* Section titre + image côte à côte, sur toute la largeur, sans margin top */}
          <div className="flex w-full bg-white border-b-2">

            {/* Titre à gauche, centré verticalement */}
            <div className="w-1/2 flex items-center px-6">
              <h1 className="text-3xl text-center w-full font-bold text-black">
                {muscle.name}
              </h1>
            </div>

            {/* Image à droite, prend 50% de la largeur */}
            <div className="w-1/2 relative h-64 bg-gray-200">
              {muscle.image_url && (
                <Image
                  src={muscle.image_url}
                  alt={muscle.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>

          {/* Date de création (si présente) */}
          {muscle.created_at && (
            <div className="p-6 bg-white">
              <strong>Créé le :</strong> {new Date(muscle.created_at).toLocaleDateString()}
            </div>
          )}

          {/* Contenu détaillé du muscle */}
          <div className="p-6 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 bg-white">
            {/* Colonne de gauche */}
            <div className="flex-1 space-y-6">
              {muscle.origine && (
                <section>
                  <h2 className="text-xl font-semibold">Origine</h2>
                  <p>{muscle.origine}</p>
                </section>
              )}
              {muscle.terminaison && (
                <section>
                  <h2 className="text-xl font-semibold">Terminaison</h2>
                  <p>{muscle.terminaison}</p>
                </section>
              )}
              {muscle.fonctions && (
                <section>
                  <h2 className="text-xl font-semibold">Fonctions</h2>
                  <p>{muscle.fonctions}</p>
                </section>
              )}
            </div>

            {/* Colonne de droite */}
            <div className="flex-1 space-y-6">
              {muscle.articulations && (
                <section>
                  <h2 className="text-xl font-semibold">Articulations</h2>
                  <p>{muscle.articulations}</p>
                </section>
              )}
              {muscle.nref && (
                <section>
                  <h2 className="text-xl font-semibold">Nerveux (NREF)</h2>
                  <p>{muscle.nref}</p>
                </section>
              )}
              {muscle.arteres && (
                <section>
                  <h2 className="text-xl font-semibold">Artères</h2>
                  <p>{muscle.arteres}</p>
                </section>
              )}
              {muscle.chaine_musculaire && (
                <section>
                  <h2 className="text-xl font-semibold">Chaîne musculaire</h2>
                  <p>{muscle.chaine_musculaire}</p>
                </section>
              )}
              {muscle.douleurs && (
                <section>
                  <h2 className="text-xl font-semibold">Douleurs associées</h2>
                  <p>{muscle.douleurs}</p>
                </section>
              )}
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
