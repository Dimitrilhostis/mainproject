"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import Loader from "@/components/loader";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import BackButton from "@/components/buttons/back_button";

// Fonction utilitaire pour splitter les chaînes multi-lignes ou tableaux
function splitToList(str) {
  if (!str) return [];
  if (Array.isArray(str)) return str;
  return str.split('\n').map(s => s.trim()).filter(Boolean);
}

// Composant pour la checklist des étapes de préparation
function PreparationSteps({ steps }) {
  const [checked, setChecked] = useState(Array(steps.length).fill(false));

  const toggleStep = (i) => {
    setChecked((prev) =>
      prev.map((val, idx) => (idx === i ? !val : val))
    );
  };

  return (
    <ul className="ml-6 text-lg space-y-2">
      {steps.map((step, i) => (
        <li key={i}>
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <span className="flex items-start pt-1">
              <input
                type="checkbox"
                checked={checked[i]}
                onChange={() => toggleStep(i)}
                className="w-5 h-5 accent-violet-600"
                style={{ minWidth: '1.25rem', minHeight: '1.25rem' }} // 1.25rem = 20px
              />
            </span>
            <span className={checked[i] ? "line-through text-gray-400" : ""}>
              {step}
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
}

export default function PreparationPage() {
  const router = useRouter();
  const { uuid } = router.query;
  const [preparation, setPreparation] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Marge à appliquer pour espacer bandeau/blocs du bas
  const BANNER_MARGIN = 56; // px

  useEffect(() => {
    if (!router.isReady) return;
    (async () => {
      setLoading(true);
      const { data: ex, error: errEx } = await supabase
        .from("preparations")
        .select("*")
        .eq("uuid", uuid)
        .maybeSingle();
      if (errEx) {
        console.error("Fetch preparation error", errEx);
        setLoading(false);
        return;
      }
      if (!ex) {
        setPreparation(null);
        setLoading(false);
        return;
      }
      setPreparation(ex);

      // Gère string ou tableau pour les ingrédients
      let ingrUuids = [];
      if (Array.isArray(ex.ingredient_uuid)) {
        ingrUuids = ex.ingredient_uuid;
      } else if (typeof ex.ingredient_uuid === "string" && ex.ingredient_uuid.length > 0) {
        ingrUuids = [ex.ingredient_uuid];
      }
      if (ingrUuids.length > 0) {
        const { data: ing, error: errIng } = await supabase
          .from("ingredients")
          .select("uuid,name")
          .in("uuid", ingrUuids);
        if (errIng) console.error("Fetch ingredients error", errIng);
        else setIngredients(ing || []);
      } else {
        setIngredients([]);
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

  if (!preparation) {
    return (
      <Layout>
        <BackButton />
        <div className="p-8 text-center">Préparation non trouvée.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full min-h-screen bg-violet-100 flex flex-col items-center mb-10">
        {/* Bandeau Titre + Infos */}
        <div
          className="mx-auto w-full max-w-7xl flex flex-col md:flex-row items-center p-8 bg-violet-200 shadow rounded-3xl"
          style={{ marginTop: BANNER_MARGIN, marginBottom: BANNER_MARGIN }}
        >
          <div className="flex-1 flex ml-12">
            <h1 className="text-4xl md:text-6xl font-semibold uppercase tracking-tight text-gray-900 text-center mb-6 md:mb-0">
              {preparation.name}
            </h1>
          </div>
          <div className="flex flex-row items-center gap-12 text-gray-800 text-xl font-light min-w-[200px] text-center">
            {preparation.time != null && (
              <div>Durée : {preparation.time} min</div>
            )}
            {preparation.difficulty != null && (
              <div>Difficulté : {preparation.difficulty}/5</div>
            )}
            {preparation.created_at && (
              <div>Créé le : {new Date(preparation.created_at).toLocaleDateString()}</div>
            )}
          </div>
        </div>

        <BackButton className="ml-4 mb-4" />

        {/* Bloc principal : 2 colonnes 50/50 */}
        <div className="max-w-7xl w-full flex flex-row gap-12 px-8" style={{ minHeight: '60vh' }}>
          {/* Gauche : Vidéo + Ingrédients, sticky sur la hauteur de la préparation */}
          <div className="w-1/2 flex flex-col sticky top-28 self-start" style={{ maxHeight: '80vh' }}>
            {/* Vidéo */}
            <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black mb-6">
              <video src={preparation.video_url} poster={preparation.image_url} controls className="w-full h-auto rounded-2xl"/>
            </div>
            {/* Ingrédients */}
            <section className="bg-white border-violet-200 border-2 p-6 rounded-2xl shadow-lg flex-1 overflow-auto">
              <h2 className="text-2xl font-bold mb-4">Ingrédients</h2>
              {ingredients.length > 0 ? (
                <ul className="list-disc ml-6 text-lg">
                  {ingredients.map((ing, i) => (
                    <li key={ing.uuid} className="mb-2">
                      <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="font-medium whitespace-nowrap">
                          {preparation.quantities && preparation.quantities[i] ? preparation.quantities[i] : "?"}
                        </span>
                        <span className="whitespace-nowrap">
                          <Link
                            href={`/discover/preparations/ingredients/${ing.uuid}`}
                            className="text-black hover:text-purple-600 transition"
                          >
                            {ing.name}
                          </Link>
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Aucun ingrédient lié.</p>
              )}
            </section>

          </div>
          {/* Droite : Préparation (scrollable) */}
          <div className="w-1/2 min-w-[350px] flex flex-col">
            <section className="bg-white border-violet-200 border-2 p-6 rounded-2xl shadow-lg flex-1">
              <h2 className="text-2xl font-bold mb-4">Préparation</h2>
              {splitToList(preparation.preparation).length > 0 ? (
                <PreparationSteps steps={splitToList(preparation.preparation)} />
              ) : (
                <p className="text-gray-500">Aucune étape.</p>
              )}
            </section>
          </div>
        </div>

        {/* Blocs bas (Tips, Association, Variantes) avec même margin que le bandeau */}
        <div
          className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 px-8"
          style={{ marginTop: BANNER_MARGIN, marginBottom: BANNER_MARGIN }}
        >
          {/* Tips */}
          {preparation.tips && (
            <section className="bg-white border-violet-200 border-2 p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-2">Tips</h2>
              {splitToList(preparation.tips).length > 0 ? (
                <ul className="list-disc ml-5 text-lg space-y-1">
                  {splitToList(preparation.tips).map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Aucun tips.</p>
              )}
            </section>
          )}
          {/* Association */}
          {preparation.association && (
            <section className="bg-white border-violet-200 border-2 p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-2">Association</h2>
              {splitToList(preparation.association).length > 0 ? (
                <ul className="list-disc ml-5 text-lg space-y-1">
                  {splitToList(preparation.association).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Aucune association.</p>
              )}
            </section>
          )}
          {/* Variantes */}
          {preparation.variantes && (
            <section className="bg-white border-violet-200 border-2 p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-2">Variantes</h2>
              {splitToList(preparation.variantes).length > 0 ? (
                <ul className="list-disc ml-5 text-lg space-y-1">
                  {splitToList(preparation.variantes).map((item, i) => (
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
    </Layout>
  );
}
