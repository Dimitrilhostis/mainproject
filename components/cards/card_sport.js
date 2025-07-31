  "use client";

  import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { fadeVariants } from './card_variant';

export default function SportProfileCard({ item }) {
  const router = useRouter();
  const handleClick = () => router.push(`/programs/perso/${item.user_id}`);

  return (
    <motion.div
      className="bg-[var(--light-dark)] rounded-2xl shadow-lg p-6 flex flex-col cursor-pointer hover:shadow-xl transition"
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02 }}
      onClick={handleClick}
    >
      <h3 className="text-lg font-semibold text-[var(--green2)] mb-2">Mon programme Sport</h3>
      <p className="text-[var(--text2)] line-clamp-4 mb-4">{item.objectifs || 'Pas encore de profil sport.'}</p>
      <span className="mt-auto text-sm text-[var(--text3)]">Voir le détail</span>
    </motion.div>
  );
}

SportProfileCard.propTypes = {
  item: PropTypes.shape({
    user_id: PropTypes.string.isRequired,
    objectifs: PropTypes.string,
  }).isRequired,
};