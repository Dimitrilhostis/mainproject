"use client";

import React, { useState } from 'react';

// Exemple de questions (on peut les remplacer ou étendre)
const questions = [
  { id: 1, question: "Quel est votre prénom ?", type: "text" },
  { id: 2, question: "Quel est votre âge ?", type: "number" },
  { id: 3, question: "Quelle est votre couleur préférée ?", type: "text" },
];

export default function Form() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const current = questions[currentIndex];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Sauvegarde la réponse courante
    setAnswers((prev) => ({
      ...prev,
      [current.id]: value,
    }));
    setValue('');

    // Passe à la question suivante si elle existe
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Formulaire terminé : on déclenche l'animation puis la redirection
      console.log('Réponses finales:', { ...answers, [current.id]: value });

      // Active l'écran de validation
      setIsSubmitting(true);

      // Délai aléatoire entre 5 000 et 10 000 ms (5–10 s)
      const delay = Math.floor(Math.random() * 5000) + 5000;

      // Redirection vers la page principale après le délai
      setTimeout(() => {
        window.location.href = '/';
      }, delay);
    }
  };

  // Écran d'animation/validation
  if (isSubmitting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 space-y-6">
        <svg
          className="animate-spin h-12 w-12 text-indigo-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <p className="text-indigo-700 font-medium text-lg text-center">
          Nous validons vos réponses…<br />Vous allez être redirigé(e) vers la page principale.
        </p>
      </div>
    );
  }

  // Formulaire principal
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-lg shadow-md p-6"
      >
        <p className="text-lg font-semibold mb-4">
          Question {currentIndex + 1} sur {questions.length}
        </p>

        <label className="block mb-2 text-gray-700">{current.question}</label>

        {(current.type === 'text' || current.type === 'number') && (
          <input
            type={current.type}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        )}

        <button
          type="submit"
          className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition"
        >
          {currentIndex < questions.length - 1 ? 'Suivant' : 'Terminer'}
        </button>
      </form>
    </div>
  );
}
