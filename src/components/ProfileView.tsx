import React, { useState } from 'react';
import { UserProfile, Badge } from '../types';
import { storage } from '../services/storage';
import { soundManager } from '../services/sound';
import { PWAInstallButton } from './PWAInstallButton';
import { Trophy, Award, Flame, Timer, Rocket, CheckSquare, Cloud, RefreshCw, Smartphone, ShieldCheck, Sparkles, Droplet } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  profile: UserProfile;
  badges: Badge[];
  onOpenDeployGuide?: () => void;
}

export const ProfileView: React.FC<Props> = ({ profile, badges, onOpenDeployGuide }) => {
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleManualSync = async () => {
    setSyncing(true);
    soundManager.playBeep(520, 0.08);
    await storage.trySyncBackend();
    setTimeout(() => {
      setSyncing(false);
      setSyncSuccess(true);
      soundManager.playSuccess();
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 600);
  };

  const unlockedCount = badges.filter((b) => b.unlockedAt !== null).length;
  const progressPercent = Math.min(100, Math.round((profile.currentLevelXp / profile.nextLevelXp) * 100)) || 0;

  return (
    <div className="space-y-4 pb-20">
      {/* Hero Character Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 border border-indigo-900/50 shadow-xl text-slate-100">
        <div className="flex items-center gap-3.5 mb-4">
          <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-0.5 shadow-xl shadow-rose-500/25">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-3xl">
              ⚡
            </div>
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black shadow-md">
              NV {profile.level}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-extrabold text-white truncate">{profile.name}</h2>
              <span className="text-xs">🔥</span>
            </div>
            <p className="text-xs font-bold text-amber-400 mt-0.5">{profile.title}</p>
            <p className="text-[11px] text-slate-400">
              {profile.streakDays} {profile.streakDays === 1 ? 'dia consecutivo' : 'dias consecutivos'} de foco
            </p>
          </div>
        </div>

        {/* Level XP Bar */}
        <div className="space-y-1.5 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Progresso do Nível {profile.level}</span>
            <span className="font-extrabold text-amber-400">
              {profile.currentLevelXp} / {profile.nextLevelXp} XP ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 text-right">
            Total acumulado: {profile.xp} XP
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black text-white">{profile.fiveSecLaunches}</span>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Disparos 5s</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black text-white">{profile.pomodorosCompleted}</span>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Pomodoros (25m)</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black text-white">{profile.tasksCompleted}</span>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Metas SMART</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black text-white">{unlockedCount} / {badges.length}</span>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Conquistas</p>
          </div>
        </div>
      </div>

      {/* Badges Gallery */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Mural de Conquistas & Insígnias</span>
          </h3>
          <span className="text-xs text-amber-400 font-extrabold">{unlockedCount} Desbloqueadas</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {badges.map((badge) => {
            const isUnlocked = badge.unlockedAt !== null;

            return (
              <div
                key={badge.id}
                className={`p-3 rounded-2xl border transition-all ${
                  isUnlocked
                    ? 'bg-amber-500/10 border-amber-500/30 text-white'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-500 opacity-75'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className={`text-2xl p-1.5 rounded-xl ${isUnlocked ? 'bg-amber-500/20' : 'bg-slate-800 grayscale'}`}>
                    {badge.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs font-bold ${isUnlocked ? 'text-amber-300' : 'text-slate-400'}`}>
                        {badge.title}
                      </h4>
                      <span className="text-[10px] font-bold text-amber-400">+{badge.xpReward} XP</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{badge.description}</p>
                    <div className="mt-2 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${isUnlocked ? 'bg-amber-400' : 'bg-slate-600'}`}
                        style={{ width: `${Math.min(100, (badge.progress / badge.maxProgress) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cloud & PWA Card */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Conexão Google Cloud Backend</h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            Ativa
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Seu PWA sincroniza o progresso no backend Express e no Google Cloud Run, garantindo persistência tanto online quanto em modo 100% offline via Service Worker.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          <button
            onClick={handleManualSync}
            disabled={syncing}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 flex items-center justify-center gap-2 transition active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-amber-400' : ''}`} />
            <span>{syncSuccess ? 'Sincronizado com Sucesso!' : 'Sincronizar com Nuvem'}</span>
          </button>

          {onOpenDeployGuide && (
            <button
              onClick={onOpenDeployGuide}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Cloud className="w-3.5 h-3.5 text-emerald-400" />
              <span>Passo a Passo de Publicação</span>
            </button>
          )}

          <PWAInstallButton />
        </div>
      </div>
    </div>
  );
};
