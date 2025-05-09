import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';

/**
 * AuthButton
 * Un bouton rond fixé en haut à droite pour "Connexion / Inscription" ou "Mon Profil | prénom" si connecté.
 * Props:
 * - text: libellé par défaut ("Connexion / Inscription")
 * - href: chemin de redirection (défaut: "/connect")
 * - onClick: callback au clic (optionnel)
 */
export default function AuthButton({
  text: defaultText = 'Connexion / Inscription',
  href = '/connect',
  onClick,
}) {
  const [label, setLabel] = useState(defaultText);

  useEffect(() => {
    async function checkSession() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.log('AuthButton: erreur getUser()', error.message);
        return;
      }
      if (user) {
        console.log('AuthButton: utilisateur connecté', user.email);
        // Récupère le prénom depuis la table profiles
        const { data: profile, error: profErr } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', user.id)
          .single();
        if (profErr) {
          console.log('AuthButton: erreur fetch profile', profErr.message);
        } else if (profile?.name) {
          setLabel(`Mon Profil | ${profile.name}`);
        }
      } else {
        console.log('AuthButton: pas de session active');
      }
    }
    checkSession();
  }, []);

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className="fixed top-4 right-4 z-50 bg-gray-500 text-white rounded-full p-3 shadow-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      >
        {label}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className="fixed top-4 right-4 z-50 bg-gray-500 text-white rounded-full p-3 shadow-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
    >
      {label}
    </button>
  );
}
