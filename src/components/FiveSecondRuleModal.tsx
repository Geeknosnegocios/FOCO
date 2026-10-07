import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../services/sound';
import { storage } from '../services/storage';
import { Rocket, Zap, X, Check, Flame, AlertCircle } from 'lucide-react';
import { NandoBananaMascot } from './NandoBananaMascot';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultTaskTitle?: string;
}

export const FiveSecondRuleModal: React.FC<Props> = ({ isOpen, onClose, defaultTaskTitle = '' }) => {
  const [taskName, setTaskName] = useState(defaultTaskTitle);
  const [stage, setStage] = useState<'idle' | 'counting' | 'blastoff'>('idle');
  const [count, setCount] = useState(5);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (defaultTaskTitle) {
      setTaskName(defaultTaskTitle);
    }
  }, [defaultTaskTitle]);

  useEffect(() => {
    if (!isOpen) {
      if (timerRef.current) clearInterval(timerRef.current);
      setStage('idle');
      setCount(5);
    }
  }, [isOpen]);

  const startCountdown = () => {
    setStage('counting');
    setCount(5);
    soundManager.playBeep(400, 0.15);
    soundManager.triggerHaptic(50);

    let current = 5;
    timerRef.current = setInterval(() => {
      current -= 1;
      setCount(current);

      if (current > 0) {
        soundManager.playBeep(400 + (5 - current) * 100, 0.15);
        soundManager.triggerHaptic(60);
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        setStage('blastoff');
        soundManager.playBlastoff();
        soundManager.triggerHaptic([100, 50, 150]);

        try {
          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'],
          });
        } catch {}

        // Record launch in storage
        storage.triggerFiveSecondLaunch(taskName);
      }
    }, 1000);
  };

  const cancelCountdown = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStage('idle');
    setCount(5);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl text-slate-100 overflow-hidden">
        {/* Glow behind */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={() => {
            cancelCountdown();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {stage === 'idle' && (
          <div className="flex flex-col items-center text-center">
            <NandoBananaMascot size="sm" withBubble bubbleText="5-4-3-2-1 e AÇÃO!" className="mb-2" />

            <h2 className="text-xl font-extrabold text-white">Regra dos 5 Segundos</h2>
            <p className="text-xs text-amber-400 font-semibold mt-1 uppercase tracking-wider">
              Capítulo 1 • Neurociência da Inércia
            </p>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              O cérebro demora 5 segundos para inventar uma desculpa de autopreservação e paralisar seu corpo.
              Conte <strong>5-4-3-2-1</strong> e comece fisicamente antes que o subconsciente assuma o controle!
            </p>

            <div className="w-full mt-4 text-left">
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Qual tarefa você vai disparar agora?
              </label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Ex: Escrever primeiro parágrafo do relatório..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div className="w-full flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60 mt-3 text-left">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-[11px] text-slate-300">
                Recompensa: <strong>+30 XP</strong> imediato ao concluir a contagem e iniciar.
              </span>
            </div>

            <button
              onClick={startCountdown}
              className="w-full mt-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 text-white font-extrabold text-base shadow-lg shadow-rose-500/25 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Flame className="w-5 h-5 text-amber-200 fill-amber-200" />
              <span>INICIAR CONTAGEM 5-4-3-2-1</span>
            </button>
          </div>
        )}

        {stage === 'counting' && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              Prepare seu corpo para agir
            </span>

            {/* Huge Number */}
            <div className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 p-1 flex items-center justify-center shadow-2xl shadow-rose-500/40 my-3 animate-pulse">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                <span className="text-7xl font-black bg-gradient-to-b from-white via-amber-200 to-amber-500 bg-clip-text text-transparent">
                  {count}
                </span>
              </div>
            </div>

            <p className="text-sm font-bold text-white mt-2">
              {count > 2 ? 'Respire fundo e posicione as mãos...' : 'PREPARE-SE PARA O MOVIMENTO!'}
            </p>

            {taskName && (
              <p className="text-xs text-amber-300/90 mt-1 max-w-xs truncate font-medium">
                Alvo: "{taskName}"
              </p>
            )}

            <button
              onClick={cancelCountdown}
              className="mt-6 text-xs text-slate-400 hover:text-slate-200 underline"
            >
              Cancelar
            </button>
          </div>
        )}

        {stage === 'blastoff' && (
          <div className="flex flex-col items-center text-center py-2">
            <NandoBananaMascot size="sm" withBubble bubbleText="Boa! Agora manda bala!" className="mb-1" />

            <h3 className="text-xl font-black text-white">DISPARO EFETUADO!</h3>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-extrabold border border-amber-500/40 my-2">
              +30 XP CONQUISTADO!
            </span>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 my-3 text-left w-full">
              <div className="flex items-center gap-2 mb-1 text-emerald-400 font-bold text-xs">
                <Check className="w-4 h-4" />
                <span>A inércia neural foi quebrada!</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Agora aplique a <strong>Regra dos 2 Minutos</strong>: toque no material de trabalho e faça os primeiros 120 segundos sem interrupção. O movimento já gerou a emoção!
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-2 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/30"
            >
              COMEÇAR A TRABALHAR AGORA
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
