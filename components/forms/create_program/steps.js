// src/components/steps.js
export const steps = [
    {
      key: 'fullName',
      question: 'Quel est votre nom complet ?',
      options: null,
      type: 'text'
    },
    {
      key: 'birthDate',
      question: 'Quelle est votre date de naissance ?',
      options: null,
      type: 'date'
    },
    {
      key: 'location',
      question: 'Où êtes-vous situé(e) ? (Ville, pays)',
      options: null,
      type: 'text'
    },
    {
      key: 'gender',
      question: 'Quel est votre sexe ?',
      options: [
        { value: 'male', label: 'Homme' },
        { value: 'female', label: 'Femme' },
        { value: 'other', label: 'Autre' }
      ],
      type: 'single'
    },
    {
      key: 'height',
      question: 'Quelle est votre taille ? (en cm)',
      options: null,
      type: 'number'
    },
    {
      key: 'weight',
      question: 'Quel est votre poids ? (en kg)',
      options: null,
      type: 'number'
    },
    {
      key: 'activityLevel',
      question: 'Quel est votre niveau d’activité actuel ?',
      options: [
        { value: 'sedentary', label: 'Sédentaire' },
        { value: 'light', label: 'Léger' },
        { value: 'moderate', label: 'Modéré' },
        { value: 'intense', label: 'Intense' }
      ],
      type: 'single'
    },
    // ... ajoute les autres questions de la liste de la même façon
  ];
  