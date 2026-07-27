import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { cloudSyncService, GlobalDataSchema } from '../services/cloudService';
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
  UserProfile,
  ClassItem,
  GroceryItem
} from '../types';
import { INITIAL_TASKS, INITIAL_HABITS, INITIAL_REMINDERS, INITIAL_GOALS, INITIAL_ROUTINES, INITIAL_GYM_SPLITS, INITIAL_CLASSES, INITIAL_GROCERIES } from '../data/initialData';
import { INITIAL_QUOTES } from '../data/quotes';

interface StoreState {
  userName: string;
  setUserName: (name: string) => void;
  profiles: UserProfile[];
  currentProfile: UserProfile;
  switchProfile: (profileId: string) => void;
  createProfile: (name: string, avatarEmoji: string, color: string) => void;
  updateProfile: (profileId: string, name: string, avatarEmoji: string, color: string) => void;
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
  deleteHabit: (id: string) => void;

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
  gymCompletedDays: Record<string, boolean>;
  toggleGymWorkoutCompleted: (day: DayOfWeek) => void;
  toggleExerciseToday: (exerciseId: string) => void;
  addExerciseToDay: (day: DayOfWeek, name: string, setsReps: string) => void;
  updateGymSplitFocusTitle: (day: DayOfWeek, title: string) => void;

  // Classes Schedule
  classes: ClassItem[];
  addClass: (item: Omit<ClassItem, 'id'>) => void;
  deleteClass: (id: string) => void;
  toggleClassCompleted: (id: string) => void;

  // Grocery List
  groceries: GroceryItem[];
  addGroceryItem: (item: Omit<GroceryItem, 'id' | 'completed'>) => void;
  deleteGroceryItem: (id: string) => void;
  toggleGroceryItem: (id: string) => void;
  clearCompletedGroceries: () => void;

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

  // Admin & Real-Time Cloud Data Sync
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  toggleAdminMode: () => void;
  globalData: GlobalDataSchema;
  updateGlobalWorkoutSplits: (splits: GymSplitDay[]) => void;
  updateGlobalRoutines: (routines: RoutineTask[]) => void;
  updateGlobalQuotes: (quotes: { id: string; quote: string; author: string; category: string }[]) => void;
  updateGlobalAnnouncements: (announcements: { id: string; title: string; message: string; date: string; priority: 'low' | 'medium' | 'high' }[]) => void;
  updateGlobalSettings: (settings: { globalNotice: string; themeAccent: string; version: string }) => void;
}

const StoreContext = createContext<StoreState | undefined>(undefined);

const STORAGE_PREFIX = 'aura_dashboard_v6_';

const DEFAULT_PROFILES: UserProfile[] = [
  { id: 'p_eve', name: 'Eve', avatarEmoji: '✨', color: '#007AFF', createdAt: '2026-07-26' },
  { id: 'p_alex', name: 'Alex', avatarEmoji: '🌿', color: '#34C759', createdAt: '2026-07-26' }
];

function sanitizeGymSplits(splits: GymSplitDay[]): GymSplitDay[] {
  if (!splits || !Array.isArray(splits)) return INITIAL_GYM_SPLITS;
  return splits.map(s => ({
    ...s,
    exercises: []
  }));
}

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
    const cloudBundle = cloudSyncService.loadProfileFromCloud(profileId);
    if (cloudBundle && cloudBundle[key] !== undefined) {
      return cloudBundle[key];
    }
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
  const [gymSplits, setGymSplits] = useState<GymSplitDay[]>(() => sanitizeGymSplits(getProfileStorage(activeProfileId, 'gymSplits', INITIAL_GYM_SPLITS)));
  const [gymCompletedDays, setGymCompletedDays] = useState<Record<string, boolean>>(() => getProfileStorage(activeProfileId, 'gymCompletedDays', {}));
  const [classes, setClasses] = useState<ClassItem[]>(() => getProfileStorage(activeProfileId, 'classes', INITIAL_CLASSES));
  const [groceries, setGroceries] = useState<GroceryItem[]>(() => getProfileStorage(activeProfileId, 'groceries', INITIAL_GROCERIES));
  
  const [waterGlassesToday, setWaterGlassesToday] = useState<number>(() => getProfileStorage(activeProfileId, 'waterGlasses', 5));
  const [todayMood, setTodayMoodState] = useState<MoodType | null>(() => getProfileStorage(activeProfileId, 'todayMood', 'Energized ⚡'));
  
  const [selectedQuoteCategory, setSelectedQuoteCategory] = useState<QuoteCategory>(() => 
    getProfileStorage(activeProfileId, 'quoteCategory', 'Stoicism')
  );

  // Cloud Sync & Admin Mode State
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [globalData, setGlobalData] = useState<GlobalDataSchema>(cloudSyncService.getGlobalData());

  useEffect(() => {
    const unsubscribe = cloudSyncService.subscribeToGlobalData((latest) => {
      setGlobalData(latest);
    });
    return () => unsubscribe();
  }, []);

  const toggleAdminMode = () => setIsAdmin(prev => !prev);

  const updateGlobalWorkoutSplits = (splits: GymSplitDay[]) => {
    cloudSyncService.updateGlobalData(prev => ({ ...prev, workoutSplits: splits }));
  };

  const updateGlobalRoutines = (routines: RoutineTask[]) => {
    cloudSyncService.updateGlobalData(prev => ({ ...prev, routineTemplates: routines }));
  };

  const updateGlobalQuotes = (quotes: { id: string; quote: string; author: string; category: string }[]) => {
    cloudSyncService.updateGlobalData(prev => ({ ...prev, quotes: quotes as any }));
  };

  const updateGlobalAnnouncements = (announcements: { id: string; title: string; message: string; date: string; priority: 'low' | 'medium' | 'high' }[]) => {
    cloudSyncService.updateGlobalData(prev => ({ ...prev, announcements }));
  };

  const updateGlobalSettings = (settings: { globalNotice: string; themeAccent: string; version: string }) => {
    cloudSyncService.updateGlobalData(prev => ({ ...prev, appSettings: settings }));
  };

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

  // Sync shared profile state to cloud store & broadcast updates
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

  // Save composite profile data bundle to shared cloud & local storage
  useEffect(() => { 
    const profileBundle = {
      tasks,
      habits,
      routines,
      reminders,
      gymSplits,
      gymCompletedDays,
      classes,
      groceries,
      goals,
      updatedAt: new Date().toISOString()
    };
    
    // Save to cloud & local storage fallback
    cloudSyncService.saveProfileToCloud(activeProfileId, profileBundle);
    localStorage.setItem(`${STORAGE_PREFIX}${activeProfileId}_tasks`, JSON.stringify(tasks));
    localStorage.setItem(`${STORAGE_PREFIX}${activeProfileId}_habits`, JSON.stringify(habits));
    localStorage.setItem(`${STORAGE_PREFIX}${activeProfileId}_routines`, JSON.stringify(routines));
    localStorage.setItem(`${STORAGE_PREFIX}${activeProfileId}_reminders`, JSON.stringify(reminders));
    localStorage.setItem(`${STORAGE_PREFIX}${activeProfileId}_gymSplits`, JSON.stringify(gymSplits));
    localStorage.setItem(`${STORAGE_PREFIX}${activeProfileId}_gymCompletedDays`, JSON.stringify(gymCompletedDays));
    localStorage.setItem(`${STORAGE_PREFIX}${activeProfileId}_classes`, JSON.stringify(classes));
    localStorage.setItem(`${STORAGE_PREFIX}${activeProfileId}_groceries`, JSON.stringify(groceries));
    localStorage.setItem(`${STORAGE_PREFIX}${activeProfileId}_goals`, JSON.stringify(goals));
  }, [tasks, habits, routines, reminders, gymSplits, gymCompletedDays, classes, groceries, goals, activeProfileId]);

  // Real-time synchronization across devices and instances for the active profile
  useEffect(() => {
    const unsubscribe = cloudSyncService.subscribeToProfileUpdates((profileId, incomingData) => {
      if (profileId === activeProfileId) {
        const cloudData = incomingData || cloudSyncService.loadProfileFromCloud(profileId);
        if (cloudData) {
          if (cloudData.tasks) setTasks(cloudData.tasks);
          if (cloudData.habits) setHabits(cloudData.habits);
          if (cloudData.routines) setRoutines(cloudData.routines);
          if (cloudData.reminders) setReminders(cloudData.reminders);
          if (cloudData.gymSplits) setGymSplits(cloudData.gymSplits);
          if (cloudData.gymCompletedDays) setGymCompletedDays(cloudData.gymCompletedDays);
          if (cloudData.classes) setClasses(cloudData.classes);
          if (cloudData.groceries) setGroceries(cloudData.groceries);
          if (cloudData.goals) setGoals(cloudData.goals);
        }
      }
    });
    return () => unsubscribe();
  }, [activeProfileId]);

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
    setGymCompletedDays(getProfileStorage(profileId, 'gymCompletedDays', {}));
    setClasses(getProfileStorage(profileId, 'classes', INITIAL_CLASSES));
    setGroceries(getProfileStorage(profileId, 'groceries', INITIAL_GROCERIES));
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

  const updateProfile = (profileId: string, name: string, avatarEmoji: string, color: string) => {
    setProfiles(prev => prev.map(p => {
      if (p.id === profileId) {
        return { ...p, name, avatarEmoji, color };
      }
      return p;
    }));
    if (activeProfileId === profileId) {
      setUserNameState(name);
    }
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

  const setUserName = (name: string) => {
    setUserNameState(name);
    setProfiles(prev => prev.map(p => p.id === activeProfileId ? { ...p, name } : p));
  };
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

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
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

  const toggleGymWorkoutCompleted = (day: DayOfWeek) => {
    setGymCompletedDays(prev => {
      const nextState = !prev[day];
      if (nextState) triggerConfetti();
      return { ...prev, [day]: nextState };
    });
  };

  // Class functions
  const addClass = (itemData: Omit<ClassItem, 'id'>) => {
    const newClass: ClassItem = {
      ...itemData,
      id: 'c_' + Date.now()
    };
    setClasses(prev => [...prev, newClass]);
  };

  const deleteClass = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  const toggleClassCompleted = (id: string) => {
    setClasses(prev => prev.map(c => {
      if (c.id === id) {
        const nextComp = !c.completed;
        if (nextComp) triggerConfetti();
        return { ...c, completed: nextComp };
      }
      return c;
    }));
  };

  // Grocery functions
  const addGroceryItem = (itemData: Omit<GroceryItem, 'id' | 'completed'>) => {
    const newItem: GroceryItem = {
      ...itemData,
      id: 'g_' + Date.now(),
      completed: false
    };
    setGroceries(prev => [...prev, newItem]);
  };

  const deleteGroceryItem = (id: string) => {
    setGroceries(prev => prev.filter(g => g.id !== id));
  };

  const toggleGroceryItem = (id: string) => {
    setGroceries(prev => prev.map(g => {
      if (g.id === id) {
        const nextComp = !g.completed;
        if (nextComp) triggerConfetti();
        return { ...g, completed: nextComp };
      }
      return g;
    }));
  };

  const clearCompletedGroceries = () => {
    setGroceries(prev => prev.filter(g => !g.completed));
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
    setGymCompletedDays({});
    setClasses(INITIAL_CLASSES);
    setGroceries(INITIAL_GROCERIES);
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
      updateProfile,
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
      deleteHabit,
      routines,
      toggleRoutineItemToday,
      addRoutineItem,
      deleteRoutineItem,
      reminders,
      dismissReminder,
      addReminder,
      gymSplits,
      gymCompletedDays,
      toggleGymWorkoutCompleted,
      toggleExerciseToday,
      addExerciseToDay,
      updateGymSplitFocusTitle,
      classes,
      addClass,
      deleteClass,
      toggleClassCompleted,
      groceries,
      addGroceryItem,
      deleteGroceryItem,
      toggleGroceryItem,
      clearCompletedGroceries,
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
      resetAllData,
      isAdmin,
      setIsAdmin,
      toggleAdminMode,
      globalData,
      updateGlobalWorkoutSplits,
      updateGlobalRoutines,
      updateGlobalQuotes,
      updateGlobalAnnouncements,
      updateGlobalSettings
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
