// components/programs/TodayTab.jsx
import Image from "next/image";
import { useRouter } from "next/navigation";

function TodayTab({
  mainProgram,
  secondaryPrograms,
  getTodayDay,
  onOpenOverlay,
}) {
  const mainDay = mainProgram ? getTodayDay(mainProgram) : null;

  const secondaryDays = secondaryPrograms
    .map((p) => ({ program: p, day: getTodayDay(p) }))
    .filter((item) => item.day !== null);

  return (
    <div className="space-y-6">
      {/* Bloc principal du jour : layout 2 colonnes */}
      {mainProgram && mainDay ? (
        <section className="rounded-2xl border border-[var(--green2)]/25 bg-[var(--background)]/90 p-4 sm:p-5">
          <div className="grid gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-stretch">
            {/* Colonne gauche : titre, jour, description, contenu cliquable */}
            <TodayMainLeft
              program={mainProgram}
              day={mainDay}
              onOpenOverlay={onOpenOverlay}
            />

            {/* Colonne droite : image + energy + temps */}
            <TodayMainRight day={mainDay} />
          </div>
        </section>
      ) : (
        <p className="text-sm text-[var(--text2)]">
          Aucun programme principal actif ou la date de départ est dans le
          futur.
        </p>
      )}

      {/* Programmes secondaires du jour */}
      {secondaryDays.length > 0 && (
        <section className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--text3)]">
            Programmes secondaires
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {secondaryDays.map(({ program, day }) => (
              <SecondaryDayCard
                key={program.id}
                program={program}
                day={day}
                onOpenOverlay={onOpenOverlay}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ----- Colonne gauche Today : titre, jour, description, contenu cliquable -----

function TodayMainLeft({ program, day, onOpenOverlay }) {
  const previewText =
    day.content && day.content.length > 200
      ? day.content.slice(0, 200) + "..."
      : day.content || "Pas de contenu détaillé pour cette séance.";

    const router = useRouter();

  return (
    <div className="flex flex-col h-full">
      {/* Titre du programme + info jour */}
      <div className="mb-3">
        <h2 className="text-base font-semibold text-[var(--text1)]">
          {program.name}
        </h2>
        <p className="text-xs text-[var(--text3)]">
          Jour {day.day_number}
          {program.objective ? ` · ${program.objective}` : ""}
        </p>
      </div>

      {/* Petite description courte de la séance */}
      {day.objective_short && (
        <p className="mb-3 text-xs text-[var(--text2)]">
          {day.objective_short}
        </p>
      )}

      {/* Bloc contenu cliquable */}
      <button
        type="button"
        onClick={() => router.push(`/programs/${program.id}/day/${day.day_number}`)}
        className="
          group text-left flex flex-col justify-between flex-1
          rounded-xl border border-[var(--details-dark)] 
          bg-[var(--background)]/90 px-3 py-3 
          hover:border-[var(--green2)]/50 hover:shadow-md hover:cursor-pointer
          transition
        "
      >
        {/* EN-TÊTE — toujours en haut */}
        <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--text3)] mb-1">
          Contenu de la séance
        </p>

        {/* PREVIEW */}
        <p className="text-xs text-[var(--text1)] mb-3">
          {previewText}
        </p>

        {/* FOOTER — GO >> centré */}
        <div
          className="
            mt-auto w-full flex items-center justify-center 
            text-xl font-medium 
            text-[var(--text1)] 
            transition-all duration-300 ease-out
            group-hover:text-[var(--green2)]
          "
        >
          <span className="tracking-wide flex items-center gap-1">
            <span
              className="
                inline-block 
                transition-transform duration-[900ms] ease-out
                group-hover:translate-x-0.1
              "
            >
              G
            </span>
            <span
              className="
                inline-block 
                transition-transform duration-[950ms] ease-out
                group-hover:translate-x-0.25
              "
            >
              O
            </span>
            <span
              className="
                inline-block 
                transition-transform duration-[1000ms] ease-out
                group-hover:translate-x-1
              "
            >
              &gt;
            </span>
            <span
              className="
                inline-block 
                transition-transform duration-[1050ms] ease-out
                group-hover:translate-x-2
              "
            >
              &gt;
            </span>
          </span>
        </div>
      </button>
    </div>
  );
}

// ----- Colonne droite Today : image + titre de séance + energy + temps -----

function TodayMainRight({ day }) {
  const energy = day.energy || 0;
  const duration =
    day.duration_minutes != null ? day.duration_minutes : null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--details-dark)] bg-[var(--background)]/95 min-h-[220px]">
      {/* Image ou fond dégradé */}
      {day.image_path ? (
        <Image
          src={day.image_path}
          alt={day.title}
          fill
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--green2)]/20 via-[var(--background)] to-[var(--background)]" />
      )}

      {/* Overlay foncé pour lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />

      {/* Titre de la séance dans l'image */}
      <div className="absolute inset-x-0 top-0 p-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text3)]">
          Session du jour
        </p>
        <h3 className="mt-1 text-sm font-semibold text-[var(--text1)]">
          {day.title}
        </h3>
      </div>

      {/* Energy + temps en bas dans un seul bloc */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-3 py-2 bg-black/55 text-[11px] text-[var(--text1)]">
        <div className="flex items-center gap-1">
          <span className="uppercase tracking-[0.2em] text-[9px] text-[var(--text3)]">
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
          <div className="text-[11px] text-[var(--text2)]">
            ~ {duration} min
          </div>
        )}
      </div>
    </div>
  );
}

// ----- Carte programme secondaire du jour -----

function SecondaryDayCard({ program, day, onOpenOverlay }) {
  const energy = day.energy || 0;
  const duration =
    day.duration_minutes != null ? day.duration_minutes : null;

  const thumbSrc = program.image_path || day.image_path;

  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(`/programs/${program.id}/day/${day.day_number}`)}
      className="
        group
        rounded-2xl border border-[var(--details-dark)]
        bg-[var(--background)]/90 p-3 flex gap-3 items-center w-full
        hover:border-[var(--green2)]/50 hover:shadow-md transition
        hover:cursor-pointer
      "
    >
      {/* Image */}
      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[var(--details-dark)] shrink-0">
        {thumbSrc ? (
          <Image
            src={thumbSrc}
            alt={day.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--green2)]/20 via-[var(--background)] to-[var(--background)]" />
        )}

        {/* energy/time overlay */}
        <div className="absolute inset-x-0 bottom-0 px-2 py-1 bg-black/60 flex items-center justify-between gap-1">
          <span className="flex items-center text-[9px]">
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                className={i < Math.min(energy, 3) ? "opacity-100" : "opacity-25"}
              >
                ⚡
              </span>
            ))}
          </span>
          {duration != null && (
            <span className="text-[9px] text-[var(--text2)]">
              ~{duration}m
            </span>
          )}
        </div>
      </div>

      {/* Texte */}
      <div className="flex flex-col justify-between min-w-0 flex-1">
        <div>
          <p className="text-xs font-medium text-[var(--text2)] truncate">
            {program.name} — J{day.day_number}
          </p>
          <p className="text-sm font-semibold text-[var(--text1)] truncate">
            {day.title}
          </p>
          {day.objective_short && (
            <p className="mt-1 text-[11px] text-[var(--text3)] line-clamp-2">
              {day.objective_short}
            </p>
          )}
        </div>
      </div>

      {/* GO >> (à droite) */}
      <div
        className="
          flex items-center justify-center px-2
          ml-auto 
          text-[var(--text1)] 
          transition-all duration-300 ease-out
          group-hover:text-[var(--green2)]
        "
      >
        <span className="tracking-wide flex items-center gap-1">
          <span
            className="
              inline-block 
              transition-transform duration-[900ms] ease-out
              group-hover:translate-x-0.1
            "
          >
            G
          </span>
          <span
            className="
              inline-block 
              transition-transform duration-[950ms] ease-out
              group-hover:translate-x-0.25
            "
          >
            O
          </span>
          <span
            className="
              inline-block 
              transition-transform duration-[1000ms] ease-out
              group-hover:translate-x-1
            "
          >
            &gt;
          </span>
          <span
            className="
              inline-block 
              transition-transform duration-[1050ms] ease-out
              group-hover:translate-x-2
            "
          >
            &gt;
          </span>
        </span>
      </div>
    </button>
  );
}

export default TodayTab;
