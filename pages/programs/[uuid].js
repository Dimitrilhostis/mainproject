import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import Image from "next/image";
import Layout from "@/components/layout";
import Loader from "@/components/loader";
import BackButton from "@/components/buttons/back_button";
import { motion, useScroll, useSpring } from "framer-motion";
import { FaStar } from "react-icons/fa";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getServerSideProps({ params }) {
  const { uuid } = params;
  const { data: program, error } = await supabase
    .from("programs")
    .select(
      "uuid, title, explaination, duration_weeks, difficulty_rating, is_published, image"
    )
    .eq("uuid", uuid)
    .single();

  if (error || !program) {
    return { notFound: true };
  }

  return { props: { program } };
}

export default function ProgramPage({ program }) {
  const router = useRouter();

  // Hooks must always be at the top
  const { scrollYProgress } = useScroll();
  const progressScale = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30
  });

  // Show loader while fallback
  if (router.isFallback || !program) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <Loader />
        </div>
      </Layout>
    );
  }

  // Prepare values
  const stars = Array.from({ length: 5 }).map((_, i) => (
    <FaStar
      key={i}
      className={
        i < Math.round(program.difficulty_rating)
          ? 'text-yellow-400'
          : 'text-gray-300'
      }
      size={24}
    />
  ));

  const imageUrl =
    program.image.startsWith('/') ? program.image : `/${program.image}`;

  return (
    <Layout>
      <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory">
        {/* Scroll Progress Bar */}
        <motion.div
          style={{ scaleX: progressScale }}
          className="fixed top-0 left-0 right-0 h-1 bg-blue-500 origin-left z-50"
        />

        {/* Back Button */}
        <div className="fixed top-4 left-4 z-50">
          <BackButton />
        </div>

        {/* Hero Section */}
        <section className="relative h-screen w-full snap-start">
          <Image
            src={imageUrl}
            alt={program.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/70" />
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center text-white px-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-6xl font-extrabold drop-shadow-xl">
              {program.title}
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-relaxed">
              {program.explaination.split('\n')[0]}
            </p>
            <motion.button
              onClick={() =>
                document
                  .getElementById('about-section')
                  .scrollIntoView({ behavior: 'smooth' })
              }
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-10 px-10 py-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-full text-white shadow-lg"
            >
              Découvrir la suite
            </motion.button>
          </motion.div>
        </section>

        {/* About Section */}
        <section
          id="about-section"
          className="flex h-screen w-full items-center justify-center bg-gray-50 snap-start"
        >
          <motion.div
            className="max-w-3xl mx-auto p-10 bg-white rounded-3xl shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              À propos de ce programme
            </h2>
            <p className="text-lg leading-relaxed text-gray-800 whitespace-pre-line">
              {program.explaination}
            </p>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-tr from-purple-500 to-pink-500 text-white snap-start">
          <motion.div
            className="grid w-full max-w-5xl grid-cols-1 gap-12 p-8 sm:grid-cols-3"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-col items-center">
              <span className="text-8xl font-extrabold">
                {program.duration_weeks}
              </span>
              <span className="mt-3 text-xl uppercase tracking-wide">
                Semaines
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex space-x-2">{stars}</div>
              <span className="mt-3 text-xl uppercase tracking-wide">
                Difficulté
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span
                className={`text-6xl font-bold ${
                  program.is_published ? 'text-green-300' : 'text-red-300'
                }`}
              >
                {program.is_published ? 'Publié' : 'Brouillon'}
              </span>
              <span className="mt-3 text-xl uppercase tracking-wide">
                Statut
              </span>
            </div>
          </motion.div>
          <motion.button
            onClick={() => alert('Prêt à démarrer !')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-12 px-12 py-4 rounded-full bg-white text-gray-800 shadow-lg"
          >
            Commencer maintenant
          </motion.button>
        </section>
      </div>
    </Layout>
  );
}
