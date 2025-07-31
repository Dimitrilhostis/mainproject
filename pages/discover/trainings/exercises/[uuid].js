"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import Loader from "@/components/loader";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import BackButton from "@/components/buttons/back_button";

// Utilitaire pour splitter les textes multi-lignes ou tableaux
function splitToList(str) {
  if (!str) return [];
  if (Array.isArray(str)) return str;
  return str.split('\n').map(s => s.trim()).filter(Boolean);
}

export default function ExercisePage() {
  const router = useRouter();
  const { uuid } = router.query;
  const [exercise, setExercise] = useState(null);
  const [muscles, setMuscles] = useState([]);
  const [loading, setLoading] = useState(true);

  const BANNER_MARGIN = 56;

  useEffect(() => {
    if (!router.isReady) return;
    (async () => {
      setLoading(true);
      const { data: ex, error: errEx } = await supabase
        .from("exercises")
        .select("*")
        .eq("uuid", uuid)
        .maybeSingle();
      if (errEx) {
        console.error("Fetch exercise error", errEx);
        setLoading(false);
        return;
      }
      if (!ex) {
        setExercise(null);
        setLoading(false);
        return;
      }
      setExercise(ex);

      if (Array.isArray(ex.muscle_uuid) && ex.muscle_uuid.length > 0) {
        const { data: ms, error: errMs } = await supabase
          .from("muscles")
          .select("uuid,name,image_url")
          .in("uuid", ex.muscle_uuid);
        if (errMs) console.error("Fetch muscles error", errMs);
        else setMuscles(ms || []);
      } else {
        setMuscles([]);
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

  if (!exercise) {
    return (
      <Layout>
        <BackButton />
        <div className="p-8 text-center">Exercice non trouvé.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-90% min-h-screen bg-violet-100 flex flex-col items-center">

        {/* Bandeau Titre + Infos */}
        <div
          className="mx-auto w-90% max-w-7xl flex flex-col md:flex-row items-center p-8 bg-violet-200 shadow rounded-3xl"
          style={{ marginTop: BANNER_MARGIN, marginBottom: BANNER_MARGIN }}
        >
          <div className="flex-1 flex ml-12">
            <h1 className="text-2xl md:text-4xl font-semibold uppercase tracking-tight text-gray-900 text-center">
              {exercise.name}
            </h1>
          </div>
          <div className="flex flex-row items-center gap-12 text-gray-800 text-xl font-light min-w-[200px] text-center">
            {exercise.duration_min != null && (
              <div>Durée : {exercise.duration_min} min</div>
            )}
            {exercise.difficulty != null && (
              <div>Difficulté : {exercise.difficulty}/5</div>
            )}
            {exercise.created_at && (
              <div>Créé le : {new Date(exercise.created_at).toLocaleDateString()}</div>
            )}
          </div>
        </div>

        <BackButton className="ml-4 mb-4" />

        {/* Bloc principal à 2 colonnes 50/50 */}
        <div className="max-w-7xl w-full flex flex-row gap-12 px-8" style={{ minHeight: '60vh' }}>
          {/* Gauche : Vidéo + Muscles sticky */}
          <div className="w-1/2 flex flex-col sticky top-28 self-start" style={{ maxHeight: '80vh' }}>
            {/* Vidéo */}
            <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black mb-6">
              <video src={exercise.video_url} poster={exercise.cover_video || exercise.image_url} controls className="w-full h-auto rounded-2xl" />
            </div>
            {/* Muscles sollicités */}
            {muscles.length > 0 && (
              <section className="bg-white border-violet-200 border-2 p-6 rounded-2xl shadow-lg flex-1 overflow-auto">
                <h2 className="text-2xl font-bold mb-4">Muscles sollicités</h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-4">
                  {muscles.map((m) => (
                    <div key={m.uuid} className="w-32 border-1 border-violet-200 rounded-2xl hover:shadow-md transition overflow-hidden hover:scale-105 duration-200">
                    <Link
                      key={m.uuid}
                      href={`/admin/muscles/${m.uuid}`}
                      className="bg-white rounded-lg shadow  flex flex-col items-center"
                    >
                      <div className="relative h-20 w-20 mb-2">
                        <Image
                          src={m.image_url}
                          alt={m.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="p-1">
                        <h3 className="font-semibold text-center">{m.name}</h3>
                      </div>
                    </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
          {/* Droite : Mouvements, Conseils, Variantes (scrollable) */}
          <div className="w-1/2 min-w-[350px] flex flex-col gap-8">
            {/* Mouvements */}
            <section className="bg-white border-violet-200 border-2 p-6 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Mouvements</h2>
              {splitToList(exercise.mouvements).length > 0 ? (
                <ol className="list-decimal ml-6 text-lg space-y-1">
                  {splitToList(exercise.mouvements).map((mv, i) => (
                    <li key={i}>{mv}</li>
                  ))}
                </ol>
              ) : (
                <p className="text-gray-500">Aucun mouvement renseigné.</p>
              )}
            </section>
            {/* Conseils */}
            {exercise.tips && (
              <section className="bg-white border-violet-200 border-2 p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold mb-2">Conseils</h2>
                {splitToList(exercise.tips).length > 0 ? (
                  <ul className="list-disc ml-5 text-lg space-y-1">
                    {splitToList(exercise.tips).map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Aucun conseil.</p>
                )}
              </section>
            )}
            {/* Variantes */}
            {exercise.variantes && (
              <section className="bg-white border-violet-200 border-2 p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold mb-2">Variantes</h2>
                {splitToList(exercise.variantes).length > 0 ? (
                  <ul className="list-disc ml-5 text-lg space-y-1">
                    {splitToList(exercise.variantes).map((item, i) => (
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

      </div>
    </Layout>
  );
}
