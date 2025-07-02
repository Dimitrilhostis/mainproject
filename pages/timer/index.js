"use client";

import { useState, useEffect, useCallback } from "react";
import Button from "@/components/buttons/button";
import CustomCard from "@/components/cards/custom_card";
import SelectSound from "@/components/selects/select_sound";
import { motion } from "framer-motion";
import SideBar from "@/components/nav/sidebar";
import MobileNav from "@/components/nav/mobile_nav";

export default function Timer() {
  const [mode, setMode] = useState("chronometer");
  const [time, setTime] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timerDuration, setTimerDuration] = useState(0);
  const [running, setRunning] = useState(false);
  const [repetitions, setRepetitions] = useState(1);
  const [currentRep, setCurrentRep] = useState(1);

  // Timer alterné (minutes et secondes pour chaque)
  const [interval1Min, setInterval1Min] = useState(0);
  const [interval1Sec, setInterval1Sec] = useState(0);
  const [interval2Min, setInterval2Min] = useState(0);
  const [interval2Sec, setInterval2Sec] = useState(0);
  const [intervalReps, setIntervalReps] = useState(1);
  const [intervalPhase, setIntervalPhase] = useState(1); // 1 ou 2

  const [selectedSound, setSelectedSound] = useState("/sounds/PIANO.mp3");
  const sounds = [    
    { title: "Piano", path: "/sounds/PIANO.mp3" },
    { title: "Cri", path: "/sounds/CRI.mp3" },
    { title: "Klaxon", path: "/sounds/KLAXON.mp3" },
    { title: "Bip", path: "/sounds/BIP.mp3" },
    { title: "Pet", path: "/sounds/PET.mp3" },
    { title: "Chat", path: "/sounds/CHAT.mp3" },
    { title: "Notif", path: "/sounds/NOTIF.mp3" },
  ];

  const playAlarm = useCallback(() => {
    const audio = new Audio(selectedSound);
    audio.play().catch(() => console.log("Audio playback failed"));
  }, [selectedSound]);

  // Calcul des durées en secondes
  const interval1 = interval1Min * 60 + interval1Sec;
  const interval2 = interval2Min * 60 + interval2Sec;

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setTime((prev) => {
          // Chronomètre
          if (mode === "chronometer") return prev + 1;
          // Minuteur simple
          if (mode === "timer") {
            if (prev > 0) return prev - 1;
            playAlarm();
            if (currentRep < repetitions) {
              setCurrentRep((r) => r + 1);
              return timerDuration;
            } else {
              setRunning(false);
              return 0;
            }
          }
          // Alterné
          if (mode === "interval") {
            if (prev > 0) return prev - 1;
            playAlarm();

            if (intervalPhase === 1) {
              setIntervalPhase(2);
              return interval2;
            } else {
              if (currentRep < intervalReps) {
                setCurrentRep((r) => r + 1);
                setIntervalPhase(1);
                return interval1;
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
  }, [running, mode, repetitions, currentRep, timerDuration, playAlarm, interval1, interval2, intervalReps, intervalPhase]);

  const toggleStartStop = () => {
    if (running) {
      setRunning(false);
    } else {
      if (mode === "timer") {
        const totalSeconds = minutes * 60 + seconds;
        setTimerDuration(totalSeconds);
        setTime(totalSeconds);
        setCurrentRep(1);
      }
      if (mode === "interval") {
        setTime(interval1);
        setIntervalPhase(1);
        setCurrentRep(1);
      }
      setRunning(true);
    }
  };

  const reset = () => {
    setRunning(false);
    setMinutes(0);
    setSeconds(0);
    setTime(0);
    setCurrentRep(1);
    setInterval1Min(0);
    setInterval1Sec(0);
    setInterval2Min(0);
    setInterval2Sec(0);
    setIntervalPhase(1);
    setIntervalReps(1);
  };

  useEffect(() => {
    if (mode === "timer") {
      setTime(timerDuration);
    }
    if (mode === "interval") {
      setTime(interval1);
      setIntervalPhase(1);
      setCurrentRep(1);
    }
  }, [timerDuration, repetitions, mode, interval1, interval2, intervalReps]);

  const modeButtons = [
    { key: "chronometer", label: "Chrono" },
    { key: "timer", label: "Minuteur" },
    { key: "interval", label: "Pomodoro" },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-100 via-purple-50 to-white flex-col md:flex-row">
      <aside className="hidden md:flex">
        <SideBar />
      </aside>
      <div className="flex-1 flex items-center justify-center p-8">
        <CustomCard className="w-full max-w-md p-6 bg-white shadow-lg rounded-2xl ring-2 ring-purple-200">
          <div className="flex justify-center gap-2 mb-6">
            {modeButtons.map((btn) => (
              <Button
                key={btn.key}
                onClick={() => setMode(btn.key)}
                variant={mode === btn.key ? "default" : "outline"}
                className={`w-1/3 py-3 text-lg transition ${
                  mode === btn.key
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                }`}
              >
                {btn.label}
              </Button>
            ))}
          </div>

          {/* Inputs pour chaque mode */}
          {mode === "timer" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {[
                { label: "Minutes", value: minutes, setter: setMinutes },
                { label: "Secondes", value: seconds, setter: setSeconds },
                { label: "Répétitions", value: repetitions, setter: setRepetitions },
              ].map(({ label, value, setter }) => (
                <div key={label} className="flex flex-col">
                  <label className="text-sm mb-2 text-purple-600">{label}</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) =>
                      setter(Math.max(0, parseInt(e.target.value) || 0))
                    }
                    className="w-full p-3 text-purple-800 bg-purple-50 rounded-lg shadow-inner focus:ring-2 focus:ring-purple-300"
                    onFocus={(e) => e.target.select()}
                    placeholder={label}
                  />
                </div>
              ))}
            </div>
          )}

          {mode === "interval" && (
            <div className="flex flex-row items-center justify-between mb-6">
              {/* Timers à gauche */}
              <div className="flex flex-col gap-2">
                {/* Timer 1 */}
                <div className="flex flex-col">
                  <label className="text-sm text-purple-600 mb-1">Work</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={interval1Min}
                      onChange={(e) => setInterval1Min(Math.max(0, parseInt(e.target.value) || 0))}
                      className="max-w-26 p-3 text-purple-800 bg-purple-50 rounded-lg shadow-inner focus:ring-2 focus:ring-purple-300"
                      placeholder="Min"
                    />
                    <span className="self-center text-purple-700">:</span>
                    <input
                      type="number"
                      value={interval1Sec}
                      onChange={(e) => setInterval1Sec(Math.max(0, parseInt(e.target.value) || 0))}
                      className="max-w-26 p-3 text-purple-800 bg-purple-50 rounded-lg shadow-inner focus:ring-2 focus:ring-purple-300"
                      placeholder="Sec"
                    />
                  </div>
                </div>
                {/* Timer 2 */}
                <div className="flex flex-col mt-1">
                  <label className="text-sm text-purple-600 mb-1">Pause</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={interval2Min}
                      onChange={(e) => setInterval2Min(Math.max(0, parseInt(e.target.value) || 0))}
                      className="max-w-26 p-3 text-purple-800 bg-purple-50 rounded-lg shadow-inner focus:ring-2 focus:ring-purple-300"
                      placeholder="Min"
                    />
                    <span className="self-center text-purple-700">:</span>
                    <input
                      type="number"
                      value={interval2Sec}
                      onChange={(e) => setInterval2Sec(Math.max(0, parseInt(e.target.value) || 0))}
                      className="max-w-26 p-3 text-purple-800 bg-purple-50 rounded-lg shadow-inner focus:ring-2 focus:ring-purple-300"
                      placeholder="Sec"
                    />
                  </div>
                </div>
              </div>
              {/* Répétitions à droite, centré verticalement */}
              <div className="flex flex-col items-center justify-center h-full">
                <label className="text-sm text-purple-600 mb-1">Répétitions</label>
                <input
                  type="number"
                  value={intervalReps}
                  onChange={(e) => setIntervalReps(Math.max(1, parseInt(e.target.value) || 1))}
                  className="max-w-32 p-3 text-purple-800 bg-purple-50 rounded-lg shadow-inner focus:ring-2 focus:ring-purple-300 text-center"
                  placeholder="Nb"
                />
              </div>
            </div>
          )}

          {/* Affichage du timer */}
          <motion.div
            className="text-6xl font-bold mb-6 text-center text-purple-700"
            animate={{ scale: running ? 1.1 : 1 }}
          >
            {new Date(time * 1000).toISOString().substr(14, 5)}
          </motion.div>
          {/* Affichage répétition ou phase */}
          {(mode === "timer" || mode === "interval") && (
            <div className="text-center mb-4 text-lg text-purple-600">
              Répétition {currentRep} / {mode === "timer" ? repetitions : intervalReps}
              {mode === "interval" && (
                <span className="ml-2">
                  ({intervalPhase === 1 ? "Work" : "Pause"} time)
                </span>
              )}
            </div>
          )}

          {/* Boutons contrôle */}
          <div className="flex justify-center gap-6 mb-6">
            <Button
              onClick={toggleStartStop}
              variant={running ? "destructive" : "default"}
              className={`w-1/2 py-3 text-xl transition ${
                running
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-purple-500 text-white hover:bg-purple-600"
              }`}
            >
              {running ? "Arrêter" : "Démarrer"}
            </Button>
            {!running && (
              <Button
                onClick={reset}
                variant="outline"
                className="w-1/2 py-3 text-xl text-purple-700 border-purple-300 hover:bg-purple-50"
              >
                Réinitialiser
              </Button>
            )}
          </div>

          {/* Sélection du son */}
          {(mode === "timer" || mode === "interval") && (
            <SelectSound
              SelectSound={SelectSound}
              sounds={sounds}
              setSelectedSound={setSelectedSound}
              className="mt-4 text-purple-800"
            />
          )}
        </CustomCard>
      </div>
      <MobileNav />
    </div>
  );
}
