// Effets d'arrière-plan animés
import { motion } from "framer-motion";

export default function BackgroundEffects() {
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
  