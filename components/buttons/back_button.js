// components/BackButton.jsx
"use client";

import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import clsx from "clsx";

export default function BackButton({ className }) {
  const router = useRouter();

  return (
    <motion.button
      onClick={() => router.back()}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.06, boxShadow: "0 4px 32px 0 rgba(80,0,200,0.09)" }}
      className={clsx(
        "fixed top-5 left-5 z-50",
        "flex items-center gap-3 px-4 py-2",
        "rounded-full border border-violet-200",
        "bg-white/60 backdrop-blur-xl shadow-lg",
        "transition-all duration-200",
        "hover:bg-white/90 hover:border-violet-400",
        "active:scale-95 active:shadow-md",
        "focus:outline-none focus:ring-2 focus:ring-violet-400",
        "text-violet-700 font-semibold",
        className
      )}
      style={{
        boxShadow: "0 4px 32px 0 rgba(80,0,200,0.06)",
      }}
    >
      <motion.span
        initial={false}
        animate={{ x: 0 }}
        whileHover={{ x: -4 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="flex"
      >
        <FaArrowLeft className="w-5 h-5" />
      </motion.span>
      <span className="hidden sm:inline font-semibold tracking-wide">Retour</span>
    </motion.button>
  );
}
