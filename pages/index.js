"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/layout";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "@/contexts/auth_context";
import Loader from "@/components/loader";
import Button from "@/components/buttons/button";
import CustomCard from "@/components/cards/custom_card";
import Header from "@/components/header";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  // Timer navigation
  const goToTimer = (mode) => () => router.push(`/timer?mode=${mode}`);

  // Fetch programs
  useEffect(() => {
    if (!authLoading) {
      supabase
        .from("programs")
        .select("*")
        .then(({ data }) => {
          setPrograms(data || []);
          setLoading(false);
        });
    }
  }, [authLoading]);

  // Header scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => () =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen w-screen bg-[var(--background)]">
          <Loader />
        </div>
      </Layout>
    );
  }

  // Program filters
  const sportItems = programs.filter((p) => p.type === "sport");
  const nutrItems = programs.filter((p) => p.type === "nutrition");
  const displaySport = sportItems.length
    ? sportItems
    : Array.from({ length: 4 }, (_, i) => ({
        uuid: i,
        name: `Sport ${i + 1}`,
        description: "Séances adaptées à votre objectif.",
      }));
  const displayNutrition = nutrItems.length
    ? nutrItems
    : Array.from({ length: 4 }, (_, i) => ({
        uuid: i,
        name: `Nutrition ${i + 1}`,
        description: "Plans selon votre régime.",
      }));

  return (
    <Layout>
      <Header scrolled={scrolled} />
      {/* IMAGE DE FOND FIXE SUR TOUT LE MAIN */}
      <main
        className="
          relative min-h-screen text-[var(--text1)]
          bg-no-repeat bg-cover bg-center bg-fixed
        "
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
      >
        {/* HERO — transparence/gradient à gérer via les classes du container */}
        <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden"> 
            <div className="absolute inset-0 z-10 bg-gradient-to-br from-[var(--background)]/80 via-[var(--background)]/40 to-[var(--background)]" /> 
            <div className="absolute inset-0 z-20 bg-[var(--background)]/60" /> <div className="relative z-30 text-center px-4"> 
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-16 text-[var(--text1)]"> Développe ton plein potentiel </h1>
              <Button onClick={scrollTo("programs")}>Découvre ton programme personnalisé</Button> </div> </section>

        {/* Programs (NOIR) */}
        <section id="programs" className="py-32 bg-[var(--background)]/80">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-[var(--green1)] mb-12">Nos Programmes</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Sport */}
              <div>
                <h3 className="text-2xl font-semibold text-[var(--green2)] mb-6">Sport</h3>
                <div className="grid grid-cols-2 gap-6">
                  {displaySport.map((p) => (
                    <Link key={p.uuid} href={`/programs?type=sport&uuid=${p.uuid}`}>
                      <CustomCard className="hover:shadow-lg transition">
                        <div className="relative h-32 w-full">
                          <Image
                            src="/images/muscles.webp"
                            alt={p.name}
                            fill
                            className="object-cover rounded-t-xl"
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="text-lg font-semibold mb-1">{p.name}</h4>
                          <p className="text-[var(--text2)] text-sm">{p.description}</p>
                        </div>
                      </CustomCard>
                    </Link>
                  ))}
                </div>
                <div className="mt-6">
                  <Link href="/programs?type=sport">
                    <p className="text-[var(--green2)] hover:underline">
                      Voir tous les programmes de sport
                    </p>
                  </Link>
                </div>
              </div>

              {/* Nutrition */}
              <div>
                <h3 className="text-2xl font-semibold text-[var(--green2)] mb-6">Nutrition</h3>
                <div className="grid grid-cols-2 gap-6">
                  {displayNutrition.map((p) => (
                    <Link key={p.uuid} href={`/programs?type=nutrition&uuid=${p.uuid}`}>
                      <CustomCard className="hover:shadow-lg transition">
                        <div className="relative h-32 w-full">
                          <Image
                            src="/images/muscles.webp"
                            alt={p.name}
                            fill
                            className="object-cover rounded-t-xl"
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="text-lg font-semibold mb-1">{p.name}</h4>
                          <p className="text-[var(--text2)] text-sm">{p.description}</p>
                        </div>
                      </CustomCard>
                    </Link>
                  ))}
                </div>
                <div className="mt-6">
                  <Link href="/programs?type=nutrition">
                    <p className="text-[var(--green2)] hover:underline">
                      Voir tous les programmes de nutrition
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmaps (GRIS FONCÉ) */}
        <section id="roadmap" className="py-32 bg-[var(--details-dark)]/80">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-[var(--green1)] mb-12">Roadmaps</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-800 rounded-xl p-4 hover:shadow-[0_0_10px_var(--green3)] transition-shadow">
                <Link href="/roadmaps?variant=muscles">
                  <Image
                    src="/images/muscles.webp"
                    alt="Nutrition Roadmap"
                    width={600}
                    height={300}
                    className="rounded-xl object-cover w-full"
                  />
                </Link>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 hover:shadow-[0_0_10px_var(--green3)] transition-shadow">
                <Link href="/roadmaps?variant=muscles">
                  <Image
                    src="/images/muscles.webp"
                    alt="Muscles Roadmap"
                    width={600}
                    height={300}
                    className="rounded-xl object-cover w-full"
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* E-books (NOIR) */}
        <section id="ebooks" className="py-32 bg-[var(--background)]/80">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-[var(--green1)] mb-12">E-books</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <Link key={i} href={`/ebooks/${i}`}>
                  <CustomCard className="overflow-hidden">
                    <Image
                      src="/images/muscles.webp"
                      alt={`E-book ${i}`}
                      width={400}
                      height={160}
                      className="object-cover w-full h-32 rounded-t-xl"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2">E-book {i}</h3>
                      <p className="text-[var(--text1)] text-sm">Téléchargez notre guide complet.</p>
                    </div>
                  </CustomCard>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Outils (GRIS FONCÉ) */}
        <section id="outils" className="py-32 bg-[var(--details-dark)]/80">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-[var(--green1)] mb-12">Outils Timer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { key: "chronometer", label: "Chronomètre" },
                { key: "timer", label: "Workout Timer" },
                { key: "interval", label: "Pomodoro" },
              ].map((tool) => (
                <Button key={tool.key} onClick={goToTimer(tool.key)} className="mx-auto mb-4">
                  {tool.label}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Footer (NOIR) */}
        <footer className="bg-[var(--background)] py-12 text-[var(--text3)] border-t border-[var(--details-dark)]">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-6">
            {["À propos", "Services", "Ressources", "Contact"].map((col, idx) => (
              <div key={idx}>
                <h4 className="font-semibold text-[var(--text1)] mb-2">{col}</h4>
                <ul className="space-y-1">
                  <li>
                    <Link href="/settings">
                      <p className="hover:underline">{col}</p>
                    </Link>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </footer>
      </main>
    </Layout>
  );
}
