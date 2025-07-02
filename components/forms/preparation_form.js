"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function PreparationForm({ toEdit, onSaved }) {
  const [form, setForm] = useState({ name:'', ingredient_uuid: '', preparation: [''], association: '', image_url: '', tips: '', variantes: '', video_url: '', cover_video:'' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (toEdit) setForm(toEdit); }, [toEdit]);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async e => {
    e.preventDefault(); setLoading(true);
    const payload = { ...form };
    if (toEdit) await supabase.from('preparations').update(payload).eq('id', form.id);
    else { payload.id = crypto.randomUUID(); await supabase.from('preparations').insert(payload); }
    setLoading(false); onSaved();
  };

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded-lg shadow space-y-2">
      <h2 className="text-lg font-bold">{toEdit? 'Modifier':'Créer'} Préparation</h2>
      <label className='text-neutral-500'>Name</label>
      <input name="name" value={form.name} onChange={handle} className="w-full p-2 border rounded" />
      <label className='text-neutral-500'>UUID des ingrédients</label>
      <input name="ingredient_uuid" value={form.ingredient_uuid} onChange={handle} className="w-full p-2 border rounded" />
      <label className='text-neutral-500'>Préparation</label>
      <textarea name="preparation" value={form.preparation.join('\n')} onChange={e=>setForm({...form, preparation: e.target.value.split('\n')})} className="w-full p-2 border rounded h-20" />
      <label className='text-neutral-500'>Associations</label>
      <input name="association" value={form.association} onChange={handle} className="w-full p-2 border rounded" />
      <label className='text-neutral-500'>URL de l&apos;image</label>
      <input name="image_url" value={form.image_url} onChange={handle} className="w-full p-2 border rounded" />
      <label className='text-neutral-500'>Tips</label>
      <textarea name="tips" value={form.tips} onChange={handle} className="w-full p-2 border rounded h-16" />
      <label className='text-neutral-500'>Variantes</label>
      <textarea name="variantes" value={form.variantes} onChange={handle} className="w-full p-2 border rounded h-16" />
      <label className='text-neutral-500'>URL de la vidéo</label>
      <input name="video_url" value={form.video_url} onChange={handle} className="w-full p-2 border rounded" />
      <label className='text-neutral-500'>Cover de la vidéo (url)</label>
      <input name="cover_video" value={form.cover_video} onChange={handle} className="w-full p-2 border rounded" />
      <button type="submit" disabled={loading} className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white rounded disabled:opacity-50">
        {toEdit? 'Enregistrer':'Créer'}
      </button>
    </form>
  );
}