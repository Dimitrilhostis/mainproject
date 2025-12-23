// components/programs/DayCard.jsx
"use client";

export default function DayCard({ day, compact, hideTitle }) {
  const energy = day.energy || 0;
  const duration =
    day.duration_minutes != null ? day.duration_minutes : null;

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border border-[var(--details-dark)] bg-[var(--background)]/90 backdrop-blur ${
        compact ? "p-3" : "p-4"
      }`}
    >
      {/* Image */}
      {day.image_path && (
        <div className="mb-3 h-32 overflow-hidden rounded-xl bg-black/40">
          <img
            src={day.image_path}
            alt={day.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Titre */}
      {!hideTitle && (
        <h3
          className={`font-semibold text-[var(--text1)] ${
            compact ? "text-sm" : "text-base"
          }`}
        >
          Jour {day.day_number} — {day.title}
        </h3>
      )}

      {day.objective_short && (
        <p className="mt-1 text-xs text-[var(--text2)]">
          {day.objective_short}
        </p>
      )}

      {/* Énergie + durée */}
      <div className="mt-2 flex items-center justify-between text-xs text-[var(--text3)]">
        <div className="flex items-center gap-1">
          <span className="text-[10px] uppercase tracking-[0.2em]">
            Energy
          </span>
          <span className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={i < energy ? "opacity-100" : "opacity-25"}
              >
                ⚡
              </span>
            ))}
          </span>
        </div>
        {duration !== null && (
          <div className="text-xs">~ {duration} min</div>
        )}
      </div>

      {/* Contenu */}
      {day.content && (
        <p
          className={`mt-3 text-xs text-[var(--text1)] ${
            compact ? "line-clamp-3" : "whitespace-pre-line"
          }`}
        >
          {day.content}
        </p>
      )}

      {day.objective_full && !compact && (
        <p className="mt-2 text-[11px] text-[var(--text3)]">
          Objectif : {day.objective_full}
        </p>
      )}
    </div>
  );
}
