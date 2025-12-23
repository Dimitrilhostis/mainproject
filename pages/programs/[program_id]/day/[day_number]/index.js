// // app/programs/[program_id]/day/[day_number]/page.jsx
// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { supabase } from "@/lib/supabaseClient";
// import ContentOverlay from "@/components/programs/content_overlay";

// export default function ProgramDayPage() {
//   const { program_id, day_number } = useParams(); // ⬅️ récupère les segments d'URL
//   const [day, setDay] = useState(null);

//   useEffect(() => {
//     if (!program_id || !day_number) return; // sécurité

//     async function fetch() {
//       const { data, error } = await supabase
//         .from("program_days")
//         .select("*")
//         .eq("program_id", program_id)
//         .eq("day_number", Number(day_number))
//         .single();

//       if (!error && data) setDay(data);
//     }

//     fetch();
//   }, [program_id, day_number]);

//   if (!day) {
//     return (
//       <div className="w-full h-screen flex items-center justify-center">
//         <p className="text-sm text-[var(--text2)]">
//           Chargement de la séance...
//         </p>
//       </div>
//     );
//   }

//   return <ContentOverlay day={day} onClose={() => history.back()} />;
// }


// app/programs/[program_id]/day/[day_number]/page.jsx

// app/programs/[program_id]/day/[day_number]/page.jsx

// pages/programs/[program_id]/day/[day_number]/index.jsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import ContentOverlay from "@/components/programs/content_overlay";

export default function ProgramDayPage() {
  const router = useRouter();
  const { program_id, day_number } = router.query; // ✅ vient de l'URL
  const [day, setDay] = useState(null);

  useEffect(() => {
    // Au premier render, router.query est souvent vide → on attend.
    if (!program_id || !day_number) return;

    async function fetchDay() {
      const { data, error } = await supabase
        .from("program_days")
        .select("*")
        .eq("program_id", program_id)
        .eq("day_number", Number(day_number))
        .single();

      if (!error && data) {
        setDay(data);
      } else {
        console.error("Erreur Supabase:", error);
      }
    }

    fetchDay();
  }, [program_id, day_number]);

  if (!program_id || !day_number) {
    // query pas encore prêt
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-sm text-[var(--text2)]">
          Préparation de la séance...
        </p>
      </div>
    );
  }

  if (!day) {
    // chargement / fetch en cours
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-sm text-[var(--text2)]">
          Chargement de la séance...
        </p>
      </div>
    );
  }

  return <ContentOverlay day={day} onClose={() => router.back()} />;
}
