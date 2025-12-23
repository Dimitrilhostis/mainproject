import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/header";
import { MdFilterList } from "react-icons/md";


// --- Demo data : tu remplaceras par Supabase plus tard ---
const RECIPES = [
  {
    uuid: "pancakes-proteines-banane",
    title: "Pancakes protéinés banane",
    excerpt: "Rapide, moelleux, parfait petit-déj.",
    image: "/images/random.jpg", // paysage
    minutes: 12,
    foods: ["oeufs", "banane", "lait", "flocons_avoine"],
  },
  {
    uuid: "bowl-saumon-riz-avocat",
    title: "Bowl saumon, riz & avocat",
    excerpt: "Simple, dense en nutriments.",
    image: "/images/random.jpg",
    minutes: 18,
    foods: ["saumon", "riz", "avocat", "citron"],
  },
  {
    uuid: "wrap-poulet-yaourt-citron",
    title: "Wrap poulet yaourt-citron",
    excerpt: "Le snack qui cale sans te plomber.",
    image: "/images/random.jpg",
    minutes: 15,
    foods: ["viande_blanche", "yaourt", "citron", "tortilla"],
  },
  {
    uuid: "overnight-oats-cacao",
    title: "Overnight oats cacao",
    excerpt: "Préparé la veille. Ready au réveil.",
    image: "/images/random.jpg",
    minutes: 5,
    foods: ["flocons_avoine", "lait", "cacao"],
  },
  {
    uuid: "salade-lentilles-feta",
    title: "Salade lentilles & feta",
    excerpt: "Protéines + fibres : combo anti-fringale.",
    image: "/images/random.jpg",
    minutes: 16,
    foods: ["lentilles", "fromage", "oignon"],
  },
  {
    uuid: "salade-lentilles-feta",
    title: "Salade lentilles & feta",
    excerpt: "Protéines + fibres : combo anti-fringale.",
    image: "/images/random.jpg",
    minutes: 16,
    foods: ["lentilles", "fromage", "oignon"],
  },
  {
    uuid: "salade-lentilles-feta",
    title: "Salade lentilles & feta",
    excerpt: "Protéines + fibres : combo anti-fringale.",
    image: "/images/random.jpg",
    minutes: 16,
    foods: ["lentilles", "fromage", "oignon"],
  },
  {
    uuid: "salade-lentilles-feta",
    title: "Salade lentilles & feta",
    excerpt: "Protéines + fibres : combo anti-fringale.",
    image: "/images/random.jpg",
    minutes: 16,
    foods: ["lentilles", "fromage", "oignon"],
  },
  {
    uuid: "salade-lentilles-feta",
    title: "Salade lentilles & feta",
    excerpt: "Protéines + fibres : combo anti-fringale.",
    image: "/images/random.jpg",
    minutes: 16,
    foods: ["lentilles", "fromage", "oignon"],
  },
  {
    uuid: "salade-lentilles-feta",
    title: "Salade lentilles & feta",
    excerpt: "Protéines + fibres : combo anti-fringale.",
    image: "/images/random.jpg",
    minutes: 16,
    foods: ["lentilles", "fromage", "oignon"],
  },
  {
    uuid: "salade-lentilles-feta",
    title: "Salade lentilles & feta",
    excerpt: "Protéines + fibres : combo anti-fringale.",
    image: "/images/random.jpg",
    minutes: 16,
    foods: ["lentilles", "fromage", "oignon"],
  },
  {
    uuid: "salade-lentilles-feta",
    title: "Salade lentilles & feta",
    excerpt: "Protéines + fibres : combo anti-fringale.",
    image: "/images/random.jpg",
    minutes: 16,
    foods: ["lentilles", "fromage", "oignon"],
  },
  {
    uuid: "salade-lentilles-feta",
    title: "Salade lentilles & feta",
    excerpt: "Protéines + fibres : combo anti-fringale.",
    image: "/images/random.jpg",
    minutes: 16,
    foods: ["lentilles", "fromage", "oignon"],
  },
  {
    uuid: "salade-lentilles-feta",
    title: "Salade lentilles & feta",
    excerpt: "Protéines + fibres : combo anti-fringale.",
    image: "/images/random.jpg",
    minutes: 16,
    foods: ["lentilles", "fromage", "oignon"],
  },
  {
    uuid: "salade-lentilles-feta",
    title: "Salade lentilles & feta",
    excerpt: "Protéines + fibres : combo anti-fringale.",
    image: "/images/random.jpg",
    minutes: 16,
    foods: ["lentilles", "fromage", "oignon"],
  },
  {
    uuid: "salade-lentilles-feta",
    title: "Salade lentilles & feta",
    excerpt: "Protéines + fibres : combo anti-fringale.",
    image: "/images/random.jpg",
    minutes: 16,
    foods: ["lentilles", "fromage", "oignon"],
  },
  {
    uuid: "salade-lentilles-feta",
    title: "Salade lentilles & feta",
    excerpt: "Protéines + fibres : combo anti-fringale.",
    image: "/images/random.jpg",
    minutes: 16,
    foods: ["lentilles", "fromage", "oignon"],
  },
  {
    uuid: "salade-lentilles-feta",
    title: "Salade lentilles & feta",
    excerpt: "Protéines + fibres : combo anti-fringale.",
    image: "/images/random.jpg",
    minutes: 16,
    foods: ["lentilles", "fromage", "oignon"],
  },
  {
    uuid: "salade-lentilles-feta",
    title: "Salade lentilles & feta",
    excerpt: "Protéines + fibres : combo anti-fringale.",
    image: "/images/random.jpg",
    minutes: 16,
    foods: ["lentilles", "fromage", "oignon"],
  },
  {
    uuid: "salade-lentilles-feta",
    title: "Salade lentilles & feta",
    excerpt: "Protéines + fibres : combo anti-fringale.",
    image: "/images/random.jpg",
    minutes: 16,
    foods: ["lentilles", "fromage", "oignon"],
  },
  {
    uuid: "salade-lentilles-feta",
    title: "Salade lentilles & feta",
    excerpt: "Protéines + fibres : combo anti-fringale.",
    image: "/images/random.jpg",
    minutes: 16,
    foods: ["lentilles", "fromage", "oignon"],
  },
  {
    uuid: "salade-lentilles-feta",
    title: "Salade lentilles & feta",
    excerpt: "Protéines + fibres : combo anti-fringale.",
    image: "/images/random.jpg",
    minutes: 16,
    foods: ["lentilles", "fromage", "oignon"],
  },
  {
    uuid: "salade-lentilles-feta",
    title: "Salade lentilles & feta",
    excerpt: "Protéines + fibres : combo anti-fringale.",
    image: "/images/random.jpg",
    minutes: 16,
    foods: ["lentilles", "fromage", "oignon"],
  },
  {
    uuid: "salade-lentilles-feta",
    title: "Salade lentilles & feta",
    excerpt: "Protéines + fibres : combo anti-fringale.",
    image: "/images/random.jpg",
    minutes: 16,
    foods: ["lentilles", "fromage", "oignon"],
  },
  {
    uuid: "salade-lentilles-feta",
    title: "Salade lentilles & feta",
    excerpt: "Protéines + fibres : combo anti-fringale.",
    image: "/images/random.jpg",
    minutes: 16,
    foods: ["lentilles", "fromage", "oignon"],
  },
  {
    uuid: "salade-lentilles-feta",
    title: "Salade lentilles & feta",
    excerpt: "Protéines + fibres : combo anti-fringale.",
    image: "/images/random.jpg",
    minutes: 16,
    foods: ["lentilles", "fromage", "oignon"],
  },
  {
    uuid: "salade-lentilles-feta",
    title: "Salade lentilles & feta",
    excerpt: "Protéines + fibres : combo anti-fringale.",
    image: "/images/random.jpg",
    minutes: 16,
    foods: ["lentilles", "fromage", "oignon"],
  },
  {
    uuid: "salade-lentilles-feta",
    title: "Salade lentilles & feta",
    excerpt: "Protéines + fibres : combo anti-fringale.",
    image: "/images/random.jpg",
    minutes: 16,
    foods: ["lentilles", "fromage", "oignon"],
  },
  {
    uuid: "salade-lentilles-feta",
    title: "Salade lentilles & feta",
    excerpt: "Protéines + fibres : combo anti-fringale.",
    image: "/images/random.jpg",
    minutes: 16,
    foods: ["lentilles", "fromage", "oignon"],
  },
  {
    uuid: "salade-lentilles-feta",
    title: "Salade lentilles & feta",
    excerpt: "Protéines + fibres : combo anti-fringale.",
    image: "/images/random.jpg",
    minutes: 16,
    foods: ["lentilles", "fromage", "oignon"],
  },
  {
    uuid: "salade-lentilles-feta",
    title: "Salade lentilles & feta",
    excerpt: "Protéines + fibres : combo anti-fringale.",
    image: "/images/random.jpg",
    minutes: 16,
    foods: ["lentilles", "fromage", "oignon"],
  },
  {
    uuid: "salade-lentilles-feta",
    title: "Salade lentilles & feta",
    excerpt: "Protéines + fibres : combo anti-fringale.",
    image: "/images/random.jpg",
    minutes: 16,
    foods: ["lentilles", "fromage", "oignon"],
  }
];

// --- Catégories -> aliments (tu enrichiras au fur et à mesure) ---
const FOOD_CATEGORIES = [
  {
    key: "proteines",
    label: "Protéines",
    items: [
      { key: "oeufs", label: "Œufs" },
      { key: "poisson_blanc", label: "Poisson blanc" },
      { key: "saumon", label: "Saumon" },
      { key: "viande_rouge", label: "Viande rouge" },
      { key: "viande_blanche", label: "Viande blanche" },
      { key: "lentilles", label: "Lentilles" },
    ],
  },
  {
    key: "fruits",
    label: "Fruits",
    items: [
      { key: "banane", label: "Banane" },
      { key: "avocat", label: "Avocat" },
      { key: "citron", label: "Citron" },
    ],
  },
  {
    key: "legumes",
    label: "Légumes",
    items: [
      { key: "oignon", label: "Oignon" },
      { key: "tomate", label: "Tomate" },
      { key: "salade", label: "Salade" },
    ],
  },
  {
    key: "glucides",
    label: "Glucides",
    items: [
      { key: "riz", label: "Riz" },
      { key: "flocons_avoine", label: "Flocons d’avoine" },
      { key: "tortilla", label: "Tortilla" },
    ],
  },
  {
    key: "laitiers",
    label: "Laitiers",
    items: [
      { key: "lait", label: "Lait" },
      { key: "yaourt", label: "Yaourt" },
      { key: "fromage", label: "Fromage" },
    ],
  },
];

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

function RecipeCard({ recipe }) {
  return (
    <Link
      href={`/recipes/${recipe.uuid}`}
      className={classNames(
        "group relative block overflow-hidden rounded-2xl",
        "border border-white/10 bg-white/5",
        "shadow-[0_18px_55px_rgba(0,0,0,0.45)]",
        "transition-transform duration-300 ease-out",
        "hover:scale-[1.03]"
      )}
    >
      {/* Landscape image */}
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          priority={false}
          sizes="(max-width: 640px) 95vw, (max-width: 1024px) 70vw, 33vw"
          className="object-cover"
        />

        {/* Apple TV style overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15" />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 transition group-hover:ring-white/25" />

        {/* Title on image */}
        <div className="absolute left-4 right-4 bottom-4">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold text-white">
                {recipe.title}
              </h3>
              <p className="mt-0.5 line-clamp-1 text-sm text-white/70">
                {recipe.excerpt}
              </p>
            </div>

            {typeof recipe.minutes === "number" && (
              <span className="shrink-0 rounded-full bg-black/45 px-3 py-1 text-xs text-white/85 backdrop-blur">
                {recipe.minutes} min
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function FoodFiltersOverlay({
  open,
  onClose,
  selectedFoods,
  toggleFood,
  clearFoods,
}) {
  const [activeCategoryKey, setActiveCategoryKey] = useState(
    FOOD_CATEGORIES[0]?.key
  );

  const activeCategory = useMemo(
    () => FOOD_CATEGORIES.find((c) => c.key === activeCategoryKey),
    [activeCategoryKey]
  );

  // Close on ESC
  // (simple & safe without document listeners: only if open)
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60]"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <button
        onClick={onClose}
        className="absolute inset-0 bg-black/65"
        aria-label="Fermer"
      />

      {/* Panel */}
      <div className="absolute left-1/2 top-1/2 w-[min(980px,92vw)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-white/10 bg-black/70 shadow-[0_30px_90px_rgba(0,0,0,0.7)] backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-white">
              Filtrer par aliments
            </h2>
            <p className="text-xs text-white/55">
              Sélectionne des aliments. Les recettes se filtrent instantanément.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearFoods}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:border-white/20"
            >
              Réinitialiser
            </button>
            <button
              onClick={onClose}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:border-white/20"
            >
              Fermer
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">
          {/* Categories */}
          <div className="border-b md:border-b-0 md:border-r border-white/10 bg-black/35">
            <div className="p-3">
              <p className="px-2 pb-2 text-xs text-white/50">Catégories</p>
              <div className="flex flex-col gap-1">
                {FOOD_CATEGORIES.map((cat) => {
                  const isActive = cat.key === activeCategoryKey;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setActiveCategoryKey(cat.key)}
                      className={classNames(
                        "flex items-center justify-between rounded-2xl px-3 py-2 text-left text-sm",
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:bg-white/5"
                      )}
                    >
                      <span>{cat.label}</span>
                      <span className="text-xs text-white/45">
                        {cat.items.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">
                  {activeCategory?.label}
                </p>
                <p className="text-xs text-white/55">
                  Clique pour sélectionner / désélectionner.
                </p>
              </div>

              <div className="text-xs text-white/55">
                Sélectionnés:{" "}
                <span className="text-white/85">{selectedFoods.size}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {activeCategory?.items?.map((item) => {
                const active = selectedFoods.has(item.key);
                return (
                  <button
                    key={item.key}
                    onClick={() => toggleFood(item.key)}
                    className={classNames(
                      "rounded-2xl border px-3 py-3 text-left text-sm transition",
                      active
                        ? "border-white/25 bg-white/10 text-white"
                        : "border-white/10 bg-white/5 text-white/75 hover:border-white/20"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate">{item.label}</span>
                      <span
                        className={classNames(
                          "text-xs",
                          active ? "text-white/80" : "text-white/35"
                        )}
                      >
                        {active ? "✓" : "+"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected chips */}
            {selectedFoods.size > 0 && (
              <div className="mt-4 border-t border-white/10 pt-4">
                <p className="mb-2 text-xs text-white/50">Actifs</p>
                <div className="flex flex-wrap gap-2">
                  {[...selectedFoods].map((k) => (
                    <button
                      key={k}
                      onClick={() => toggleFood(k)}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75 hover:border-white/20"
                      title="Retirer"
                    >
                      {k} <span className="ml-1 text-white/40">✕</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecipesPage() {
  const [query, setQuery] = useState("");
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState(() => new Set());

  function toggleFood(foodKey) {
    setSelectedFoods((prev) => {
      const next = new Set(prev);
      if (next.has(foodKey)) next.delete(foodKey);
      else next.add(foodKey);
      return next;
    });
  }

  function clearFoods() {
    setSelectedFoods(new Set());
  }

  const filteredRecipes = useMemo(() => {
    const q = query.trim().toLowerCase();

    return RECIPES.filter((r) => {
      const matchesQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        (r.excerpt || "").toLowerCase().includes(q);

      const matchesFoods =
        selectedFoods.size === 0 ||
        [...selectedFoods].every((food) => (r.foods || []).includes(food));

      return matchesQuery && matchesFoods;
    });
  }, [query, selectedFoods]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Header />

      {/* Background FIXE (Apple TV vibe) */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/hero-bg.jpg"
          alt="Immersive background"
          fill
          priority
          sizes="100vw"
          className="object-cover brightness-[0.35]"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Top bar "catalog" */}
      <div className="sticky top-0 z-20 pt-20">
  <div className="w-full px-4 sm:px-6">
    {/* Une seule surface glass */}
    <div className="rounded-3xl border border-white/10 bg-white/8 backdrop-blur-xl">
      {/* Ligne search + filtre */}
      <div className="flex w-full items-center gap-3 px-4 py-3">
        {/* SEARCH : aucun bg -> fusion totale avec le fond */}
        <label
          className="
            flex-1
            flex items-center
            h-11
            rounded-full
            px-4
            cursor-text
            hover:bg-white/5
            transition
          "
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher..."
            className="
              w-full
              bg-transparent
              text-sm text-white/90
              placeholder:text-white/45
              outline-none
            "
          />
        </label>

        {/* BOUTON : pareil, pas de bg différent */}
        <button
          onClick={() => setOverlayOpen(true)}
          className="
            inline-flex items-center gap-2
            h-11
            rounded-full
            px-4
            text-sm text-white/85
            hover:bg-white/5
            transition
            whitespace-nowrap
          "
        >
          <span className="leading-none">Aliments</span>
          <MdFilterList className="text-base opacity-80" />

          {selectedFoods.size > 0 && (
            <span className="ml-1 rounded-full bg-white/15 px-2 py-0.5 text-xs text-white/90">
              {selectedFoods.size}
            </span>
          )}
        </button>
      </div>

      {/* Filtres actifs : chips sans border, même matière */}
      {selectedFoods.size > 0 && (
        <div className="flex flex-wrap gap-2 px-4 pb-3">
          {[...selectedFoods].slice(0, 10).map((k) => (
            <button
              key={k}
              onClick={() => toggleFood(k)}
              className="
                rounded-full
                bg-white/10
                px-3 py-1
                text-xs text-white/75
                hover:bg-white/15
                transition
              "
              title="Retirer"
            >
              {k} <span className="ml-1 text-white/40">✕</span>
            </button>
          ))}
          <button
            onClick={clearFoods}
            className="
              rounded-full
              bg-white/10
              px-3 py-1
              text-xs text-white/65
              hover:bg-white/15
              transition
            "
          >
            Reset
          </button>
        </div>
      )}
    </div>
  </div>
</div>


      {/* Full page content */}
      <main className="w-full pb-16">
        <section
            className="
            w-full
            px-4 sm:px-6 md:px-10 xl:px-14 2xl:px-20
            grid gap-5
            grid-cols-2
            sm:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-5
            2xl:grid-cols-6
            "
        >
            {filteredRecipes.map((r) => (
            <RecipeCard key={r.uuid} recipe={r} />
            ))}
        </section>
        </main>


      {/* Overlay filters */}
      <FoodFiltersOverlay
        open={overlayOpen}
        onClose={() => setOverlayOpen(false)}
        selectedFoods={selectedFoods}
        toggleFood={toggleFood}
        clearFoods={clearFoods}
      />
    </div>
  );
}
