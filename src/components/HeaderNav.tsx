import React, { useState } from 'react';
import { UserProfile } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { soundManager } from '../services/sound';
import { Flame, Cloud, Volume2, VolumeX, Sparkles, Bot } from 'lucide-react';

interface Props {
  profile: UserProfile;
  onOpenCoach: () => void;
  onOpenQuick5s: () => void;
}

export const HeaderNav: React.FC<Props> = ({ profile, onOpenCoach, onOpenQuick5s }) => {
  const [soundOn, setSoundOn] = useState(soundManager.isEnabled());

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundManager.setSoundEnabled(next);
  };

  const progressPercent = Math.min(100, Math.round((profile.currentLevelXp / profile.nextLevelXp) * 100)) || 0;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 py-2.5 transition">
      <div className="max-w-xl mx-auto flex flex-col gap-2">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-2">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-violet-600 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="text-lg">⚡</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-300 bg-clip-text text-transparent">
                  FocoTotal
                </h1>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  PWA
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Anti-Procrastinação</p>
            </div>
          </div>

          {/* Controls & Actions */}
          <div className="flex items-center gap-1.5">
            {/* Quick 5s emergency button */}
            <button
              onClick={onOpenQuick5s}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-rose-500/20 active:scale-95 transition"
              title="Disparador dos 5 Segundos"
            >
              <span className="animate-pulse">🚀</span>
              <span className="hidden sm:inline">Disparo</span> 5s
            </button>

            {/* AI Coach button */}
            <button
              onClick={onOpenCoach}
              className="p-1.5 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 active:scale-95 transition"
              title="Coach Anti-Procrastinação IA"
            >
              <Bot className="w-4 h-4 text-indigo-400" />
            </button>

            {/* Sound toggle */}
            <button
              onClick={toggleSound}
              className="p-1.5 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/60 active:scale-95 transition"
              title={soundOn ? 'Desativar Sons' : 'Ativar Sons'}
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* PWA Install */}
            <PWAInstallButton compact />
          </div>
        </div>

        {/* Gamification Bar */}
        <div className="flex items-center justify-between gap-3 bg-slate-900/90 rounded-2xl px-3 py-1.5 border border-slate-800/90">
          {/* Level & Title */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-black">
              NV {profile.level}
            </span>
            <span className="text-xs font-semibold text-slate-200 truncate">{profile.title}</span>
          </div>

          {/* Streak & Cloud */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 text-xs font-bold text-amber-400" title="Dias Consecutivos de Foco">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{profile.streakDays}d</span>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-400" title="Google Cloud Conectado">
              <Cloud className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden xs:inline">Nuvem</span>
            </div>
          </div>
        </div>

        {/* XP Progress indicator */}
        <div className="relative w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </header>
  );
};
