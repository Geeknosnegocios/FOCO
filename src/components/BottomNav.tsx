import React from 'react';
import { Home, Timer, CheckSquare, Wrench, Trophy, BookOpen } from 'lucide-react';
import { soundManager } from '../services/sound';

export type TabType = 'hoje' | 'foco' | 'smart' | 'ferramentas' | 'perfil';

interface Props {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  pendingTasksCount: number;
}

export const BottomNav: React.FC<Props> = ({ currentTab, onChangeTab, pendingTasksCount }) => {
  const tabs = [
    { id: 'hoje' as TabType, label: 'Hoje', icon: Home },
    { id: 'foco' as TabType, label: 'Foco 25m', icon: Timer },
    { id: 'smart' as TabType, label: 'S.M.A.R.T', icon: CheckSquare, badge: pendingTasksCount },
    { id: 'ferramentas' as TabType, label: 'Métodos', icon: Wrench },
    { id: 'perfil' as TabType, label: 'Conquistas', icon: Trophy },
  ];

  const handleSelect = (tab: TabType) => {
    soundManager.triggerHaptic(25);
    onChangeTab(tab);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/92 backdrop-blur-2xl border-t border-slate-800/80 px-2 py-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] transition">
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleSelect(tab.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.5]' : 'scale-100 stroke-[1.8]'
                  }`}
                />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 px-1.5 py-0.2 min-w-[16px] h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight truncate max-w-full ${isActive ? 'text-amber-300' : 'text-slate-400'}`}>
                {tab.label}
              </span>

              {/* Active dot indicator */}
              {isActive && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/80 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
