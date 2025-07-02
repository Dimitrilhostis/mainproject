"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import Loader from "@/components/loader";
import BackButton from "@/components/buttons/back_button";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function IngredientPage() {
  const router = useRouter();
  const { uuid } = router.query;
  const [ingredient, setIngredient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;
    (async () => {
      setLoading(true);
      const { data: i, error } = await supabase
        .from("ingredients")
        .select("*")
        .eq("uuid", uuid)
        .maybeSingle();
      if (error) {
        console.error("Fetch ingredient error", error);
        setLoading(false);
        return;
      }
      setIngredient(i);
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

  if (!ingredient) {
    return (
      <Layout>
        <BackButton />
        <div className="p-8 text-center">Ingrédient non trouvé.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex w-screen h-screen">
        <main className="flex-1 overflow-auto bg-gray-50">
          {/* Bouton retour en haut à gauche */}
          <div className="px-6 py-4">
            <BackButton />
          </div>

          {/* Section titre à gauche + image à droite */}
          <div className="flex w-full bg-white">
            {/* Texte à gauche, 50% largeur, aligné verticalement */}
            <div className="w-1/2 flex items-center px-6">
              <h1 className="w-full text-center text-3xl font-bold text-black">
                {ingredient.name}
              </h1>
            </div>
            {/* Image à droite, 50% largeur */}
            <div className="w-1/2 relative h-64 bg-gray-200">
              {ingredient.image_url && (
                <Image
                  src={ingredient.image_url}
                  alt={ingredient.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>

          {/* Date de création (si présente) */}
          {ingredient.created_at && (
            <div className="p-6 bg-white">
              <strong>Créé le :</strong>{" "}
              {new Date(ingredient.created_at).toLocaleDateString()}
            </div>
          )}

          {/* Contenu détaillé de l’ingrédient */}
          <div className="p-6 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 bg-white">
            {/* Colonne de gauche */}
            <div className="flex-1 space-y-6">
              {ingredient.micronutrients && (
                <section>
                  <h2 className="text-xl font-semibold">Micronutriments</h2>
                  <p>{ingredient.micronutrients}</p>
                </section>
              )}
              {ingredient.apports && (
                <section>
                  <h2 className="text-xl font-semibold">Apports</h2>
                  <p>{ingredient.apports}</p>
                </section>
              )}
            </div>

            {/* Colonne de droite */}
            <div className="flex-1 space-y-6">
              {ingredient.associations && (
                <section>
                  <h2 className="text-xl font-semibold">Associations</h2>
                  <p>{ingredient.associations}</p>
                </section>
              )}
              {ingredient.infos_sup && (
                <section>
                  <h2 className="text-xl font-semibold">Infos Supplémentaires</h2>
                  <p>{ingredient.infos_sup}</p>
                </section>
              )}
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
