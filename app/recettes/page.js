"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/app/services/supabaseClient";
import CustomCard from "@components/cards/custom_card";
import Input from "@components/inputs/input";
import Button from "@components/buttons/button";
import Masonry from "react-masonry-css";
import { motion } from "framer-motion";
import BackToEntryButton from "@components/buttons/back_to_entry";
import { addRecipe } from "../services/add_receipe";
import { fetchRecipes } from "../services/fetch_receipes";



export default function RecipeApp() {

  const handleAddRecipe = async () => {
    if (!newRecipe.title || !newRecipe.description) {
      alert("Veuillez remplir tous les champs !");
      return;
    }
  
    const { data, error } = await addRecipe(newRecipe.title, newRecipe.description);
    
    if (error) {
      console.error("Erreur lors de l'ajout :", error);
      return;
    }
  
    setRecipes((prev) => [...prev, data[0]]);
    setNewRecipe({ title: "", description: "" });
  };

  const handleDeleteRecipe = async (id) => {
    const { error } = await supabase.from("recettes").delete().match({ id });
  
    if (error) {
      console.error("Erreur lors de la suppression :", error);
      return;
    }
  
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
  };
  

  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from('recettes').select('*');
  
        if (error) {
          // Gestion d'erreur si Supabase retourne un problème
          console.error("Erreur de connexion à Supabase :", error.message || error);
          return; // On arrête l'exécution si l'erreur est présente
        }
  
        // Si l'appel est un succès, on affiche les données récupérées
        console.log("Recettes récupérées :", data);
      } catch (err) {
        // Gestion des erreurs autres que celles de Supabase
        console.error("Erreur de connexion à Supabase :", err);
      }
    };
  
    testConnection(); // Appel pour tester la connexion
  
    const getRecipes = async () => {
      const { data, error } = await fetchRecipes();
      if (!error) {
        setRecipes(data);
      } else {
        console.error("Erreur lors de la récupération des recettes :", error);
      }
    };
  
    getRecipes(); // Appel de la fonction pour charger les recettes
  
  }, []); // Le tableau vide garantit que cet effet ne se déclenche qu'une seule fois au chargement
  
  

  const [search, setSearch] = useState("");
  const [newRecipe, setNewRecipe] = useState({ title: "", description: "" });

  const filteredRecipes = recipes.filter(
    (recipe) => recipe?.title?.toLowerCase().includes(search.toLowerCase())
  );  

  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Recettes</h1>
      <Input
        type="text"
        placeholder="Rechercher une recette..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />
      <Masonry
        breakpointCols={{ default: 3, 800: 2, 500: 1 }}
        className="flex gap-4"
        columnClassName="masonry-column"
      >
        {filteredRecipes.map((recipe) => (
          <motion.div key={recipe.id} whileHover={{ scale: 1.05 }} initial={{opacity: 0}} animate={{opacity: 1  }}>
            <CustomCard className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold">{recipe.title}</h2>
                <p className="text-sm text-gray-600">{recipe.description}</p>
                <Button onClick={() => handleDeleteRecipe(recipe.id)} className="mt-2">Supprimer</Button>
            </CustomCard>
          </motion.div>
        ))}
      </Masonry>
      <div className="mt-6 p-4 border-t">
        <h2 className="text-lg font-semibold">Ajouter une recette</h2>
        <Input
          type="text"
          placeholder="Titre de la recette"
          value={newRecipe.title}
          onChange={(e) => setNewRecipe({ ...newRecipe, title: e.target.value })}
          className="mb-2"
        />
        <Input
          type="text"
          placeholder="Description de la recette"
          value={newRecipe.description}
          onChange={(e) => setNewRecipe({ ...newRecipe, description: e.target.value })}
          className="mb-2"
        />
        <Button onClick={handleAddRecipe}>Ajouter</Button>


      </div>

      <footer className="text-white text-center py-6 mt-6">
        <BackToEntryButton></BackToEntryButton>
      </footer>
    </div>
  );
}