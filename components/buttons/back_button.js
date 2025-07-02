// components/BackButton.jsx
"use client";

import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import clsx from "clsx"; // ou 'classnames' / 'tailwind-merge'

export default function BackButton({ className }) {
  const router = useRouter();

  return (
    <motion.button
      onClick={() => router.back()}
      whileTap={{ scale: 0.95 }}
      className={clsx(
        // Position fixe au-dessus de tout avec z-index élevé
        "fixed top-4 left-4 z-50",
        // Styles de base
        "flex items-center space-x-2",
        "px-5 py-2",
        "bg-gray-50 bg-opacity-80 backdrop-blur-sm hover:bg-white hover:border-1",
        "text-gray-800",
        "rounded-2xl",
        "shadow-md shadow-gray-300/50",
        "focus:outline-none focus:ring-2 focus:ring-gray-400",
        // Classes additionnelles passées depuis l'import
        className
      )}
    >
      <FaArrowLeft className="w-5 h-5" />
      <span className="font-semibold">Retour</span>
    </motion.button>
  );
}
