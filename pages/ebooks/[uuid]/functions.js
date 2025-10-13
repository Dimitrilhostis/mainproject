import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CATALOG } from "@/components/catalog/e-books";
import { useEffect, useRef, useState } from "react";


export function Feature({ children }) {
    return (
      <div className="flex items-start gap-2 text-[var(--text2)]">
        <span className="mt-1 inline-block h-2 w-2 rounded-full bg-[var(--green2)]" />
        <span>{children}</span>
      </div>
    );
  }
  
  export function Gallery({ images }) {
    if (!images?.length) return null;
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((src, i) => (
          <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--text3)]/15">
            <Image src={src} alt={`gallery-${i}`} fill className="object-cover" />
          </div>
        ))}
      </div>
    );
  }
  
  export function PagesPreview({ pages }) {
    if (!pages?.length) return null;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map((p) => (
          <div key={p.n} className="relative rounded-2xl overflow-hidden border border-[var(--text3)]/15 bg-[var(--details-dark)]">
            <div className="relative aspect-[3/4]">
              <Image src={p.src} alt={`page-${p.n}`} fill className="object-cover" />
            </div>
            <div className="px-3 py-2 text-sm text-[var(--text2)]">Page {p.n}</div>
          </div>
        ))}
      </div>
    );
  }
  
  export function Tabs({ value, onChange }) {
    const items = [
      { key: "about", label: "Présentation" },
      { key: "previews", label: "Extraits" },
      { key: "details", label: "Détails" },
    ];
    return (
      <div className="w-full flex gap-1 md:gap-2 border-b border-[var(--text3)]/20">
        {items.map((it) => (
          <button
            key={it.key}
            onClick={() => onChange(it.key)}
            className={`relative px-3 py-2 rounded-t-xl transition text-sm md:text-base font-medium ${
              value === it.key
                ? "bg-[var(--details-dark)] text-[var(--text1)]"
                : "text-[var(--text2)] hover:text-[var(--text1)]"
            }`}
          >
            {it.label}
            {value === it.key && (
              <motion.div
                layoutId="tab-underline"
                className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[var(--green2)]"
              />
            )}
          </button>
        ))}
      </div>
    );
  }


export function useContainerSize() {
  const ref = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ro = new ResizeObserver(([entry]) => {
      const cr = entry.contentRect;
      setSize({ w: cr.width, h: cr.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, ...size };
}

  
  export function EbookCardMini({ b }) {
      const isFree = !b.price || b.price === 0;
      const href = `/ebooks/${b.uuid}`;
    
      return (
        <Link
          href={href}
          className="snap-start shrink-0 w-56 rounded-2xl border border-[var(--text3)]/20 overflow-hidden hover:border-[var(--text3)]/40 transition bg-[var(--details-dark)]"
        >
          <div className="relative aspect-[3/4]">
            <Image src={b.cover} alt={b.title} fill className="object-cover" />
            {b.tier === "premium" && (
              <span
                className="absolute top-2 left-2 z-10 px-2 py-1 rounded-full text-xs font-bold text-[var(--background)]"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, var(--premium-light), var(--premium), var(--premium-dark))",
                }}
              >
                Premium
              </span>
            )}
          </div>
          <div className="p-3">
            <div className="text-sm font-semibold text-[var(--text1)] line-clamp-2">{b.title}</div>
            <div className="mt-1 text-xs text-[var(--text3)] line-clamp-1">{b.subtitle}</div>
            <div className="mt-2 text-sm font-bold">
              {isFree ? (
                <span className="text-[var(--green2)]">Gratuit</span>
              ) : (
                <span className="text-[var(--text1)]">{b.price.toFixed(2)}€</span>
              )}
            </div>
          </div>
        </Link>
      );
    }
    
    export function EbookRail2Rows({ books }) {
      return (
        <div
          className="relative overflow-x-auto overflow-y-hidden pb-2"
          // pas de height calc ici → on laisse le contenu faire sa hauteur
          style={{
            '--tile-w': '10rem',     // ajuste cette largeur
            '--gap': '0.75rem',      // gap-3
          }}
        >
          {/* 2 rangées, colonnes qui s’écoulent à l’horizontale */}
          <div className="grid grid-flow-col auto-cols-max grid-rows-2 gap-[var(--gap)] pr-2 snap-x snap-mandatory">
            {books.map((b) => (
              <EbookTileMini key={b.uuid} b={b} />
            ))}
          </div>
        </div>
      );
    }
    
    
  
  
    export function EbookTileMini({ b, mode = "coverTitle" }) {
        // mode: "text" | "cover" | "coverTitle"
        const isFree = !b.price || b.price === 0;
      
        if (mode === "text") {
          return (
            <Link href={`/ebooks/${b.uuid}`} title={b.title}
              className="snap-start shrink-0 max-w-[16rem] rounded-full border border-[var(--text3)]/25 px-3 py-1.5 text-xs font-medium text-[var(--text1)] bg-[var(--details-dark)] hover:border-[var(--text3)]/40 whitespace-nowrap">
              {b.title}
            </Link>
          );
        }
      
        return (
          <Link href={`/ebooks/${b.uuid}`} title={b.title}
                className="snap-start shrink-0 w-[var(--tile-w)]">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-[var(--text3)]/20 bg-[var(--light-dark)] hover:border-[var(--text3)]/40 transition">
              <Image src={b.cover} alt={b.title} fill className="object-cover" />
      
              {b.tier === "premium" && (
                <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full text-[var(--background)]"
                      style={{ backgroundImage: "linear-gradient(90deg,#ffffff,#f2f2f2)" /* blanc→gris clair */ }}>
                  Premium
                </span>
              )}
              {b.tier === "free" && (
                <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full text-[var(--background)]"
                      style={{ backgroundImage: "var(--neutral-gradient)" }}>
                  Free
                </span>
              )}
      
              {mode === "coverTitle" && (
                <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-[var(--details-dark)]/95 via-[var(--details-dark)]/60 to-transparent">
                  <div className="text-[13px] leading-snug font-semibold text-[var(--text1)] line-clamp-2">{b.title}</div>
                  <div className="mt-1 text-[12px] font-bold">
                    {isFree ? <span className="text-[var(--green2)]">Free</span>
                            : <span className="text-[var(--premium)]">{b.price.toFixed(2)}€</span>}
                  </div>
                </div>
              )}
            </div>
          </Link>
        );
      }

      
      export function BottomRightEbooksDock({ currentUuid }) {
        const all = Object.values(CATALOG || {});
        const books = all.filter((b) => b?.uuid !== currentUuid);
      
        // TRI simple : premium d'abord puis free
        const premium = books.filter(b => b?.tier === "premium");
        const free = books.filter(b => !b?.price || b?.price === 0);
        const ordered = [...premium, ...free];
      
        // Zone fixe bas-droite
        // - pointer-events: wrapper none + contenu auto => n’obstrue pas la page
        // - width/height clamp => jamais trop grand ni trop petit
        return (
          <div
            className="hidden lg:block fixed z-50 pointer-events-none"
            style={{
              bottom: "16px",
              right: "clamp(12px, calc((100vw - 72rem) / 2 + 24px), 5vw)",
              width: "clamp(260px, 28vw, 420px)",
              height: "clamp(120px, 30vh, 360px)",
            }}
          >
            <AdaptiveRail books={ordered} />
          </div>
        );
      }
      
      function AdaptiveRail({ books }) {
        const { ref, w, h } = useContainerSize();
      
        // Choix de mode d’affichage selon l’espace interne
        // seuils empiriques mais robustes
        const mode = (function () {
          if (h < 140 || w < 260) return "text";          // très compact: puces titres
          if (h < 220 || w < 320) return "cover";         // moyen: covers seules
          return "coverTitle";                             // confortable: cover + titre + prix
        })();
      
        // Taille des tuiles selon mode
        const tileW = mode === "coverTitle" ? "10.5rem" : mode === "cover" ? "9rem" : "auto";
      
        return (
          <div
            ref={ref}
            className="h-full w-full pointer-events-auto rounded-3xl border border-[var(--text3)]/20 bg-[var(--details-dark)] shadow-xl overflow-hidden flex flex-col"
          >
            {/* Header compact */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--text3)]/15">
              <div className="text-xs font-semibold text-[var(--text2)]">E-books disponibles</div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-10 rounded-full" style={{ backgroundImage: "linear-gradient(90deg,#ffffff,#f2f2f2)" }} />
                <span className="inline-block h-1.5 w-10 rounded-full" style={{ backgroundImage: "var(--neutral-gradient)" }} />
              </div>
            </div>
      
            {/* Contenu scrollable H (et jamais masqué) */}
            <div
              className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide"
              style={{ ['--tile-w']: tileW }}
            >
              {mode === "text" ? (
                <div className="h-full flex items-center gap-2 px-3 py-2 snap-x snap-mandatory">
                  {books.map(b => (
                    <EbookTileMini key={b.uuid} b={b} mode="text" />
                  ))}
                </div>
              ) : (
                // 2 rangées en mode cover/coverTitle si la hauteur le permet
                <div
                  className={`grid grid-flow-col auto-cols-max gap-3 p-3 snap-x snap-mandatory ${
                    h >= 260 ? "grid-rows-2" : "grid-rows-1"
                  }`}
                >
                  {books.map(b => (
                    <EbookTileMini key={b.uuid} b={b} mode={mode} />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      }
   
    
    
    
    
    
    
      export function RecommendationsPanel({ currentUuid, fill = false }) {
        const all = Object.values(CATALOG || {});
        const premium = all.filter((b) => b?.tier === "premium" && b?.uuid !== currentUuid);
        const free = all.filter((b) => (!b?.price || b?.price === 0) && b?.uuid !== currentUuid);
      
        if (!premium.length && !free.length) return null;
      
        // largeur tuile: assez petite pour rentrer dans une demi-hauteur, assez grande pour rester lisible
        const tileWidth = "clamp(7rem, 24vw, 9.5rem)";
      
        if (!fill) {
          // ---- mode classique (fallback si jamais) ----
          return (
            <div className="flex flex-col gap-5 overflow-hidden">
              {/* Premium */}
              <div className="min-h-0">
                <div className="mb-2.5 flex items-center justify-between">
                  <div className="h-1.5 w-15 rounded-full animate-scroll" style={{ backgroundImage: "var(--premium-gradient)" }} />
                  <h4 className="text-sm font-semibold text-[var(--premium)]">E-books Premium</h4>
                  <div className="h-1.5 w-15 rounded-full animate-scroll" style={{ backgroundImage: "var(--premium-gradient)" }} />
                </div>
                <div
                  className="overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory"
                  style={{ scrollPadding: "0.75rem", scrollbarGutter: "stable", ['--tile-w']: tileWidth }}
                >
                  <div className="grid grid-flow-col auto-cols-[var(--tile-w)] gap-3 p-3 pe-4">
                    {premium.map((b) => <EbookTileMini key={b.uuid} b={b} />)}
                  </div>
                </div>
              </div>
      
              {/* Free */}
              <div className="min-h-0">
                <div className="mb-2.5 flex items-center justify-between">
                  <div className="h-1.5 w-15 rounded-full animate-scroll" style={{ backgroundImage: "var(--neutral-gradient)" }} />
                  <h4 className="text-sm font-semibold text-[var(--text1)]">Free E-books</h4>
                  <div className="h-1.5 w-15 rounded-full animate-scroll" style={{ backgroundImage: "var(--neutral-gradient)" }} />
                </div>
                <div
                  className="overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory"
                  style={{ scrollPadding: "0.75rem", scrollbarGutter: "stable", ['--tile-w']: tileWidth }}
                >
                  <div className="grid grid-flow-col auto-cols-[var(--tile-w)] gap-3 p-3 pe-4">
                    {free.map((b) => <EbookTileMini key={b.uuid} b={b} />)}
                  </div>
                </div>
              </div>
            </div>
          );
        }
      
        // ---- mode fill (2/3 de la colonne) : 2 rangées qui se partagent EXACTEMENT la hauteur ----
        return (
          <div className="h-full flex flex-col gap-3 overflow-hidden">
            {/* Rangée Premium (1/2 de la hauteur dispo) */}
            <div className="flex-1 min-h-0 flex flex-col">
              <div className="flex items-center justify-between px-1 pb-2">
                <div className="h-1.5 w-15 rounded-full animate-scroll" style={{ backgroundImage: "var(--premium-gradient)" }} />
                <h4 className="text-sm font-semibold text-[var(--premium)]">E-books Premium</h4>
                <div className="h-1.5 w-15 rounded-full animate-scroll" style={{ backgroundImage: "var(--premium-gradient)" }} />
              </div>
              <div
                className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory"
                style={{ scrollPadding: "0.5rem", scrollbarGutter: "stable", ['--tile-w']: tileWidth }}
              >
                <div className="grid grid-flow-col auto-cols-[var(--tile-w)] gap-3 p-2 pe-4">
                  {premium.map((b) => <EbookTileMini key={b.uuid} b={b} />)}
                </div>
              </div>
            </div>
      
            {/* Rangée Free (1/2 de la hauteur dispo) */}
            <div className="flex-1 min-h-0 flex flex-col">
              <div className="flex items-center justify-between px-1 pb-2">
                <div className="h-1.5 w-15 rounded-full animate-scroll" style={{ backgroundImage: "var(--neutral-gradient)" }} />
                <h4 className="text-sm font-semibold text-[var(--text1)]">Free E-books</h4>
                <div className="h-1.5 w-15 rounded-full animate-scroll" style={{ backgroundImage: "var(--neutral-gradient)" }} />
              </div>
              <div
                className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory"
                style={{ scrollPadding: "0.5rem", scrollbarGutter: "stable", ['--tile-w']: tileWidth }}
              >
                <div className="grid grid-flow-col auto-cols-[var(--tile-w)] gap-3 p-2 pe-4">
                  {free.map((b) => <EbookTileMini key={b.uuid} b={b} />)}
                </div>
              </div>
            </div>
          </div>
        );
      }
      