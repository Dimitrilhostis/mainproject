import { supabase } from "@/app/services/supabaseClient";

export const fetchRecipes = async () => {
  try {
    const { data, error } = await supabase.from("recettes").select("*");

    if (error) {
      console.error("Erreur de chargement des recettes :", error);
      return { data: [], error: error.message }; // Retourne toujours un tableau et un message d'erreur
    }

    return { data: data || [], error: null }; // Toujours un tableau, même si vide
  } catch (err) {
    console.error("Erreur lors du chargement des recettes :", err);
    return { data: [], error: "Une erreur inconnue s'est produite." };
  }
};
