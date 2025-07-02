"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function TrainingForm({ toEdit, onSaved }) {
  const [form, setForm] = useState({ name:'', exercise_uuid:[], type:'', objectives:'', time_min:0, material:'', image_url:'', cover_video:'' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { if(toEdit) setForm(toEdit); }, [toEdit]);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleArr = key => e => setForm({ ...form, [key]: e.target.value.split(',').map(x=>x.trim()) });
  const save = async e => {
    e.preventDefault(); setLoading(true);
    const payload={...form};
    if(toEdit) await supabase.from('trainings').update(payload).eq('id',form.id);
    else { payload.id=crypto.randomUUID(); await supabase.from('trainings').insert(payload); }
    setLoading(false); onSaved();
  };

  return (
    <form onSubmit={save} className="bg-white p-4 rounded-lg shadow space-y-2">
      <h2 className="text-lg font-bold">{toEdit?'Modifier':'Créer'} Training</h2>
      {['name','type','objectives','material','image_url', 'cover_video'].map(f=>(
        <input key={f} name={f} value={form[f]} onChange={handle} placeholder={f} className="w-full p-2 border rounded" />
      ))}
      <label className='text-neutral-500'>Temps en minutes</label>
      <input name="time_min" type="number" value={form.time_min} onChange={handle} className="w-full p-2 border rounded" />
      <label className='text-neutral-500'>UUID de l&apos;exercice</label>
      <input name="exercise_uuid" value={form.exercise_uuid.join(',')} onChange={handleArr('exercise_uuid')} className="w-full p-2 border rounded" />
      <button type="submit" disabled={loading} className="w-full mt-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded disabled:opacity-50">{toEdit?'Enregistrer':'Créer'}</button>
    </form>
  )
}