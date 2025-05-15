"use client";

import { useState, useEffect, useCallback } from "react";
import Button from "@/components/buttons/button";
import CustomCard from "@/components/cards/custom_card";
import SelectSound from "@/components/selects/select_sound";
import { motion } from "framer-motion";
import Layout from "@/components/layout";
import SideBar from "@/components/sidebar";
import MobileNav from "@/components/mobile_nav";

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
  const [selectedSound, setSelectedSound] = useState("/sounds/CRI.mp3");
  const sounds = [
    { title: "Cri", path: "/sounds/CRI.mp3" },
    { title: "Klaxon", path: "/sounds/KLAXON.mp3" },
    { title: "Bip", path: "/sounds/BIP.mp3" },
    { title: "Pet", path: "/sounds/PET.mp3" },
    { title: "Chat", path: "/sounds/CHAT.mp3" },
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
    <div className="min-h-screen flex bg-gray-50 flex-col md:flex-row">
        <aside className="hidden md:flex">
          <SideBar />
        </aside>
        <div className="flex-1 flex items-center justify-center p-8">
        <CustomCard className="w-full max-w-md p-6 bg-gray-200 shadow-xl rounded-2xl">
            <div className="flex justify-center gap-4 mb-6">
            <Button onClick={() => setMode("chronometer")} variant={mode === "chronometer" ? "default" : "outline"} className={`w-1/2 py-3 text-lg ${ mode === "chronometer" ? "bg-gray-500 text-white hover:bg-gray-600" : "bg-gray-300 text-gray-800 hover:bg-gray-400"}`}>
                Chrono
            </Button>
            <Button onClick={() => setMode("timer")} variant={mode === "timer" ? "default" : "outline"} className={`w-1/2 py-3 text-lg ${ mode === "timer" ? "bg-gray-500 text-white hover:bg-gray-600" : "bg-gray-300 text-gray-800 hover:bg-gray-400"}`}>
                Minuteur
            </Button>
            </div>

            {mode === "timer" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {/* Champ Temps */}
                <div className="flex flex-col">
                <label className="text-sm mb-2 text-gray-500">Heures</label>
                <input
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full p-3 text-gray-500 bg-gray-100 rounded-lg shadow-md"
                    onFocus={(e) => e.target.select()}
                    placeholder="Heures"
                />
                </div>

                <div className="flex flex-col">
                <label className="text-sm mb-2 text-gray-500">Minutes</label>
                <input
                    type="number"
                    value={minutes}
                    onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full p-3 text-gray-500 bg-gray-100 rounded-lg shadow-md"
                    onFocus={(e) => e.target.select()}
                    placeholder="Minutes"
                />
                </div>

                <div className="flex flex-col">
                <label className="text-sm mb-2 text-gray-500">Secondes</label>
                <input
                    type="number"
                    value={seconds}
                    onChange={(e) => setSeconds(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full p-3 text-gray-500 bg-gray-100 rounded-lg shadow-md"
                    onFocus={(e) => e.target.select()}
                    placeholder="Secondes"
                />
                </div>

                <div className="flex flex-col mb-6">
                <label className="text-sm mb-2 text-gray-600">Répétitions</label>
                <input
                    type="number"
                    value={repetitions}
                    onChange={(e) => setRepetitions(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full p-3 text-gray-600 bg-gray-200 rounded-lg shadow-md"
                    onFocus={(e) => e.target.select()}
                    placeholder="Répétitions"
                />
                </div>
            </div>

            )}

            

            {/* Affichage du timer */}
            <motion.div className="text-6xl font-bold mb-6 text-center text-gray-500" animate={{ scale: running ? 1.1 : 1 }}>
            {mode === "timer" ? new Date(time * 1000).toISOString().substr(11, 8) : new Date(time * 1000).toISOString().substr(11, 8)}
            </motion.div>

            {mode === "timer" && <div className="text-center mb-4 text-lg">Répétition {currentRep} / {repetitions}</div>}

            <div className="flex justify-center gap-6 mb-6">
            <Button onClick={toggleStartStop} variant={running ? "destructive" : "default"} className="w-1/2 py-3 text-xl bg-gray-400 hover:bg-gray-500">{running ? "Arrêter" : "Démarrer"}</Button>
            {!running && <Button onClick={reset} variant="outline" className="w-1/2 py-3 text-xl bg-gray-300 hover:bg-gray-400">Réinitialiser</Button>}
            </div>

            {mode === "timer" && (
            <SelectSound SelectSound={SelectSound} sounds={sounds} setSelectedSound={setSelectedSound}></SelectSound>
            )}
        </CustomCard>
        </div>
        <MobileNav />
    </div>
  );
}
