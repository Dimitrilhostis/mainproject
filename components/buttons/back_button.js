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
      className={clsx(
        "fixed top-3 left-5 z-50",
        "flex items-center gap-3 px-4 py-2",
        "rounded-full border border-[var(--green1)]",
        "bg-[var(--background)] backdrop-blur-xl shadow-lg",
        "transition-all duration-200",
        "hover:bg-[var(--green1)] hover:text-[var(--background)] hover:border-[var(--green1)]",
        "active:scale-95 active:shadow-md",
        "focus:outline-none focus:ring-2 focus:ring-[var(--green1)]",
        "text-[var(--green1)] font-semibold",
        className
      )}
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
