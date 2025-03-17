"use client";

import { useState, useEffect, useCallback } from "react";

export default function Timer() {
  const [mode, setMode] = useState("chronometer"); // "chronometer" ou "timer"
  const [time, setTime] = useState(0);
  const [timerDuration, setTimerDuration] = useState(0); // Temps en secondes
  const [running, setRunning] = useState(false);
  const [repetitions, setRepetitions] = useState(1);
  const [currentRep, setCurrentRep] = useState(1);
  const [selectedSound, setSelectedSound] = useState("/sounds/notif.mp3"); // Son par défaut
  const sounds = [
    { name: "Cri", path: "/sounds/cri.mp3" },
    { name: "Klaxon", path: "/sounds/klaxon.mp3" },
    { name: "Notif", path: "/sounds/notif.mp3" },
    { name: "Pet", path: "/sounds/pet.mp3" },
    { name: "Pop", path: "/sounds/pop.mp3" },
    { name: "Sonnette", path: "/sounds/sonnette.mp3" },
  ];

  const playAlarm = useCallback(() => {
    const audio = new Audio(selectedSound);
    audio.play().catch((error) => console.log("Audio playback failed", error));
  }, [selectedSound]);

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setTime((prev) => {
          if (mode === "chronometer") {
            return prev + 1;
          } else {
            if (prev > 0) {
              return prev - 1;
            } else {
              playAlarm();
              if (currentRep < repetitions) {
                setCurrentRep((r) => r + 0.5);
                return timerDuration;
              } else {
                setRunning(false);
                return 0;
              }
            }
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [running, mode, repetitions, currentRep, timerDuration, playAlarm]);

  const toggleStartStop = () => {
    if (running) {
      setRunning(false);
    } else {
      if (mode === "timer") {
        setTime(timerDuration);
      }
      setRunning(true);
      setCurrentRep(1);
    }
  };

  const reset = () => {
    setRunning(false);
    setTime(mode === "timer" ? timerDuration : 0);
    setCurrentRep(1);
  };

  return (
    <div className="flex flex-col items-center p-5">
      {/* Boutons de mode */}
      <div className="mb-4 flex gap-2">
        <button onClick={() => setMode("chronometer")} className="p-2 bg-blue-500 text-white rounded">
          Chronomètre
        </button>
        <button onClick={() => setMode("timer")} className="p-2 bg-green-500 text-white rounded">
          Minuteur
        </button>
      </div>

      {/* Options du minuteur */}
      {mode === "timer" && (
        <div className="mb-4">
          <label>Temps (secondes) :</label>
          <input
            type="number"
            value={timerDuration}
            onChange={(e) => {
              const newTime = Math.max(0, parseInt(e.target.value) || 0); // ✅ Évite les valeurs négatives
              setTimerDuration(newTime);
              if (!running) setTime(newTime);
            }}
            onFocus={(e) => e.target.select()} // Sélectionne tout le texte au focus
            className="p-1 border"
          />
          <label className="ml-2">Répétitions :</label>
          <input
            type="number"
            value={repetitions}
            min={1}
            onChange={(e) => setRepetitions(Math.max(1, parseInt(e.target.value) || 1))}
            onFocus={(e) => e.target.select()} // Sélectionne tout le texte au focus
            className="p-1 border"
          />
        </div>
      )}

      {/* Affichage du temps */}
      <div className="text-4xl font-bold mb-4">
        {new Date(time * 1000).toISOString().substr(14, 5)}
      </div>

      {/* Affichage des répétitions */}
      {mode === "timer" && <div className="mb-4">Répétition {Math.min(currentRep, repetitions)} / {repetitions}</div>}

      {/* Boutons Démarrer/Arrêter */}
      <div className="flex gap-2">
        <button
          onClick={toggleStartStop}
          className={`p-2 ${running ? "bg-red-500" : "bg-green-500"} text-white rounded`}
        >
          {running ? "Arrêter" : "Démarrer"}
        </button>
        {!running && (
          <button onClick={reset} className="p-2 bg-gray-500 text-white rounded">
            Réinitialiser
          </button>
        )}
      </div>

      {/* Sélecteur de son */}
      {mode === "timer" && (
        <div className="mt-4">
            <label className="mr-2">Choisir un son :</label>
            <select onChange={(e) => setSelectedSound(e.target.value)} value={selectedSound} className="p-1 border">
            {sounds.map((sound, index) => (
                <option key={index} value={sound.path}>
                {sound.name}
                </option>
            ))}
            </select>
        </div>
      )}
    </div>
  );
}
