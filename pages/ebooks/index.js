"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Layout from '@/components/layout';
import Header from '@/components/header';
import Image from 'next/image';
import DetailsModal from "./details_modal";

export default function EbooksPage() {
  const [open, setOpen] = useState(false);
  const [activeBook, setActiveBook] = useState(null);

  
  const showDetails = () => setOpen(true);
  const hideDetails = () => setOpen(false);

  const free_ebooks = [
    {
      key: 'ebook1',
      title: 'Guide rapide de la nutrition',
      desc: 'Apprenez les bases de la nutrition pour atteindre vos objectifs.',
      img: '/images/muscles.webp',
      descriptions: ["Comprendre l'importance d'une bonne nutrition.", 'Les points principaux expliqués.', '5 recettes faciles et saines.', 'prout'],
    },
    {
      key: 'ebook2',
      title: 'Programme Full Body',
      img: '/images/muscles.webp',
      desc: 'Entraînement complet pour tous les niveaux, structuré sur 8 semaines.',
      descriptions: ['Apprenez les bases de la nutrition pour atteindre vos objectifs.'],
    },
    {
      key: 'ebook3',
      title: 'Détente chill',
      img: '/images/muscles.webp',
      desc: 'Séquences de yoga pour améliorer la souplesse et la relaxation.',
      descriptions: ['Apprenez les bases de la nutrition pour atteindre vos objectifs.'],
    },
    {
      key: 'ebook4',
      title: 'Recettes Saines',
      img: '/images/muscles.webp',
      desc: '50 recettes rapides et équilibrées pour chaque jour de la semaine.',
      descriptions: ['Apprenez les bases de la nutrition pour atteindre vos objectifs.'],
    },
    {
      key: 'ebook4',
      title: 'Recettes Saines',
      img: '/images/muscles.webp',
      desc: '50 recettes rapides et équilibrées pour chaque jour de la semaine.',
      descriptions: ['Apprenez les bases de la nutrition pour atteindre vos objectifs.'],
    },
  ];

  const premium_ebooks = [
    {
      key: 'ebook5',
      title: 'Guide Nutrition Complet',
      img: '/images/muscles.webp',
      desc: 'Apprenez les bases de la nutrition pour atteindre vos objectifs.',
      descriptions: ['Apprenez les bases de la nutrition pour atteindre vos objectifs.'],
    },
    {
      key: 'ebook6',
      title: 'Programme Push Pull Legs',
      img: '/images/muscles.webp',
      desc: 'Entraînement complet pour tous les niveaux, structuré sur 8 semaines.',
      descriptions: ['Apprenez les bases de la nutrition pour atteindre vos objectifs.'],
    },
    {
      key: 'ebook7',
      title: 'Yoga & Arts martiaux',
      img: '/images/muscles.webp',
      desc: 'Séquences de yoga pour améliorer la souplesse et la relaxation.',
      descriptions: ['Apprenez les bases de la nutrition pour atteindre vos objectifs.'],
    },
    {
      key: 'ebook8',
      title: 'Les bases de la nutrition',
      img: '/images/muscles.webp',
      desc: '50 recettes rapides et équilibrées pour chaque jour de la semaine.',
      descriptions: ['Apprenez les bases de la nutrition pour atteindre vos objectifs.'],
    },
    {
      key: 'ebook8',
      title: 'Les bases de la nutrition',
      img: '/images/muscles.webp',
      desc: '50 recettes rapides et équilibrées pour chaque jour de la semaine.',
      descriptions: ['Apprenez les bases de la nutrition pour atteindre vos objectifs.'],
    },
  ];

  const canScrollFree = free_ebooks.length > 4;
  const canScrollPremium = premium_ebooks.length > 4;



  return (
    <Layout>
      <Header />
      <main className="w-screen min-h-screen relative flex flex-row items-center justify-start pt-10 bg-[var(--background)]">

        <div className="relative flex flex-col items-center justify-start pt-10 pb-8 rounded-4xl hover:bg-[var(--details-dark)]">
        <h1 className="text-4xl font-extrabold text-[var(--text1)] mb-8">E‑books classic - free</h1>
        <div className="relative px-6 max-w-6xl">
        {canScrollFree && (
          <>
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 z-10 bg-gradient-to-b from-[var(--background)] to-transparent" />
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 z-10 bg-gradient-to-t from-[var(--background)] to-transparent" />
          </>
        )}
        <div
            className={`grid grid-cols-1 lg:grid-cols-2 gap-6 py-4
              ${canScrollFree ? "max-h-[76vh] overflow-y-auto pr-2 overscroll-contain scrollbox" : ""}`}
          >          
          {free_ebooks.map((book, idx) => (
            <motion.div
              key={book.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="relative bg-transparent backdrop-blur-2xl border border-[var(--text3)]/20 rounded-3xl overflow-hidden shadow-xl hover:border-[var(--green3)]/40"
              onClick={() => setActiveBook(book)}
            >
              <div className="relative h-48 w-full mt-5">
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
                   onClick={() => setActiveBook(book)}
                >
                  Voir les détails
                </button>
              </div>
              {open && <DetailsModal book={book} onClose={hideDetails} />}
            </motion.div>
          ))}
        </div> </div> </div>

        <div className="relative flex flex-col items-center justify-start pt-10 pb-8 rounded-4xl hover:bg-[var(--details-dark)]">
      
        <h1
          className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text"
          style={{
            backgroundImage:
              'linear-gradient(90deg, var(--premium-light), var(--premium), var(--premium-dark), var(--premium-light))',
            backgroundSize: '200% 100%',
            animation: 'gold-shine 4s linear infinite',
          }}
        >
        E‑books premium - 16.99€
        </h1>
        <div className="relative px-6 max-w-6xl">
          {canScrollPremium && (
            <>
              <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 z-10 bg-gradient-to-b from-[var(--background)] to-transparent" />
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 z-10 bg-gradient-to-t from-[var(--background)] to-transparent" />
            </>
          )}
          <div
              className={`grid grid-cols-1 lg:grid-cols-2 gap-6 py-4
                ${canScrollPremium ? "max-h-[76vh] overflow-y-auto pr-2 overscroll-contain scrollbox" : ""}`}
            >          
            {premium_ebooks.map((book, idx) => (
            <motion.div
              key={book.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="relative bg-transparent backdrop-blur-2xl border border-[var(--text3)]/20 rounded-3xl overflow-hidden shadow-xl hover:border-[var(--green3)]/40"
              onClick={() => setActiveBook(book)}
            >
              <div className="relative h-48 w-full mt-5">
                <Image
                  src={book.img}
                  alt={book.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <h2
                  className="absolute bottom-3 left-4 z-20 text-xl font-extrabold text-transparent bg-clip-text"
                  style={{
                    backgroundImage:
                      'linear-gradient(90deg, var(--premium-light), var(--premium), var(--premium-dark), var(--premium-light))',
                    backgroundSize: '200% 100%',
                    animation: 'gold-shine 4s linear infinite',
                  }}
                >
                  {book.title}
                </h2>

              </div>
              <div className="p-4 bg-[var(--details-dark)]">
                <p className="text-[var(--text2)] mb-4">
                  {book.desc}
                </p>
                <button
                  className="w-full py-2 bg-[var(--green2)] text-[var(--background)] rounded-full font-medium hover:bg-[var(--green3)] transition"
                  onClick={() => setActiveBook(book)}
                  >
                  <h1
                    className="font-extrabold text-transparent bg-clip-text"
                    style={{
                      backgroundImage:
                        'linear-gradient(90deg, var(--premium-light), var(--premium), var(--premium-dark), var(--premium-light))',
                      backgroundSize: '200% 100%',
                      animation: 'gold-shine 4s linear infinite',
                    }}
                  >
                  Voir les détails
                  </h1>           
                </button>
              </div>
              {open && <DetailsModal book={book} onClose={hideDetails} />}
            </motion.div>
          ))}
        </div> </div> </div>

        {activeBook && (
          <DetailsModal
            book={activeBook}
            onClose={() => setActiveBook(null)}
          />
        )}
      </main>
    </Layout>
  );
}