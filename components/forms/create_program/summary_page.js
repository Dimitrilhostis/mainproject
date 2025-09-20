import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function SummaryPage({ answers }) {
  async function handleSubmit() {
    await supabase.from('profiles').insert([answers]);
    // redirection ou message de succès
  }

  return (
    <div className="p-8">
      <h2>Récapitulatif</h2>
      <pre>{JSON.stringify(answers, null, 2)}</pre>
      <button className="btn btn-primary" onClick={handleSubmit}>
        Lancer mon programme
      </button>
    </div>
  );
}