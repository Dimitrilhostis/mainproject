// components/programs/ProgramDetailView.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import DayCard from "./day_card";

export default function ProgramDetailView({ slug }) {
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!slug) return;
    fetchProgram();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function fetchProgram() {
    setLoading(true);

    console.log("🔎 Fetch program with slug:", slug);

    const { data, error } = await supabase
      .from("programs")
      .select(
        "id, name, slug, objective, is_main, start_date, cycle_length, program_days(*)"
      )
      .eq("slug", slug) // 👉 si ta colonne a un autre nom, change ici
      .single();

    console.log("Supabase data:", data);
    console.log("Supabase error:", error);

    if (error) {
      console.error("Erreur Supabase:", error);
      setProgram(null);
      setLoading(false);
      return;
    }

    setProgram(data);
    setLoading(false);
  }

  return (
    <div className="glass w-full h-[80vh] flex flex-col p-4 md:p-6 overflow-hidden">
      {/* Header haut : retour + titre */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/programs")}
            className="rounded-full border border-[var(--details-dark)] bg-[var(--background)]/80 px-3 py-1 text-xs text-[var(--text2)] hover:bg-[var(--light-dark)]/80 transition"
          >
            ← Retour
          </button>
          <div>
            <h1 className="text-xl font-semibold text-[var(--text1)]">
              {program ? program.name : "Programme"}
            </h1>
            {program && (
              <p className="text-sm text-[var(--text2)]">
                Cycle de {program.cycle_length} jours
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Contenu scrollable */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {loading && (
          <div className="py-10 text-center text-sm text-[var(--text2)]">
            Chargement du programme...
          </div>
        )}

        {!loading && !program && (
          <div className="py-10 text-center text-sm text-[var(--text2)]">
            Programme introuvable pour le slug : <code>{slug}</code>
          </div>
        )}

        {!loading && program && (
          <div className="space-y-6">
            {/* Infos générales */}
            <section className="rounded-2xl border border-[var(--details-dark)] bg-[var(--background)]/85 p-4">
              {program.is_main && (
                <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-[var(--green2)]">
                  Programme principal
                </p>
              )}
              <h2 className="text-lg font-semibold text-[var(--text1)]">
                {program.name}
              </h2>
              {program.objective && (
                <p className="mt-1 text-sm text-[var(--text2)]">
                  {program.objective}
                </p>
              )}
              <p className="mt-2 text-xs text-[var(--text3)]">
                {program.start_date
                  ? `Début du cycle : ${new Date(
                      program.start_date
                    ).toLocaleDateString("fr-FR")}`
                  : "Date de début non définie"}
              </p>
            </section>

            {/* Jours du programme */}
            <section className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--text3)]">
                Jours du programme
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {program.program_days
                  ?.slice()
                  .sort((a, b) => a.day_number - b.day_number)
                  .map((day) => (
                    <DayCard key={day.id} day={day} compact={false} />
                  ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
