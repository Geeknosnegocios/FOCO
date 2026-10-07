import React, { useState, useEffect } from 'react';
import { RoutineItem, UserProfile } from '../types';
import { storage } from '../services/storage';
import { soundManager } from '../services/sound';
import { Droplet, Sun, Moon, Wind, CheckCircle2, Circle, Sparkles, Play, Pause, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  routines: RoutineItem[];
  profile: UserProfile;
}

export const DailyRoutineView: React.FC<Props> = ({ routines, profile }) => {
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inspire' | 'hold' | 'expire'>('inspire');
  const [breathSeconds, setBreathSeconds] = useState(4);
  const [totalBreatheCount, setTotalBreatheCount] = useState(0);

  const morningRoutines = routines.filter((r) => r.period === 'morning');
  const eveningRoutines = routines.filter((r) => r.period === 'evening');

  // Breathing 4-4-4 cycle
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (breathingActive) {
      interval = setInterval(() => {
        setBreathSeconds((prev) => {
          if (prev <= 1) {
            setBreathPhase((currentPhase) => {
              if (currentPhase === 'inspire') {
                soundManager.playBeep(440, 0.05);
                return 'hold';
              }
              if (currentPhase === 'hold') {
                soundManager.playBeep(350, 0.05);
                return 'expire';
              }
              // Expire done, loop back
              soundManager.playBeep(520, 0.05);
              setTotalBreatheCount((c) => c + 1);
              return 'inspire';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [breathingActive]);

  const toggleBreathing = () => {
    const next = !breathingActive;
    setBreathingActive(next);
    soundManager.triggerHaptic(40);
    if (!next && totalBreatheCount >= 3) {
      storage.addMeditationMinutes(2);
      try {
        confetti({ particleCount: 40, spread: 50 });
      } catch {}
    }
  };

  const handleToggleRoutine = (id: string) => {
    storage.toggleRoutine(id);
    soundManager.triggerHaptic(30);
  };

  return (
    <div className="space-y-4">
      {/* Hydration Tracker Card */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg text-slate-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <Droplet className="w-4 h-4 fill-sky-400" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Hidratação Cerebral (Cap. 7)</h3>
              <p className="text-[11px] text-slate-400">Meta: {profile.waterGoal} copos / dia ({profile.waterGlasses * 250}ml)</p>
            </div>
          </div>
          <span className="text-xs font-black text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
            {profile.waterGlasses}/{profile.waterGoal} copos
          </span>
        </div>

        {/* Glasses row */}
        <div className="flex items-center justify-between gap-1 py-2">
          {Array.from({ length: 8 }).map((_, idx) => {
            const isFilled = idx < profile.waterGlasses;
            return (
              <button
                key={idx}
                onClick={() => {
                  if (idx < profile.waterGlasses) {
                    storage.removeWaterGlass();
                  } else {
                    storage.addWaterGlass();
                  }
                }}
                className={`flex-1 h-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95 ${
                  isFilled
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30 font-bold'
                    : 'bg-slate-800/80 text-slate-500 hover:bg-slate-800'
                }`}
                title={`Copo ${idx + 1}`}
              >
                <Droplet className={`w-4 h-4 ${isFilled ? 'fill-current' : ''}`} />
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
          <span>Água combate a sonolência e fadiga mental.</span>
          <button
            onClick={() => storage.addWaterGlass()}
            className="text-sky-400 font-bold hover:underline"
          >
            + Beber 1 Copo
          </button>
        </div>
      </div>

      {/* Rhythmic Breathing 4-4-4 Box Meditation */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg text-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Respiração Desaceleradora 4-4-4</h3>
              <p className="text-[11px] text-slate-400">Quebre a ansiedade antes de começar</p>
            </div>
          </div>
          <button
            onClick={toggleBreathing}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              breathingActive
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/30'
            }`}
          >
            {breathingActive ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{breathingActive ? 'Pausar' : 'Respirar'}</span>
          </button>
        </div>

        {breathingActive ? (
          <div className="flex flex-col items-center justify-center py-4 text-center animate-fadeIn">
            {/* Pulsating breathing circle */}
            <div
              className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-1000 border-2 ${
                breathPhase === 'inspire'
                  ? 'scale-110 bg-teal-500/25 border-teal-400 shadow-xl shadow-teal-500/30'
                  : breathPhase === 'hold'
                  ? 'scale-105 bg-amber-500/20 border-amber-400'
                  : 'scale-90 bg-indigo-500/20 border-indigo-400'
              }`}
            >
              <div className="text-center">
                <span className="text-2xl font-black text-white">{breathSeconds}s</span>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-teal-300">
                  {breathPhase === 'inspire' ? 'Inspire' : breathPhase === 'hold' ? 'Segure' : 'Expire'}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-300 mt-3">
              Ciclos completados: <strong>{totalBreatheCount}</strong> (+20 XP ao finalizar)
            </p>
          </div>
        ) : (
          <p className="text-xs text-slate-400 leading-relaxed">
            O <strong>Capítulo 7</strong> recomenda técnicas de respiração para controlar o cortisol que gera a vontade de fugir da tarefa. Toque em "Respirar" para 1 minuto de ancoragem.
          </p>
        )}
      </div>

      {/* Morning & Evening Routines Checklists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Morning */}
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <Sun className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Rotina Matinal</h4>
          </div>
          <div className="space-y-2">
            {morningRoutines.map((routine) => (
              <button
                key={routine.id}
                onClick={() => handleToggleRoutine(routine.id)}
                className={`w-full text-left p-2.5 rounded-2xl border transition flex items-start gap-2.5 ${
                  routine.completed
                    ? 'bg-slate-950/40 border-slate-800 text-slate-500'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-200 hover:bg-slate-800'
                }`}
              >
                {routine.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                )}
                <div className="min-w-0">
                  <p className={`text-xs font-semibold ${routine.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                    {routine.title}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">{routine.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Evening */}
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <Moon className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Rotina Noturna</h4>
          </div>
          <div className="space-y-2">
            {eveningRoutines.map((routine) => (
              <button
                key={routine.id}
                onClick={() => handleToggleRoutine(routine.id)}
                className={`w-full text-left p-2.5 rounded-2xl border transition flex items-start gap-2.5 ${
                  routine.completed
                    ? 'bg-slate-950/40 border-slate-800 text-slate-500'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-200 hover:bg-slate-800'
                }`}
              >
                {routine.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                )}
                <div className="min-w-0">
                  <p className={`text-xs font-semibold ${routine.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                    {routine.title}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">{routine.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
