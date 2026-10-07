import React from 'react';

export const PomodoroRunnerArt: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-4 border border-indigo-700/40 shadow-lg ${className}`}>
    <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle cx="100" cy="100" r="80" stroke="#818cf8" strokeWidth="4" strokeDasharray="12 8" fill="none" />
        <circle cx="100" cy="100" r="50" stroke="#f43f5e" strokeWidth="3" fill="none" />
        <path d="M100 40 L100 100 L140 120" stroke="#facc15" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M40 160 Q 90 90 140 140 T 190 70" stroke="#38bdf8" strokeWidth="3" fill="none" />
      </svg>
    </div>
    <div className="relative z-10 flex items-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-2xl shadow-md shadow-rose-500/20">
        ⏱️
      </div>
      <div>
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Método Jeff Galloway • Run-Walk</h4>
        <p className="text-[11px] text-indigo-200">25 min corrida mental + 5 min caminhada regenerativa</p>
      </div>
    </div>
  </div>
);

export const ZenDeclutterArt: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 p-4 border border-teal-700/40 shadow-lg ${className}`}>
    <div className="absolute right-2 top-1 bottom-1 w-28 opacity-25 pointer-events-none">
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <ellipse cx="60" cy="95" rx="30" ry="10" fill="#2dd4bf" />
        <ellipse cx="60" cy="78" rx="22" ry="8" fill="#14b8a6" />
        <ellipse cx="60" cy="64" rx="14" ry="6" fill="#0d9488" />
        <circle cx="60" cy="40" r="16" fill="#38bdf8" />
        <path d="M 60 20 Q 75 35 60 48 Q 45 35 60 20 Z" fill="#facc15" />
      </svg>
    </div>
    <div className="relative z-10 flex items-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center text-2xl shadow-md shadow-teal-500/20">
        🧘
      </div>
      <div>
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Despejo dos 50.000 Pensamentos</h4>
        <p className="text-[11px] text-teal-200">Esvazie a memória RAM para focar no que importa</p>
      </div>
    </div>
  </div>
);

export const VelvetBrickArt: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-pink-950 p-4 border border-purple-700/40 shadow-lg ${className}`}>
    <div className="relative z-10 flex items-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-2xl shadow-md shadow-purple-500/20">
        🧱
      </div>
      <div>
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Tijolo de Veludo & Throw It Back</h4>
        <p className="text-[11px] text-pink-200">Firme como pedra por dentro, aveludado por fora</p>
      </div>
    </div>
  </div>
);
