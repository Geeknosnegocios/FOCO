export interface Task {
  id: string;
  title: string;
  isSpecific: boolean;
  isMeasurable: boolean;
  isAttainable: boolean;
  isRelevant: boolean;
  deadlineTime: string; // e.g. "11:00"
  completed: boolean;
  isMajor: boolean; // True for the "Max 3 Major Tasks of the Day" rule
  category: 'foco' | 'delegar' | 'rotina' | 'urgente';
  estimatedMinutes: number;
  createdAt: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: number | null;
  progress: number;
  maxProgress: number;
  xpReward: number;
}

export interface UserProfile {
  name: string;
  title: string;
  level: number;
  xp: number;
  currentLevelXp: number;
  nextLevelXp: number;
  streakDays: number;
  lastActiveDate: string;
  pomodorosCompleted: number;
  fiveSecLaunches: number;
  tasksCompleted: number;
  minutesFocused: number;
  waterGlasses: number;
  waterGoal: number;
  meditationMinutes: number;
  unlockedBadgeCount: number;
}

export interface TimeDiaryEntry {
  id: string;
  activity: string;
  startTime: string;
  endTime: string;
  category: 'deep_work' | 'distraction' | 'admin' | 'social' | 'rest';
  isProductive: boolean;
  notes: string;
  timestamp: number;
}

export interface RoutineItem {
  id: string;
  period: 'morning' | 'evening';
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  targetTime?: string;
}

export interface EbookChapter {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  readingTime: string;
  summary: string;
  takeaways: string[];
  fullSummary: string;
  keyTactics: { title: string; desc: string }[];
  actionPrompt: string;
}

export interface SayNoScenario {
  id: string;
  title: string;
  target: 'chefe' | 'colega' | 'familiar' | 'manipulador';
  description: string;
  velvetScript: string;
  throwItBackScript?: string;
  psychologicalTactic: string;
}

export interface MentalThought {
  id: string;
  text: string;
  type: 'preocupacao' | 'tarefa' | 'ideia';
  createdAt: number;
}
