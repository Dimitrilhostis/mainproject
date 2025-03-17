"use client";

import Link from "next/link";
import { FaDumbbell } from "react-icons/fa";
import { BiAlarm, BiCalendar, BiFoodMenu } from "react-icons/bi";
import { motion } from "framer-motion";

export default function EntryPage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white overflow-hidden p-6">
      
      {/* Arrière-plan animé */}
      <BackgroundEffects />

      {/* Titre animé */}
      <motion.h1
        className="text-6xl font-bold mb-12 text-center relative z-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        Bienvenue
      </motion.h1>

      {/* Boutons en grille */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl relative z-10">
        <AnimatedButton href="/coaching" icon={<FaDumbbell size={40} />} text="Coaching" />
        <AnimatedButton href="/timer" icon={<BiAlarm size={40} />} text="Timer" />
        <AnimatedButton href="/tracking" icon={<BiCalendar size={40} />} text="Tracking" />
        <AnimatedButton href="/recettes" icon={<BiFoodMenu size={40} />} text="Recettes" />
      </div>
    </div>
  );
}

// Composant des boutons animés
function AnimatedButton({ href, icon, text }) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={{ y: [0, -5, 0], transition: { repeat: Infinity, duration: 2, ease: "easeInOut" } }}
    >
      <Link
        href={href}
        className="flex items-center justify-center gap-4 w-full p-5 bg-gray-900 text-white rounded-xl shadow-xl hover:bg-gray-800 transition-all"
      >
        {icon}
        <span className="text-xl font-medium">{text}</span>
      </Link>
    </motion.div>
  );
}

// Effets d'arrière-plan animés
function BackgroundEffects() {
  return (
    <>
      {/* Halo lumineux animé */}
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-purple-500 opacity-20 blur-3xl rounded-full"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      />
      
      {/* Particules en mouvement */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-white rounded-full opacity-30"
          initial={{ x: Math.random() * 800 - 400, y: Math.random() * 600 - 300, scale: Math.random() * 0.5 + 0.5 }}
          animate={{
            x: [Math.random() * 800 - 400, Math.random() * 800 - 400],
            y: [Math.random() * 600 - 300, Math.random() * 600 - 300],
            opacity: [0.2, 0.6, 0.2]
          }}
          transition={{ duration: Math.random() * 5 + 3, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </>
  );
}
