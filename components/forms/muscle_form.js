"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function MuscleForm({ toEdit, onSaved }) {
  const [form, setForm] = useState({ name: '', origine: '', terminaison: '', fonctions: '', articulations: '', nerfs: '', arteres: '', chaine_musculaire: '', douleurs: '', image_url: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (toEdit) setForm(toEdit); }, [toEdit]);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });
  const save = async e => {
    e.preventDefault(); setLoading(true);
    const payload = { ...form };
    if (toEdit) await supabase.from('muscles').update(payload).eq('id', form.id);
    else { payload.id = crypto.randomUUID(); await supabase.from('muscles').insert(payload); }
    setLoading(false); onSaved();
  };

  return (
    <form onSubmit={save} className="bg-white p-4 rounded-lg shadow space-y-2">
      <h2 className="text-lg font-bold">{toEdit ? 'Modifier' : 'Créer'} Muscle</h2>
      {['name','origine','terminaison','fonctions','articulations','nerfs','arteres','chaine_musculaire','douleurs','image_url'].map(field => (
        <input
          key={field}
          name={field}
          value={form[field]}
          onChange={handle}
          placeholder={field.replace('_',' ')}
          className="w-full p-2 border rounded"
        />
      ))}
      <button type="submit" disabled={loading} className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white rounded disabled:opacity-50">
        {toEdit ? 'Enregistrer' : 'Créer'}
      </button>
    </form>
  );
}