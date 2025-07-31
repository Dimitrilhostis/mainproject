import PropTypes from 'prop-types';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { fadeVariants } from './card_variant';

export default function ProgramCard({ program }) {
  const imgSrc = program.image.startsWith('/') ? program.image : `/${program.image}`;

  return (
    <Link href={`/programs/${program.uuid}`} passHref>
      <motion.a
        className="bg-[var(--light-dark)] rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transform hover:scale-105 transition"
        variants={fadeVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.02 }}
      >
        <div className="relative w-full h-48">
          <Image src={imgSrc} alt={program.title} fill className="object-cover" />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h2 className="text-lg font-semibold text-[var(--green2)] mb-1 truncate">{program.title}</h2>
          <p className="text-[var(--text2)] text-sm line-clamp-3 flex-grow">{program.short_description}</p>
          <div className="mt-4 flex justify-between text-xs text-[var(--text3)]">
            <span>{program.duration_weeks} sem.</span>
            <span>{Math.round(program.difficulty_rating)}/5</span>
          </div>
        </div>
      </motion.a>
    </Link>
  );
}

ProgramCard.propTypes = {
  program: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    short_description: PropTypes.string,
    image: PropTypes.string,
    duration_weeks: PropTypes.number,
    difficulty_rating: PropTypes.number,
  }).isRequired,
};

