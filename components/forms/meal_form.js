"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function MealForm({ toEdit, onSaved }) {
  const [form, setForm] = useState({ name: '', ingredient_uuid: [], preparation_uuid: [], variantes: '', saison: '', image_url: '', time_min: 0, difficulty: 1, price: 0, tips: '', video_url: '', cover_video:'' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (toEdit) setForm(toEdit); }, [toEdit]);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async e => {
    e.preventDefault(); setLoading(true);
    const payload={...form};
    if(toEdit) await supabase.from('meals').update(payload).eq('id', form.id);
    else { payload.id = crypto.randomUUID(); await supabase.from('meals').insert(payload); }
    setLoading(false); onSaved();
  };

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded-lg shadow space-y-2">
      <h2 className="text-lg font-bold">{toEdit?'Modifier':'Créer'} Meal</h2>
      <label className='text-neutral-500'>Nom</label>
      <input name="name" value={form.name} onChange={handle} className="w-full p-2 border rounded" />
      <label className='text-neutral-500'>UUID des ingrédients</label>
      <input name="ingredient_uuid" value={form.ingredient_uuid.join(',')} onChange={e=>setForm({...form, ingredient_uuid:e.target.value.split(',')})} className="w-full p-2 border rounded" />
      <label className='text-neutral-500'>UUID des préparations</label>
      <input name="preparation_uuid" value={form.preparation_uuid.join(',')} onChange={e=>setForm({...form, preparation_uuid:e.target.value.split(',')})} className="w-full p-2 border rounded" />
      <label className='text-neutral-500'>Variantes</label>
      <input name="variantes" value={form.variantes} onChange={handle} className="w-full p-2 border rounded" />
      <label className='text-neutral-500'>Saison</label>
      <input name="saison" value={form.saison} onChange={handle} className="w-full p-2 border rounded" />
      <label className='text-neutral-500'>URL de l&apos;image</label>
      <input name="image_url" value={form.image_url} onChange={handle} className="w-full p-2 border rounded" />
      <label className='text-neutral-500'>Temps en minutes</label>
      <input name="time_min" type="number" value={form.time_min} onChange={handle} className="w-full p-2 border rounded" />
      <label className='text-neutral-500'>Difficulté</label>
      <input name="difficulty" type="number" value={form.difficulty} onChange={handle} className="w-full p-2 border rounded" />
      <label className='text-neutral-500'>Prix</label>
      <input name="price" type="number" value={form.price} onChange={handle} className="w-full p-2 border rounded" />
      <label className='text-neutral-500'>Tips</label>
      <textarea name="tips" value={form.tips} onChange={handle} className="w-full p-2 border rounded h-16" />
      <label className='text-neutral-500'>URL de la vidéo</label>
      <input name="video_url" value={form.video_url} onChange={handle} className="w-full p-2 border rounded" />
      <label className='text-neutral-500'>Cover de la vidéo (URL)</label>
      <input name="cover_video" value={form.cover_video} onChange={handle} className="w-full p-2 border rounded" />
      <button type="submit" disabled={loading} className="w-full mt-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded disabled:opacity-50">
        {toEdit?'Enregistrer':'Créer'}
      </button>
    </form>
  );
}