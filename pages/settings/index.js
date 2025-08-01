"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout';
import Header from '@/components/header';
import Loader from '@/components/loader';
import { useAuth } from '@/contexts/auth_context';
import Image from 'next/image';
import Link from 'next/link';

export default function SettingsPage() {
  const router = useRouter();
  const { user, signOut, loading: authLoading } = useAuth();
  const [active, setActive] = useState('payments');
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const plans = ['Gratuit', 'Premium', 'Premium+'];
  const [subscription, setSubscription] = useState('Gratuit');

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
        <div className="fixed inset-0 flex items-center justify-center bg-[var(--background)]">
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

      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="Hero"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-[var(--background)]/80 via-[var(--background)]/40 to-[var(--background)]" />
        <div className="absolute inset-0 z-20 bg-[var(--background)]/60" />
        <div className="relative z-30 text-center px-4">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-16 text-[var(--text1)]">
            Paramètres du compte
          </h1>
        </div>
      </section>

      <main className="relative w-full overflow-x-hidden bg-[var(--background)] text-[var(--text1)] -mt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-[var(--light-dark)] bg-opacity-80 backdrop-blur-sm rounded-3xl p-8">
            {/* Tabs */}
            <nav className="mb-8">
              <ul className="flex space-x-4">
                {tabs.map(tab => (
                  <li key={tab.key} className="flex-1">
                    <button
                      onClick={() => setActive(tab.key)}
                      className={`w-full py-3 text-center font-medium rounded-lg transition 
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
            <div className="text-[var(--text2)]">
              {active === 'payments' && (
                <div className="space-y-4">
                  {payments.length === 0 ? (
                    <p>Aucune méthode de paiement enregistrée.</p>
                  ) : (
                    payments.map(p => (
                      <div key={p.id} className="flex justify-between p-4 bg-white/10 rounded-lg">
                        <span>{p.method}</span>
                        <button className="text-red-400 hover:text-red-300">Supprimer</button>
                      </div>
                    ))
                  )}
                  <button className="mt-4 w-full py-3 bg-[var(--green2)] hover:bg-[var(--green3)] text-[var(--background)] rounded-lg">
                    Ajouter une méthode
                  </button>
                </div>
              )}

              {active === 'subscriptions' && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg text-[var(--text1)]">Plan actuel :</h2>
                    <p className="mt-1 text-xl font-semibold text-[var(--green1)]">{subscription}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {plans.map(plan => (
                      <button
                        key={plan}
                        onClick={() => setSubscription(plan)}
                        className={`py-3 rounded-lg w-full transition 
                          ${subscription === plan
                            ? 'bg-[var(--green2)] text-[var(--background)]'
                            : 'bg-white/10 text-[var(--text1)] hover:bg-white/20'}
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
                  <p>Email : <span className="font-semibold text-[var(--text1)]">{user.email}</span></p>
                  <button
                    onClick={handleSignOut}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  >
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
