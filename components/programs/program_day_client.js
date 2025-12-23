// components/programs/day_client.jsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ContentOverlay from "@/components/programs/content_overlay";

export default function ProgramDayClient({ program_id, day_number }) {
  const [day, setDay] = useState(null);

  useEffect(() => {
    if (!program_id || !day_number) return;

    async function fetch() {
      const { data, error } = await supabase
        .from("program_days")
        .select("*")
        .eq("program_id", program_id)
        .eq("day_number", Number(day_number))
        .single();

      if (!error && data) setDay(data);
    }

    fetch();
  }, [program_id, day_number]);

  if (!day) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-sm text-[var(--text2)]">
          Chargement de la séance...
        </p>
      </div>
    );
  }

  return <ContentOverlay day={day} onClose={() => history.back()} />;
}
