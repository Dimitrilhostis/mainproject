import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../components/buttons/button';
import WarningMessage from '../components/buttons/warning_button';
import { supabase } from '../../lib/supabaseClient';

export default function Connect() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', last_name: '', name: '' });
  const [warnMsg, setWarnMsg] = useState('');
  const [warnVisible, setWarnVisible] = useState(false);
  const [bottomMsg, setBottomMsg] = useState('');
  const [fadeOut, setFadeOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userFirstName, setUserFirstName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Au chargement, vérifier la session et récupérer le prénom si connecté
  useEffect(() => {
    async function checkAuth() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.log('Utilisateur non connecté');
        setIsAuthenticated(false);
      } else {
        console.log('Utilisateur déjà connecté:', user.email);
        setIsAuthenticated(true);
        // récupérer prénom depuis profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', user.id)
          .single();
        if (profile?.name) setUserFirstName(profile.name);
      }
    }
    checkAuth();
  }, []);

  // Reset warnings and messages on tab switch
  useEffect(() => {
    setWarnMsg('');
    setWarnVisible(false);
    setBottomMsg('');
    setFadeOut(false);
  }, [isLogin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
    if (!isLogin && name === 'password' && value.trim()) {
      setBottomMsg('Vite vite vite !');
    }
  };

  const canSubmit =
    formData.email.trim() !== '' &&
    formData.password.trim() !== '' &&
    (isLogin || (formData.last_name.trim() !== '' && formData.name.trim() !== ''));

  const handleSubmit = async () => {
    if (!canSubmit) {
      setWarnMsg(
        isLogin
          ? 'Veuillez remplir tous les champs pour vous connecter.'
          : 'Veuillez remplir tous les champs pour vous inscrire.'
      );
      setWarnVisible(true);
      return;
    }

    setWarnVisible(false);
    setBottomMsg(isLogin ? "C'est parti !" : 'Inscription réussie !');
    setFadeOut(true);
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) {
        setWarnMsg(error.message);
        setWarnVisible(true);
        setFadeOut(false);
        setLoading(false);
        return;
      }
      setTimeout(() => router.push('/'), 3000);
    } else {
      const fullName = `${formData.name} ${formData.last_name}`;
      const { data, error } = await supabase.auth.signUp(
        { email: formData.email, password: formData.password },
        { data: { full_name: fullName } }
      );
      if (error) {
        setWarnMsg(error.message);
        setWarnVisible(true);
        setFadeOut(false);
        setLoading(false);
        return;
      }
      const userId = data.user.id;
      await supabase.from('profiles').insert({ id: userId, name: formData.name, last_name: formData.last_name });
      setTimeout(() => router.push('/form'), 3000);
    }
  };

  return (
    <div className="min-h-screen relative bg-gray-900 flex flex-col items-center justify-center overflow-hidden">
      <WarningMessage
        message={warnMsg}
        visible={warnVisible}
        onClose={() => setWarnVisible(false)}
      />

      <div className="absolute inset-0 bg-gray-800 opacity-50" />

      <p
        className="absolute"
        style={{ left: '50%', top: '15%', transform: 'translate(-50%, -50%)' }}
      >
        <span className="text-7xl font-bold text-gray-700 pointer-events-none">
          {isLogin ? 'Content de vous revoir' : 'Bienvenue chez nous !'}
        </span>
      </p>

      {/* Panel fixe */}
      <div className="relative z-10 w-full max-w-md h-[470px] flex flex-col justify-between bg-gray-900 bg-opacity-90 p-8 rounded-2xl shadow-lg">
        <div>
          <h1 className="text-3xl font-bold text-white text-center mb-4">The Smart Way</h1>
          <div className="flex mb-6 border-b border-gray-700">
            {['Connexion', 'Inscription'].map((tab, i) => (
              <button
                key={tab}
                onClick={() => setIsLogin(i === 0)}
                className={`flex-1 py-2 text-center transition-colors ${
                  (i === 0) === isLogin
                    ? 'font-semibold border-b-2 border-[#D8C3A5] text-white'
                    : 'text-gray-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {!isLogin && (
              <>
                <input
                  type="text"
                  name="last_name"
                  placeholder="Nom"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D8C3A5]"
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Prénom"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D8C3A5]"
                />
              </>
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D8C3A5]"
            />
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2	bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D8C3A5]"
            />
          </div>
        </div>

        {/* Bouton placé en bas avec libellé dynamique */}
        <div className="flex justify-center">
          <Button
            type="button"
            onClick={handleSubmit}
            bgColor="bg-[#D8C3A5] hover:bg-[#C0A78A]"
            textColor="text-gray-900"
            className="min-w-[160px] px-6"
            disabled={!canSubmit || loading}
          >
            {loading
                ? isLogin
                  ? 'Connexion…'
                  : 'Inscription…'
                : isLogin
                ? 'Se connecter'
                : "S'inscrire"}
          </Button>
        </div>
      </div>

      {bottomMsg && (
        <p
          className="absolute text-center text-5xl text-gray-500 font-semibold"
          style={{ left: '50%', bottom: '10%', transform: 'translateX(-50%)' }}
        >
          {bottomMsg}
        </p>
      )}

      <div
        className="absolute inset-0 bg-black z-50 pointer-events-none"
        style={{
          opacity: fadeOut ? 1 : 0,
          filter: fadeOut ? 'blur(10px)' : 'blur(0)',
          transition: 'opacity 3s ease, filter 3s ease',
        }}
      />
    </div>
  );
}
