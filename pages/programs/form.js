"use client";

import React, { useState } from "react";
import Layout from "@/components/layout";
import emailjs from "emailjs/browser";
import Link from "next/link";

// 🧠 Questions personnalisées
const questions = [
  {
    id: 1,
    type: "text",
    question: "Quel est ton prénom et ton nom ?",
  },
  {
    id: 2,
    type: "number",
    question: "Quel est ton âge ?",
  },
  {
    id: 3,
    type: "choice",
    question: "Quel est ton sexe ?",
    options: ["Homme", "Femme"],
  },
  {
    id: 4,
    type: "multi-choice",
    question: "Quel est ton passé sportif ?",
    options: [
      "Jamais fait",
      "Déteste ça",
      "Quelques pompes et squats dans ma chambre",
      "Occasionnellement",
      "Régulièrement",
      "Très souvent",
      "Athlète",
    ],
  },
  {
    id: 5,
    type: "multi-choice",
    question: "Comment évalues-tu tes connaissances actuelles ?",
    options: [
      "Ignorance totale",
      "Je sais faire des pâtes",
      "J’ai quelques bases",
      "Je m’entraîne depuis quelques temps",
      "J’étudie/travaille en santé, sport ou nutrition",
      "J’ai la science infuse",
    ],
  },
  {
    id: 6,
    type: "text",
    question:
      "Quelles ont été tes expériences passées en sport, nutrition ou bien-être ?",
    placeholder: "Ex : Handball, musculation, alimentation végétarienne...",
  },
  {
    id: 7,
    type: "choice",
    question: "Quel est ton principal objectif actuel ?",
    options: [
      "Perte de poids",
      "Prise de masse musculaire",
      "Reprise du sport",
      "Amélioration des performances",
      "Santé / bien-être",
      "Autre",
    ],
  },
  {
    id: 8,
    type: "number",
    question: "Combien de jours par semaine peux-tu t’entraîner ?",
    placeholder: "Ex : 3",
  },
  {
    id: 9,
    type: "choice",
    question: "As-tu des restrictions alimentaires ?",
    options: [
      "Aucune",
      "Végétarien",
      "Végétalien",
      "Sans gluten",
      "Intolérances spécifiques",
      "Autre",
    ],
  },
  {
    id: 10,
    type: "text",
    question:
      "As-tu un objectif précis à atteindre dans les 3 prochains mois ? (ex : perdre 5 kg, courir 10 km, faire 10 tractions...)",
  },
  {
    id: 11,
    type: "choice",
    question: "Souhaites-tu un accompagnement complet (sport + nutrition) ?",
    options: ["Oui", "Non, uniquement sport", "Non, uniquement nutrition"],
  },
  {
    id: 12,
    type: "text",
    question:
      "Y a-t-il des blessures, douleurs ou contre-indications médicales dont je devrais être informé ?",
    placeholder: "Ex : douleur genou droit, dos fragile, entorse récente...",
  },
  {
    id: 13,
    type: "choice",
    question:
      "Es-tu prêt à t’engager sérieusement sur 3 mois pour transformer ton corps et ton mental ?",
    options: ["Oui, à 100 %", "Oui, mais j’ai besoin d’encadrement", "Pas encore sûr"],
  },
  {
    id: 14,
    type: "email",
    question: "Email ?",
  },
  {
    id: 15,
    type: "text",
    question: "Numéro de téléphone ?",
  },

];

export default function FormPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = questions[currentIndex];

  // 🔹 Gestion des champs
  const handleChange = (e) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: e.target.value,
    });
  };

  // 🔹 Gestion des multi-choix (plusieurs cases possibles)
  const handleMultiChoiceChange = (option) => {
    const current = answers[currentQuestion.id] || [];
    if (current.includes(option)) {
      setAnswers({
        ...answers,
        [currentQuestion.id]: current.filter((o) => o !== option),
      });
    } else {
      setAnswers({
        ...answers,
        [currentQuestion.id]: [...current, option],
      });
    }
  };

  // 🔹 Passage à la question suivante
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSubmit();
    }
  };

  // 🔹 Envoi par mail
  const handleSubmit = async () => {
    const formattedAnswers = questions
      .map((q) => {
        const answer = answers[q.id];
        if (Array.isArray(answer)) return `👉 ${q.question}\n   → ${answer.join(", ")}`;
        return `👉 ${q.question}\n   → ${answer || "Non répondu"}`;
      })
      .join("\n\n");
  
    const templateParams = {
      from_name: answers[1] || "Utilisateur anonyme",
      reply_to: answers[14] || "",
      user_email: answers[14] || "",
      user_phone: answers[15] || "",
      message: formattedAnswers,
    };
  
    try {
      const serviceID = "service_l3kqtfi";
      const templateID = "template_2uzivoc";
      const publicKey = "8GwB2QOn688am10ID";
  
      const res = await emailjs.send(serviceID, templateID, templateParams, publicKey);
      console.log("EmailJS OK:", res);
      setSubmitted(true);
    } catch (error) {
      console.error("Erreur EmailJS:", error);
      alert(`❌ Envoi échoué.\n\n${error?.text || error?.message || "Erreur inconnue"}`);
    }
  };
  

  return (
    <Layout>
      <main
        className="
          relative min-h-screen text-[var(--text1)]
          bg-no-repeat bg-cover bg-center bg-fixed
          flex items-center justify-center
        "
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
      >
        <div className="max-w-xl w-full glass rounded-2xl p-8 shadow-lg">
          {!submitted ? (
            <>
              <h2 className="text-2xl font-bold mb-6 text-[var(--green2)]">
                {currentQuestion.question}
              </h2>

              {/* 🟩 Champs selon le type */}
              {["text", "number", "email"].includes(currentQuestion.type) && (
                <input
                  type={currentQuestion.type}
                  placeholder={currentQuestion.placeholder || ""}
                  value={answers[currentQuestion.id] || ""}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-[var(--green3)]/30 focus:outline-none focus:border-[var(--green2)] text-[var(--text1)]"
                />
              )}

              {currentQuestion.type === "choice" && (
                <div className="flex flex-col gap-3">
                  {currentQuestion.options.map((opt, i) => (
                    <label
                      key={i}
                      className={`cursor-pointer p-3 rounded-lg border ${
                        answers[currentQuestion.id] === opt
                          ? "bg-[var(--green2)]/30 border-[var(--green2)]"
                          : "border-[var(--text3)]/30 hover:border-[var(--green3)]"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q${currentQuestion.id}`}
                        value={opt}
                        checked={answers[currentQuestion.id] === opt}
                        onChange={handleChange}
                        className="mr-2 accent-[var(--green2)]"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}

              {currentQuestion.type === "multi-choice" && (
                <div className="flex flex-col gap-3">
                  {currentQuestion.options.map((opt, i) => {
                    const selected = answers[currentQuestion.id]?.includes(opt);
                    return (
                      <label
                        key={i}
                        className={`cursor-pointer p-3 rounded-lg border ${
                          selected
                            ? "bg-[var(--green2)]/30 border-[var(--green2)]"
                            : "border-[var(--text3)]/30 hover:border-[var(--green3)]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          value={opt}
                          checked={selected}
                          onChange={() => handleMultiChoiceChange(opt)}
                          className="mr-2 accent-[var(--green2)]"
                        />
                        {opt}
                      </label>
                    );
                  })}
                </div>
              )}

              {/* 🟢 Bouton suivant / valider */}
              <button
                onClick={handleNext}
                className="mt-8 w-full bg-[var(--green2)] text-[var(--background)] py-3 rounded-xl font-semibold hover:bg-[var(--green3)] transition"
              >
                {currentIndex === questions.length - 1 ? "Valider" : "Suivant →"}
              </button>

              <div className="mt-4 text-center text-[var(--text3)]">
                {currentIndex + 1} / {questions.length}
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[var(--green2)] mb-4">
                ✅ Formulaire envoyé avec succès !
              </h2>
              <p className="text-[var(--text2)]">
                Merci d’avoir répondu. Tes réponses ont été envoyées par mail.
              </p>
              <Link href='/programs'>Retour aux programmes</Link>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
