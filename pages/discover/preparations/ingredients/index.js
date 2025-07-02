// app/discover/exercises/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Layout from "@/components/layout";
import Loader from "@/components/loader";
import { IngredientCard } from "@/components/cards/discover_cards";
import BackButton from "@/components/buttons/back_button";

export default function IngredientsPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("ingredients")
      .select("uuid, name, image_url")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setItems(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center h-screen">
          <Loader />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex h-screen w-screen overflow-hidden">
        <main className="flex-1 flex flex-col overflow-hidden">

          <BackButton/>

          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <IngredientCard
                key={item.uuid}
                item={item}
                onClick={() => {
                  router.push(`/discover/preparations/ingredients/${item.uuid}`)
                }}
              />
            ))}
          </div>

        </main>
      </div>
    </Layout>
  );
}
