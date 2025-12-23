"use client";

import Layout from "@/components/layout";
import Header from "@/components/header";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function RoadmapsPage() {
  const roadmaps = [
    {
      key: "nutrition",
      href: "/roadmaps/nutrition",
      title: "Roadmap Nutrition",
      img: "/images/muscles.webp",
      description: "Étapes clés pour optimiser votre alimentation sur 12 semaines",
    },
    {
      key: "sport",
      href: "/roadmaps/sport",
      title: "Roadmap Sport",
      img: "/images/muscles.webp",
      description: "Guide progressif pour développer un physique et des capacités athlétiques",
    },
  ];

  return (
    <Layout>
      <Header />

      <Image
        src="/images/hero-bg.jpg"
        alt="Décor immersif"
        fill
        className="immersive-bg filter brightness-30 object-cover"
        priority
      />

      <main className="w-screen min-h-screen relative flex flex-col items-center justify-start pt-24 pb-16">
        <h1 className="text-4xl font-extrabold text-[var(--text1)] mb-8">
          Roadmaps
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 w-full max-w-6xl">
          {roadmaps.map((map, idx) => (
            <motion.div
              key={map.key}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15, duration: 0.45 }}
              className="h-[420px] rounded-3xl overflow-hidden border border-[var(--text3)]/20 shadow-xl bg-[var(--details-dark)]/90 backdrop-blur-2xl"
            >
              <Link href={map.href} className="h-full w-full block">
                <div className="h-full flex flex-col">
                  {/* TOP IMAGE */}
                  <div className="relative h-[58%] w-full">
                    <Image
                      src={map.img}
                      alt={map.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <h2 className="absolute bottom-4 left-4 text-2xl font-bold text-white drop-shadow">
                      {map.title}
                    </h2>
                  </div>

                  {/* BOTTOM CONTENT (always solid, no transparent bottom) */}
                  <div className="flex-1 p-6 flex flex-col justify-between bg-[var(--details-dark)]">
                    <p className="text-[var(--text2)] leading-relaxed">
                      {map.description}
                    </p>

                    <div className="pt-5">
                      <span className="inline-flex items-center justify-center px-6 py-2 bg-[var(--green2)] text-[var(--background)] rounded-full font-medium hover:bg-[var(--green3)] transition">
                        Voir la roadmap
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </Layout>
  );
}
