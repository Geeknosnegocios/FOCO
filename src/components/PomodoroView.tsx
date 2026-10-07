import React, { useState, useEffect, useRef } from 'react';
import { storage } from '../services/storage';
import { soundManager } from '../services/sound';
import { Play, Pause, RotateCcw, Maximize2, Minimize2, Shield, BellOff, Award, Sparkles, Volume2, VolumeX, CheckCircle } from 'lucide-react';
import { PomodoroRunnerArt } from './VisualIllustrations';
import confetti from 'canvas-confetti';

export const PomodoroView: React.FC = () => {
  const [mode, setMode] = useState<'work' | 'short_break' | 'long_break'>('work');
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundAmbient, setSoundAmbient] = useState(false);
  const ambientIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Switch modes
  const handleSelectMode = (newMode: 'work' | 'short_break' | 'long_break', mins: number) => {
    setIsActive(false);
    setMode(newMode);
    setDurationMinutes(mins);
    setTimeLeft(mins * 60);
    soundManager.triggerHaptic(30);
  };

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Completed timer!
      setIsActive(false);
      soundManager.playChime();
      soundManager.triggerHaptic([100, 100, 200]);

      if (mode === 'work') {
        const nextCycles = completedCycles + 1;
        setCompletedCycles(nextCycles);
        storage.completePomodoro(durationMinutes);

        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}

        // Prompt break
        if (nextCycles % 4 === 0) {
          handleSelectMode('long_break', 15);
        } else {
          handleSelectMode('short_break', 5);
        }
      } else {
        // Break finished, back to work
        handleSelectMode('work', 25);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, completedCycles, durationMinutes]);

  // Ambient ticking synthesizer
  useEffect(() => {
    if (isActive && soundAmbient && mode === 'work') {
      ambientIntervalRef.current = setInterval(() => {
        soundManager.playBeep(800, 0.02);
      }, 1000);
    } else {
      if (ambientIntervalRef.current) clearInterval(ambientIntervalRef.current);
    }

    return () => {
      if (ambientIntervalRef.current) clearInterval(ambientIntervalRef.current);
    };
  }, [isActive, soundAmbient, mode]);

  const toggleTimer = () => {
    const next = !isActive;
    setIsActive(next);
    soundManager.triggerHaptic(40);
    if (next) {
      soundManager.playBeep(600, 0.08);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(durationMinutes * 60);
    soundManager.triggerHaptic(30);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalSeconds = durationMinutes * 60;
  const progressPercent = Math.min(100, Math.max(0, ((totalSeconds - timeLeft) / totalSeconds) * 100));

  return (
    <div className={`space-y-4 pb-20 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-6 flex flex-col justify-center items-center' : ''}`}>
      {/* Chapter 4 Visual Header */}
      {!isFullscreen && (
        <div className="space-y-3">
          <PomodoroRunnerArt />
        </div>
      )}

      {/* Main Timer Card */}
      <div className={`relative rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl text-center flex flex-col items-center ${isFullscreen ? 'max-w-md w-full border-indigo-500/30' : ''}`}>
        {/* Fullscreen & Ambient sound controls */}
        <div className="w-full flex items-center justify-between mb-3">
          <button
            onClick={() => setSoundAmbient(!soundAmbient)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
              soundAmbient
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Tick sonoro suave de ritmo de trabalho"
          >
            {soundAmbient ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="text-[11px]">Metrônomo</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700 transition"
            title={isFullscreen ? 'Sair do Modo Imersão' : 'Modo Tela Cheia Imersivo'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 w-full max-w-xs mb-6">
          <button
            onClick={() => handleSelectMode('work', 25)}
            className={`py-1.5 px-2 rounded-xl text-xs font-bold transition ${
              mode === 'work' && durationMinutes === 25
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Foco (25m)
          </button>
          <button
            onClick={() => handleSelectMode('short_break', 5)}
            className={`py-1.5 px-2 rounded-xl text-xs font-bold transition ${
              mode === 'short_break'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pausa (5m)
          </button>
          <button
            onClick={() => handleSelectMode('long_break', 15)}
            className={`py-1.5 px-2 rounded-xl text-xs font-bold transition ${
              mode === 'long_break'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Longa (15m)
          </button>
        </div>

        {/* Circular Display */}
        <div className="relative w-64 h-64 my-2 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-slate-800/80"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="44"
              className={`transition-all duration-1000 ${
                mode === 'work' ? 'text-indigo-500' : mode === 'short_break' ? 'text-emerald-500' : 'text-amber-500'
              }`}
              strokeWidth="6"
              strokeDasharray={276.46}
              strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          {/* Central Time Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black tracking-tight text-white font-mono">
              {formattedTime}
            </span>
            <span
              className={`text-xs font-bold uppercase tracking-widest mt-1.5 px-2.5 py-0.5 rounded-full ${
                mode === 'work'
                  ? 'bg-indigo-500/20 text-indigo-300'
                  : mode === 'short_break'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-amber-500/20 text-amber-300'
              }`}
            >
              {mode === 'work' ? 'Sprint de Foco' : mode === 'short_break' ? 'Descanso Mental' : 'Pausa Regenerativa'}
            </span>
          </div>
        </div>

        {/* Isolation Badge (Physical & Digital Isolation) */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 my-4">
          <Shield className="w-3.5 h-3.5 text-indigo-400" />
          <span>Isolamento Ativo: Sem redes sociais • Porta fechada</span>
        </div>

        {/* Buttons Controls */}
        <div className="flex items-center gap-3 mt-1">
          <button
            onClick={resetTimer}
            className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition active:scale-95"
            title="Reiniciar Tempo"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTimer}
            className={`px-8 py-3.5 rounded-2xl font-black text-base shadow-xl flex items-center gap-2 active:scale-95 transition ${
              isActive
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-amber-500/30 hover:brightness-110'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>INICIAR FOCO</span>
              </>
            )}
          </button>
        </div>

        {/* 4 Cycles Indicator */}
        <div className="w-full mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Ciclos de Maratona:</span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((num) => {
              const isDone = (completedCycles % 4) >= num || (completedCycles > 0 && completedCycles % 4 === 0);
              return (
                <div
                  key={num}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] transition ${
                    isDone
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isDone ? '✓' : num}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
