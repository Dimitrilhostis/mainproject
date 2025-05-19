// components/BackButton.jsx
"use client";

import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";

export default function BackButton() {
  const router = useRouter();

  return (
    <motion.button
      onClick={() => router.back()}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="
        flex items-center space-x-2
        px-5 py-2
        bg-white bg-opacity-80
        backdrop-blur-sm
        text-gray-800
        rounded-2xl
        shadow-md shadow-gray-300/50
        hover:shadow-lg hover:bg-opacity-100
        focus:outline-none focus:ring-2 focus:ring-gray-400
        transition-all
      "
    >
      <FaArrowLeft className="w-5 h-5" />
      <span className="font-semibold">Retour</span>
    </motion.button>
  );
}
