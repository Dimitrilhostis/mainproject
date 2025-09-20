"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout';
import Header from '@/components/header';
import Loader from '@/components/loader';
import { useAuth } from '@/contexts/auth_context';
import Image from 'next/image';
import Link from 'next/link';
import UnderConstructionPage from '@/components/under_construction';

export default function SettingsPage() {
  const router = useRouter();
  const { user, signOut, loading: authLoading } = useAuth();
  const [active, setActive] = useState('payments');
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const plans = ['Gratuit', 'Premium', 'Premium+'];
  const [subscription, setSubscription] = useState('Gratuit');

  // useEffect(() => {
  //   if (!authLoading && !user) router.replace('/login?from=settings');
  //   else if (user) setLoading(false);
  // }, [authLoading, user, router]);

  // const handleSignOut = async () => {
  //   await signOut();
  //   router.push('/');
  // };

  // if (authLoading || loading) {
  //   return (
  //     <Layout>
  //       <div className="fixed inset-0 flex items-center justify-center bg-[var(--background)]">
  //         <Loader />
  //       </div>
  //     </Layout>
  //   );
  // }

  return (
    <Layout>
      <UnderConstructionPage />
    </Layout>)

  // const tabs = [
  //   { key: 'payments', label: 'Méthodes de paiement' },
  //   { key: 'subscriptions', label: 'Abonnements' },
  //   { key: 'account', label: 'Mon compte' },
  // ];

  // return (
  //   <Layout>
  //     <Header />
  //     <main className="relative w-full min-h-screen flex items-center justify-center overflow-x-hidden bg-[var(--background)]">
  //       {/* background image */}
  //       <div className="fixed inset-0 -z-10">
  //         <Image
  //           src="/images/hero-bg.jpg"
  //           alt="Background"
  //           fill
  //           className="object-cover object-center"
  //           priority
  //         />
  //       </div>
  //       {/* dark blur overlay */}
  //       <div className="fixed inset-0 -z-5 bg-[var(--background)]/70 backdrop-blur-md" />

  //       {/* content */}
  //       <div className="relative z-10 max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl mx-4">
  //         <h1 className="text-3xl font-bold text-center text-[var(--text1)] mb-6">Paramètres</h1>

  //         <nav className="mb-6">
  //           <ul className="flex">
  //             {tabs.map(tab => (
  //               <li key={tab.key} className="flex-1">
  //                 <button
  //                   onClick={() => setActive(tab.key)}
  //                   className={`w-full py-2 text-center font-medium rounded-lg transition 
  //                     ${active === tab.key
  //                       ? 'bg-[var(--green2)] text-[var(--background)]'
  //                       : 'text-[var(--text2)] hover:bg-white/20 hover:text-[var(--text1)]'}
  //                   `}
  //                 >
  //                   {tab.label}
  //                 </button>
  //               </li>
  //             ))}
  //           </ul>
  //         </nav>

  //         <div className="space-y-4 text-[var(--text1)]">
  //           {active === 'payments' && (
  //             <div className="space-y-3">
  //               {payments.length === 0 ? (
  //                 <p className="text-center text-[var(--text2)]">Aucune méthode de paiement.</p>
  //               ) : (
  //                 payments.map(p => (
  //                   <div key={p.id} className="flex justify-between p-3 bg-white/20 rounded-lg">
  //                     <span>{p.method}</span>
  //                     <button className="text-red-400 hover:text-red-300">Supprimer</button>
  //                   </div>
  //                 ))
  //               )}
  //               <button className="w-full py-2 bg-[var(--green2)] text-[var(--background)] rounded-lg">
  //                 Ajouter une méthode
  //               </button>
  //             </div>
  //           )}

  //           {active === 'subscriptions' && (
  //             <div className="space-y-4">
  //               <div>
  //                 <h2 className="text-lg">Plan actuel :</h2>
  //                 <p className="text-2xl font-semibold text-[var(--green1)]">{subscription}</p>
  //               </div>
  //               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
  //                 {plans.map(plan => (
  //                   <button
  //                     key={plan}
  //                     onClick={() => setSubscription(plan)}
  //                     className={`py-2 rounded-lg w-full transition 
  //                       ${subscription === plan
  //                         ? 'bg-[var(--green2)] text-[var(--background)]'
  //                         : 'bg-white/20 text-[var(--text1)] hover:bg-white/30'}
  //                     `}
  //                   >
  //                     {plan}
  //                   </button>
  //                 ))}
  //               </div>
  //             </div>
  //           )}

  //           {active === 'account' && (
  //             <div className="space-y-6">
  //               <p>Email : <span className="font-semibold">{user.email}</span></p>
  //               <button
  //                 onClick={handleSignOut}
  //                 className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
  //               >
  //                 Se déconnecter
  //               </button>
  //             </div>
  //           )}
  //         </div>
  //       </div>
  //     </main>
  //   </Layout>
  // );
}
