"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import MobileNav from "@/components/nav/mobile_nav";
import Loader from "@/components/loader";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import BackButton from "@/components/buttons/back_button";

// Pour splitter les textes multi-lignes ou tableaux
function splitToList(str) {
  if (!str) return [];
  if (Array.isArray(str)) return str;
  return str.split('\n').map(s => s.trim()).filter(Boolean);
}

export default function TrainingPage() {
  const router = useRouter();
  const { uuid } = router.query;
  const [training, setTraining] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  const BANNER_MARGIN = 56;

  useEffect(() => {
    if (!router.isReady) return;
    (async () => {
      setLoading(true);
      // 1. Fetch le training
      const { data: tr, error: errTr } = await supabase
        .from("trainings")
        .select("*")
        .eq("uuid", uuid)
        .maybeSingle();
      if (errTr) {
        console.error("Fetch training error", errTr);
        setLoading(false);
        return;
      }
      if (!tr) {
        setTraining(null);
        setLoading(false);
        return;
      }
      setTraining(tr);

      // 2. Fetch les exercices liés
      let exUuids = [];
      if (Array.isArray(tr.exercise_uuids)) exUuids = tr.exercise_uuids;
      else if (typeof tr.exercise_uuids === "string" && tr.exercise_uuids.length > 0) exUuids = [tr.exercise_uuids];
      if (exUuids.length > 0) {
        const { data: exos, error: errExos } = await supabase
          .from("exercises")
          .select("uuid,name,image_url,description")
          .in("uuid", exUuids);
        if (errExos) console.error("Fetch exercises error", errExos);
        else setExercises(exos || []);
      } else {
        setExercises([]);
      }
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

  if (!training) {
    return (
      <Layout>
        <BackButton />
        <div className="p-8 text-center">Training non trouvé.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-90% min-h-screen bg-violet-100 flex flex-col items-center">

        {/* Bandeau titre + infos training */}
        <div
          className="mx-auto w-90% max-w-7xl flex flex-col md:flex-row items-center p-8 bg-violet-200 shadow rounded-3xl"
          style={{ marginTop: BANNER_MARGIN, marginBottom: BANNER_MARGIN }}
        >
          <div className="flex-1 flex ml-12">
            <h1 className="text-2xl md:text-4xl font-semibold uppercase tracking-tight text-gray-900 text-center">
              {training.name}
            </h1>
          </div>
          <div className="flex flex-row items-center gap-12 text-gray-800 text-xl font-light min-w-[200px] text-center">
            {training.duration_min != null && (
              <div>Durée totale : {training.duration_min} min</div>
            )}
            {training.difficulty != null && (
              <div>Difficulté : {training.difficulty}/5</div>
            )}
            {training.created_at && (
              <div>Créé le : {new Date(training.created_at).toLocaleDateString()}</div>
            )}
          </div>
        </div>

        <BackButton className="ml-4 mb-4" />

        {/* Bloc principal : 2 colonnes */}
        <div className="max-w-7xl w-full flex flex-row gap-12 px-8" style={{ minHeight: '60vh' }}>
          {/* Gauche : Description + Conseils */}
          <div className="w-1/2 flex flex-col gap-8 sticky top-28 self-start" style={{ maxHeight: '80vh' }}>
            {/* Description */}
            {training.description && (
              <section className="bg-white border-violet-200 border-2 p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-lg">{training.description}</p>
              </section>
            )}
            {/* Conseils */}
            {training.tips && (
              <section className="bg-white border-violet-200 border-2 p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold mb-2">Conseils</h2>
                {splitToList(training.tips).length > 0 ? (
                  <ul className="list-disc ml-5 text-lg space-y-1">
                    {splitToList(training.tips).map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Aucun conseil.</p>
                )}
              </section>
            )}
          </div>
          {/* Droite : Exercices liés (affichage en grid) */}
          <div className="w-1/2 min-w-[350px] flex flex-col gap-8">
            <section className="bg-white border-violet-200 border-2 p-6 rounded-2xl shadow-lg flex-1 overflow-auto">
              <h2 className="text-2xl font-bold mb-4">Exercices du programme</h2>
              {exercises.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {exercises.map((exo) => (
                    <Link
                      href={`/exercises/${exo.uuid}`}
                      key={exo.uuid}
                      className="bg-white border border-violet-100 rounded-xl shadow flex flex-col items-center p-4 hover:scale-105 transition duration-150"
                    >
                      <div className="relative h-24 w-24 mb-2">
                        <Image
                          src={exo.image_url}
                          alt={exo.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <h3 className="font-semibold text-center text-lg">{exo.name}</h3>
                      {exo.description && (
                        <p className="text-sm text-gray-600 mt-1 text-center line-clamp-2">{exo.description}</p>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Aucun exercice lié à ce training.</p>
              )}
            </section>
            {/* Variantes */}
            {training.variantes && (
              <section className="bg-white border-violet-200 border-2 p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold mb-2">Variantes</h2>
                {splitToList(training.variantes).length > 0 ? (
                  <ul className="list-disc ml-5 text-lg space-y-1">
                    {splitToList(training.variantes).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Aucune variante.</p>
                )}
              </section>
            )}
          </div>
        </div>

        {/* Marge bas équivalente au bandeau */}
        <div style={{ marginBottom: BANNER_MARGIN }} />

        <MobileNav />
      </div>
    </Layout>
  );
}
