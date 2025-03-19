"use client";

import { FaDumbbell } from "react-icons/fa";
import { BiAlarm, BiCalendar, BiFoodMenu } from "react-icons/bi";
import { motion } from "framer-motion";
import AnimatedButton from "@components/buttons/animated_button"
import BackgroundEffects from "@components/effects/background_effect";

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
