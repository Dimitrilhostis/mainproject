import { useParams } from "next/navigation";

const recipeDetails = {
  1: {
    name: "Pâtes Carbonara",
    image: "/images/carbonara.jpg",
    ingredients: ["200g de pâtes", "100g de lardons", "2 œufs", "Parmesan", "Poivre"],
    steps: [
      "Faire cuire les pâtes.",
      "Faire revenir les lardons à la poêle.",
      "Mélanger les œufs avec le parmesan.",
      "Incorporer le tout aux pâtes.",
    ],
  },
  2: {
    name: "Avocado Toast",
    image: "/images/avocado-toast.jpg",
    ingredients: ["Pain", "Avocat", "Citron", "Sel", "Poivre"],
    steps: [
      "Griller le pain.",
      "Écraser l'avocat avec du citron.",
      "Étaler sur le pain.",
      "Saler et poivrer.",
    ],
  },
};

export default function RecipePage() {
  const { id } = useParams();
  const recipe = recipeDetails[id] || null;

  if (!recipe) {
    return <p>Recette introuvable.</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">{recipe.name}</h1>
      <img src={recipe.image} alt={recipe.name} className="w-full h-60 object-cover rounded-lg mt-4" />
      <h2 className="text-xl font-semibold mt-6">Ingrédients</h2>
      <ul className="list-disc ml-5">
        {recipe.ingredients.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mt-6">Étapes</h2>
      <ol className="list-decimal ml-5">
        {recipe.steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </div>
  );
}


