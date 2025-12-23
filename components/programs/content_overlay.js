// components/programs/ContentOverlay.jsx
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
function buildDefaultExercises(day) {
  const baseTitle = day?.title || "Séance du jour";

  return [
    {
      id: "warmup",
      label: "Échauffement",
      title: `${baseTitle} — Warm-up`,
      type: "warmup",
    },
    {
      id: "exo1",
      label: "Exercice 1",
      title: `${baseTitle} — Exo 1`,
      type: "main",
    },
    {
      id: "exo2",
      label: "Exercice 2",
      title: `${baseTitle} — Exo 2`,
      type: "finisher",
    },
    {
      id: "exo3",
      label: "Exercice 3",
      title: `${baseTitle} — Exo 3`,
      type: "finisher",
    },
    {
        id: "exo3",
        label: "Exercice 3",
        title: `${baseTitle} — Exo 3`,
        type: "finisher",
      },
      {
        id: "exo3",
        label: "Exercice 3",
        title: `${baseTitle} — Exo 3`,
        type: "finisher",
      },
      {
        id: "exo3",
        label: "Exercice 3",
        title: `${baseTitle} — Exo 3`,
        type: "finisher",
      },
      {
        id: "exo3",
        label: "Exercice 3",
        title: `${baseTitle} — Exo 3`,
        type: "finisher",
      },
      {
        id: "exo3",
        label: "Exercice 3",
        title: `${baseTitle} — Exo 3`,
        type: "finisher",
      },
      {
        id: "exo3",
        label: "Exercice 3",
        title: `${baseTitle} — Exo 3`,
        type: "finisher",
      },
      {
        id: "exo3",
        label: "Exercice 3",
        title: `${baseTitle} — Exo 3`,
        type: "finisher",
      },
      {
        id: "exo3",
        label: "Exercice 3",
        title: `${baseTitle} — Exo 3`,
        type: "finisher",
      },
      {
        id: "exo3",
        label: "Exercice 3",
        title: `${baseTitle} — Exo 3`,
        type: "finisher",
      },
      {
        id: "exo3",
        label: "Exercice 3",
        title: `${baseTitle} — Exo 3`,
        type: "finisher",
      },
    {
      id: "finisher",
      label: "Finisher",
      title: `${baseTitle} — Finisher`,
      type: "finisher",
    },
  ];
}

function ContentOverlay({ day, onClose }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timelineHovered, setTimelineHovered] = useState(false);
    const [timelineProgress, setTimelineProgress] = useState(0);
    const timelineRef = useRef(null);
  
    // --- Barre de progression basée sur l'étape active ---
    useEffect(() => {
      if (!day) return;
  
      const totalSteps =
        day.exercises && day.exercises.length > 0
          ? day.exercises.length
          : buildDefaultExercises(day).length;
  
      if (totalSteps <= 1) {
        setTimelineProgress(0);
      } else {
        const progress = (currentIndex / (totalSteps - 1)) * 100;
        setTimelineProgress(progress);
      }
  
      // Scroll auto pour amener la bulle active au centre
      const el = timelineRef.current;
      if (el && el.children && el.children[currentIndex]) {
        const child = el.children[currentIndex];
        if (child && child.scrollIntoView) {
          child.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }
      }
    }, [currentIndex, day]);
  
    const handleTimelineMouseEnter = () => {
      setTimelineHovered(true);
    };
  
    const handleTimelineMouseLeave = () => {
      setTimelineHovered(false);
    };
  
    if (!day) return null;
  
    const exercises =
      (day.exercises && day.exercises.length > 0
        ? day.exercises
        : buildDefaultExercises(day)
      ).map((ex, index) => ({
        index,
        id: ex.id || `ex-${index}`,
        label: ex.label || `Exercice ${index + 1}`,
        title: ex.title || day.title || `Exercice ${index + 1}`,
        type: ex.type || "main",
      }));
  
    const active = exercises[currentIndex];
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === exercises.length - 1;
  
    const handleNext = () => {
      if (!isLast) {
        setCurrentIndex((i) => i + 1);
      } else {
        onClose && onClose();
      }
    };
  
    const handlePrev = () => {
      if (!isFirst) {
        setCurrentIndex((i) => i - 1);
      }
    };
  
    return (
        <div className="relative w-screen h-screen overflow-hidden">
          {/* Image de fond pleine page */}
          <Image
            src="/images/hero-bg.jpg"
            alt="Background"
            fill
            className="filter brightness-50 object-cover"
            priority
          />
      
          {/* Overlay sombre pour lisibilité */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      
          {/* Wrapper centré */}
          <div className="absolute inset-0 flex items-center justify-center px-3 sm:px-6">
            {/* Ligne : bouton gauche / bloc central / bouton droit */}
            <div className="absolute inset-0 flex items-stretch gap-2 px-2 py-6 sm:px-4">
              {/* Zone cliquable gauche = PRÉCÉDENT */}
              <button
                type="button"
                onClick={handlePrev}
                disabled={isFirst}
                className={`
                  h-full
                  flex flex-1 basis-0 items-center justify-center
                  rounded-2xl border border-transparent
                  text-3xl md:text-4xl
                  transition
                  ${isFirst
                    ? "cursor-not-allowed opacity-10"
                    : "cursor-pointer hover:bg-white/5 hover:border-white/10"}
                `}
              >
                {/* On laisse la flèche mais on la centre bien */}
                <span className="rotate-180 text-[var(--text2)]/50">
                  ➜
                </span>
              </button>
      
              {/* BLOC CENTRAL (plus large) */}
              <div className="glass flex-[4] basis-0 h-full flex flex-col relative overflow-hidden">
                {/* HEADER — Titre, jour, objectif */}
                <header className="px-4 pt-4 pb-2 md:px-6 md:pt-5 flex flex-col gap-2 border-b border-[var(--details-dark)]">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--green2)]">
                        Séance — Jour {day.day_number}
                      </p>
                      <h2 className="text-base md:text-lg font-semibold text-[var(--text1)]">
                        {day.title}
                      </h2>
                    </div>
      
                    <div className="text-right">
                      {day.objective_full && (
                        <p className="text-[11px] md:text-xs text-[var(--text2)] max-w-xs md:max-w-sm">
                          Objectif : {day.objective_full}
                        </p>
                      )}
                      <p className="text-[10px] text-[var(--text3)] mt-1">
                        {exercises.length} étapes ·{" "}
                        {day.duration_minutes != null
                          ? `~ ${day.duration_minutes} min`
                          : "Durée variable"}
                      </p>
                      <p className="text-[10px] text-[var(--text3)] mt-0.5">
                        Étape {currentIndex + 1} / {exercises.length}
                        {isLast ? " · Dernier bloc" : ""}
                      </p>
                    </div>
                  </div>
                </header>
      
                {/* CONTENU PRINCIPAL */}
                <div className="flex-1 px-4 pb-3 pt-3 md:px-6 md:pb-4 md:pt-4 grid gap-4 md:gap-5 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1.0fr)]">
                  {/* COLONNE GAUCHE : timeline + vision globale */}
                  <div className="flex flex-col gap-3 md:gap-4 min-w-0">
                    {/* Timeline horizontale des exercices */}
                    <section className="rounded-xl border border-[var(--details-dark)] bg-[var(--background)]/90 px-3 py-3">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text3)] mb-2">
                        Déroulé de la séance
                      </p>
      
                      {/* Wrapper pour timeline + barre */}
                      <div className="relative">
                        {/* Timeline scrollable */}
                        <div
                          ref={timelineRef}
                          onMouseEnter={handleTimelineMouseEnter}
                          onMouseLeave={handleTimelineMouseLeave}
                          className="
                            flex items-center gap-2 
                            overflow-x-auto 
                            no-native-scrollbar
                            pb-1
                          "
                        >
                          {exercises.map((ex) => {
                            const isActiveEx = ex.index === currentIndex;
                            const isDone = ex.index < currentIndex;
      
                            return (
                              <button
                                key={ex.id}
                                type="button"
                                onClick={() => setCurrentIndex(ex.index)}
                                className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg min-w-[72px] transition ${
                                  isActiveEx
                                    ? "bg-[var(--green2)]/15 border border-[var(--green2)]/70"
                                    : isDone
                                    ? "bg-[var(--light-dark)]/50 border border-[var(--details-dark)]"
                                    : "border border-[var(--details-dark)] hover:bg-[var(--light-dark)]/40"
                                }`}
                              >
                                <span
                                  className={`h-6 w-6 flex items-center justify-center rounded-full text-[11px] font-semibold ${
                                    isActiveEx
                                      ? "bg-[var(--green2)] text-[var(--background)]"
                                      : isDone
                                      ? "bg-[var(--text2)] text-[var(--background)]"
                                      : "bg-[var(--details-dark)] text-[var(--text2)]"
                                  }`}
                                >
                                  {ex.index + 1}
                                </span>
                                <span className="text-[9px] text-center text-[var(--text2)] leading-tight">
                                  {ex.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
      
                        {/* Barre de scroll custom en bas */}
                        <div
                          className="
                            mt-1 h-1 rounded-full 
                            bg-[var(--details-dark)]/40 
                            overflow-hidden 
                            transition-opacity duration-200
                          "
                          style={{ opacity: 1 }}
                        >
                          <div
                            className="h-full rounded-full bg-[var(--green2)] transition-[width] duration-150"
                            style={{ width: `${timelineProgress}%` }}
                          />
                        </div>
                      </div>
                    </section>
      
                    {/* Description rapide de l'exercice actif */}
                    <section className="rounded-xl border border-[var(--details-dark)] bg-[var(--background)]/90 p-3 md:p-4 flex-1">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text3)] mb-2">
                        Exercice {active.index + 1} : {active.label}
                      </p>
                      {/* Tu pourras ajouter ici du contenu spécifique par exercice */}
                    </section>
                  </div>
      
                  {/* COLONNE DROITE : exercice actif, démo / consignes etc. */}
                  <div className="flex flex-col gap-3 md:gap-4 min-w-0">
                    <section className="grid gap-3 md:grid-cols flex-1">
                      {/* Démo : image / vidéo */}
                      <div className="rounded-2xl border border-[var(--details-dark)] bg-[var(--background)]/90 flex items-center justify-center">
                        <div className="w-full h-full max-h-48 md:max-h-full flex items-center justify-center border border-dashed border-[var(--details-dark)] rounded-xl mx-3 my-3">
                          <p className="text-[11px] md:text-xs text-[var(--text3)] text-center px-4">
                            Zone démonstration : image ou vidéo de l&apos;exercice
                            (position de départ, mouvement complet, respiration).
                          </p>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
      
                {/* FOOTER — bouton Exit centré */}
                <div className="px-4 pb-3 pt-1 md:px-6 md:pb-4 flex justify-center">
                  <button
                    type="button"
                    onClick={onClose}
                    className="
                      px-5 py-1.5 rounded-full 
                      text-[11px] md:text-xs font-medium
                      border border-[var(--details-dark)]
                      text-[var(--text2)]
                      hover:bg-[var(--light-dark)]/60 hover:text-[var(--text1)]
                      transition
                    "
                  >
                    Exit
                  </button>
                </div>
              </div>
      
              {/* Zone cliquable droite = SUIVANT / TERMINER */}
              <button
                type="button"
                onClick={handleNext}
                className={`
                  h-full
                  flex flex-1 basis-0 items-center justify-center
                  rounded-2xl border border-transparent
                  text-3xl md:text-4xl
                  cursor-pointer transition
                  hover:bg-white/5 hover:border-white/10
                `}
              >
                <span className="text-[var(--text2)]/50">
                  {isLast ? "✓" : "➜"}
                </span>
              </button>
            </div>
          </div>
        </div>
      );      
  }
  
  export default ContentOverlay;