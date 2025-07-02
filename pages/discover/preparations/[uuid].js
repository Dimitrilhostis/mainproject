// pages/preparations/[uuid].jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter }    from "next/router";
import Layout from "@/components/layout";
import MobileNav from "@/components/nav/mobile_nav";
import Loader from "@/components/loader";
import Image            from "next/image";
import { supabase }     from "@/lib/supabaseClient";
import Link from "next/link";
import BackButton from "@/components/buttons/back_button";
import VideoZone from "@/components/video_zone";

export default function PreparationPage() {
  const router       = useRouter();
  const { uuid }     = router.query;        
  const [preparation, setPreparation] = useState(null);
  const [muscles,   setMuscles]   = useState([]);     // A mettre partout
  const [loading,   setLoading]   = useState(true);

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

      // 2. Si l'exercice a un tableau muscles_uuid, on fetch les muscles liés
      if (Array.isArray(ex.muscle_uuid) && ex.muscle_uuid.length > 0) {
        const { data: ms, error: errMs } = await supabase
          .from("muscles")
          .select("uuid,name,image_url")
          .in("uuid", ex.muscle_uuid);
        if (errMs) console.error("Fetch muscles error", errMs);
        else setMuscles(ms || []);
      }

      setLoading(false);
    })();
  }, [router.isReady, uuid]);

  // UI
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
        <BackButton/>
        <div className="p-8 text-center">Préparation non trouvée.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex w-screen h-screen"> 

        {/* Contenu principal */}
        <main className="flex-1 overflow-auto">

        <div className="bg-violet-200 shadow-md text-center py-4">
            <h1 className="text-4xl uppercase font-bold">
                {preparation.name}
            </h1>
        </div>

        <BackButton className={"mt-8"}/>    

          {/* Hero image + vidéo côte-à-côte */}
          <div className="my-4 flex gap-6">
            {/* Image */}
            <div className="relative ml-40 h-80 w-80 bg-gray-200 rounded-lg overflow-hidden">
              {preparation.image_url && (
                <Image
                  src={preparation.image_url}
                  alt={preparation.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            <VideoZone 
              src={preparation.video_url} 
              poster={preparation.cover_video} 
              height="w-160"
              width="h-80"
            />    
          </div>

          {/* Meta */}
          <div className="pl-20 p-6 flex flex-wrap gap-20 bg-white border-b">
            {preparation.time != null && (
              <div><strong>Durée :</strong> {preparation.time} min</div>
            )}
            {preparation.difficulty != null && (
              <div><strong>Difficulté :</strong> {preparation.difficulty}/5</div>
            )}
            {preparation.created_at && (
              <div>
                <strong>Créé le :</strong>{" "}
                {new Date(preparation.created_at).toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Contenu détaillé */}
          <div className="p-6 space-y-8 grid grid-rows-2 grid-cols-3 gap-5">
            {/* Preparation */}
            {preparation.ingredient_uuid && (
              <section className="bg-white border-violet-200 border-2 p-3 rounded-xl">
                <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
                <p className="text-gray-700">{preparation.ingredient_uuid}</p>
              </section>
            )}

            {/* Preparation */}
            {preparation.preparation && (
              <section className="bg-white border-violet-200 border-2 p-3 rounded-xl">
                <h2 className="text-xl font-semibold mb-2">Preparation</h2>
                <p className="text-gray-700">{preparation.preparation}</p>
              </section>
            )}

            {/* Tips */}
            {preparation.tips && (
              <section className="bg-white border-violet-200 border-2 p-3 rounded-xl">
                <h2 className="text-xl font-semibold mb-2">Tips</h2>
                <p className="text-gray-700">{preparation.tips}</p>
              </section>
            )}

            {/* Association */}
            {preparation.association && (
              <section className="bg-white border-violet-200 border-2 p-3 rounded-xl">
                <h2 className="text-xl font-semibold mb-2">Association</h2>
                <p className="text-gray-700">{preparation.association}</p>
              </section>
            )}

            {/* Variantes */}
            {preparation.variantes && (
              <section className="bg-white border-violet-200 border-2 p-3 rounded-xl">
                <h2 className="text-xl font-semibold mb-2">Variantes</h2>
                <p className="text-gray-700">{preparation.variantes}</p>
              </section>
            )}

            {/* Muscles */}
            {muscles.length > 0 && (
              <section className="col-span-3">
                <h2 className="text-xl font-semibold mb-4">Muscles sollicités</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {muscles.map((m) => (
                    <Link
                      key={m.uuid}
                      href={`/admin/muscles/${m.uuid}`}
                      className="bg-white w-32 rounded-lg shadow hover:shadow-md transition overflow-hidden hover:scale-105 duration-200"
                    >
                      <div className="relative h-32 w-full">
                        <Image
                          src={m.image_url}
                          alt={m.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold">{m.name}</h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>

        {/* Mobile nav */}
        <MobileNav />
      </div>
    </Layout>
  );
}
