// pages/recettes/page.jsx (Page principale avec la liste des recettes)
import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import RecipeCard from "@/components/RecipeCard";
import { recipesData } from "@/data/recipes";

export default function Recettes() {
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const filteredRecipes = recipesData.filter((recipe) =>
    recipe.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Header search={search} setSearch={setSearch} />
      <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} toggleFavorite={toggleFavorite} isFavorite={favorites.includes(recipe.id)} />
        ))}
      </div>
    </div>
  );
}
