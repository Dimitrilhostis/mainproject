// components/programs/ProgramsView.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Crown, CalendarDays } from "lucide-react";

import TabButton from "./tab_button";
import ProgrammeTab from "./program_tab";
import TodayTab from "./today_tab";
import ContentOverlay from "./content_overlay";

function ProgramsView() {
  const [tab, setTab] = useState("today"); // "programmes" | "today"
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overlayDay, setOverlayDay] = useState(null); // pour la mini-page full screen
  const router = useRouter();

  useEffect(() => {
    fetchPrograms();
  }, []);

  async function fetchPrograms() {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("programs")
        .select(
          "id, name, slug, objective, is_main, start_date, cycle_length, program_days(*)"
        )
        .order("is_main", { ascending: false }); // tri principal

      if (error) {
        console.error("Erreur Supabase:", error);
        setPrograms([]);
        setLoading(false);
        return;
      }

      if (data) {
        // on trie les jours en JS pour éviter les soucis de .order sur foreignTable
        const normalized = data.map((p) => ({
          ...p,
          program_days: (p.program_days || []).slice().sort((a, b) => {
            if (a.day_number == null || b.day_number == null) return 0;
            return a.day_number - b.day_number;
          }),
        }));
        setPrograms(normalized);
      } else {
        setPrograms([]);
      }
    } catch (err) {
      console.error("Erreur inattendue Supabase:", err);
      setPrograms([]);
    }

    setLoading(false);
  }

  function getTodayDay(program) {
    if (!program.start_date || !program.cycle_length || !program.program_days?.length) {
      return null;
    }

    const start = new Date(program.start_date);
    const today = new Date();

    start.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffMs = today.getTime() - start.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return null;

    const indexInCycle =
      ((diffDays % program.cycle_length) + program.cycle_length) %
      program.cycle_length;

    const dayNumber = indexInCycle + 1;

    return program.program_days.find((d) => d.day_number === dayNumber) || null;
  }

  const mainProgram = programs.find((p) => p.is_main) || null;
  const secondaryPrograms = programs.filter((p) => !p.is_main);

  function handleProgramClick(program) {
    if (!program.slug) return;
    router.push(`/programs/${program.slug}`);
  }

  // header "Today + date" / "Keep Going" / tabs
  const today = new Date();
  const dateLabel = today.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "short",
  });

  return (
    <>
      <div className="glass w-full h-[80vh] flex flex-col p-4 md:p-6 overflow-hidden">
        {/* Header aligné sur 3 colonnes */}
        <div className="mb-4 flex items-center justify-between gap-4">
          {/* Gauche : Today + date ou titre section */}
          <div className="min-w-0">
            {tab === "today" ? (
              <>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--green2)]">
                  Today
                </p>
                <p className="text-sm text-[var(--text2)]">{dateLabel}</p>
              </>
            ) : (
              <>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--green2)]">
                  Mes Programmes
                </p>
                <p className="text-sm text-[var(--text3)]">
                  Vue d&apos;ensemble sur tous tes cycles
                </p>
              </>
            )}
          </div>

          {/* Milieu : phrase motivation */}
          <div className="hidden sm:flex flex-col items-center min-w-0">
            <p className="text-2xl uppercase tracking-[0.25em] text-[var(--text3)]">
              {tab === "today" ? "Keep Going" : ""}
            </p>
          </div>

          {/* Droite : tabs icons */}
          <div className="flex items-center justify-end min-w-[120px]">
            <div className="relative flex items-center gap-1 bg-[var(--light-dark)]/60 p-1 rounded-full">
              {/* highlight glissant */}
              <div
                className={`
                  absolute top-1 bottom-1 rounded-full bg-[var(--text2)]
                  transition-all duration-300 ease-out
                `}
                style={{
                  left: tab === "programmes" ? "4px" : "calc(50% + 4px)",
                  width: "calc(50% - 8px)",
                }}
              />

              {/* boutons */}
              <TabButton
                icon={<CalendarDays size={18} strokeWidth={2.2} />}
                active={tab === "programmes"}
                onClick={() => setTab("programmes")}
              />
              <TabButton
                icon={<Crown size={18} strokeWidth={2.2} />}
                active={tab === "today"}
                onClick={() => setTab("today")}
              />
            </div>
          </div>
        </div>

        {/* Contenu scrollable, hauteur fixe */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {loading && (
            <div className="py-10 text-center text-sm text-[var(--text2)]">
              Chargement des programmes...
            </div>
          )}

          {!loading && programs.length === 0 && (
            <div className="py-10 text-center text-sm text-[var(--text2)]">
              Aucun programme n&apos;est encore configuré dans Supabase.
            </div>
          )}

          {!loading && programs.length > 0 && (
            <>
              {tab === "programmes" && (
                <ProgrammeTab
                  mainProgram={mainProgram}
                  secondaryPrograms={secondaryPrograms}
                  onProgramClick={handleProgramClick}
                />
              )}

              {tab === "today" && (
                <TodayTab
                  mainProgram={mainProgram}
                  secondaryPrograms={secondaryPrograms}
                  getTodayDay={getTodayDay}
                  onOpenOverlay={setOverlayDay}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Overlay full screen pour le contenu détaillé */}
      {overlayDay && (
        <ContentOverlay day={overlayDay} onClose={() => setOverlayDay(null)} />
      )}
    </>
  );
}

export default ProgramsView;
