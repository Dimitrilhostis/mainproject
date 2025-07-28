// /app/timer/page.jsx (ou TimerPage.jsx)

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import Header from "@/components/header";
import SelectSound from "@/components/selects/select_sound";
import Image from "next/image";
import BubbleBackground from "@/components/bubbles";

/*
  Dans globals.css, conservez uniquement la partie pour enlever les spinners :

  .no-spinner::-webkit-outer-spin-button,
  .no-spinner::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .no-spinner {
    -moz-appearance: textfield;
  }
*/

export default function TimerPage() {
  const router = useRouter();
  const { mode: queryMode } = router.query;

  // ——— États généraux ———
  const [mode, setMode] = useState("chronometer");
  const [time, setTime] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timerDuration, setTimerDuration] = useState(0);
  const [running, setRunning] = useState(false);
  const [immersive, setImmersive] = useState(false);
  const [repetitions, setRepetitions] = useState(1);
  const [currentRep, setCurrentRep] = useState(1);

  // ——— États intervalle ———
  const [interval1Min, setInterval1Min] = useState(0);
  const [interval1Sec, setInterval1Sec] = useState(0);
  const [interval2Min, setInterval2Min] = useState(0);
  const [interval2Sec, setInterval2Sec] = useState(0);
  const [intervalReps, setIntervalReps] = useState(1);
  const [intervalPhase, setIntervalPhase] = useState(1);

  // ——— Wake Lock ———
  const wakeLockRef = useRef(null);
  useEffect(() => {
    if ("wakeLock" in navigator && running) {
      navigator.wakeLock.request("screen")
        .then(lock => { wakeLockRef.current = lock; })
        .catch(() => {});
    }
    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().then(() => { wakeLockRef.current = null; });
      }
    };
  }, [running]);

  // ——— Sons ———
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
    new Audio(selectedSound).play().catch(() => {});
  }, [selectedSound]);

  // ——— Calculs rapides ———
  const interval1 = interval1Min * 60 + interval1Sec;
  const interval2 = interval2Min * 60 + interval2Sec;

  // ——— Mode depuis URL ———
  useEffect(() => {
    if (["chronometer", "timer", "interval"].includes(queryMode)) {
      setMode(queryMode);
    }
  }, [queryMode]);

  // ——— Boucle de ticker ———
  useEffect(() => {
    if (!running) return;
    const ticker = setInterval(() => {
      setTime(prev => {
        if (mode === "chronometer") return prev + 1;
        if (mode === "timer") {
          if (prev > 0) return prev - 1;
          playAlarm();
          if (currentRep < repetitions) {
            setCurrentRep(r => r + 1);
            return timerDuration;
          }
          setRunning(false); setImmersive(false);
          return 0;
        }
        if (mode === "interval") {
          if (prev > 0) return prev - 1;
          playAlarm();
          if (intervalPhase === 1) {
            setIntervalPhase(2);
            return interval2;
          }
          if (currentRep < intervalReps) {
            setCurrentRep(r => r + 1);
            setIntervalPhase(1);
            return interval1;
          }
          setRunning(false); setImmersive(false);
          return 0;
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(ticker);
  }, [running, mode, repetitions, currentRep, timerDuration, playAlarm, interval1, interval2, intervalReps, intervalPhase]);

  // ——— Réinitialisation au changement de mode ———
  useEffect(() => {
    if (mode === "timer") setTime(timerDuration);
    if (mode === "interval") {
      setTime(interval1);
      setIntervalPhase(1);
      setCurrentRep(1);
    }
  }, [mode, timerDuration, interval1]);

  // ——— Démarrage / Arrêt ———
  const startStop = () => {
    if (running) {
      setRunning(false);
      setImmersive(false);
    } else {
      if (mode === "timer") {
        const tot = minutes * 60 + seconds;
        setTimerDuration(tot);
        setTime(tot);
        setCurrentRep(1);
      }
      if (mode === "interval") {
        setTime(interval1);
        setIntervalPhase(1);
        setCurrentRep(1);
      }
      setRunning(true);
      setImmersive(true);
    }
  };

  // ——— Réinitialisation complète ———
  const resetAll = () => {
    setRunning(false); setImmersive(false);
    setTime(0); setMinutes(0); setSeconds(0); setCurrentRep(1);
    setInterval1Min(0); setInterval1Sec(0);
    setInterval2Min(0); setInterval2Sec(0);
    setIntervalPhase(1); setIntervalReps(1);
  };

  const modes = [
    { key: "chronometer", label: "Chrono" },
    { key: "timer",      label: "Timer"   },
    { key: "interval",   label: "Pomodoro"},
  ];

  // ——— Visibilité onglet ———
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const onChange = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  // ——— Mode immersif plein écran ———

  if (immersive && running) {
    return (
      <div className="fixed inset-0 overflow-hidden">
        {/* 1) Fond animé */}
        <Image
          src="/images/hero-bg.jpg"
          alt="Décor immersif"
          fill
          className="immersive-bg filter brightness-30 object-cover"
        />
  
        {/* 2) Bulles AU‑DESSUS du fond */}
        <BubbleBackground count={20} />
  
        {/* 3) Timer au‑dessus de tout */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-4">
              <div style={{ fontSize: "8rem", fontWeight: 700, color: "var(--green2)" }}>
            {new Date(time * 1000).toISOString().substr(14, 5)}
          </div>
          {mode !== "chronometer" && (
            <div className="mt-4 text-[var(--text3)] text-2xl text-center">
              {mode === "timer"
                ? `Rep ${currentRep} / ${repetitions}`
                : `${intervalPhase === 1 ? "Work" : "Pause"} – Rep ${currentRep}/${intervalReps}`}
            </div>
          )}
          <button
            onClick={() => setImmersive(false)}
            className="mt-8 px-6 py-2 rounded-full bg-[var(--light-dark)] text-[var(--text1)]"
          >
            Exit
          </button>
          {!visible && (
            <div className="fixed bottom-4 right-4 bg-[var(--details-dark)] px-4 py-2 rounded-lg shadow-lg">
              <div style={{ fontSize: "1.5rem", color: "var(--green2)" }}>
                {new Date(time * 1000).toISOString().substr(14, 5)}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }



  // ——— Version standard : image pleine page + timer au-dessus ———
  return (
    <Layout>
      <Header />

      <div className="relative w-screen h-screen overflow-hidden">
        {/* Image de fond pleine page */}
        <Image
        src="/images/hero-bg.jpg"
        alt="Background"
        fill
        className="filter brightness-50 object-cover"
        />

        {/* Bloc timer centré au‑dessus */}
        <main className="relative z-10 flex items-center justify-center w-full h-full p-4">
          <div
            className="w-[90vw] sm:w-[60vw] max-w-[700px] bg-[var(--details-dark)] rounded-2xl shadow-lg p-4 sm:p-8 flex flex-col justify-between space-y-6"
            style={{ minHeight: "650px" }}
          >
            {/* Switch de mode */}
            <div className="flex">
              {modes.map(m => (
                <button
                  key={m.key}
                  onClick={() => setMode(m.key)}
                  className="flex-1 h-12 rounded-full mx-1 flex items-center justify-center"
                  style={{
                    background: mode===m.key ? "var(--green2)" : "var(--light-dark)",
                    color:      mode===m.key ? "var(--background)" : "var(--text3)",
                    cursor: "pointer"
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Réglages dynamiques */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start sm:items-center">
              {mode === "chronometer" ? (
                <div className="sm:col-span-3 text-center text-[var(--text3)]">
                  Chronometer running
                </div>
              ) : mode === "timer" ? (
                ["Min","Sec","Rep"].map(label => {
                  const val = label==="Min"?minutes: label==="Sec"?seconds: repetitions;
                  const set = label==="Min"? setMinutes: label==="Sec"? setSeconds: setRepetitions;
                  return (
                    <div key={label} className="flex flex-col items-center">
                      <span className="text-[var(--green2)] mb-1">{label}</span>
                      <input
                        type="number"
                        className="no-spinner w-20 rounded-md"
                        onFocus={e=>e.target.select()}
                        value={val}
                        onChange={e=>set(Math.max(label==="Rep"?1:0,parseInt(e.target.value,10)||0))}
                        style={{
                          fontSize:"1.5rem", textAlign:"center",
                          background:"transparent", color:"var(--text1)",
                          border:"none", borderBottom:"2px solid var(--green3)",
                          outline:"none"
                        }}
                      />
                    </div>
                  );
                })
              ) : (
                ["Work","Pause","Rep"].map(label => {
                  if(label==="Rep") {
                    return (
                      <div key={label} className="flex flex-col items-center">
                        <span className="text-[var(--green2)] mb-1 uppercase">{label}</span>
                        <input
                          type="number"
                          className="no-spinner w-20 rounded-md"
                          onFocus={e=>e.target.select()}
                          value={intervalReps}
                          onChange={e=>setIntervalReps(Math.max(1,parseInt(e.target.value,10)||1))}
                          style={{
                            fontSize:"1.5rem", textAlign:"center",
                            background:"transparent", color:"var(--text1)",
                            border:"none", borderBottom:"2px solid var(--green3)",
                            outline:"none"
                          }}
                        />
                      </div>
                    );
                  }
                  const mins = label==="Work"? interval1Min: interval2Min;
                  const secs = label==="Work"? interval1Sec: interval2Sec;
                  const setM = label==="Work"? setInterval1Min: setInterval2Min;
                  const setS = label==="Work"? setInterval1Sec: setInterval2Sec;
                  return (
                    <div key={label} className="flex flex-col items-center">
                      <span className="text-[var(--green2)] mb-1 uppercase">{label}</span>
                      <div className="flex items-center">
                        <input
                          type="number"
                          className="no-spinner w-12 rounded-md"
                          onFocus={e=>e.target.select()}
                          value={mins}
                          onChange={e=>setM(Math.max(0,parseInt(e.target.value,10)||0))}
                          style={{
                            fontSize:"1.3rem", textAlign:"center",
                            background:"transparent", color:"var(--text1)",
                            border:"none", borderBottom:"2px solid var(--green3)",
                            outline:"none"
                          }}
                        />
                        <span className="text-[var(--green2)] px-1">:</span>
                        <input
                          type="number"
                          className="no-spinner w-12 rounded-md"
                          onFocus={e=>e.target.select()}
                          value={secs}
                          onChange={e=>setS(Math.max(0,parseInt(e.target.value,10)||0))}
                          style={{
                            fontSize:"1.3rem", textAlign:"center",
                            background:"transparent", color:"var(--text1)",
                            border:"none", borderBottom:"2px solid var(--green3)",
                            outline:"none"
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Affichage du temps */}
            <div
              className="text-center"
              style={{ fontSize:"4rem", fontWeight:700, color:"var(--green2)" }}
            >
              {new Date(time*1000).toISOString().substr(14,5)}
            </div>
            {(mode==="timer"||mode==="interval") && (
              <div className="text-center text-[var(--text3)] text-xl">
                {mode==="timer"
                  ? `Rep ${currentRep} of ${repetitions}`
                  : `Rep ${currentRep} of ${intervalReps} (${intervalPhase===1?"Work":"Pause"})`}
              </div>
            )}

            {/* Contrôles */}
            <div className="space-y-2">
              <button
                onClick={startStop}
                className="w-full py-3 h-12 rounded-lg"
                style={{
                  background: running?"var(--green1)":"var(--green2)",
                  color:"var(--background)", fontWeight:500, cursor:"pointer"
                }}
              >
                {running?"Arrêter":"Démarrer"}
              </button>
              {!running && (
                <button
                  onClick={resetAll}
                  className="w-full py-3 h-12 rounded-lg"
                  style={{
                    background:"transparent", color:"var(--text1)",
                    border:"2px solid var(--green2)", fontWeight:500, cursor:"pointer"
                  }}
                >
                  Réinitialiser
                </button>
              )}
              {(mode==="timer"||mode==="interval") && (
                <SelectSound
                  sounds={sounds}
                  setSelectedSound={setSelectedSound}
                  className="w-full text-[var(--text1)]"
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
