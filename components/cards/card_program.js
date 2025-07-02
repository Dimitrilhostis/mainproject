import PropTypes from 'prop-types';
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

// Réutilise la même animation de fade
const fadeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

/**
 * Composant ProgramCard
 * @param {{ program: { uuid: string, title: string, short_description: string, image: string, duration_weeks: number, difficulty_rating: number } }} props
 */
export default function ProgramCard({ program }) {
  const imgSrc = program.image.startsWith("/")
    ? program.image
    : `/${program.image}`;

  return (
    <Link href={`/programs/${program.uuid}`} passHref legacyBehavior>
      <motion.a
        className=" bg-white group relative block overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all"
        variants={fadeVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <div className="relative w-full h-64 rounded-t-2xl overflow-hidden">
          <Image
            src={imgSrc}
            alt={program.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-5 bg-white rounded-b-2xl flex flex-col justify-between h-auto">
          <h2 className="text-2xl font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
            {program.title}
          </h2>
          <p className="mt-2 text-gray-600 text-base line-clamp-3">
            {program.short_description}
          </p>
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <span>{program.duration_weeks} sem.</span>
            <span>{program.difficulty_rating}/5</span>
          </div>
        </div>
      </motion.a>
    </Link>
  );
}

ProgramCard.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  category: PropTypes.string,
};

/**
 * CardSpecial: carte spéciale
 */
export function CardSpecial({ title, content, extra, category }) {
  return (
    <div className="w-80 rounded-lg shadow-xl bg-white flex flex-col transform transition-transform duration-200 hover:scale-105">
      <div className="p-6 flex-grow">
        <h2 className="text-xl font-bold text-gray-800 mb-4 truncate">{title}</h2>
        <p className="text-gray-700 text-base overflow-auto">{content}</p>
      </div>
      {extra && (
        <div className="px-6 py-2 bg-gray-100">
          <span className="text-xs uppercase font-bold text-gray-700">{extra}</span>
        </div>
      )}
    </div>
  );
}

CardSpecial.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  extra: PropTypes.string,
  category: PropTypes.string
};
