"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Loader from "@/components/loader";
import { useAuth } from "@/contexts/auth_context";

export default function UnderConstructionPage() {
  const router = useRouter();
  const { loading: authLoading } = useAuth();
  const [ready, setReady] = useState(false);

  // Petit délai optionnel pour lisser l'affichage après le loader (facultatif)
  useEffect(() => {
    if (!authLoading) {
      const t = setTimeout(() => setReady(true), 150);
      return () => clearTimeout(t);
    }
  }, [authLoading]);

  return (
    <>
      <Header />

      {/* Fond global FIXE (modifie l'URL ou supprime style pour un fond uni) */}
      <main
  className="relative min-h-screen w-full overflow-x-hidden text-[var(--text1)] flex items-center justify-center pt-24 pb-24 bg-no-repeat bg-cover bg-center bg-fixed"
  style={{ backgroundImage: `url("/images/hero-bg.jpg")` }}
>



        {/* Voile pour lisibilité (ajuste l'opacité ou retire-le) */}
        <div className="absolute inset-0 bg-[var(--background)]/60" aria-hidden />

        {/* Contenu principal */}
        {authLoading || !ready ? (
          <div className="relative z-10">
            <Loader />
          </div>
        ) : (
          <div className="relative z-10 text-center max-w-3xl px-6">
            {/* Illustration principale */}
            <div className="mx-auto mb-8">
              <Image
                src="/images/under-construction.svg"
                alt="Section en travaux"
                width={420}
                height={280}
                className="mx-auto drop-shadow-lg"
                priority
              />
            </div>

            {/* Titres */}
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            🚧 Cette partie du site n’est pas encore disponible 🚧
            </h1>
            <p className="text-base md:text-lg text-[var(--text3)] mb-8">
              Restez branchés — ça arrive bientôt !
            </p>

            {/* Barre de progression “fake” pour le fun */}
            <div className="relative w-full md:w-2/3 h-3 rounded-full overflow-hidden bg-[var(--details-dark)]/70 mx-auto mb-10">
            <div className="absolute inset-0 animate-scroll bg-gradient-to-l from-[var(--green1)] via-[var(--green2)] to-[var(--green1)] bg-[length:200%_100%]" />
            </div>


            {/* Petit texte de statut */}
            <p className="mt-10 text-sm text-[var(--text3)]">
              Statut : <span className="text-[var(--green2)]">Phase de finition</span> ·
              Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
            </p>
          </div>
        )}
      </main>

      {/* Styles d’animation (inline, sans dépendance externe) */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 14s linear infinite;
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-float-slow {
          animation: float-slow 5.5s ease-in-out infinite;
        }
        @keyframes float-slower {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float-slower {
          animation: float-slower 7s ease-in-out infinite;
        }
        @keyframes progress {
          0% { width: 0%; }
          60% { width: 72%; }
          100% { width: 85%; }
        }
        .animate-progress {
          animation: progress 2.8s ease-out forwards;
        }
      `}</style>
    </>
  );
}
