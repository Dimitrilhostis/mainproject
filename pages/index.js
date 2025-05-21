"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout';
import SideBar from '@/components/sidebar';
import ProgramCard from '@/components/cards/card_program';
import { CardSpecial } from '@/components/cards/card_program';
import { supabase } from '../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/auth_context';
import Loader from '@/components/loader';
import MobileNav from '@/components/mobile_nav';
import { IoClose } from 'react-icons/io5';
import { FaMoneyBillAlt, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { GiBiceps } from "react-icons/gi";
import { MdFoodBank, MdCoPresent } from "react-icons/md";





// Motion variants
const fade = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const modalFade = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } }, exit: { opacity: 0, scale: 0.9 } };

export default function HomePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [activeTab, setActiveTab] = useState('plans');

  // Auth check
  useEffect(() => { if (!authLoading && !user) router.replace('/login'); }, [authLoading, user]);

  // Fetch programs
  useEffect(() => {
    if (authLoading || !user) return;
    supabase.from('programs').select('*').then(({ data }) => { setPrograms(data || []); setLoading(false); });
  }, [authLoading, user]);

  useEffect(() => {
    if (selectedService) {
      setActiveTab(selectedService);
    }
  }, [selectedService]);

  if (authLoading || loading) {
    return <Layout><div className="flex items-center justify-center h-screen w-screen"><Loader /></div></Layout>;
  }

  const services = [
    { id: 'sport', title: 'Sportif', icone: <GiBiceps className="absolute top-4 right-4 text-purple-400 text-2xl"/> },
    { id: 'nutrition', title: 'Nutrition', icone: <MdFoodBank className="absolute top-4 right-4 text-purple-400 text-2xl"/> },
    { id: 'plans', title: 'Offres', icone: <FaMoneyBillAlt className="absolute top-4 right-4 text-purple-400 text-2xl"/> },
    { id: 'demo', title: 'Démo', icone: <MdCoPresent className="absolute top-4 right-4 text-purple-400 text-2xl"/> },
  ];
  const planDetails = [
    { name: 'Free', price: 'Gratuit', concept1: '3 recettes/3 mois', concept2: '3 séances/3 mois' },
    { name: 'Basic', price: '10€/mois', concept1: '100+ recettes', concept2: '20+ entraînements' },
    { name: 'Premium', price: '49€/mois', concept1: 'Programme adapté', concept2: 'Coachs dédiés' },
    { name: 'VIP', price: '79€/mois', concept1: 'Accès illimité', concept2: 'Communauté VIP' }
  ];

  return (
    <Layout>
      <div className="flex h-screen w-screen">
        {/* Sidebar */}
        <aside className="hidden md:flex">
          <SideBar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-auto bg-gray-50">

          {/* Hero Banner */}
          <motion.section
            className="h-[50vh] w-full flex py-10 items-center justify-center bg-gradient-to-r from-violet-600 via-purple-500 to-pink-400 text-white"
            variants={fade} initial="hidden" animate="visible"
          >
            <div className="text-center px-4">
              <h1 className="text-5xl font-extrabold mb-8">Atteins Tes Objectifs</h1>
              <p className="text-lg">Coaching sportif et nutritionnel sur mesure</p>
            </div>
          </motion.section>

          {/* Decorative Accent */}
          <div className="h-4 bg-gradient-to-r from-purple-600 to-fuchsia-600" />

          {/* Services Section */}
          <motion.section id="services" className="py-12 px-6 bg-white" variants={fade} initial="hidden" animate="visible">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Nos Services</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {services.map(s => (
                  <motion.div
                    key={s.id}
                    className="relative bg-gray-100 rounded-2xl p-6 hover:bg-white hover:shadow-lg transition"
                    whileHover={{ y: -4 }}
                    onClick={() => {
                         setSelectedService(s.id);
                         setActiveTab(s.id);
                       }}
                    >
                    {s.icone}
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{s.title}</h3>
                    <p className="text-gray-600">Clique pour découvrir</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Programmes Section */}
          <section id="programs" className="py-12 px-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center mb-8">
                <div className="h-1 w-12 bg-purple-600 mr-3"></div>
                <h2 className="text-3xl font-bold text-gray-800">Programmes Phare</h2>
                <div className="h-1 w-12 bg-purple-600 ml-3"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {programs.map(p => <ProgramCard key={p.uuid} program={p} />)}
              </div>
            </div>
          </section>

          {/* Decorative Footer Accent */}
          <div className="h-2 bg-gradient-to-r from-fuchsia-600 to-violet-600" />

          {/* Footer */}
          <footer id="contact" className="bg-white py-8 shadow-inner mb-8 md:mb-0">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <p className="text-gray-600 mb-4">Tous droits réservés.</p>
              <p className="text-gray-600 mb-4">@TheSmartWay</p>
              
            </div>
          </footer>

        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Modal */}
      <AnimatePresence>
        {selectedService && (
          <>
            <motion.div className="fixed inset-0 bg-black bg-opacity-40" variants={modalFade} initial="hidden" animate="visible" exit="exit" onClick={() => setSelectedService(null)} />
            <motion.div className="fixed inset-0 flex flex-col bg-gradient-to-br from-violet-600 via-purple-400 to-fuchsia-400 text-white overflow-auto" variants={modalFade} initial="hidden" animate="visible" exit="exit" onClick={e => e.stopPropagation()}>
              <div className="p-4 flex justify-end"><button onClick={() => setSelectedService(null)}><IoClose size={28} /></button></div>
              <nav className="flex justify-center space-x-4 py-2 sticky top-0 bg-transparent">
                {services.map(s => (
                  <button key={s.id} onClick={() => setActiveTab(s.id)} className={`px-4 py-2 rounded-full transition ${activeTab===s.id?'bg-white text-purple-600':'bg-white/30 text-white hover:bg-white/50'}`}>{s.title}</button>
                ))}
              </nav>
              <div className="flex-1 p-6">
                {activeTab==='plans' && (
                  <div className="grid grid-cols-2 grid-rows-2 gap-6 h-full">
                    {planDetails.map(plan => (
                      <div key={plan.name} className="bg-white/20 p-6 rounded-2xl flex flex-col justify-between shadow-md hover:bg-white/30">
                        <div><h3 className="text-xl font-bold">{plan.name}</h3><p className="text-lg font-semibold mt-1">{plan.price}</p></div>
                        <div className="mt-2 text-sm"><p>{plan.concept1}</p><p>{plan.concept2}</p></div>
                        <button className="mt-4 py-2 bg-white/30 rounded-full text-white font-medium hover:bg-white/50">Choisir</button>
                      </div>
                    ))}
                  </div>
                )}
                {/* TODO: sport, nutrition, demo */}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Layout>
  );
}
