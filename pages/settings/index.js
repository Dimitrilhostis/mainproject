"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from '@/components/layout';
import Header from '@/components/header';
import { motion } from 'framer-motion';
import Loader from '@/components/loader';
import { useAuth } from '@/contexts/auth_context';
import Image from 'next/image';

export default function SettingsPage() {
  const { user, signOut, loading: authLoading } = useAuth();
  const router = useRouter();
  const [active, setActive] = useState('payments');
  const [loading, setLoading] = useState(true);

  // Dummy data
  const [payments, setPayments] = useState([]);
  const plans = ['Gratuit', 'Premium', 'Premium+'];
  const [subscription, setSubscription] = useState('Gratuit');

  // Auth redirect
  useEffect(() => {
    if (!authLoading && !user) router.replace('/login?from=settings');
    else if (user) setLoading(false);
  }, [authLoading, user, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen w-screen">
          <Loader />
        </div>
      </Layout>
    );
  }

  const tabs = [
    { key: 'payments', label: 'Méthodes de paiement' },
    { key: 'subscriptions', label: 'Abonnements' },
    { key: 'account', label: 'Mon compte' },
  ];

  return (
    <Layout>
      <Header />
      <main className="w-full min-h-screen relative overflow-x-hidden">
        {/* Full background image */}
        <div className="fixed inset-0 -z-10">
          <Image
            src="/images/hero-bg.jpg"
            alt="Background"
            fill
            className="object-cover object-center"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 mx-auto mt-24 mb-16 w-full max-w-xl bg-transparent backdrop-blur-lg rounded-3xl p-8"
        >
          <h1 className="text-4xl font-bold mb-6 text-center">Paramètres</h1>

          {/* Tabs navigation full width */}
          <nav className="mb-8">
            <ul className="flex w-full">
              {tabs.map(tab => (
                <li key={tab.key} className="flex-1">
                  <button
                    onClick={() => setActive(tab.key)}
                    className={`w-full py-3 font-medium transition 
                      ${active === tab.key
                        ? 'bg-[var(--green2)] text-white'
                        : 'text-white/70 hover:text-white'}
                    `}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Tab contents */}
          <div className="space-y-6">
            {/* Payments */}
            {active === 'payments' && (
              <div className="space-y-4">
                {payments.length === 0 ? (
                  <p className="text-white/70">Aucune méthode de paiement enregistrée.</p>
                ) : (
                  payments.map(p => (
                    <div key={p.id} className="flex justify-between p-4 bg-white/10 rounded-lg">
                      <span className="text-white">{p.method}</span>
                      <button className="text-red-400 hover:text-red-300">Supprimer</button>
                    </div>
                  ))
                )}
                <button className="w-full py-3 bg-[var(--green2)] text-white rounded-lg">Ajouter une méthode</button>
              </div>
            )}

            {/* Subscriptions */}
            {active === 'subscriptions' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-white/80">Plan actuel :</h2>
                  <p className="mt-2 text-xl font-semibold text-white">{subscription}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {plans.map(plan => (
                    <button
                      key={plan}
                      onClick={() => setSubscription(plan)}
                      className={`py-3 rounded-lg w-full transition 
                        ${subscription === plan
                          ? 'bg-[var(--green2)] text-white'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'}
                      `}
                    >
                      {plan}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Account */}
            {active === 'account' && (
              <div className="space-y-6">
                <p className="text-white">Email : <span className="font-semibold">{user.email}</span></p>
                <button
                  onClick={handleSignOut}
                  className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
                >
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </Layout>
  );
}
