"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ExerciseForm({ toEdit, onSaved }) {
  const [form, setForm] = useState({ name:'', muscle_uuid: [], mouvements:'', image_url:'', video_url:'', tips:'', difficulty:1, variantes:'', cover_video:'' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { if(toEdit) setForm(toEdit); }, [toEdit]);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleArray = key => e => setForm({ ...form, [key]: e.target.value.split(',').map(x=>x.trim()) });
  const save = async e => {
    e.preventDefault(); setLoading(true);
    const payload = { ...form };
    if(toEdit) await supabase.from('exercises').update(payload).eq('id',form.id);
    else { payload.id = crypto.randomUUID(); await supabase.from('exercises').insert(payload); }
    setLoading(false); onSaved();
  };

  return (
    <form onSubmit={save} className="bg-white p-4 rounded-lg shadow space-y-2">
      <h2 className="text-lg font-bold">{toEdit?'Modifier':'Créer'} Exercise</h2>
      <label className='text-neutral-500'>Name</label>
      <input name="name" value={form.name} onChange={handle} className="w-full p-2 border rounded" />
      <label className='text-neutral-500'>Mouvements</label>
      <input name="mouvements" value={form.mouvements} onChange={handle} className="w-full p-2 border rounded" />
      <label className='text-neutral-500'>URL de la vidéo</label>
      <input name="video_url" value={form.video_url} onChange={handle} className="w-full p-2 border rounded" />
      <label className='text-neutral-500'>Tips</label>
      <textarea name="tips" value={form.tips} onChange={handle} className="w-full p-2 border rounded h-16" />
      <label className='text-neutral-500'>Difficulté</label>
      <input name="difficulty" type="number" value={form.difficulty} onChange={handle} className="w-full p-2 border rounded" />
      <label className='text-neutral-500'>Variantes</label>
      <input name="variantes" value={form.variantes} onChange={handle} className="w-full p-2 border rounded" />
      <label className='text-neutral-500'>Muscles (leur uuid)</label>
      <input name="muscle_uuid" value={form.muscle_uuid.join(',')} onChange={handleArray('muscle_uuid')} className="w-full p-2 border rounded" />
      <label className='text-neutral-500'>URL de l&apos;image</label>
      <input name="image_url" value={form.image_url} onChange={handle} className="w-full p-2 border rounded" />
      <label className='text-neutral-500'>Cover de la vidéo (url)</label>
      <input name="cover_video" value={form.cover_video} onChange={handle} className="w-full p-2 border rounded" />
      <button type="submit" disabled={loading} className="w-full mt-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded disabled:opacity-50">{toEdit?'Enregistrer':'Créer'}</button>
    </form>
  );
}