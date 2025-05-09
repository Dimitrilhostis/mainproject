"use client";

import { useState } from 'react';
import Layout from '../components/layout';
import SideBar from '../components/sidebar';
import { FaHome } from 'react-icons/fa';
import { IoIosSearch } from 'react-icons/io';
import { LuCrown } from 'react-icons/lu';
import { IoSettingsSharp } from 'react-icons/io5';
import { Card, CardSpecial } from '../components/cards/card_program'

const samplePrograms = [
  { id: 1, title: 'Nutrition Basics', description: 'Learn the fundamentals of balanced eating.', category: 'nutrition' },
  { id: 2, title: 'Home Workout', description: 'Stay fit with minimal equipment.', category: 'sport' },
  { id: 3, title: 'Holistic Health', description: 'Combine diet and exercise for max results.', category: 'both' },
  { id: 4, title: 'Vegan Diet', description: 'Plant-based nutrition program.', category: 'nutrition' },
  { id: 5, title: 'Cardio Blast', description: 'High-intensity cardio workout.', category: 'sport' },
  { id: 6, title: 'Mind & Body', description: 'Wellness and workout combined.', category: 'both' },
  { id: 7, title: 'Macro Balance', description: 'Track macros for better health.', category: 'nutrition' },
];

const sampleSpecialPrograms = [
  { id: 1, title: 'Nutrition Advanced', description: 'Deep dive into macros and micros.', extra: 'Includes meal plans and shopping lists.', category: 'nutrition' },
  { id: 2, title: 'Endurance Training', description: 'Build stamina over weeks.', extra: 'Weekly mileage tracker.', category: 'sport' },
  { id: 3, title: 'Balanced Lifestyle', description: 'Integration of diet and exercise.', extra: 'Personalized coaching tips.', category: 'both' },
  { id: 4, title: 'Gut Health', description: 'Optimize digestion and wellness.', extra: 'Probiotic meal guide.', category: 'nutrition' },
  { id: 5, title: 'Strength Builder', description: 'Progressive strength routines.', extra: 'Focus on compound lifts.', category: 'sport' },
  { id: 6, title: 'Zen Fitness', description: 'Yoga and light cardio combo.', extra: 'Mindfulness sessions included.', category: 'both' },
  { id: 7, title: 'Keto Kickstart', description: 'Low-carb ketogenic diet plan.', extra: 'Weekly progress checks.', category: 'nutrition' },
];

export default function ProgramsPage() {

  const [filter, setFilter] = useState('all');
  const filtered = samplePrograms.filter(
    p => filter === 'all' || p.category === filter
  );
  const filteredSpecials = sampleSpecialPrograms.filter(
    p => filter === 'all' || p.category === filter
  );

  // Chunk and alternate rows
  const simplePerRow = 5;
  const specialPerRow = 4;
  const simpleChunks = [];
  for (let i = 0; i < filtered.length; i += simplePerRow) {
    simpleChunks.push(filtered.slice(i, i + simplePerRow));
  }
  const specialChunks = [];
  for (let i = 0; i < filteredSpecials.length; i += specialPerRow) {
    specialChunks.push(filteredSpecials.slice(i, i + specialPerRow));
  }
  const maxRows = Math.max(simpleChunks.length, specialChunks.length);

  return (
    <Layout>
      <div className="flex w-screen h-screen">
        <SideBar
          minWidth={65}
          maxWidth={250}
          defaultWidth={65}
        />
        <div className="flex-1 flex flex-col bg-gray-100">
          <div className="relative flex items-center py-6">
            {/* Filters on top-left */}
            <div className="absolute left-8 flex gap-4">
              {['all', 'nutrition', 'sport', 'both'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded ${
                    filter === cat ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                  } shadow`}
                >
                  {cat === 'all' ? 'Tous' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
            {/* Title centered */}
            <h1 className="mx-auto text-4xl font-bold">Nos Programmes</h1>
          </div>
          <div className="flex-1 overflow-auto p-8">
            {Array.from({ length: maxRows * 2 }).map((_, r) => {
              const isSimple = r % 2 === 0;
              const idx = Math.floor(r / 2);
              const rowItems = isSimple ? simpleChunks[idx] || [] : specialChunks[idx] || [];
              if (rowItems.length === 0) return null;
              const cols = isSimple ? 'lg:grid-cols-5' : 'lg:grid-cols-4';
              return (
                <div
                  key={r}
                  className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${isSimple ? 5 : 4} ${cols} gap-6 justify-items-center mb-8`}
                >
                  {rowItems.map(program =>
                    isSimple ? (
                      <Card
                        key={`simple-${program.id}`}
                        title={program.title}
                        content={program.description}
                        category={program.category}
                      />
                    ) : (
                      <CardSpecial
                        key={`special-${program.id}`}
                        title={program.title}
                        content={program.description}
                        extra={program.extra}
                        category={program.category}
                      />
                    )
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
