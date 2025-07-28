// app/discover/muscles/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Layout from "@/components/layout";
import SideBar from "@/components/sidebar";
import MobileNav from "@/components/nav/mobile_nav";
import Loader from "@/components/loader";
import { MuscleCard } from "@/components/cards/discover_cards";
import { FaArrowLeft, FaDumbbell } from "react-icons/fa";

export default function MusclesPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("muscles")
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

        <header className="flex-shrink-0 flex items-center justify-center px-4 py-2 bg-white shadow-sm relative">
          <button
            onClick={() => router.back()}
            className="absolute left-4"
          >
            <FaArrowLeft className="h-5 w-5 text-gray-600"/>
          </button>
          <h1 className="text-3xl text-gray-700 font-bold text-center flex-1">MUSCLES</h1>
        </header>

          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <MuscleCard
                key={item.uuid}
                item={item}
                onClick={() => {
                  router.push(`muscles/${item.uuid}`);
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
