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
  const [payments, setPayments] = useState([]);
  const plans = ['Gratuit', 'Premium', 'Premium+'];
  const [subscription, setSubscription] = useState('Gratuit');

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?from=settings');
    } else if (user) {
      setLoading(false);
    }
  }, [authLoading, user, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen w-screen bg-[var(--background)]">
          <Loader />
        </div>
      </Layout>
    );
  }

  const tabs = [
    { key: 'payments', label: 'Méthodes de paiement' },
    { key: 'subscriptions', label: 'Abonnements & achats' },
    { key: 'account', label: 'Mon compte' },
  ];

  return (
    <Layout>
      <Header />
      <main className="w-screen min-h-screen relative bg-[var(--background)] text-[var(--text1)]">
        {/* Full background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="Background"
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-[var(--background)]/40" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 mx-auto mt-24 mb-16 w-full max-w-4xl bg-transparent backdrop-blur-2xl rounded-3xl p-8 shadow-xl"
        >
          <h1 className="text-4xl font-bold mb-6 text-center">Paramètres</h1>

          {/* Tabs navigation - full width */}
          <nav className="mb-8">
            <ul className="flex w-full">
              {tabs.map(tab => (
                <li key={tab.key} className="flex-1">
                  <button
                    onClick={() => setActive(tab.key)}
                    className={`w-full text-center py-3 text-md font-medium transition 
                      ${active === tab.key
                        ? 'bg-[var(--green2)] text-[var(--background)]'
                        : 'text-[var(--text2)] hover:bg-[var(--light-dark)] hover:text-[var(--text1)]'}
                    `}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Tab content */}
          <div className="space-y-6">
            {active === 'payments' && (
              <div className="space-y-4">
                {payments.length === 0 ? (
                  <p className="text-[var(--text2)]">Aucune méthode de paiement enregistrée.</p>
                ) : (
                  payments.map(p => (
                    <div key={p.id} className="flex justify-between p-4 bg-[var(--light-dark)] rounded-lg">
                      <span>{p.method}</span>
                      <button className="text-red-500 hover:text-red-400">Supprimer</button>
                    </div>
                  ))
                )}
                <button className="mt-4 w-full py-3 bg-[var(--green2)] hover:bg-[var(--green3)] text-[var(--background)] rounded-lg transition">
                  Ajouter une méthode
                </button>
              </div>
            )}

            {active === 'subscriptions' && (
              <div className="space-y-4">
                <div>
                  <h2 className="font-medium">Plan actuel :</h2>
                  <p className="mt-2 text-lg font-semibold">{subscription}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {plans.map(plan => (
                    <button
                      key={plan}
                      onClick={() => setSubscription(plan)}
                      className={`py-3 rounded-lg w-full transition 
                        ${subscription === plan
                          ? 'bg-[var(--green2)] text-[var(--background)]'
                          : 'bg-[var(--light-dark)] text-[var(--text1)] hover:bg-[var(--details-dark)]'}
                      `}
                    >
                      {plan}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {active === 'account' && (
              <div className="space-y-6">
                <p>Email : <span className="font-semibold">{user.email}</span></p>
                <button
                  onClick={handleSignOut}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
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
