"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/layout";
import Header from "@/components/header";
import { CATALOG } from "@/components/catalog/e-books";
import BackButton from "@/components/buttons/back_button";
import { Feature, Gallery, PagesPreview, Tabs, RecommendationsPanel } from "@/lib/ebook_functions";

/**
 * Page de vente d'e‑book (focus conversion)
 * Dossier (App Router): app/ebooks/[uuid]/page.jsx
 *
 * Principles:
 * - Layout en deux colonnes: gauche = contenu, droite = carte d'achat sticky
 * - Multiplication des CTA (haut, sticky mobile, fin de page)
 * - Preuve sociale, garanties, FAQ
 * - Esthétique "payment page" minimaliste, non centré
 */




export default function EbookSalesPage() {
  const params = useParams();
  const router = useRouter();
  const uuid = Array.isArray(params?.uuid) ? params.uuid[0] : params?.uuid;

  const book = useMemo(() => CATALOG[uuid], [uuid]);
  const [tab, setTab] = useState("about");
  const [qty, setQty] = useState(1);

  if (!book) {
    return (
      <Layout>
    <Header />
        <main className="min-h-screen w-full flex items-center justify-center bg-[var(--background)] px-6">
          <div className="max-w-lg w-full text-left px-6 py-8 rounded-3xl border border-[var(--text3)]/20 shadow-xl bg-[var(--details-dark)]">
            <h1 className="text-2xl font-bold text-[var(--text1)] mb-2">E‑book introuvable</h1>
            <p className="text-[var(--text2)] mb-6">Le lien est invalide ou l&apos;e‑book a été déplacé.</p>
            <button
              onClick={() => router.push("/ebooks")}
              className="px-4 py-2 rounded-full bg-[var(--green2)] text-[var(--background)] hover:bg-[var(--green3)]"
            >
              Revenir aux e‑books
            </button>
          </div>
        </main>
      </Layout>
    );
  }

  const isFree = !book.price || book.price === 0;

  const addToCart = () => {
    console.log("ADD_TO_CART", { id: book.uuid, qty });
    alert(`${book.title} ajouté au panier (x${qty}).`);
  };

  const buyNow = () => {
    console.log("BUY_NOW", { id: book.uuid, qty });
    alert("Redirection vers le paiement… (à brancher)");
  };

  return (
    <Layout>
      <Header scroll_x={0} time_s={0} />

      <main className="w-full bg-[var(--background)]">
        {/* container */}
        <section className="mx-auto max-w-7xl px-4 md:px-6 pt-24 pb-20 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr),420px,1fr] gap-8">
        {/* BackButton PROVISOIRE ! */}
            <BackButton></BackButton>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start pr-2 xl:pr-4">
            
            {/* Left: content */}
            <div className="space-y-8">
              {/* Hero row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="flex flex-col justify-center">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text1)] tracking-tight">{book.title}</h1>
                  {book.subtitle && (
                    <p className="mt-2 text-lg text-[var(--text2)] max-w-prose">{book.subtitle}</p>
                  )}
                  <p className="mt-4 text-[var(--text2)] max-w-prose">{book.desc}</p>

                  {book.features?.length > 0 && (
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {book.features.map((f, i) => (
                        <Feature key={i}>{f}</Feature>
                      ))}
                    </div>
                  )}

                  {/* mini trust */}
                  <div className="mt-6 flex flex-wrap items-left gap-3 text-xs text-[var(--text3)]">
                    <span>✔️ Accès à vie</span>
                    <span>✔️ Mises à jour incluses</span>
                    <span>✔️ Support e‑mail</span>
                  </div>
                </div>
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-[var(--text3)]/20 bg-[var(--details-dark)]">
                  <Image src={book.cover} alt={book.title} fill className="object-cover" />
                </div>
              </div>

              

              {/* Tabs content */}
              <div className="">
                <Tabs value={tab} onChange={setTab} />
                <div className="pt-6">
                  <AnimatePresence mode="wait">
                    {tab === "about" && (
                      <motion.div
                        key="tab-about"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] gap-6"
                      >
                        <div className="rounded-3xl border border-[var(--text3)]/20 p-4 md:p-5 bg-[var(--details-dark)]">
                          <h2 className="text-xl font-bold text-[var(--text1)] mb-2">Ce que tu vas obtenir</h2>
                          <p className="text-[var(--text2)] leading-relaxed">{book.desc}</p>
                          {book.features?.length > 0 && (
                            <div className="mt-4 space-y-2">
                              {book.features.map((f, i) => (
                                <Feature key={`f2-${i}`}>{f}</Feature>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="rounded-3xl border border-[var(--text3)]/20 p-4 md:p-5 bg-[var(--details-dark)]">
                          <h3 className="text-lg font-semibold text-[var(--text1)] mb-3">Galerie</h3>
                          <Gallery images={book.gallery} />
                        </div>
                      </motion.div>
                    )}

                    {tab === "previews" && (
                      <motion.div
                        key="tab-previews"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="rounded-3xl border border-[var(--text3)]/20 p-4 md:p-5 bg-[var(--details-dark)]"
                      >
                        <h2 className="text-xl font-bold text-[var(--text1)] mb-4">Extraits (pages)</h2>
                        <PagesPreview pages={book.pagesPreview} />
                      </motion.div>
                    )}

                    {tab === "details" && (
                      <motion.div
                        key="tab-details"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        <div className="rounded-3xl border border-[var(--text3)]/20 p-4 md:p-5 bg-[var(--details-dark)]">
                          <h3 className="text-lg font-semibold text-[var(--text1)] mb-2">À qui s&apos;adresse cet e‑book ?</h3>
                          <ul className="space-y-2 text-[var(--text2)]">
                            <li>• Débutants qui veulent un plan clair</li>
                            <li>• Intermédiaires qui stagnent</li>
                            <li>• Pros qui veulent optimiser</li>
                          </ul>
                        </div>
                        <div className="rounded-3xl border border-[var(--text3)]/20 p-4 md:p-5 bg-[var(--details-dark)]">
                          <h3 className="text-lg font-semibold text-[var(--text1)] mb-2">Ce que tu vas maîtriser</h3>
                          <ul className="space-y-2 text-[var(--text2)]">
                            <li>• Méthode simple & actionnable</li>
                            <li>• Structure et constance</li>
                            <li>• Mise en pratique immédiate</li>
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Social proof */}
              <div className="rounded-3xl border border-[var(--text3)]/20 p-4 md:p-5 bg-[var(--details-dark)]">
                <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
                  <div className="text-[var(--text2)]">Plus de <span className="text-[var(--text1)] font-semibold">1 000+</span> lecteurs satisfaits</div>
                  <div className="flex items-center gap-2 text-sm text-[var(--text2)]">
                    <span>★★★★★</span>
                    <span className="text-[var(--text3)]">(note moyenne 4.8/5)</span>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="rounded-3xl border border-[var(--text3)]/20 bg-[var(--details-dark)]">
                <div className="p-4 md:p-6">
                  <h3 className="text-lg font-semibold text-[var(--text1)] mb-4">Questions fréquentes</h3>
                  <div className="divide-y divide-[var(--text3)]/15">
                    {[
                      { q: "Comment j'y accède après achat ?", a: "Tu reçois un e‑mail avec le lien. Tu peux aussi l'ouvrir depuis ta bibliothèque sur le site." },
                      { q: "C'est mis à jour ?", a: "Oui, les mises à jour sont incluses sans coût supplémentaire." },
                      { q: "Et si ce n'est pas pour moi ?", a: "Écris‑nous sous 14 jours: on trouve une solution (échange, avoir, ou remboursement selon le cas)." },
                    ].map((item, i) => (
                      <details key={i} className="group">
                        <summary className="cursor-pointer list-none py-3 flex items-center justify-between text-[var(--text2)] hover:text-[var(--text1)]">
                          {item.q}
                          <span className="text-[var(--text3)] group-open:rotate-180 transition">⌄</span>
                        </summary>
                        <p className="pb-3 text-[var(--text3)]">{item.a}</p>
                      </details>
                    ))}
                  </div>
                </div>
              </div>
            </div>



{/* Right panel — FIXED, centré sur le container, avec vide à l’extrême droite */}
<div
  className="hidden lg:block fixed top-24 bottom-6 z-40"
  style={{
    right: "clamp(16px, calc((100vw - 72rem) / 2 + var(--aside-inset, 64px)), 20vw)",
    width: "min(420px, 90vw)",
  }}
>
    <div
        className="h-full grid gap-4 pointer-events-auto"
        style={{ gridTemplateRows: "1fr 2fr" }}
    >    
    {/* Carte d'achat — plus aérée */}
    <div className="min-h-0 overflow-auto rounded-3xl border border-[var(--text3)]/20 bg-[var(--details-dark)] p-7 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-[var(--text3)]">
          {book.tier === "premium" ? "E-book Premium" : "E-book"}
        </div>
        {book.tier === "premium" && (
          <span
            className="text-xs font-extrabold text-transparent bg-clip-text premium-text-animated"
            style={{ backgroundSize: "200% 100%" }}
          >
            Premium
          </span>
        )}
      </div>

      <h2 className="text-xl font-bold text-[var(--text1)] leading-tight">{book.title}</h2>

      <div className="mt-5 flex items-end gap-3">
        <div className="text-3xl font-extrabold text-[var(--text1)]">
          {isFree ? <span>Gratuit</span> : <span>{book.price.toFixed(2)}€</span>}
        </div>
        {!isFree && <span className="text-sm text-[var(--text3)]">Paiement unique</span>}
      </div>

      {!isFree && (
        <div className="mt-5 flex items-center gap-3">
          <label className="text-sm text-[var(--text2)]">Quantité</label>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || "1", 10)))}
            className="no-spinner w-24 rounded-xl border border-[var(--text3)]/30 bg-transparent px-3 py-2 text-[var(--text1)]"
          />
        </div>
      )}

      <div className="mt-6 space-y-3" id="purchase">
        <button
          onClick={isFree ? addToCart : buyNow}
          className="w-full px-4 py-3 rounded-2xl bg-[var(--green1)] text-[var(--background)] hover:bg-[var(--green2)] font-semibold"
        >
          {isFree ? "Ajouter à ma bibliothèque" : "Acheter maintenant"}
        </button>
        {!isFree && (
          <button
            onClick={addToCart}
            className="w-full px-4 py-3 rounded-2xl border border-[var(--green2)] text-[var(--green2)] hover:bg-[var(--light-dark)]"
          >
            Ajouter au panier
          </button>
        )}
      </div>

      <div className="mt-6 text-xs text-[var(--text3)]">
        Paiement chiffré • Accès instantané • Reçus par e-mail
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 text-[var(--text3)] text-[10px]">
        <div className="rounded-xl border border-[var(--text3)]/20 py-2 text-center">Visa</div>
        <div className="rounded-xl border border-[var(--text3)]/20 py-2 text-center">Mastercard</div>
        <div className="rounded-xl border border-[var(--text3)]/20 py-2 text-center">PayPal</div>
      </div>
    </div>


    {/* Recommandations — scroll vertical discret + 2 colonnes Premium | Free */}
    <div className="min-h-0 rounded-3xl border border-[var(--text3)]/20 bg-[var(--details-dark)] p-3 overflow-hidden">
      <RecommendationsPanel currentUuid={uuid} fill />
    </div>


  </div>
</div>


        
          </div>

          </section>
      </main>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-3 left-3 right-3 z-[60] lg:hidden">
        <div className="flex items-center gap-3 rounded-2xl border border-[var(--text3)]/20 bg-[var(--details-dark)]/90 backdrop-blur px-3 py-3 shadow-2xl">
          <div className="flex-1 text-xs text-[var(--text2)]">
            <div className="font-semibold text-[var(--text1)] truncate">{book.title}</div>
            <div>{isFree ? "Gratuit" : `${book.price.toFixed(2)}€`}</div>
          </div>
          <button
            onClick={isFree ? addToCart : buyNow}
            className="px-4 py-2 rounded-xl bg-[var(--green2)] text-[var(--background)] hover:bg-[var(--green3)] text-sm font-medium"
          >
            {isFree ? "Obtenir" : "Acheter"}
          </button>
        </div>
      </div>
    </Layout>
  );
}