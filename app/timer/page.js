"use client";

import { useState, useEffect, useCallback } from "react";
import Button from "@components/buttons/button";
import CustomCard from "@components/cards/custom_card";
import SelectSound from "@components/selects/select_sound";
import { motion } from "framer-motion";
import BackToEntryButton from "@components/buttons/back_to_entry"; 

export default function Timer() {
  const [mode, setMode] = useState("chronometer");
  const [time, setTime] = useState(0);
  const [hours, setHours] = useState(0); 
  const [minutes, setMinutes] = useState(0); 
  const [seconds, setSeconds] = useState(0); 
  const [timerDuration, setTimerDuration] = useState(0);
  const [running, setRunning] = useState(false);
  const [repetitions, setRepetitions] = useState(1);
  const [currentRep, setCurrentRep] = useState(1);
  const [selectedSound, setSelectedSound] = useState("/sounds/cri.mp3");
  const sounds = [
    { title: "Cri", path: "/sounds/cri.mp3" },
    { title: "Klaxon", path: "/sounds/klaxon.mp3" },
    { title: "Notif", path: "/sounds/notif.mp3" },
    { title: "Pet", path: "/sounds/pet.mp3" },
    { title: "Pop", path: "/sounds/pop.mp3" },
    { title: "Sonnette", path: "/sounds/sonnette.mp3" },
  ];

  const playAlarm = useCallback(() => {
    const audio = new Audio(selectedSound);
    audio.play().catch(() => console.log("Audio playback failed"));
  }, [selectedSound]);

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setTime((prev) => {
          if (mode === "chronometer") return prev + 1;
          if (prev > 0) return prev - 1;
          playAlarm();
          if (currentRep < repetitions) {
            setCurrentRep((r) => r + 1);
            return timerDuration;
          } else {
            setRunning(false);
            return 0;
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
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      setTimerDuration(totalSeconds);
      if (mode === "timer") setTime(totalSeconds);
      setRunning(true);
      setCurrentRep(1);
    }
  };

  const reset = () => {
    setRunning(false);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setTime(0);
    setCurrentRep(1);
  };

  useEffect(() => {
    if (mode === "timer") {
      setTime(timerDuration);
    }
  }, [timerDuration, repetitions, mode]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <CustomCard className="w-full max-w-md p-6 bg-gray-800 shadow-xl rounded-2xl">
        <div className="flex justify-center gap-4 mb-6">
          <Button onClick={() => setMode("chronometer")} variant={mode === "chronometer" ? "default" : "outline"} className="w-1/2 py-3 text-lg">
            Chrono
          </Button>
          <Button onClick={() => setMode("timer")} variant={mode === "timer" ? "default" : "outline"} className="w-1/2 py-3 text-lg">
            Minuteur
          </Button>
        </div>

        {mode === "timer" && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Champ Temps */}
            <div className="flex flex-col">
              <label className="text-sm mb-2">Heures</label>
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full p-3 text-white bg-gray-700 rounded-lg shadow-md"
                onFocus={(e) => e.target.select()}
                placeholder="Heures"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm mb-2">Minutes</label>
              <input
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full p-3 text-white bg-gray-700 rounded-lg shadow-md"
                onFocus={(e) => e.target.select()}
                placeholder="Minutes"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm mb-2">Secondes</label>
              <input
                type="number"
                value={seconds}
                onChange={(e) => setSeconds(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full p-3 text-white bg-gray-700 rounded-lg shadow-md"
                onFocus={(e) => e.target.select()}
                placeholder="Secondes"
              />
            </div>
          </div>
        )}

        {/* Affichage du timer */}
        <motion.div className="text-6xl font-bold mb-6 text-center text-gray-300" animate={{ scale: running ? 1.1 : 1 }}>
          {mode === "timer" ? new Date(time * 1000).toISOString().substr(11, 8) : new Date(time * 1000).toISOString().substr(11, 8)}
        </motion.div>

        {mode === "timer" && <div className="text-center mb-4 text-lg">Répétition {currentRep} / {repetitions}</div>}

        <div className="flex justify-center gap-6 mb-6">
          <Button onClick={toggleStartStop} variant={running ? "destructive" : "default"} className="w-1/2 py-3 text-xl">{running ? "Arrêter" : "Démarrer"}</Button>
          {!running && <Button onClick={reset} variant="outline" className="w-1/2 py-3 text-xl">Réinitialiser</Button>}
        </div>

        {mode === "timer" && (
          <SelectSound SelectSound={SelectSound} sounds={sounds} setSelectedSound={setSelectedSound}></SelectSound>
        )}
      </CustomCard>

      <footer className="text-white text-center py-6 mt-6">
        <BackToEntryButton></BackToEntryButton>
      </footer>
    </div>
  );
}
