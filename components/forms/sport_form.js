"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function SportProfileForm({ toEdit, onSaved }) {
  const [form, setForm] = useState({ user_id:'', objectifs:'', passif:'', actif:'', social:'', geographic:'', job:'', time_available:'' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { if(toEdit) setForm(toEdit); }, [toEdit]);

  const handle=e=>setForm({...form,[e.target.name]:e.target.value});
  const save=async e=>{e.preventDefault();setLoading(true);const payload={...form};if(toEdit)await supabase.from('sport_profiles').update(payload).eq('id',form.id);else{payload.id=crypto.randomUUID();await supabase.from('sport_profiles').insert(payload);}setLoading(false);onSaved();};

  return (
    <form onSubmit={save} className="bg-white p-4 rounded-lg shadow space-y-2">
      <h2 className="text-lg font-bold">{toEdit?'Modifier':'Créer'} SportProfile</h2>
      <input name="user_id" value={form.user_id} onChange={handle} placeholder="User UUID" className="w-full p-2 border rounded" />
      {['objectifs','passif','actif','social','geographic','job','time_available'].map(f=>(
        <textarea key={f} name={f} value={form[f]} onChange={handle} placeholder={f} className="w-full p-2 border rounded h-16" />
      ))}
      <button type="submit" disabled={loading} className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white rounded disabled:opacity-50">{toEdit?'Enregistrer':'Créer'}</button>
    </form>
  );
}
