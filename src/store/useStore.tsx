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
  ViewMode
} from '../types';
import { INITIAL_TASKS, INITIAL_HABITS, INITIAL_REMINDERS, INITIAL_GOALS, INITIAL_ROUTINES, INITIAL_GYM_SPLITS } from '../data/initialData';
import { INITIAL_QUOTES } from '../data/quotes';

interface StoreState {
  userName: string;
  setUserName: (name: string) => void;
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

const STORAGE_PREFIX = 'aura_dashboard_v1_';

function getInitialStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userName, setUserNameState] = useState<string>(() => getInitialStorage('userName', 'Eve'));
  const [theme, setThemeState] = useState<AppTheme>(() => getInitialStorage('theme', 'light'));
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [viewMode, setViewModeState] = useState<ViewMode>(() => getInitialStorage('viewMode', 'phone'));
  const [isDeviceFrame, setIsDeviceFrame] = useState<boolean>(() => getInitialStorage('deviceFrame', true));

  const [goals, setGoals] = useState<GoalItem[]>(() => getInitialStorage('goals', INITIAL_GOALS));
  const [todaysMainGoalId, setTodaysMainGoalId] = useState<string>(() => getInitialStorage('todaysGoal', INITIAL_GOALS[0]?.id || 'g1'));
  
  const [tasks, setTasks] = useState<TaskItem[]>(() => getInitialStorage('tasks', INITIAL_TASKS));
  const [habits, setHabits] = useState<HabitItem[]>(() => getInitialStorage('habits', INITIAL_HABITS));
  const [routines, setRoutines] = useState<RoutineTask[]>(() => getInitialStorage('routines', INITIAL_ROUTINES));
  const [reminders, setReminders] = useState<ReminderItem[]>(() => getInitialStorage('reminders', INITIAL_REMINDERS));
  const [gymSplits, setGymSplits] = useState<GymSplitDay[]>(() => getInitialStorage('gymSplits', INITIAL_GYM_SPLITS));
  
  const [waterGlassesToday, setWaterGlassesToday] = useState<number>(() => getInitialStorage('waterGlasses', 5));
  const [todayMood, setTodayMoodState] = useState<MoodType | null>(() => getInitialStorage('todayMood', 'Energized ⚡'));
  
  const [selectedQuoteCategory, setSelectedQuoteCategory] = useState<QuoteCategory>(() => 
    getInitialStorage('quoteCategory', 'Stoicism')
  );

  const [notifications, setNotifications] = useState<UserNotification[]>([
    {
      id: 'n1',
      title: 'Good Morning!',
      body: 'Ready to start your day with calm focus?',
      date: 'Today, 8:00 AM',
      read: false,
      type: 'assistant'
    },
    {
      id: 'n2',
      title: 'Weekend Reset Reminder',
      body: 'Saturday routines are active for your apartment reset.',
      date: 'Today, 9:30 AM',
      read: false,
      type: 'reminder'
    }
  ]);

  // Sync to local storage
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'userName', JSON.stringify(userName)); }, [userName]);
  useEffect(() => { 
    localStorage.setItem(STORAGE_PREFIX + 'theme', JSON.stringify(theme)); 
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'deviceFrame', JSON.stringify(isDeviceFrame)); }, [isDeviceFrame]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'viewMode', JSON.stringify(viewMode)); }, [viewMode]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'goals', JSON.stringify(goals)); }, [goals]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'todaysGoal', JSON.stringify(todaysMainGoalId)); }, [todaysMainGoalId]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'habits', JSON.stringify(habits)); }, [habits]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'routines', JSON.stringify(routines)); }, [routines]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'reminders', JSON.stringify(reminders)); }, [reminders]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'gymSplits', JSON.stringify(gymSplits)); }, [gymSplits]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'waterGlasses', JSON.stringify(waterGlassesToday)); }, [waterGlassesToday]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'todayMood', JSON.stringify(todayMood)); }, [todayMood]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'quoteCategory', JSON.stringify(selectedQuoteCategory)); }, [selectedQuoteCategory]);

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
