// pages/index.jsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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

  const goToTimer = (mode) => () => {
    router.push({
      pathname: "/timer",
      query: { mode },
    });
  };

  // Récupération des programmes
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

  // Gestion du style du header au scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ancre scroll
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

  // Fallback si pas de données
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
      {/* Header */}
        <Header></Header>

      <main className="bg-[var(--background)] text-[var(--text1)]">
        {/* Hero */}
        <section
          id="hero"
          className="relative h-screen flex items-center justify-center overflow-hidden"
        >
          {/* Image de fond */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-bg.jpg"
              alt="Hero background"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
          {/* Dégradé principal */}
          <div className="absolute inset-0 z-10 bg-gradient-to-br from-[var(--background)]/80 via-[var(--background)]/40 to-[var(--background)]" />
          {/* Overlay sombre */}
          <div className="absolute inset-0 z-20 bg-[var(--background)]/60" />
          {/* Dégradé bas vers le fond */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[var(--background)] z-30" />
          {/* Contenu texte */}
          <div className="relative z-40 text-center px-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-16 text-[var(--text1)]">
              Développe ton plein potentiel
            </h1>
            <Button>Découvre ton programme personnalisé</Button>
          </div>
        </section>

        {/* Nos Programmes */}
        <section id="programs" className="py-32 bg-[var(--background)]">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-[var(--green1)] mb-12">
              Nos Programmes
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Sport */}
              <div>
                <h3 className="text-2xl font-semibold text-[var(--green2)] mb-6 text-center">
                  Sport
                </h3>
                <div className="overflow-y-auto scrollbar-hide p-2">
                  <div className="grid grid-cols-2 gap-6">
                    {displaySport.map((p) => (
                      <div
                        key={p.uuid}
                        className="p-1"
                      >
                        <CustomCard>
                        <Image
                          src="/images/muscles.webp"
                          alt={p.name}
                          width={300}
                          height={150}
                          className="object-cover w-full h-32 rounded-t-xl"
                        />
                        <div className="p-4">
                          <h4 className="text-lg font-semibold text-center mb-1">
                            {p.name}
                          </h4>
                          <p className="text-[var(--text2)] text-sm text-center">
                            {p.description}
                          </p>
                        </div>
                        </CustomCard>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <Button>Voir tous les programmes de sport</Button>
                </div>
              </div>

              {/* Nutrition */}
              <div>
                <h3 className="text-2xl font-semibold text-[var(--green2)] mb-6 text-center">
                  Nutrition
                </h3>
                <div className="overflow-y-auto scrollbar-hide p-2">
                  <div className="grid grid-cols-2 gap-6">
                    {displayNutrition.map((p) => (
                      <div key={p.uuid} className="p-1">
                        <CustomCard>
                        <Image
                          src="/images/muscles.webp"
                          alt={p.name}
                          width={300}
                          height={150}
                          className="object-cover w-full h-32 rounded-t-xl"
                        />
                        <div className="p-4">
                          <h4 className="text-lg font-semibold text-center mb-1">
                            {p.name}
                          </h4>
                          <p className="text-[var(--text2)] text-sm text-center">
                            {p.description}
                          </p>
                        </div>
                        </CustomCard>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <Button>Voir tous les programmes de nutrition</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmaps */}
        <section id="roadmap" className="py-32 bg-[var(--details-dark)]">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-[var(--green1)] mb-12">
              Roadmaps Nutrition & Muscles
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-800 rounded-xl p-4 shadow-md">
                {/* <RoadmapComponent variant="nutrition" /> */}
                <Image
                  src="/images/muscles.webp"
                  alt="Nutrition Roadmap"
                  width={600}
                  height={300}
                  className="rounded-xl object-cover w-full"
                />
              </div>
              <div className="bg-gray-800 rounded-xl p-4 shadow-md">
                {/* <RoadmapComponent variant="muscles" /> */}
                <Image
                  src="/images/muscles.webp"
                  alt="Muscles Roadmap"
                  width={600}
                  height={300}
                  className="rounded-xl object-cover w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* E‑books */}
        <section id="ebooks" className="py-32 bg-[var(--bakcground)]">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-[var(--green1)] mb-12">
              E‑books à Télécharger
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <CustomCard key={i} className="overflow-hidden">
                  <Image
                    src="/images/muscles.webp"
                    alt={`E-book ${i}`}
                    width={400}
                    height={160}
                    className="object-cover w-full h-32 rounded-t-xl"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">E‑book {i}</h3>
                    <p className="text-[var(--text1)] text-sm">
                      Téléchargez notre guide complet.
                    </p>
                  </div>
                </CustomCard>
              ))}
            </div>
          </div>
        </section>

        {/* Outils */}
        <section id="outils" className="py-32 bg-[var(--details-dark)]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-[var(--green1)] mb-12">
            Outils timer
          </h2>

          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-y-12 gap-x-8">
            {[
              { key: "chronometer", label: "Chronomètre", desc: "Pour faire ton max bebew" },
              { key: "timer",       label: "Workout timer", desc: "Pour des entraînements en fractionné" },
              { key: "interval",    label: "Pomodoro timer", desc: "Pour travailler efficacement ma puce" },
            ].map(({ key, label, desc }) => (
              <li key={key} className="flex flex-col items-center">
                <Button
                  onClick={goToTimer(key)}
                  className="text-lg font-medium text-[var(--background)] bg-[var(--green2)]
                            py-2 px-6 rounded-full hover:bg-[var(--green3)] transition-colors"
                >
                  {label}
                </Button>
                <p className="mt-4 text-base text-[var(--text2)] leading-relaxed max-w-xs">
                  {desc}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>




        {/* Footer */}
        <footer className="bg-[var(--background)] py-12 text-[var(--text3)] border-t-1 border-[var(--details-dark)]">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-6">
            <div>
              <h4 className="font-semibold text-[var(--text1)] mb-2">À propos</h4>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="hover:underline">
                    Qui sommes-nous ?
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Nos valeurs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Carrières
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[var(--text1)] mb-2">Services</h4>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={scrollTo("programs")}
                    className="hover:underline"
                  >
                    Programmes
                  </button>
                </li>
                <li>
                  <button
                    onClick={scrollTo("roadmap")}
                    className="hover:underline"
                  >
                    Roadmap
                  </button>
                </li>
                <li>
                  <button
                    onClick={scrollTo("ebooks")}
                    className="hover:underline"
                  >
                    E‑books
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[var(--text1)] mb-2">Ressources</h4>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={scrollTo("programs")}
                    className="hover:underline"
                  >
                    Programmations
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[var(--text1)] mb-2">Contact</h4>
              <ul className="space-y-1">
                <li>
                  <a href="mailto:contact@monsite.com" className="hover:underline">
                    Email
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </main>
    </Layout>
  );
}
