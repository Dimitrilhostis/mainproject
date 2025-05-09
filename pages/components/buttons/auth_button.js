import React from 'react';

/**
 * AuthButton
 * Un bouton rond fixé en haut à droite pour "Connexion / Inscription".
 * Utilise une balise <a> ou <button> selon les props.
 *
 * Props:
 * - text: libellé du bouton (par défaut: "Connexion / Inscription")
 * - href: chemin de la page de redirection (défaut: "/connect")
 * - onClick: callback au clic (optionnel)
 *
 * Usage:
 * <AuthButton />
 * <AuthButton text="Se connecter" />
 * <AuthButton href="/other-page" />
 * <AuthButton onClick={() => openModal()} />
 */
export default function AuthButton({
  text = 'Connexion / Inscription',
  href = '/connect',
  onClick,
}) {
  // Si un href est fourni, on utilise une balise <a>
  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className="fixed top-4 right-4 z-50 bg-gray-500 text-white rounded-full p-3 shadow-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      >
        {text}
      </a>
    );
  }

  // Sinon, un bouton classique
  return (
    <button
      onClick={onClick}
      className="fixed top-4 right-4 z-50 bg-gray-500 text-white rounded-full p-3 shadow-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
    >
      {text}
    </button>
  );
}