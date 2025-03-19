// Composant des boutons animés
import { motion } from "framer-motion";
import Link from "next/link";

export default function AnimatedButton({ href, icon, text }) {
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