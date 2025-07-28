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
  const [active, setActive] = useState('payments');
  const [loading, setLoading] = useState(true);

  // No predefined payment methods
  const [payments, setPayments] = useState([]);

  // Subscription plans
  const plans = ['Gratuit', 'Premium', 'Premium+'];
  const [subscription, setSubscription] = useState('Gratuit');

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
          <Image src="/images/hero-bg.jpg" alt="Background" fill className="object-contain object-top" />
        </div>
        <div className="absolute inset-0 bg-[var(--background)]/50" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 max-w-lg mx-auto mt-24 mb-16 bg-transparent backdrop-blur-2xl border border-[var(--text3)]/30 rounded-3xl p-6 shadow-xl"
        >
          <h1 className="text-3xl font-bold mb-4">Paramètres</h1>

          {/* Tabs navigation */}
          <nav className="mb-6">
            <ul className="flex space-x-4">
              {tabs.map(tab => (
                <li key={tab.key}>
                  <button
                    onClick={() => setActive(tab.key)}
                    className={`px-4 py-1 text-sm font-medium rounded-full transition 
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
            {/* Payments tab */}
            {active === 'payments' && (
              <div className="space-y-4">
                {payments.length === 0 ? (
                  <p className="text-[var(--text2)]">Aucune méthode de paiement enregistrée.</p>
                ) : (
                  payments.map(p => (
                    <div key={p.id} className="flex justify-between p-3 bg-[var(--light-dark)] rounded-lg">
                      <span>{p.method}</span>
                      <button className="text-red-500 hover:text-red-400">Supprimer</button>
                    </div>
                  ))
                )}
                <button className="mt-2 px-4 py-2 bg-[var(--green2)] hover:bg-[var(--green3)] text-[var(--background)] rounded-lg transition">
                  Ajouter une méthode
                </button>
              </div>
            )}

            {/* Subscriptions tab */}
            {active === 'subscriptions' && (
              <div className="space-y-4">
                <div>
                  <h2 className="font-medium">Plan actuel :</h2>
                  <p className="mt-1 font-semibold">{subscription}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {plans.map(plan => (
                    <button
                      key={plan}
                      onClick={() => setSubscription(plan)}
                      className={`px-3 py-2 rounded-lg transition 
                        ${subscription === plan
                          ? 'bg-[var(--green2)] text-[var(--background)]'
                          : 'bg-[var(--light-dark)] text-[var(--text1)] hover:bg-[var(--details-dark)] hover:text-[var(--text1)]'}
                      `}
                    >
                      {plan}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Account tab */}
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
          </div>
        </motion.div>

        <MobileNav />
      </main>
    </Layout>
  );
}
