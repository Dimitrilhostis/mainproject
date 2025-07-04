"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function PreparationForm({ toEdit, onSaved }) {
  const [form, setForm] = useState({ 
    name:'', 
    ingredient_uuid: [], // Tableau UUID au lieu de string
    preparation: [''], 
    association: '', 
    image_url: '', 
    tips: '', 
    variantes: '', 
    video_url: '', 
    cover_video:'' 
  });
  const [loading, setLoading] = useState(false);

  // Champ de saisie multi-lignes pour UUIDs
  const [ingredientUuidsInput, setIngredientUuidsInput] = useState('');

  // Remplit le formulaire en mode édition
  useEffect(() => {
    if (toEdit) {
      setForm(toEdit);
      setIngredientUuidsInput(
        Array.isArray(toEdit.ingredient_uuid)
          ? toEdit.ingredient_uuid.join('\n')
          : (toEdit.ingredient_uuid || "")
      );
    }
  }, [toEdit]);

  // Gestion des autres champs du formulaire
  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Submit du formulaire
  const submit = async e => {
    e.preventDefault(); setLoading(true);
    const payload = { ...form };
  
    payload.ingredient_uuid = ingredientUuidsInput
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
  
    if (!payload.ingredient_uuid.length) delete payload.ingredient_uuid;
    
    let error;
    if (toEdit)
      ({ error } = await supabase.from('preparations').update(payload).eq('uuid', form.uuid));
    else {
      payload.uuid = crypto.randomUUID();
      ({ error } = await supabase.from('preparations').insert([payload]));
    }
    if (error) {
      console.error('❌ Supabase error:', error);
      alert('Erreur : ' + error.message);
      setLoading(false);
      return;
    }
    setLoading(false); onSaved();
  };
  

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded-lg shadow space-y-2">
      <h2 className="text-lg font-bold">{toEdit? 'Modifier':'Créer'} Préparation</h2>
      <label className='text-neutral-500'>Nom</label>
      <input name="name" value={form.name} onChange={handle} className="w-full p-2 border rounded" />
      
      <label className='text-neutral-500'>UUID des ingrédients  </label>
      <textarea
        name="ingredient_uuid"
        value={ingredientUuidsInput}
        onChange={e => setIngredientUuidsInput(e.target.value)}
        className="w-full p-2 border rounded h-16"
      />
      
      <label className='text-neutral-500'>Préparation</label>
      <textarea name="preparation" value={form.preparation.join('\n')} onChange={e=>setForm({...form, preparation: e.target.value.split('\n')})} className="w-full p-2 border rounded h-16" />
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
      <button type="submit" disabled={loading} className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white rounded disabled:opacity-50">
        {toEdit? 'Enregistrer':'Créer'}
      </button>
    </form>
  );
}
