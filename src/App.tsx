/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { storage } from './services/storage';
import { soundManager } from './services/sound';
import { HeaderNav } from './components/HeaderNav';
import { BottomNav, TabType } from './components/BottomNav';
import { OfflineIndicator } from './components/OfflineIndicator';
import { FiveSecondRuleModal } from './components/FiveSecondRuleModal';
import { AICoachModal } from './components/AICoachModal';
import { PomodoroView } from './components/PomodoroView';
import { SmartTasksView } from './components/SmartTasksView';
import { ToolsAndEbookView } from './components/ToolsAndEbookView';
import { ProfileView } from './components/ProfileView';
import { DailyRoutineView } from './components/DailyRoutineView';
import { NandoBananaMascot } from './components/NandoBananaMascot';
import { DeployGuideModal } from './components/DeployGuideModal';
import {
  Rocket,
  Timer,
  CheckSquare,
  Flame,
  Sparkles,
  Bot,
  ArrowRight,
  BookOpen,
  Award,
  Shield,
  Zap,
  Target,
  Cloud
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('hoje');
  const [profile, setProfile] = useState(storage.getProfile());
  const [tasks, setTasks] = useState(storage.getTasks());
  const [diary, setDiary] = useState(storage.getDiary());
  const [routines, setRoutines] = useState(storage.getRoutines());
  const [badges, setBadges] = useState(storage.getBadges());

  // Modal triggers
  const [is5sModalOpen, setIs5sModalOpen] = useState(false);
  const [fiveSecTaskTarget, setFiveSecTaskTarget] = useState('');
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState(false);

  // Subscribe to reactive storage changes
  useEffect(() => {
    const unsubscribe = storage.subscribe(() => {
      setProfile(storage.getProfile());
      setTasks(storage.getTasks());
      setDiary(storage.getDiary());
      setRoutines(storage.getRoutines());
      setBadges(storage.getBadges());
    });
    return unsubscribe;
  }, []);

  const open5sWithTask = (taskTitle: string) => {
    setFiveSecTaskTarget(taskTitle);
    setIs5sModalOpen(true);
  };

  const pendingTasks = tasks.filter((t) => !t.completed);
  const majorTasks = tasks.filter((t) => t.isMajor);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Offline Status */}
      <OfflineIndicator />

      {/* Top Header & XP Progress */}
      <HeaderNav
        profile={profile}
        onOpenCoach={() => setIsCoachOpen(true)}
        onOpenQuick5s={() => open5sWithTask('')}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 pb-24">
        {/* TAB 1: HOJE (DASHBOARD) */}
        {currentTab === 'hoje' && (
          <div className="space-y-4">
            {/* Banner: Nando Banana & Disparador 5-4-3-2-1 Hero Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-rose-600 to-indigo-700 p-5 shadow-2xl text-white">
              <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/30 backdrop-blur-md text-amber-200 text-[10px] font-black uppercase tracking-wider border border-white/20">
                      Regra dos 5 Segundos • Neurociência
                    </span>
                    <span className="text-[11px] font-bold text-amber-300">Capítulo 1</span>
                  </div>

                  <h2 className="text-xl font-black leading-tight text-white">
                    Quebre a Inércia Agora Mesmo!
                  </h2>
                  <p className="text-xs text-white/90 mt-1 leading-relaxed">
                    Seu cérebro demora 5 segundos para inventar uma desculpa. O mascote <strong>Nando Banana</strong> já ligou os propulsores: conte <strong>5-4-3-2-1</strong> e entre em ação!
                  </p>

                  <div className="flex flex-wrap items-center gap-2.5 mt-4">
                    <button
                      onClick={() => open5sWithTask('')}
                      className="px-5 py-3 rounded-2xl bg-slate-950 hover:bg-slate-900 text-amber-300 font-extrabold text-xs shadow-xl active:scale-95 transition flex items-center gap-2 border border-amber-400/30"
                    >
                      <Rocket className="w-4 h-4 text-amber-400 animate-pulse" />
                      <span>DISPARAR CONTAGEM 5s</span>
                    </button>

                    <button
                      onClick={() => setIsCoachOpen(true)}
                      className="px-3.5 py-3 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95"
                    >
                      <Bot className="w-4 h-4 text-amber-200" />
                      <span>Coach IA</span>
                    </button>
                  </div>
                </div>

                {/* Animated Nando Banana Mascot */}
                <div className="shrink-0 pt-2 sm:pt-0">
                  <NandoBananaMascot size="lg" withBubble bubbleText="5-4-3-2-1 e FOGO!" />
                </div>
              </div>

              {/* Decorative shapes */}
              <div className="absolute -right-8 -bottom-10 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
            </div>

            {/* Google Cloud Backend Banner */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Cloud className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-white block truncate">Google Cloud Backend Conectado</span>
                  <span className="text-[11px] text-emerald-300">Sincronização persistente e PWA pronto</span>
                </div>
              </div>
              <button
                onClick={() => setIsDeployGuideOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] shrink-0 transition active:scale-95"
              >
                Como Publicar
              </button>
            </div>

            {/* As 3 Grandes Vitórias do Dia (Capítulo 3) */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    As 3 Grandes Metas SMART de Hoje
                  </h3>
                </div>
                <button
                  onClick={() => setCurrentTab('smart')}
                  className="text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-0.5"
                >
                  <span>Gerenciar</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {majorTasks.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400">
                  Nenhuma das 3 grandes metas definidas. Clique em "Gerenciar" para planejar seu dia!
                </div>
              ) : (
                <div className="space-y-2">
                  {majorTasks.map((t) => (
                    <div
                      key={t.id}
                      className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                        t.completed
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-200'
                      }`}
                    >
                      <button
                        onClick={() => storage.toggleTask(t.id)}
                        className="text-slate-400 hover:text-emerald-400 transition"
                      >
                        {t.completed ? (
                          <CheckSquare className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <div className="w-5 h-5 rounded-lg border-2 border-slate-600 hover:border-amber-400" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold truncate ${t.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                          {t.title}
                        </p>
                        <span className="text-[10px] text-amber-400 font-medium">Até {t.deadlineTime}</span>
                      </div>

                      {!t.completed && (
                        <button
                          onClick={() => open5sWithTask(t.title)}
                          className="px-2 py-1 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-extrabold hover:bg-rose-500/30 transition"
                        >
                          🚀 5s
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Pomodoro Launcher */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-md flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                  <Timer className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Sprint de Foco (Pomodoro 25m)</h4>
                  <p className="text-[11px] text-slate-400">Método Jeff Galloway • +60 XP por ciclo</p>
                </div>
              </div>
              <button
                onClick={() => setCurrentTab('foco')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white shadow-md active:scale-95 transition"
              >
                Abrir Foco
              </button>
            </div>

            {/* Micro-hábitos, Hidratação & Respiração (Capítulo 7) */}
            <DailyRoutineView routines={routines} profile={profile} />

            {/* Ebook Chapter Highlight Card */}
            <div
              onClick={() => setCurrentTab('ferramentas')}
              className="p-4 rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950/60 border border-indigo-900/40 cursor-pointer hover:border-indigo-500/40 transition shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Acesse os 8 Capítulos do Ebook</h4>
                    <p className="text-[11px] text-slate-400">Resumos, táticas práticas e os simuladores</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FOCO & POMODORO */}
        {currentTab === 'foco' && <PomodoroView />}

        {/* TAB 3: SMART & QUADRO */}
        {currentTab === 'smart' && (
          <SmartTasksView
            tasks={tasks}
            diary={diary}
            onOpen5sWithTask={open5sWithTask}
          />
        )}

        {/* TAB 4: FERRAMENTAS & EBOOK */}
        {currentTab === 'ferramentas' && <ToolsAndEbookView />}

        {/* TAB 5: PERFIL & CONQUISTAS */}
        {currentTab === 'perfil' && (
          <ProfileView
            profile={profile}
            badges={badges}
            onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
          />
        )}
      </main>

      {/* Modals */}
      <FiveSecondRuleModal
        isOpen={is5sModalOpen}
        onClose={() => setIs5sModalOpen(false)}
        defaultTaskTitle={fiveSecTaskTarget}
      />

      <AICoachModal
        isOpen={isCoachOpen}
        onClose={() => setIsCoachOpen(false)}
        onLaunch5sWithTask={(title) => {
          setIsCoachOpen(false);
          open5sWithTask(title);
        }}
      />

      <DeployGuideModal
        isOpen={isDeployGuideOpen}
        onClose={() => setIsDeployGuideOpen(false)}
      />

      {/* Bottom Mobile PWA Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
        pendingTasksCount={pendingTasks.length}
      />
    </div>
  );
}
