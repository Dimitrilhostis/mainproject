"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function IngredientForm({ toEdit, onSaved }) {
  const [form, setForm] = useState({ name: '', image_url: '/images/', icon_url: '<  />', micronutrients: '', apports: '', associations: '', infos_sup: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (toEdit) setForm(toEdit); }, [toEdit]);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });
  const save = async e => {
    e.preventDefault(); setLoading(true);
    const payload = { ...form }; let res, error;
    if (toEdit) await supabase.from('ingredients').update(payload).eq('id', form.id);
    else { payload.uuid = crypto.randomUUID(); ({ data: res, error } = await supabase.from('ingredients').insert([payload])); }
    if (error) {console.error('❌ Supabase error:', error); alert('Erreur : ' + error.message); setLoading(false); return;}
    setLoading(false); onSaved();
  };

  return (
    <form onSubmit={save} className="bg-white p-4 rounded-lg shadow space-y-2">
      <h2 className="text-lg font-bold">{toEdit? 'Modifier':'Créer'} Ingredient</h2>

      <label className='text-neutral-500'>Nom</label>
      <input name="name" value={form.name} onChange={handle} className="w-full p-2 border rounded" />
      <label className='text-neutral-500'>URL de l&apos;image</label>
      <input name="image_url" value={form.image_url} onChange={handle} className="w-full p-2 border rounded" />
      <label className='text-neutral-500'>URL de l&apos;icone</label>
      <input name="icon_url" value={form.icon_url} onChange={handle} className="w-full p-2 border rounded" />
      <label className='text-neutral-500'>Micronutriments</label>
      <textarea name="micronutrients" value={form.micronutrients} onChange={handle} className="w-full p-2 border rounded h-16" />
      <label className='text-neutral-500'>Apports</label>
      <textarea name="apports" value={form.apports} onChange={handle} className="w-full p-2 border rounded h-16" />
      <label className='text-neutral-500'>Associations</label>
      <textarea name="associations" value={form.associations} onChange={handle} className="w-full p-2 border rounded h-16" />
      <label className='text-neutral-500'>Info supplémentaires</label>
      <textarea name="infos_sup" value={form.infos_sup} onChange={handle} className="w-full p-2 border rounded h-16" />
      <button type="submit" disabled={loading} className="w-full mt-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded disabled:opacity-50">
        {toEdit? 'Enregistrer':'Créer'}
      </button>
    </form>
  );
}