// components/settings/profile.jsx
"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/auth_context';
import { supabase } from '@/lib/supabaseClient';

export default function ProfileSection({ user, friends, addFriend, removeFriend }) {
  const { signOut } = useAuth();
  const [showPwd, setShowPwd] = useState(false);
  const [step, setStep] = useState('view'); // 'view' | 'validate' | 'change'
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [error, setError] = useState('');

  const toggleShowPassword = () => setShowPwd(!showPwd);

  const handleValidateCurrent = async () => {
    setError('');
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPw,
    });
    if (authError || !data.session) {
      setError('Mot de passe actuel invalide');
    } else {
      setStep('change');
      setError('');
    }
  };

  const handleChangePassword = async () => {
    setError('');
    if (newPw !== confirmPw) {
      setError("Les nouveaux mots de passe ne correspondent pas");
      return;
    }
    const { data, error: updateError } = await supabase.auth.updateUser({ password: newPw });
    if (updateError) {
      setError("Erreur lors de la mise à jour");
    } else {
      setStep('view');
      setShowPwd(false);
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
      alert('Mot de passe mis à jour !');
    }
  };

  return (
    <section className="max-w-md mx-auto p-4 space-y-6 bg-white rounded-lg shadow">
      {/* Email display */}
      <div className="flex justify-between items-center bg-cyan-100 border-2 border-blue-600 p-3 rounded">
        <span className="font-medium text-gray-700">Mon mail :</span>
        <span className="text-gray-900 break-all">{user.email}</span>
      </div>

      {/* Change password workflow */}
      {step === 'view' && (
        <button
          onClick={() => setStep('validate')}
          className="w-full bg-emerald-100 border-2 border-green-600 text-green-700 py-2 rounded hover:bg-green-600 hover:text-emerald-100 transition"
        >
          Changer le mot de passe
        </button>
      )}

      {step === 'validate' && (
        <div className="space-y-3">
          <p className="font-medium text-gray-700">Confirmez votre mot de passe actuel</p>
          <input
            type="password"
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-400"
            placeholder="Mot de passe actuel"
          />
          {error && <p className="text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleValidateCurrent}
              className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
            >
              Valider
            </button>
            <button
              onClick={() => { setStep('view'); setError(''); }}
              className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {step === 'change' && (
        <div className="space-y-3">
          <p className="font-medium text-gray-700">Entrez votre nouveau mot de passe</p>
          <input
            type="password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-400"
            placeholder="Nouveau mot de passe"
          />
          <input
            type="password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-400"
            placeholder="Confirmez mot de passe"
          />
          {error && <p className="text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleChangePassword}
              className="flex-1 bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition"
            >
              Enregistrer
            </button>
            <button
              onClick={() => { setStep('view'); setError(''); }}
              className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Logout button */}
      <button
        onClick={() => signOut()}
        className="w-full bg-red-100 border-2 border-red-600 text-red-600 py-2 rounded hover:bg-red-600 hover:text-white transition"
      >
        Déconnexion
      </button>
    </section>
  );
}