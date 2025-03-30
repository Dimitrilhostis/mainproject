import { supabase } from "@/app/services/supabaseClient";

export const addRecipe = async (title, description) => {
  if (!title.trim() || !description.trim()) {
    return { error: "Le titre et la description doivent être remplis." };
  }

  try {
    const { data, error } = await supabase
      .from("recettes") // Vérifie que c'est bien "recettes" dans Supabase
      .insert([{ title, description }])
      .select(); // Ajoute cette ligne pour récupérer l'élément inséré

    if (error) {
      console.error("Erreur d'ajout de la recette :", error);
      return { error: error.message };
    }

    return { data }; // Retourne les données directement
  } catch (err) {
    console.error("Erreur lors de l'ajout de la recette :", err);
    return { error: "Une erreur inconnue s'est produite lors de l'ajout de la recette." };
  }
};
