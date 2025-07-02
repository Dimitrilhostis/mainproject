// components/modals/DetailModal.jsx
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

const overlay = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };
const modal   = { hidden: { scale: 0.8, opacity: 0 }, visible: { scale: 1, opacity: 1 }, exit: { scale: 0.8, opacity: 0 } };

export default function DetailModal({ item, onClose, onSubClick }) {
  const [full, setFull] = useState(null);

  useEffect(() => {
    if (!item) {
      setFull(null);
      return;
    }
    async function load() {
      const result = { ...item };
      const ids = item.muscle_ids ?? [];
      if (ids.length) {
        const { data: muscles } = await supabase
          .from("muscles")
          .select("id,name,image_url,fonctions")
          .in("id", ids);
        result.muscles = muscles || [];
      } else {
        result.muscles = [];
      }
      setFull(result);
    }
    load();
  }, [item]);

  if (!item) return null;
  if (!full) return null;

  return createPortal(
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="overlay"
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        variants={overlay} initial="hidden" animate="visible" exit="exit"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        key="modal"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        variants={modal} initial="hidden" animate="visible" exit="exit"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden">

          {/* Header Image + Title */}
          <div className="relative h-56 bg-gray-100">
            {full.image_url && (
              <Image
                src={full.image_url}
                alt={full.name}
                fill
                className="object-cover"
              />
            )}
            <button
              onClick={e => { e.stopPropagation(); onClose(); }}
              className="absolute top-3 right-3 bg-white/75 p-1 rounded-full hover:bg-gray-400 hover:text-white"
            >
              <IoClose size={24} />
            </button>
            <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white px-4 py-1 rounded">
              <h2 className="text-xl font-bold">{full.name}</h2>
            </div>
          </div>

          {/* Quick Info Panel */}
          <div className="flex flex-wrap md:flex-nowrap bg-gray-50 p-4 border-b">
            <div className="flex-1 grid grid-cols-2 gap-4 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Durée :</span>
                <span>{full.duration_weeks} sem.</span>
              </div>
              {full.difficulty != null && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Difficulté :</span>
                  <span>{full.difficulty}/5</span>
                </div>
              )}
              {full.created_at && (
                <div className="flex items-center gap-2 col-span-2 md:col-span-1">
                  <span className="font-semibold">Créé le :</span>
                  <span>{new Date(full.created_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-6">
            {/* Description */}
            {full.description && (
              <section>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{full.description}</p>
              </section>
            )}

            <div className="flex-col columns-3">
                {/* Mouvements */}
                {full.mouvements && (
                <section>
                    <h3 className="text-lg font-semibold mb-2">Mouvements</h3>
                    <p className="text-gray-700">{full.mouvements}</p>
                </section>
                )}

                {/* Tips */}
                {full.tips && (
                <section>
                    <h3 className="text-lg font-semibold mb-2">Conseils</h3>
                    <p className="text-gray-700">{full.tips}</p>
                </section>
                )}

                {/* Variantes */}
                {full.variantes && (
                <section>
                    <h3 className="text-lg font-semibold mb-2">Variantes</h3>
                    <p className="text-gray-700">{full.variantes}</p>
                </section>
                )}
            </div>

            {/* Muscles ciblés */}
            {full.muscles.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold mb-2">Muscles ciblés</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {full.muscles.map(m => (
                    <div
                      key={m.id}
                      onClick={() => onSubClick?.(m)}
                      className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg shadow cursor-pointer hover:bg-gray-100"
                    >
                      {m.image_url && (
                        <Image
                          src={m.image_url}
                          alt={m.name}
                          width={48}
                          height={48}
                          className="rounded object-cover"
                        />
                      )}
                      <span className="font-medium">{m.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Vidéo */}
            {full.video_url && (
              <section>
                <h3 className="text-lg font-semibold mb-2">Démonstration</h3>
                <video
                  controls
                  poster={full.image_url}
                  className="w-full rounded-lg shadow-lg"
                >
                  <source src={full.video_url} type="video/mp4" />
                  Votre navigateur ne supporte pas la vidéo.
                </video>
              </section>
            )}

            {/* Nouveau bouton de navigation */}
            {link && (
              <div className="mt-4 text-right">
                <Link href={link}>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
                    Aller à la page associée
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
