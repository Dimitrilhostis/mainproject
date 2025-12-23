import Image from "next/image";

function ProgrammeTab({ mainProgram, secondaryPrograms, onProgramClick }) {
  return (
    <div className="space-y-4 pt-1.5">
      {/* Bloc principal (grand, cliquable) */}
      {mainProgram && (
        <button
          onClick={() => onProgramClick(mainProgram)}
          className="w-full text-left"
        >
          <div className="rounded-2xl border border-[var(--green2)]/30 bg-[var(--background)]/90 p-4 md:p-5 hover:border-[var(--green2)]/60 hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-[var(--text1)]">
              {mainProgram.name}
            </h2>
            {mainProgram.objective && (
              <p className="mt-1 text-sm text-[var(--text2)]">
                {mainProgram.objective}
              </p>
            )}
            <p className="mt-2 text-xs text-[var(--text3)]">
              Cycle de {mainProgram.cycle_length} jours · Cliquez pour voir les
              jours du programme
            </p>
          </div>
        </button>
      )}

      {/* Programmes secondaires (plus grands, avec image/énergie/temps) */}
      {secondaryPrograms.length > 0 && (
        <section className="space-y-3 pt-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--text3)]">
            Programmes secondaires
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {secondaryPrograms.map((program) => (
              <button
                key={program.id}
                onClick={() => onProgramClick(program)}
                className="text-left"
              >
                <div className="rounded-2xl border border-[var(--details-dark)] bg-[var(--background)]/90 p-3 hover:border-[var(--green2)]/50 hover:shadow-md transition flex gap-3">
                  {/* Image du programme (si tu ajoutes program.image_path ou le jour 1) */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[var(--details-dark)] shrink-0">
                    {/* fallback simple pour l’instant */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--green2)]/25 via-[var(--background)] to-[var(--background)]" />
                    <div className="absolute inset-0 flex items-center justify-center text-[11px] text-[var(--text2)] text-center px-2">
                      {program.name}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between min-w-0">
                    <div>
                      <p className="text-sm font-semibold text-[var(--text1)] truncate">
                        {program.name}
                      </p>
                      {program.objective && (
                        <p className="mt-1 text-xs text-[var(--text2)] line-clamp-2">
                          {program.objective}
                        </p>
                      )}
                    </div>
                    <p className="mt-1 text-[11px] text-[var(--text3)]">
                      Cycle de {program.cycle_length} jours
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProgrammeTab;
