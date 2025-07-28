// app/discover/exercises/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Layout from "@/components/layout";
import SideBar from "@/components/sidebar";
import MobileNav from "@/components/nav/mobile_nav";
import Loader from "@/components/loader";
import DiscoverNav from "@/components/nav/discover_nav";
import { GiMuscleUp } from "react-icons/gi";
import { TrainingCard } from "@/components/cards/discover_cards";

export default function ExercisesPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("trainings")
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
        <aside className="hidden md:flex">
          <SideBar />
        </aside>
        <main className="flex-1 flex flex-col overflow-hidden">

        <header className="relative flex items-center px-4 py-2 bg-white shadow-sm h-[64px]">
            <div className="absolute left-4">
                <DiscoverNav />
            </div>
            <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl text-gray-700 font-bold text-center m-0 p-0 md:hidden">
                SÉANCES
            </h1>
            <button
                onClick={() => router.push("/discover/trainings/exercises")}
                className="absolute right-4 p-2 bg-white border rounded-lg hover:bg-gray-100 transition"
            >
                <GiMuscleUp className="h-5 w-5 text-gray-600" />
            </button>
        </header>

          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <TrainingCard
                key={item.uuid}
                item={item}
                onClick={() => {
                  router.push(`trainings/${item.uuid}`);
                }}
              />
            ))}
          </div>

          <MobileNav />
        </main>
      </div>
    </Layout>
  );
}
