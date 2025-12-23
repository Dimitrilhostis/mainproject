// app/programs/page.jsx

import Header from "@/components/header";
import ProgramsView from "@/components/programs";
import Image from "next/image";

export default function ProgramsPage() {
  return (
    <>
      <Header scroll_x={200} time_s={3} />

      {/* Fond global FIXE */}
      <div className="relative w-screen h-screen overflow-hidden">
        {/* Image de fond pleine page */}
        <Image
          src="/images/hero-bg.jpg"
          alt="Background"
          fill
          className="filter brightness-50 object-cover"
          priority
        />

        {/* Overlay sombre pour lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

        {/* Bloc programmes centré au-dessus */}
        <main className="relative z-10 flex items-center justify-center w-full h-full p-4">
          <div className="w-full max-w-5xl">
            <ProgramsView />
          </div>
        </main>
      </div>
    </>
  );
}
