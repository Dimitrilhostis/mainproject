"use client";

import { motion } from "framer-motion";
import Layout from '@/components/layout';
import Header from '@/components/header';
import Image from 'next/image';

export default function EbooksPage() {
  const ebooks = [
    {
      key: 'ebook1',
      title: 'Guide Nutrition 101',
      img: '/images/muscles.webp',
      desc: 'Apprenez les bases de la nutrition pour atteindre vos objectifs.',
    },
    {
      key: 'ebook2',
      title: 'Programme Full Body',
      img: '/images/muscles.webp',
      desc: 'Entraînement complet pour tous les niveaux, structuré sur 8 semaines.',
    },
    {
      key: 'ebook3',
      title: 'Yoga & Bien-être',
      img: '/images/muscles.webp',
      desc: 'Séquences de yoga pour améliorer la souplesse et la relaxation.',
    },
    {
      key: 'ebook4',
      title: 'Recettes Saines',
      img: '/images/muscles.webp',
      desc: '50 recettes rapides et équilibrées pour chaque jour de la semaine.',
    },
  ];

  return (
    <Layout>
      <Header />
      <main className="w-screen min-h-screen relative flex flex-col items-center justify-start pt-24 pb-16 bg-[var(--background)]">
        <h1 className="text-4xl font-extrabold text-[var(--text1)] mb-8">E‑books à Télécharger</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 max-w-6xl">
          {ebooks.map((book, idx) => (
            <motion.div
              key={book.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="relative bg-transparent backdrop-blur-2xl border border-[var(--text3)]/20 rounded-3xl overflow-hidden shadow-xl"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={book.img}
                  alt={book.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <h2 className="absolute bottom-2 left-4 text-lg font-bold text-white">
                  {book.title}
                </h2>
              </div>
              <div className="p-4 bg-[var(--details-dark)]">
                <p className="text-[var(--text2)] mb-4">
                  {book.desc}
                </p>
                <button
                  className="w-full py-2 bg-[var(--green2)] text-[var(--background)] rounded-full font-medium hover:bg-[var(--green3)] transition"
                >
                  Télécharger
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </Layout>
  );
}
