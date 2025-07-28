    "use client";

import { useState } from "react";
import Layout from '@/components/layout';
import Header from '@/components/header';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function RoadmapsPage() {
  const roadmaps = [
    {
      key: 'nutrition',
      title: 'Roadmap Nutrition',
      img: '/images/muscles.webp',
      description: 'Étapes clés pour optimiser votre alimentation sur 12 semaines',
    },
    {
      key: 'muscles',
      title: 'Roadmap Muscles',
      img: '/images/muscles.webp',
      description: 'Guide progressif pour la prise de masse musculaire',
    },
  ];

  return (
    <Layout>
      <Header />
      <main className="w-screen min-h-screen relative flex flex-col items-center justify-start pt-24 pb-16 bg-[var(--background)]">
        <h1 className="text-4xl font-extrabold text-[var(--text1)] mb-8">Roadmaps</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 max-w-6xl">
          {roadmaps.map((map, idx) => (
            <motion.div
              key={map.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.5 }}
              className="relative bg-transparent backdrop-blur-2xl border border-[var(--text3)]/20 rounded-3xl overflow-hidden shadow-xl"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={map.img}
                  alt={map.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <h2 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                  {map.title}
                </h2>
              </div>
              <div className="p-6 bg-[var(--details-dark)]">
                <p className="text-[var(--text2)] mb-4">
                  {map.description}
                </p>
                <button
                  className="px-6 py-2 bg-[var(--green2)] text-[var(--background)] rounded-full font-medium hover:bg-[var(--green3)] transition"
                >
                  Voir la roadmap
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </Layout>
  );
}
