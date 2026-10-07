import { UserProfile, Task, Badge, TimeDiaryEntry, RoutineItem, MentalThought } from '../types';
import { INITIAL_BADGES, INITIAL_ROUTINES } from '../data/ebookData';
import { soundManager } from './sound';
import confetti from 'canvas-confetti';

const STORAGE_KEY_PROFILE = 'focototal_user_profile_v1';
const STORAGE_KEY_TASKS = 'focototal_tasks_v1';
const STORAGE_KEY_DIARY = 'focototal_diary_v1';
const STORAGE_KEY_ROUTINES = 'focototal_routines_v1';
const STORAGE_KEY_THOUGHTS = 'focototal_thoughts_v1';
const STORAGE_KEY_BADGES = 'focototal_badges_v1';

const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0, title: 'Recruta Anti-Inércia' },
  { level: 2, xp: 120, title: 'Disparador dos 5s' },
  { level: 3, xp: 280, title: 'Míssil Teleguiado' },
  { level: 4, xp: 500, title: 'Executor S.M.A.R.T.' },
  { level: 5, xp: 800, title: 'Maratonista do Foco' },
  { level: 6, xp: 1200, title: 'Diplomata Tijolo de Veludo' },
  { level: 7, xp: 1700, title: 'Arquiteto de Hábitos' },
  { level: 8, xp: 2300, title: 'Mestre da Produtividade' },
  { level: 9, xp: 3000, title: 'Lorde Anti-Procrastinação' },
];

function getLevelInfo(totalXp: number) {
  let current = LEVEL_THRESHOLDS[0];
  let next = LEVEL_THRESHOLDS[1];

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalXp >= LEVEL_THRESHOLDS[i].xp) {
      current = LEVEL_THRESHOLDS[i];
      next = LEVEL_THRESHOLDS[i + 1] || { level: current.level + 1, xp: current.xp + 1000, title: 'Mestre Infinito' };
    }
  }

  return {
    level: current.level,
    title: current.title,
    currentLevelXp: totalXp - current.xp,
    nextLevelXp: next.xp - current.xp,
  };
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Guerreiro do Foco',
  title: 'Recruta Anti-Inércia',
  level: 1,
  xp: 0,
  currentLevelXp: 0,
  nextLevelXp: 120,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  pomodorosCompleted: 0,
  fiveSecLaunches: 0,
  tasksCompleted: 0,
  minutesFocused: 0,
  waterGlasses: 2,
  waterGoal: 8,
  meditationMinutes: 0,
  unlockedBadgeCount: 0,
};

const DEFAULT_TASKS: Task[] = [
  {
    id: 't-1',
    title: 'Finalizar rascunho do relatório executivo',
    isSpecific: true,
    isMeasurable: true,
    isAttainable: true,
    isRelevant: true,
    deadlineTime: '11:00',
    completed: false,
    isMajor: true,
    category: 'foco',
    estimatedMinutes: 50,
    createdAt: Date.now() - 3600000,
  },
  {
    id: 't-2',
    title: 'Reunião de 30 min para alinhar compras prioritárias',
    isSpecific: true,
    isMeasurable: true,
    isAttainable: true,
    isRelevant: true,
    deadlineTime: '14:30',
    completed: false,
    isMajor: true,
    category: 'foco',
    estimatedMinutes: 30,
    createdAt: Date.now() - 7200000,
  },
  {
    id: 't-3',
    title: 'Organizar mesa física e descartar papéis velhos',
    isSpecific: true,
    isMeasurable: true,
    isAttainable: true,
    isRelevant: true,
    deadlineTime: '17:00',
    completed: false,
    isMajor: true,
    category: 'rotina',
    estimatedMinutes: 20,
    createdAt: Date.now() - 10800000,
  },
];

class StorageService {
  private profile: UserProfile;
  private tasks: Task[];
  private diary: TimeDiaryEntry[];
  private routines: RoutineItem[];
  private thoughts: MentalThought[];
  private badges: Badge[];
  private listeners: (() => void)[] = [];

  constructor() {
    this.profile = this.loadLocal(STORAGE_KEY_PROFILE, DEFAULT_PROFILE);
    this.tasks = this.loadLocal(STORAGE_KEY_TASKS, DEFAULT_TASKS);
    this.diary = this.loadLocal(STORAGE_KEY_DIARY, []);
    this.routines = this.loadLocal(STORAGE_KEY_ROUTINES, INITIAL_ROUTINES);
    this.thoughts = this.loadLocal(STORAGE_KEY_THOUGHTS, []);
    this.badges = this.loadLocal(STORAGE_KEY_BADGES, INITIAL_BADGES);

    this.checkDailyStreak();
    this.trySyncBackend();
  }

  private loadLocal<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch {}
    return fallback;
  }

  private saveLocal() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(this.profile));
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(this.tasks));
      localStorage.setItem(STORAGE_KEY_DIARY, JSON.stringify(this.diary));
      localStorage.setItem(STORAGE_KEY_ROUTINES, JSON.stringify(this.routines));
      localStorage.setItem(STORAGE_KEY_THOUGHTS, JSON.stringify(this.thoughts));
      localStorage.setItem(STORAGE_KEY_BADGES, JSON.stringify(this.badges));
    } catch {}
    this.notify();
    this.trySyncBackend();
  }

  public subscribe(cb: () => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  // Attempt sync with backend
  public async trySyncBackend() {
    if (typeof window === 'undefined' || !navigator.onLine) return;
    try {
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: this.profile,
          tasks: this.tasks,
          diary: this.diary,
          routines: this.routines,
          thoughts: this.thoughts,
          badges: this.badges,
        }),
      });
    } catch {
      // Backend may be momentarily unreachable or offline, safe local fallback
    }
  }

  private checkDailyStreak() {
    const today = new Date().toISOString().split('T')[0];
    if (this.profile.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (this.profile.lastActiveDate === yesterday) {
        this.profile.streakDays += 1;
      } else {
        this.profile.streakDays = 1;
      }
      this.profile.lastActiveDate = today;
      // Reset daily routines checklist and water for the new day
      this.routines = this.routines.map((r) => ({ ...r, completed: false }));
      this.profile.waterGlasses = 0;
      this.saveLocal();
    }
  }

  // XP & Gamification
  public addXp(amount: number, reason?: string): { leveledUp: boolean; newLevel: number } {
    const oldLevel = this.profile.level;
    this.profile.xp += amount;
    const lvlInfo = getLevelInfo(this.profile.xp);
    this.profile.level = lvlInfo.level;
    this.profile.title = lvlInfo.title;
    this.profile.currentLevelXp = lvlInfo.currentLevelXp;
    this.profile.nextLevelXp = lvlInfo.nextLevelXp;

    const leveledUp = this.profile.level > oldLevel;
    if (leveledUp) {
      soundManager.playChime();
      soundManager.triggerHaptic([100, 50, 150]);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#ec4899', '#6366f1', '#10b981'],
        });
      } catch {}
    }

    this.checkBadgeProgress();
    this.saveLocal();
    return { leveledUp, newLevel: this.profile.level };
  }

  private checkBadgeProgress() {
    let unlockedAny = false;
    this.badges = this.badges.map((b) => {
      let progress = b.progress;
      let shouldUnlock = false;

      if (b.id === 'first_blastoff') {
        progress = this.profile.fiveSecLaunches;
        shouldUnlock = progress >= b.maxProgress;
      } else if (b.id === 'marathon_runner') {
        progress = this.profile.pomodorosCompleted;
        shouldUnlock = progress >= b.maxProgress;
      } else if (b.id === 'smart_architect') {
        const completedMajors = this.tasks.filter((t) => t.isMajor && t.completed).length;
        progress = completedMajors;
        shouldUnlock = progress >= b.maxProgress;
      } else if (b.id === 'mind_declutter') {
        progress = this.thoughts.length;
        shouldUnlock = progress >= b.maxProgress;
      } else if (b.id === 'time_auditor') {
        progress = this.diary.length;
        shouldUnlock = progress >= b.maxProgress;
      } else if (b.id === 'zen_master') {
        progress = Math.min(b.maxProgress, Math.floor(this.profile.waterGlasses / 2) + Math.floor(this.profile.meditationMinutes / 2));
        shouldUnlock = progress >= b.maxProgress;
      }

      if (shouldUnlock && !b.unlockedAt) {
        unlockedAny = true;
        return {
          ...b,
          progress: b.maxProgress,
          unlockedAt: Date.now(),
        };
      }
      return { ...b, progress };
    });

    this.profile.unlockedBadgeCount = this.badges.filter((b) => b.unlockedAt !== null).length;

    if (unlockedAny) {
      soundManager.playSuccess();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {}
    }
  }

  // Getters
  public getProfile(): UserProfile {
    return { ...this.profile };
  }

  public getTasks(): Task[] {
    return [...this.tasks];
  }

  public getDiary(): TimeDiaryEntry[] {
    return [...this.diary];
  }

  public getRoutines(): RoutineItem[] {
    return [...this.routines];
  }

  public getThoughts(): MentalThought[] {
    return [...this.thoughts];
  }

  public getBadges(): Badge[] {
    return [...this.badges];
  }

  // Actions
  public triggerFiveSecondLaunch(taskTitle?: string) {
    this.profile.fiveSecLaunches += 1;
    this.addXp(30, 'Ignição 5 Segundos');
    soundManager.triggerHaptic(60);
    this.saveLocal();
  }

  public completePomodoro(minutes: number = 25) {
    this.profile.pomodorosCompleted += 1;
    this.profile.minutesFocused += minutes;
    this.addXp(60, 'Pomodoro Concluído');
    soundManager.playChime();
    soundManager.triggerHaptic([80, 50, 100]);
    this.saveLocal();
  }

  public addTask(task: Omit<Task, 'id' | 'createdAt' | 'completed'>): { success: boolean; message?: string } {
    // Check Max 3 Major Tasks rule from Chapter 3
    if (task.isMajor) {
      const currentMajors = this.tasks.filter((t) => t.isMajor && !t.completed).length;
      if (currentMajors >= 3) {
        return {
          success: false,
          message: 'Regra do Ebook: Limite máximo de 3 grandes tarefas ativas para não sobrecarregar o cérebro! Conclua uma antes de adicionar outra ou marque como secundária.',
        };
      }
    }

    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: Date.now(),
      completed: false,
    };

    this.tasks.unshift(newTask);
    this.addXp(15, 'Planejamento S.M.A.R.T.');
    soundManager.triggerHaptic(40);
    this.saveLocal();
    return { success: true };
  }

  public toggleTask(id: string) {
    this.tasks = this.tasks.map((t) => {
      if (t.id === id) {
        const nextCompleted = !t.completed;
        if (nextCompleted) {
          soundManager.playSuccess();
          soundManager.triggerHaptic(50);
          this.profile.tasksCompleted += 1;
          this.addXp(t.isMajor ? 80 : 40, 'Tarefa Concluída');
        }
        return { ...t, completed: nextCompleted };
      }
      return t;
    });
    this.saveLocal();
  }

  public deleteTask(id: string) {
    this.tasks = this.tasks.filter((t) => t.id !== id);
    this.saveLocal();
  }

  public toggleRoutine(id: string) {
    this.routines = this.routines.map((r) => {
      if (r.id === id) {
        const nextState = !r.completed;
        if (nextState) {
          soundManager.playSuccess();
          this.addXp(25, 'Hábito Diário');
        }
        return { ...r, completed: nextState };
      }
      return r;
    });
    this.saveLocal();
  }

  public addWaterGlass() {
    if (this.profile.waterGlasses < 15) {
      this.profile.waterGlasses += 1;
      soundManager.playBeep(600, 0.08);
      soundManager.triggerHaptic(30);
      if (this.profile.waterGlasses === this.profile.waterGoal) {
        this.addXp(50, 'Meta de Hidratação');
      } else {
        this.addXp(10, 'Copo de Água');
      }
      this.saveLocal();
    }
  }

  public removeWaterGlass() {
    if (this.profile.waterGlasses > 0) {
      this.profile.waterGlasses -= 1;
      this.saveLocal();
    }
  }

  public addMeditationMinutes(minutes: number) {
    this.profile.meditationMinutes += minutes;
    this.addXp(minutes * 10, 'Respiração Consciente');
    soundManager.triggerHaptic(40);
    this.saveLocal();
  }

  public addDiaryEntry(entry: Omit<TimeDiaryEntry, 'id' | 'timestamp'>) {
    const newEntry: TimeDiaryEntry = {
      ...entry,
      id: `diary-${Date.now()}`,
      timestamp: Date.now(),
    };
    this.diary.unshift(newEntry);
    this.addXp(35, 'Auditoria de Tempo');
    soundManager.triggerHaptic(40);
    this.saveLocal();
  }

  public deleteDiaryEntry(id: string) {
    this.diary = this.diary.filter((d) => d.id !== id);
    this.saveLocal();
  }

  public addThought(text: string, type: 'preocupacao' | 'tarefa' | 'ideia') {
    const newThought: MentalThought = {
      id: `thought-${Date.now()}`,
      text,
      type,
      createdAt: Date.now(),
    };
    this.thoughts.unshift(newThought);
    this.addXp(15, 'Despejo Mental');
    soundManager.triggerHaptic(30);
    this.saveLocal();
  }

  public clearThought(id: string) {
    this.thoughts = this.thoughts.filter((t) => t.id !== id);
    this.saveLocal();
  }

  public clearAllThoughts() {
    this.thoughts = [];
    soundManager.playSuccess();
    this.saveLocal();
  }

  public unlockBadgeDirectly(badgeId: string) {
    this.badges = this.badges.map((b) => {
      if (b.id === badgeId && !b.unlockedAt) {
        this.addXp(b.xpReward, b.title);
        return { ...b, unlockedAt: Date.now(), progress: b.maxProgress };
      }
      return b;
    });
    this.saveLocal();
  }
}

export const storage = new StorageService();
