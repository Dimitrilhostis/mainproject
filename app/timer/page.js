"use client";

import { useState, useEffect, useCallback } from "react";
import Button from "@components/buttons/button";
import CustomCard from "@components/cards/custom_card";
import SelectSound from "@components/selects/select_sound"
import { motion } from "framer-motion";
import BackToEntryButton from "@components/buttons/back_to_entry"; 

export default function Timer() {
  const [mode, setMode] = useState("chronometer");
  const [time, setTime] = useState(0);
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
            setCurrentRep((r) => r + 0.5);
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
      if (mode === "timer") setTime(timerDuration);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <CustomCard className="w-full max-w-md p-6 bg-gray-800 shadow-xl rounded-2xl">
          <div className="flex justify-center mb-6">
            <Button onClick={() => setMode("chronometer")} variant={mode === "chronometer" ? "default" : "outline"}>
              Chronomètre
            </Button>
            <Button onClick={() => setMode("timer")} variant={mode === "timer" ? "default" : "outline"}>
              Minuteur
            </Button>
          </div>
          {mode === "timer" && (
            <div className="mb-4">
              <label className="block mb-2">Temps (secondes)</label>
              <input type="number" value={timerDuration} 
              onChange={(e) => setTimerDuration(Math.max(0, parseInt(e.target.value) || 0))} 
              className="w-full p-2 text-black rounded-lg" 
              onFocus={(e) => e.target.select()}/>

              <label className="block mt-4 mb-2">Répétitions</label>
              <input type="number" value={repetitions} 
              onChange={(e) => setRepetitions(Math.max(1, parseInt(e.target.value) || 1))} 
              className="w-full p-2 text-black rounded-lg" 
              onFocus={(e) => e.target.select()}/>
            </div>
          )}
            <motion.div className="text-5xl font-bold mb-6 text-center" animate={{ scale: running ? 1.1 : 1 }}>
              {new Date(time * 1000).toISOString().substr(14, 5)}
            </motion.div>
          {mode === "timer" && <div className="text-center mb-4">Répétition {currentRep} / {repetitions}</div>}
          <div className="flex justify-center gap-4 mb-4">
            <Button onClick={toggleStartStop} variant={running ? "destructive" : "default"}>{running ? "Arrêter" : "Démarrer"}</Button>
            {!running && <Button onClick={reset} variant="outline">Réinitialiser</Button>}
          </div>
          {mode === "timer" && (
            <SelectSound SelectSound={SelectSound} sounds={sounds} setSelectedSound={setSelectedSound}></SelectSound>
          )}
      </CustomCard>
      <footer className="text-white text-center py-15">
          <BackToEntryButton></BackToEntryButton>
      </footer>
    </div>
  );
}
