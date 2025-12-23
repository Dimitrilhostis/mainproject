"use client";

import Layout from "@/components/layout";
import Whiteboard from "@/components/roadmaps/whiteboard";
import { useSearchParams } from "next/navigation";


export default function NutritionRoadmap() {
  const nodes = [
    // GROUP 1
    {
      id: "g1",
      type: "group",
      position: { x: 80, y: 160 },
      style: { width: 520, height: 420 },
      data: { title: "Fondations", subtitle: "Structure, rythme, bases qui tiennent", tag: "S1–S2" },
    },
    {
      id: "g1-a",
      type: "card",
      position: { x: 30, y: 110 },
      parentNode: "g1",
      extent: "parent",
      data: {
        title: "Repères",
        note: "Objectif: rendre simple",
        items: ["Calories (approx)", "Protéines / jour", "Hydratation", "Horaires"],
      },
    },
    {
      id: "g1-b",
      type: "card",
      position: { x: 270, y: 110 },
      parentNode: "g1",
      extent: "parent",
      data: {
        title: "Assiette-type",
        items: ["Protéines", "Féculents", "Légumes", "Bon gras", "Fruit"],
      },
    },
    {
      id: "g1-c",
      type: "card",
      position: { x: 30, y: 250 },
      parentNode: "g1",
      extent: "parent",
      data: {
        title: "Routine courses",
        items: ["Liste fixe", "2–3 sauces/épices", "Batch-cooking simple"],
      },
    },

    // GROUP 2
    {
      id: "g2",
      type: "group",
      position: { x: 700, y: 140 },
      style: { width: 560, height: 460 },
      data: { title: "Habitudes", subtitle: "Automatiser sans y penser", tag: "S3–S6" },
    },
    {
      id: "g2-a",
      type: "card",
      position: { x: 30, y: 110 },
      parentNode: "g2",
      extent: "parent",
      data: {
        title: "Protéines faciles",
        items: ["Skyr/fromage blanc", "Œufs", "Poulet", "Thon", "Lentilles"],
      },
    },
    {
      id: "g2-b",
      type: "card",
      position: { x: 300, y: 110 },
      parentNode: "g2",
      extent: "parent",
      data: {
        title: "Collations smart",
        items: ["Fruit + yaourt", "Noix (portion)", "Sandwich clean", "Shake"],
      },
    },
    {
      id: "g2-c",
      type: "card",
      position: { x: 30, y: 270 },
      parentNode: "g2",
      extent: "parent",
      data: {
        title: "Gestion sorties",
        items: ["Règle 80/20", "Choix au resto", "Alcool: stratégie"],
      },
    },

    // GROUP 3
    {
      id: "g3",
      type: "group",
      position: { x: 1400, y: 160 },
      style: { width: 560, height: 420 },
      data: { title: "Optimisation", subtitle: "Sport, sommeil, timing, ajustements", tag: "S7–S12" },
    },
    {
      id: "g3-a",
      type: "card",
      position: { x: 30, y: 110 },
      parentNode: "g3",
      extent: "parent",
      data: {
        title: "Timing sport",
        items: ["Avant séance", "Après séance", "Jours off", "Hydratation/sel"],
      },
    },
    {
      id: "g3-b",
      type: "card",
      position: { x: 300, y: 110 },
      parentNode: "g3",
      extent: "parent",
      data: {
        title: "Ajustements",
        items: ["Plateau", "Prise de masse", "Sèche", "Refeed", "Maintenance"],
      },
    },
    {
      id: "g3-c",
      type: "card",
      position: { x: 30, y: 270 },
      parentNode: "g3",
      extent: "parent",
      data: {
        title: "Suivi minimal",
        items: ["Poids (moyenne)", "Tour de taille", "Énergie", "Faim", "Sommeil"],
      },
    },
  ];

  const edges = [
    { id: "e1", source: "g1-a", target: "g1-b", animated: true },
    { id: "e2", source: "g1-b", target: "g2-a", animated: true },
    { id: "e3", source: "g2-a", target: "g2-b", animated: true },
    { id: "e4", source: "g2-b", target: "g3-a", animated: true },
    { id: "e5", source: "g2-c", target: "g3-b", animated: true },
    { id: "e6", source: "g3-a", target: "g3-c", animated: true },
  ];

  const searchParams = useSearchParams();
  const isEdit = searchParams.get("edit") === "1";

  return (
    <Layout>
      <Whiteboard
        title="Roadmap Nutrition"
        subtitle="Whiteboard interactif"
        initialNodes={nodes}
        initialEdges={edges}
        readOnly={!isEdit}
        storageKey="roadmap:nutrition"
        />
    </Layout>
  );
}
