"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function NutritionProfileForm({ toEdit, onSaved }) {
  const [form, setForm] = useState({ user_id: '', needs:'', envies:'', passif:'', actif:'', time_available:'', budget:'', shopping_list:'', mindset:'', psychique:'', physique:'' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { if(toEdit) setForm(toEdit); },[toEdit]);

  const handle=e=>setForm({...form,[e.target.name]:e.target.value});
  const submit=async e=>{e.preventDefault();setLoading(true);const payload={...form};if(toEdit)await supabase.from('nutrition_profiles').update(payload).eq('id',form.id);else{payload.id=crypto.randomUUID();await supabase.from('nutrition_profiles').insert(payload);}setLoading(false);onSaved();};

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded-lg shadow space-y-2">
      <h2 className="text-lg font-bold">{toEdit?'Modifier':'Créer'} NutritionProfile</h2>
      <input name="user_id" value={form.user_id} onChange={handle} placeholder="User UUID" className="w-full p-2 border rounded" />
      {['needs','envies','passif','actif','time_available','budget','shopping_list','mindset','psychique','physique'].map(field=> (
        <textarea key={field} name={field} value={form[field]} onChange={handle} placeholder={field} className="w-full p-2 border rounded h-16" />
      ))}
      <button type="submit" disabled={loading} className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white rounded disabled:opacity-50">{toEdit?'Enregistrer':'Créer'}</button>
    </form>
  );
}