"use client";

import { useState, useEffect } from "react";
import Button from "../components/buttons/button";
import WarningMessage from "../components/buttons/warning_button";

export default function Connect() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [warnMsg, setWarnMsg] = useState("");
  const [warnVisible, setWarnVisible] = useState(false);
  const [bottomMsg, setBottomMsg] = useState("");
  const [fadeOut, setFadeOut] = useState(false);

  // Reset on tab change
  useEffect(() => {
    setBottomMsg("");
    setFadeOut(false);
  }, [isLogin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (!isLogin && name === "password" && value.trim()) {
      setBottomMsg("Vite vite vite !");
    }
  };

  const canSubmit = formData.email.trim() !== "" && formData.password.trim() !== "";

  const handleSubmit = (type) => {
    if (!canSubmit) {
      setWarnMsg(isLogin
        ? "Veuillez remplir les champs pour vous connecter !"
        : "Veuillez remplir les champs pour vous inscrire !");
      setWarnVisible(true);
      return;
    }
    // Trigger fade out
    setBottomMsg(isLogin ? "C'est parti !" : "Inscription réussie !");
    setFadeOut(true);
    setTimeout(() => {
      window.location.href = type === "login" ? "/" : "/form";
    }, 3000);
  };

  return (
    <div>
      <WarningMessage
        message={warnMsg}
        visible={warnVisible}
        onClose={() => setWarnVisible(false)}
      />

      <div className="min-h-screen relative bg-gray-900 flex flex-col items-center justify-center overflow-hidden">
        {/* Static Dark overlay */}
        <div className="absolute inset-0 bg-gray-800 opacity-50" />

        {/* Top background phrase */}
        <p
          className="absolute mb-140"
          style={{ left: '50%', transform: 'translateX(-50%)' }}
        >
          <span className="text-7xl font-bold text-gray-700 pointer-events-none">
            {isLogin ? "Content de vous revoir" : "Bienvenue chez nous !"}
          </span>
        </p>

        {/* Panel */}
        <div className="relative z-10 w-full max-w-md bg-gray-900 bg-opacity-90 p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-white text-center mb-4">
            - The Smart Way -
          </h1>

          {/* Tabs */}
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
              >{tab}</button>
            ))}
          </div>

          {/* Form */}
          <div className="space-y-6">
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
              className="w-full px-4 py-2 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D8C3A5]"
            />
            <div className="flex justify-center">
              <Button
                type="button"
                onClick={() => handleSubmit(isLogin ? 'login' : 'register')}
                bgColor="bg-[#D8C3A5] hover:bg-[#C0A78A]"
                textColor="text-gray-900"
                className="w-1/2"
                disabled={!canSubmit}
              >{isLogin ? 'Se connecter' : "S'inscrire"}</Button>
            </div>
          </div>
        </div>

        {/* Bottom phrase */}
        {bottomMsg && (
          <p className="absolute mt-140 text-center text-5xl text-gray-500 font-semibold">
            {bottomMsg}
          </p>
        )}

        {/* Full-screen fade & blur overlay */}
        <div
        className="absolute inset-0 bg-black z-50 pointer-events-none"
        style={{
            // on lie l'opacité et le flou à la variable fadeOut
            opacity: fadeOut ? 1 : 0,
            filter: fadeOut ? 'blur(10px)' : 'blur(0)',
            transition: 'opacity 3s ease, filter 3s ease'
        }}
        />

      </div>
    </div>
  );
}
