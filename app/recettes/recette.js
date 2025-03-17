import Header from "@/components/Header";
import RecipeCard from "@/components/RecipeCard";

const recipes = [
{ id: 1, name: "Pâtes Carbonara", image: "/images/carbonara.jpg" },
{ id: 2, name: "Avocado Toast", image: "/images/avocado-toast.jpg" },
{ id: 3, name: "Smoothie Fraise", image: "/images/smoothie.jpg" },
// Ajoute d'autres recettes ici
];

export default function Recettes() {
return (
    <div className="min-h-screen bg-gray-100">
    <Header />
    <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
    </div>
    </div>
);
}
