import Link from "next/link";

export default function RecipeCard({ recipe }) {
  return (
    <Link href={`/recettes/${recipe.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition duration-300">
        <img src={recipe.image} alt={recipe.name} className="w-full h-40 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-semibold">{recipe.name}</h3>
        </div>
      </div>
    </Link>
  );
}