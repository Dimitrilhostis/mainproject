"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from '@/components/layout';
import Header from '@/components/header';
import { motion } from 'framer-motion';
import Loader from '@/components/loader';
import MobileNav from '@/components/nav/mobile_nav';
import { useAuth } from '@/contexts/auth_context';
import Image from 'next/image';

export default function SettingsPage() {
  const { user, signOut, loading: authLoading } = useAuth();
  const router = useRouter();
  const [active, setActive] = useState('account');
  const [loading, setLoading] = useState(true);

  // Mock payment methods
  const [payments, setPayments] = useState([
    { id: 1, method: 'Visa **** 1234' },
    { id: 2, method: 'Mastercard **** 5678' },
  ]);

  // Mock subscription
  const plans = ['Gratuit', 'Premium', 'Premium+'];
  const [subscription, setSubscription] = useState('Premium');
  const [purchases, setPurchases] = useState([
    'E‑book Nutrition 101',
    'Pack Yoga Débutant',
  ]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?from=settings');
    } else if (user) {
      setLoading(false);
    }
  }, [authLoading, user]);

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
    { key: 'account', label: 'Mon compte' },
    { key: 'payments', label: 'Méthodes de paiement' },
    { key: 'subscriptions', label: 'Abonnements & achats' },
  ];

  return (
    <Layout>
      <Header />
      <main className="w-screen min-h-screen relative bg-[var(--background)] text-[var(--text1)]">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-[var(--background)]/80" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-lg mx-auto mt-24 mb-16 bg-transparent backdrop-blur-2xl border border-[var(--text3)]/20 rounded-3xl p-6 shadow-xl"
        >
          <h1 className="text-3xl font-bold mb-4">Paramètres</h1>

          {/* Tabs */}
          <nav className="mb-6">
            <ul className="flex space-x-4">
              {tabs.map(tab => (
                <li key={tab.key}>
                  <button
                    onClick={() => setActive(tab.key)}
                    className={`px-3 py-1 text-sm font-medium rounded-full transition $
                      {active === tab.key
                        ? 'bg-[var(--green2)] text-[var(--background)]'
                        : 'text-[var(--text2)] hover:text-[var(--text1)]'}
                    `}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <div className="space-y-6">
            {active === 'account' && (
              <div className="space-y-4">
                <p>Email : <span className="font-semibold">{user.email}</span></p>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                >
                  Se déconnecter
                </button>
              </div>
            )}

            {active === 'payments' && (
              <div className="space-y-4">
                {payments.map(p => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center p-3 bg-[var(--light-dark)] rounded-lg"
                  >
                    <span>{p.method}</span>
                    <button className="text-red-500 hover:text-red-400">
                      Supprimer
                    </button>
                  </div>
                ))}
                <button className="mt-2 px-4 py-2 bg-[var(--green2)] hover:bg-[var(--green3)] text-[var(--background)] rounded-lg transition">
                  Ajouter une méthode
                </button>
              </div>
            )}

            {active === 'subscriptions' && (
              <div className="space-y-4">
                <div>
                  <h2 className="font-medium">Plan actuel :</h2>
                  <p className="mt-1 font-semibold">{subscription}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {plans.map(plan => (
                    <button
                      key={plan}
                      onClick={() => setSubscription(plan)}
                      className={`px-4 py-2 rounded-lg transition $
                        {subscription === plan
                          ? 'bg-[var(--green2)] text-[var(--background)]'
                          : 'bg-[var(--light-dark)] text-[var(--text1)] hover:bg-[var(--details-dark)]'}
                      `}
                    >
                      {plan}
                    </button>
                  ))}
                </div>
                <div>
                  <h2 className="font-medium">Achats :</h2>
                  <ul className="mt-2 space-y-2">
                    {purchases.map(item => (
                      <li key={item} className="flex justify-between p-3 bg-[var(--light-dark)] rounded-lg">
                        <span>{item}</span>
                        <span className="font-semibold">Acheté</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <MobileNav />
      </main>
    </Layout>
  );
}
