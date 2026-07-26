import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  TaskItem, 
  HabitItem, 
  ReminderItem, 
  GoalItem, 
  RoutineTask, 
  QuoteCategory, 
  QuoteItem, 
  AppTheme, 
  ActiveTab,
  DayOfWeek,
  UserNotification,
  GymSplitDay,
  ExerciseItem,
  MoodType,
  ViewMode,
  UserProfile
} from '../types';
import { INITIAL_TASKS, INITIAL_HABITS, INITIAL_REMINDERS, INITIAL_GOALS, INITIAL_ROUTINES, INITIAL_GYM_SPLITS } from '../data/initialData';
import { INITIAL_QUOTES } from '../data/quotes';

interface StoreState {
  userName: string;
  setUserName: (name: string) => void;
  profiles: UserProfile[];
  currentProfile: UserProfile;
  switchProfile: (profileId: string) => void;
  createProfile: (name: string, avatarEmoji: string, color: string) => void;
  theme: AppTheme;
  toggleTheme: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
  isDeviceFrame: boolean;
  toggleDeviceFrame: () => void;

  // Goals
  goals: GoalItem[];
  todaysMainGoalId: string;
  setTodaysMainGoalId: (id: string) => void;
  updateGoalProgress: (id: string, delta: number) => void;
  addGoal: (goal: Omit<GoalItem, 'id'>) => void;

  // Tasks
  tasks: TaskItem[];
  toggleTask: (id: string) => void;
  addTask: (task: Omit<TaskItem, 'id' | 'createdAt' | 'completed'>) => void;
  deleteTask: (id: string) => void;

  // Habits
  habits: HabitItem[];
  toggleHabitToday: (id: string) => void;
  addHabit: (habit: Omit<HabitItem, 'id' | 'streak' | 'bestStreak' | 'completedToday'>) => void;

  // Routines
  routines: RoutineTask[];
  toggleRoutineItemToday: (id: string) => void;
  addRoutineItem: (item: Omit<RoutineTask, 'id' | 'completedDates'>) => void;
  deleteRoutineItem: (id: string) => void;

  // Reminders
  reminders: ReminderItem[];
  dismissReminder: (id: string) => void;
  addReminder: (reminder: Omit<ReminderItem, 'id' | 'dismissed'>) => void;

  // Gym Workout Splits
  gymSplits: GymSplitDay[];
  toggleExerciseToday: (exerciseId: string) => void;
  addExerciseToDay: (day: DayOfWeek, name: string, setsReps: string) => void;
  updateGymSplitFocusTitle: (day: DayOfWeek, title: string) => void;

  // Hydration & Mood
  waterGlassesToday: number;
  incrementWater: () => void;
  decrementWater: () => void;
  todayMood: MoodType | null;
  setTodayMood: (mood: MoodType) => void;

  // Quotes
  selectedQuoteCategory: QuoteCategory;
  setSelectedQuoteCategory: (category: QuoteCategory) => void;
  activeQuote: QuoteItem;

  // Assistant & Notifications
  notifications: UserNotification[];
  dismissNotification: (id: string) => void;
  triggerConfetti: () => void;
  resetAllData: () => void;
}

const StoreContext = createContext<StoreState | undefined>(undefined);

const STORAGE_PREFIX = 'aura_dashboard_v3_';

const DEFAULT_PROFILES: UserProfile[] = [
  { id: 'p_eve', name: 'Eve', avatarEmoji: '✨', color: '#007AFF', createdAt: '2026-07-26' },
  { id: 'p_alex', name: 'Alex', avatarEmoji: '🌿', color: '#34C759', createdAt: '2026-07-26' }
];

function getInitialProfiles(): UserProfile[] {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + 'profiles_list');
    return item ? JSON.parse(item) : DEFAULT_PROFILES;
  } catch {
    return DEFAULT_PROFILES;
  }
}

function getInitialActiveProfileId(): string {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + 'active_profile_id');
    return item ? JSON.parse(item) : 'p_eve';
  } catch {
    return 'p_eve';
  }
}

function getProfileStorage<T>(profileId: string, key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(`${STORAGE_PREFIX}${profileId}_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>(getInitialProfiles);
  const [activeProfileId, setActiveProfileId] = useState<string>(getInitialActiveProfileId);

  const currentProfile = profiles.find(p => p.id === activeProfileId) || profiles[0] || DEFAULT_PROFILES[0];
  const [userName, setUserNameState] = useState<string>(currentProfile.name);

  const [theme, setThemeState] = useState<AppTheme>(() => getProfileStorage(activeProfileId, 'theme', 'light'));
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [viewMode, setViewModeState] = useState<ViewMode>(() => getProfileStorage(activeProfileId, 'viewMode', 'phone'));
  const [isDeviceFrame, setIsDeviceFrame] = useState<boolean>(() => getProfileStorage(activeProfileId, 'deviceFrame', true));

  const [goals, setGoals] = useState<GoalItem[]>(() => getProfileStorage(activeProfileId, 'goals', INITIAL_GOALS));
  const [todaysMainGoalId, setTodaysMainGoalId] = useState<string>(() => getProfileStorage(activeProfileId, 'todaysGoal', INITIAL_GOALS[0]?.id || 'g1'));
  
  const [tasks, setTasks] = useState<TaskItem[]>(() => getProfileStorage(activeProfileId, 'tasks', INITIAL_TASKS));
  const [habits, setHabits] = useState<HabitItem[]>(() => getProfileStorage(activeProfileId, 'habits', INITIAL_HABITS));
  const [routines, setRoutines] = useState<RoutineTask[]>(() => getProfileStorage(activeProfileId, 'routines', INITIAL_ROUTINES));
  const [reminders, setReminders] = useState<ReminderItem[]>(() => getProfileStorage(activeProfileId, 'reminders', INITIAL_REMINDERS));
  const [gymSplits, setGymSplits] = useState<GymSplitDay[]>(() => getProfileStorage(activeProfileId, 'gymSplits', INITIAL_GYM_SPLITS));
  
  const [waterGlassesToday, setWaterGlassesToday] = useState<number>(() => getProfileStorage(activeProfileId, 'waterGlasses', 5));
  const [todayMood, setTodayMoodState] = useState<MoodType | null>(() => getProfileStorage(activeProfileId, 'todayMood', 'Energized ⚡'));
  
  const [selectedQuoteCategory, setSelectedQuoteCategory] = useState<QuoteCategory>(() => 
    getProfileStorage(activeProfileId, 'quoteCategory', 'Stoicism')
  );

  const [notifications, setNotifications] = useState<UserNotification[]>([
    {
      id: 'n1',
      title: `Welcome ${currentProfile.name}!`,
      body: 'Your personal routines and fitness splits are loaded.',
      date: 'Just Now',
      read: false,
      type: 'assistant'
    }
  ]);

  // Sync state to local storage for current profile
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'profiles_list', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'active_profile_id', JSON.stringify(activeProfileId));
  }, [activeProfileId]);

  useEffect(() => { 
    localStorage.setItem(`${STORAGE_PREFIX}${activeProfileId}_theme`, JSON.stringify(theme)); 
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme, activeProfileId]);

  useEffect(() => { localStorage.setItem(`${STORAGE_PREFIX}${activeProfileId}_tasks`, JSON.stringify(tasks)); }, [tasks, activeProfileId]);
  useEffect(() => { localStorage.setItem(`${STORAGE_PREFIX}${activeProfileId}_habits`, JSON.stringify(habits)); }, [habits, activeProfileId]);
  useEffect(() => { localStorage.setItem(`${STORAGE_PREFIX}${activeProfileId}_routines`, JSON.stringify(routines)); }, [routines, activeProfileId]);
  useEffect(() => { localStorage.setItem(`${STORAGE_PREFIX}${activeProfileId}_reminders`, JSON.stringify(reminders)); }, [reminders, activeProfileId]);
  useEffect(() => { localStorage.setItem(`${STORAGE_PREFIX}${activeProfileId}_gymSplits`, JSON.stringify(gymSplits)); }, [gymSplits, activeProfileId]);

  const switchProfile = (profileId: string) => {
    const target = profiles.find(p => p.id === profileId);
    if (!target) return;

    setActiveProfileId(profileId);
    setUserNameState(target.name);

    // Load data for switched profile
    setTasks(getProfileStorage(profileId, 'tasks', INITIAL_TASKS));
    setHabits(getProfileStorage(profileId, 'habits', INITIAL_HABITS));
    setRoutines(getProfileStorage(profileId, 'routines', INITIAL_ROUTINES));
    setReminders(getProfileStorage(profileId, 'reminders', INITIAL_REMINDERS));
    setGymSplits(getProfileStorage(profileId, 'gymSplits', INITIAL_GYM_SPLITS));
    setThemeState(getProfileStorage(profileId, 'theme', 'light'));
  };

  const createProfile = (name: string, avatarEmoji: string, color: string) => {
    const newProfile: UserProfile = {
      id: `p_${Date.now()}`,
      name,
      avatarEmoji,
      color,
      createdAt: new Date().toISOString()
    };

    setProfiles(prev => [...prev, newProfile]);
    switchProfile(newProfile.id);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // fallback
    }
  };

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    setIsDeviceFrame(mode === 'phone');
  };

  const toggleViewMode = () => {
    setViewModeState(prev => {
      const next = prev === 'phone' ? 'computer' : 'phone';
      setIsDeviceFrame(next === 'phone');
      return next;
    });
  };

  const incrementWater = () => {
    setWaterGlassesToday(prev => {
      const next = Math.min(12, prev + 1);
      if (next === 8) triggerConfetti();
      return next;
    });
  };

  const decrementWater = () => {
    setWaterGlassesToday(prev => Math.max(0, prev - 1));
  };

  const setTodayMood = (mood: MoodType) => {
    setTodayMoodState(mood);
    triggerConfetti();
  };

  const setUserName = (name: string) => setUserNameState(name);
  const toggleTheme = () => setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  const toggleDeviceFrame = () => {
    setIsDeviceFrame(prev => {
      const next = !prev;
      setViewModeState(next ? 'phone' : 'computer');
      return next;
    });
  };

  // Goal functions
  const updateGoalProgress = (id: string, delta: number) => {
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        const nextVal = Math.max(0, Math.min(g.target, parseFloat((g.current + delta).toFixed(1))));
        if (nextVal === g.target && g.current < g.target) {
          triggerConfetti();
        }
        return { ...g, current: nextVal };
      }
      return g;
    }));
  };

  const addGoal = (newGoal: Omit<GoalItem, 'id'>) => {
    if (goals.length >= 3) return; // Keep max 3 main goals
    const goal: GoalItem = { ...newGoal, id: 'g_' + Date.now() };
    setGoals(prev => [...prev, goal]);
  };

  // Task functions
  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const completed = !t.completed;
        if (completed) triggerConfetti();
        return { 
          ...t, 
          completed, 
          completedAt: completed ? new Date().toISOString().split('T')[0] : undefined 
        };
      }
      return t;
    }));
  };

  const addTask = (taskData: Omit<TaskItem, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: TaskItem = {
      ...taskData,
      id: 't_' + Date.now(),
      completed: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Habit functions
  const getTodayString = () => new Date().toISOString().split('T')[0];

  const toggleHabitToday = (id: string) => {
    const todayStr = getTodayString();
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const isDone = !h.completedToday;
        let streak = h.streak;
        if (isDone) {
          streak += 1;
          triggerConfetti();
        } else {
          streak = Math.max(0, streak - 1);
        }
        return {
          ...h,
          completedToday: isDone,
          streak,
          bestStreak: Math.max(h.bestStreak, streak),
          lastCompletedDate: isDone ? todayStr : h.lastCompletedDate
        };
      }
      return h;
    }));
  };

  const addHabit = (habitData: Omit<HabitItem, 'id' | 'streak' | 'bestStreak' | 'completedToday'>) => {
    const newHabit: HabitItem = {
      ...habitData,
      id: 'h_' + Date.now(),
      streak: 0,
      bestStreak: 0,
      completedToday: false
    };
    setHabits(prev => [...prev, newHabit]);
  };

  // Routine functions
  const toggleRoutineItemToday = (id: string) => {
    const todayStr = getTodayString();
    setRoutines(prev => prev.map(r => {
      if (r.id === id) {
        const isCompleted = r.completedDates.includes(todayStr);
        let updatedDates: string[];
        if (isCompleted) {
          updatedDates = r.completedDates.filter(d => d !== todayStr);
        } else {
          updatedDates = [...r.completedDates, todayStr];
          triggerConfetti();
        }
        return { ...r, completedDates: updatedDates };
      }
      return r;
    }));
  };

  const addRoutineItem = (item: Omit<RoutineTask, 'id' | 'completedDates'>) => {
    const newRoutine: RoutineTask = {
      ...item,
      id: 'r_' + Date.now(),
      completedDates: []
    };
    setRoutines(prev => [...prev, newRoutine]);
  };

  const deleteRoutineItem = (id: string) => {
    setRoutines(prev => prev.filter(r => r.id !== id));
  };

  // Reminder functions
  const dismissReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const addReminder = (reminderData: Omit<ReminderItem, 'id' | 'dismissed'>) => {
    const newRem: ReminderItem = {
      ...reminderData,
      id: 'rem_' + Date.now()
    };
    setReminders(prev => [...prev, newRem]);
  };

  // Gym functions
  const toggleExerciseToday = (exerciseId: string) => {
    const todayStr = getTodayString();
    setGymSplits(prev => prev.map(split => ({
      ...split,
      exercises: split.exercises.map((ex: ExerciseItem) => {
        if (ex.id === exerciseId) {
          const isDone = ex.completedDates.includes(todayStr);
          let newDates: string[];
          if (isDone) {
            newDates = ex.completedDates.filter((d: string) => d !== todayStr);
          } else {
            newDates = [...ex.completedDates, todayStr];
            triggerConfetti();
          }
          return { ...ex, completedDates: newDates };
        }
        return ex;
      })
    })));
  };

  const addExerciseToDay = (day: DayOfWeek, name: string, setsReps: string) => {
    const newEx = {
      id: 'ex_' + Date.now(),
      name,
      setsReps,
      completedDates: []
    };
    setGymSplits(prev => prev.map(split => {
      if (split.day === day) {
        return { ...split, exercises: [...split.exercises, newEx] };
      }
      return split;
    }));
  };

  const updateGymSplitFocusTitle = (day: DayOfWeek, title: string) => {
    setGymSplits(prev => prev.map(split => {
      if (split.day === day) {
        return { ...split, focusTitle: title };
      }
      return split;
    }));
  };

  // Active Quote filtering
  const quotesForCategory = INITIAL_QUOTES.filter(q => q.category === selectedQuoteCategory);
  const activeQuote = quotesForCategory[0] || INITIAL_QUOTES[0];

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const resetAllData = () => {
    localStorage.clear();
    setGoals(INITIAL_GOALS);
    setTasks(INITIAL_TASKS);
    setHabits(INITIAL_HABITS);
    setRoutines(INITIAL_ROUTINES);
    setReminders(INITIAL_REMINDERS);
    setGymSplits(INITIAL_GYM_SPLITS);
    setUserNameState('Eve');
  };

  return (
    <StoreContext.Provider value={{
      userName,
      setUserName,
      profiles,
      currentProfile,
      switchProfile,
      createProfile,
      theme,
      toggleTheme,
      activeTab,
      setActiveTab,
      viewMode,
      setViewMode,
      toggleViewMode,
      isDeviceFrame,
      toggleDeviceFrame,
      goals,
      todaysMainGoalId,
      setTodaysMainGoalId,
      updateGoalProgress,
      addGoal,
      tasks,
      toggleTask,
      addTask,
      deleteTask,
      habits,
      toggleHabitToday,
      addHabit,
      routines,
      toggleRoutineItemToday,
      addRoutineItem,
      deleteRoutineItem,
      reminders,
      dismissReminder,
      addReminder,
      gymSplits,
      toggleExerciseToday,
      addExerciseToDay,
      updateGymSplitFocusTitle,
      waterGlassesToday,
      incrementWater,
      decrementWater,
      todayMood,
      setTodayMood,
      selectedQuoteCategory,
      setSelectedQuoteCategory,
      activeQuote,
      notifications,
      dismissNotification,
      triggerConfetti,
      resetAllData
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
