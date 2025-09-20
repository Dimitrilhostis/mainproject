// components/details_modal.jsx
"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function DetailsModal({ book, onClose }) {
  const router = useRouter();

  // Échap + scroll lock
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  // On limite à 5 descriptions si présentes
  const descriptions = Array.isArray(book?.descriptions)
    ? book.descriptions.slice(0, 5)
    : null;

  const targetId = book?.id ?? book?.key ?? "";
  const goToBook = () => {
    if (book?.link) return router.push(book.link);
    if (targetId) return router.push(`/ebooks/${targetId}`);
    // Fallback : rien si pas d’ID/lien
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="details-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Fond + flou */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px]" />

      {/* Carte */}
      <div
        className="
          relative z-10 w-full max-w-5xl
          rounded-3xl border border-[var(--light-dark)]
          bg-[var(--background)] text-[var(--text1)]
          shadow-[0_10px_60px_rgba(0,0,0,0.5)]
          overflow-hidden
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-[var(--details-dark)]">
          <div>
            <p className="text-xs tracking-widest text-[var(--text3)] uppercase pb-2">E-book</p>
            <h3 id="details-title" className="text-2xl md:text-3xl font-extrabold">
              {book?.title}
            </h3>
          </div>
          <button
            className="rounded-full h-8 w-8 hover:bg-[var(--details-dark)] transition"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Body : 2 colonnes sur md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image large à gauche */}
          <div className="relative min-h-[260px] md:min-h-[380px]">
            {book?.img && (
              <Image
                src={book.img}
                alt={book?.title || "E-book"}
                fill
                className="object-cover"
                priority
              />
            )}
            {/* Légère surcouche dégradée pour le texte si besoin */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Détails à droite */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Descriptions (3 max) */}
            {descriptions ? (
              <ul className="space-y-4">
                {descriptions.map((d, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--green2)] shrink-0" />
                    <p className="text-[var(--text2)] leading-relaxed">{d}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[var(--text2)] leading-relaxed">
                {book?.desc}
              </p>
            )}

            {/* Méta (optionnel) */}
            {(book?.pages || book?.level) && (
              <div className="flex flex-wrap gap-3">
                {book?.pages && (
                  <span className="px-3 py-1 rounded-full text-sm bg-[var(--details-dark)] text-[var(--text2)]">
                    {book.pages} pages
                  </span>
                )}
                {book?.level && (
                  <span className="px-3 py-1 rounded-full text-sm bg-[var(--details-dark)] text-[var(--text2)]">
                    {book.level}
                  </span>
                )}
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                className="
                  inline-flex items-center justify-center
                  px-5 py-3 rounded-full font-semibold
                  bg-[var(--green2)] text-[var(--background)]
                  hover:bg-[var(--green3)] transition
                  shadow-[0_0_0_0_rgba(0,0,0,0)] hover:shadow-[0_8px_24px_rgba(34,197,94,0.25)]
                "
                onClick={goToBook}
              >
                Accéder au book
              </button>
            </div>

            {/* Liseré premium optionnel sous les boutons */}
            <div
              className="h-1 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, var(--premium-light), var(--premium), var(--premium-dark), var(--premium-light))",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
