import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { cloudSyncService, GlobalDataSchema } from '../services/cloudService';
import { 
  supabase, 
  fetchProfileItemsFromSupabase, 
  insertProfileItemToSupabase, 
  updateProfileItemInSupabase, 
  deleteProfileItemFromSupabase
} from '../services/supabaseClient';
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
  activeProfileId: string;
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

  // Admin Mode & Real-Time Global Settings
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

const DEFAULT_PROFILES: UserProfile[] = [
  { id: 'eve', name: 'Eve', avatarEmoji: '✨', color: '#007AFF', createdAt: '2026-07-26' },
  { id: 'alex', name: 'Alex', avatarEmoji: '🌿', color: '#34C759', createdAt: '2026-07-26' }
];

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>(DEFAULT_PROFILES);
  const [activeProfileId, setActiveProfileId] = useState<string>('eve');

  const currentProfile = profiles.find(p => p.id === activeProfileId) || profiles[0] || DEFAULT_PROFILES[0];
  const [userName, setUserNameState] = useState<string>(currentProfile.name);

  // Client interface preferences (kept in localStorage)
  const [theme, setThemeState] = useState<AppTheme>(() => {
    try {
      return (localStorage.getItem('aura_pref_theme') as AppTheme) || 'light';
    } catch {
      return 'light';
    }
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [viewMode, setViewModeState] = useState<ViewMode>('phone');
  const [isDeviceFrame, setIsDeviceFrame] = useState<boolean>(true);

  // Shared Profile State Arrays (Single Source of Truth = Supabase public.profile_items)
  // CRITICAL: Initialized with EMPTY arrays [] so stale mock data is NEVER used or fallback-merged!
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [todaysMainGoalId, setTodaysMainGoalId] = useState<string>('g1');
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [routines, setRoutines] = useState<RoutineTask[]>([]);
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [gymSplits, setGymSplits] = useState<GymSplitDay[]>([]);
  const [gymCompletedDays, setGymCompletedDays] = useState<Record<string, boolean>>({});
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [groceries, setGroceries] = useState<GroceryItem[]>([]);
  
  const [waterGlassesToday, setWaterGlassesToday] = useState<number>(5);
  const [todayMood, setTodayMoodState] = useState<MoodType | null>('Energized ⚡');
  const [selectedQuoteCategory, setSelectedQuoteCategory] = useState<QuoteCategory>('Stoicism');

  const [notifications, setNotifications] = useState<UserNotification[]>([
    {
      id: 'n1',
      title: `Welcome ${currentProfile.name}!`,
      body: 'Supabase real-time shared database connected.',
      date: 'Just Now',
      read: false,
      type: 'assistant'
    }
  ]);

  // Cloud Sync & Admin Mode State
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [globalData, setGlobalData] = useState<GlobalDataSchema>(cloudSyncService.getGlobalData());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('aura_pref_theme', theme);
    } catch {}
  }, [theme]);

  // Main Supabase public.profile_items Initial Fetch & Realtime Channel Subscription
  useEffect(() => {
    let isMounted = true;
    console.log(`[Supabase Realtime Sync] Establishing connection for active profile: "${activeProfileId}"`);

    async function loadSupabaseItems() {
      console.log(`[Supabase Initial Load] Querying DB for profile_id = "${activeProfileId}"`);
      const rows = await fetchProfileItemsFromSupabase(activeProfileId);
      if (!isMounted) return;

      const loadedGroceries: GroceryItem[] = [];
      const loadedTasks: TaskItem[] = [];
      const loadedHabits: HabitItem[] = [];
      const loadedRoutines: RoutineTask[] = [];
      const loadedReminders: ReminderItem[] = [];
      const loadedClasses: ClassItem[] = [];
      const loadedGoals: GoalItem[] = [];

      if (rows && rows.length > 0) {
        rows.forEach(r => {
          if (r.item_type === 'grocery') {
            loadedGroceries.push({
              id: r.id,
              name: r.title,
              category: (r.category as any) || 'Other',
              iconName: r.metadata?.iconName || 'ShoppingBag',
              completed: r.completed,
              quantity: r.metadata?.quantity || '1'
            });
          } else if (r.item_type === 'task') {
            loadedTasks.push({
              id: r.id,
              title: r.title,
              category: (r.category as any) || 'Personal',
              completed: r.completed,
              priority: r.metadata?.priority || 'medium',
              createdAt: r.created_at || new Date().toISOString()
            });
          } else if (r.item_type === 'habit') {
            loadedHabits.push({
              id: r.id,
              title: r.title,
              category: (r.category as any) || 'Health',
              iconName: r.metadata?.iconName || 'Zap',
              streak: r.metadata?.streak || 0,
              bestStreak: r.metadata?.bestStreak || 0,
              targetDaysPerWeek: r.metadata?.targetDaysPerWeek || 7,
              completedToday: r.completed
            } as any);
          } else if (r.item_type === 'routine') {
            loadedRoutines.push({
              id: r.id,
              day: r.metadata?.day || 'Monday',
              title: r.title,
              iconName: r.metadata?.iconName || 'CheckCircle',
              completedDates: r.metadata?.completedDates || []
            });
          } else if (r.item_type === 'reminder') {
            loadedReminders.push({
              id: r.id,
              title: r.title,
              category: (r.category as any) || 'Personal',
              dueDate: r.metadata?.dueDate || new Date().toISOString().split('T')[0],
              iconName: r.metadata?.iconName || 'Bell',
              dismissed: r.completed
            });
          } else if (r.item_type === 'class') {
            loadedClasses.push({
              id: r.id,
              day: r.metadata?.day || 'Monday',
              name: r.title,
              time: r.metadata?.time || '09:00 AM',
              location: r.metadata?.location || 'Room 101',
              completed: r.completed
            });
          } else if (r.item_type === 'goal') {
            loadedGoals.push({
              id: r.id,
              title: r.title,
              target: r.metadata?.target || 10,
              current: r.metadata?.current || 0,
              unit: r.metadata?.unit || 'hrs',
              iconName: r.metadata?.iconName || 'Target',
              color: r.metadata?.color || '#007AFF'
            });
          }
        });
      }

      // CRITICAL RULE: Unconditional Replacement!
      // Database response is the authoritative source of truth.
      console.log(`[Supabase Initial Load Replacement] Profile "${activeProfileId}" loaded: ${loadedGroceries.length} groceries, ${loadedTasks.length} tasks, ${loadedHabits.length} habits, ${loadedRoutines.length} routines, ${loadedReminders.length} reminders, ${loadedClasses.length} classes, ${loadedGoals.length} goals.`);

      setGroceries(loadedGroceries);
      setTasks(loadedTasks);
      setHabits(loadedHabits);
      setRoutines(loadedRoutines);
      setReminders(loadedReminders);
      setClasses(loadedClasses);
      setGoals(loadedGoals);
    }

    loadSupabaseItems();

    // Supabase Real-Time Channel Subscription
    const channel = supabase
      .channel(`public:profile_items:${activeProfileId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profile_items', filter: `profile_id=eq.${activeProfileId}` },
        (payload) => {
          console.log('[Supabase Realtime Event Received]:', payload);
          const { eventType, new: newRow, old: oldRow } = payload as any;

          // Ignore real-time events that do not match the active profile
          if (newRow && newRow.profile_id && newRow.profile_id !== activeProfileId) {
            console.log(`[Supabase Realtime Ignored]: Profile ID "${newRow.profile_id}" does not match activeProfileId "${activeProfileId}"`);
            return;
          }

          if (eventType === 'INSERT' && newRow) {
            console.log(`[Supabase Realtime INSERT]: item_type = "${newRow.item_type}", id = "${newRow.id}"`);

            if (newRow.item_type === 'grocery') {
              const incoming: GroceryItem = { id: newRow.id, name: newRow.title, category: newRow.category || 'Other', iconName: newRow.metadata?.iconName || 'ShoppingBag', completed: newRow.completed, quantity: newRow.metadata?.quantity || '1' };
              setGroceries(currentItems => {
                const alreadyExists = currentItems.some(item => item.id === incoming.id);
                if (alreadyExists) {
                  console.log(`[Duplicate Detection]: Grocery id "${incoming.id}" already exists locally. Ignored.`);
                  return currentItems;
                }
                console.log(`[Realtime UI Update]: Appending grocery id "${incoming.id}" to UI state.`);
                return [incoming, ...currentItems];
              });
            } else if (newRow.item_type === 'task') {
              const incoming: TaskItem = { id: newRow.id, title: newRow.title, category: newRow.category || 'Personal', completed: newRow.completed, priority: newRow.metadata?.priority || 'medium', createdAt: newRow.created_at || new Date().toISOString() };
              setTasks(currentItems => {
                const alreadyExists = currentItems.some(item => item.id === incoming.id);
                if (alreadyExists) {
                  console.log(`[Duplicate Detection]: Task id "${incoming.id}" already exists locally. Ignored.`);
                  return currentItems;
                }
                console.log(`[Realtime UI Update]: Appending task id "${incoming.id}" to UI state.`);
                return [incoming, ...currentItems];
              });
            } else if (newRow.item_type === 'habit') {
              const incoming: HabitItem = { id: newRow.id, title: newRow.title, iconName: newRow.metadata?.iconName || 'Zap', streak: newRow.metadata?.streak || 0, bestStreak: newRow.metadata?.bestStreak || 0, targetDaysPerWeek: 7, completedToday: newRow.completed };
              setHabits(currentItems => {
                const alreadyExists = currentItems.some(item => item.id === incoming.id);
                if (alreadyExists) {
                  console.log(`[Duplicate Detection]: Habit id "${incoming.id}" already exists locally. Ignored.`);
                  return currentItems;
                }
                return [incoming, ...currentItems];
              });
            } else if (newRow.item_type === 'routine') {
              const incoming: RoutineTask = { id: newRow.id, day: newRow.metadata?.day || 'Monday', title: newRow.title, iconName: newRow.metadata?.iconName || 'CheckCircle', completedDates: newRow.metadata?.completedDates || [] };
              setRoutines(currentItems => {
                const alreadyExists = currentItems.some(item => item.id === incoming.id);
                if (alreadyExists) {
                  console.log(`[Duplicate Detection]: Routine id "${incoming.id}" already exists locally. Ignored.`);
                  return currentItems;
                }
                return [incoming, ...currentItems];
              });
            } else if (newRow.item_type === 'reminder') {
              const incoming: ReminderItem = { id: newRow.id, title: newRow.title, category: newRow.category || 'Personal', dueDate: newRow.metadata?.dueDate || new Date().toISOString().split('T')[0], iconName: newRow.metadata?.iconName || 'Bell', dismissed: newRow.completed };
              setReminders(currentItems => {
                const alreadyExists = currentItems.some(item => item.id === incoming.id);
                if (alreadyExists) return currentItems;
                return [incoming, ...currentItems];
              });
            } else if (newRow.item_type === 'class') {
              const incoming: ClassItem = { id: newRow.id, day: newRow.metadata?.day || 'Monday', name: newRow.title, time: newRow.metadata?.time || '09:00 AM', location: newRow.metadata?.location || 'Room 101', completed: newRow.completed };
              setClasses(currentItems => {
                const alreadyExists = currentItems.some(item => item.id === incoming.id);
                if (alreadyExists) return currentItems;
                return [incoming, ...currentItems];
              });
            } else if (newRow.item_type === 'goal') {
              const incoming: GoalItem = { id: newRow.id, title: newRow.title, target: newRow.metadata?.target || 10, current: newRow.metadata?.current || 0, unit: newRow.metadata?.unit || 'hrs', iconName: newRow.metadata?.iconName || 'Target', color: newRow.metadata?.color || '#007AFF' };
              setGoals(currentItems => {
                const alreadyExists = currentItems.some(item => item.id === incoming.id);
                if (alreadyExists) return currentItems;
                return [incoming, ...currentItems];
              });
            }
          } else if (eventType === 'UPDATE' && newRow) {
            console.log(`[Supabase Realtime UPDATE]: item_type = "${newRow.item_type}", id = "${newRow.id}"`);
            if (newRow.item_type === 'grocery') {
              setGroceries(prev => prev.map(g => g.id === newRow.id ? { ...g, name: newRow.title, completed: newRow.completed, category: newRow.category || g.category, quantity: newRow.metadata?.quantity || g.quantity } : g));
            } else if (newRow.item_type === 'task') {
              setTasks(prev => prev.map(t => t.id === newRow.id ? { ...t, title: newRow.title, completed: newRow.completed, category: newRow.category || t.category, priority: newRow.metadata?.priority || t.priority } : t));
            } else if (newRow.item_type === 'habit') {
              setHabits(prev => prev.map(h => h.id === newRow.id ? { ...h, title: newRow.title, completedToday: newRow.completed, streak: newRow.metadata?.streak ?? h.streak, bestStreak: newRow.metadata?.bestStreak ?? h.bestStreak } : h));
            } else if (newRow.item_type === 'routine') {
              setRoutines(prev => prev.map(r => r.id === newRow.id ? { ...r, title: newRow.title, completedDates: newRow.metadata?.completedDates || r.completedDates } : r));
            } else if (newRow.item_type === 'reminder') {
              setReminders(prev => prev.map(r => r.id === newRow.id ? { ...r, title: newRow.title, dismissed: newRow.completed } : r));
            } else if (newRow.item_type === 'class') {
              setClasses(prev => prev.map(c => c.id === newRow.id ? { ...c, name: newRow.title, completed: newRow.completed } : c));
            }
          } else if (eventType === 'DELETE' && oldRow) {
            const targetId = oldRow.id;
            console.log(`[Supabase Realtime DELETE]: Removing id "${targetId}" from local UI state (NO DB WRITE initiated).`);
            setGroceries(prev => prev.filter(g => g.id !== targetId));
            setTasks(prev => prev.filter(t => t.id !== targetId));
            setHabits(prev => prev.filter(h => h.id !== targetId));
            setRoutines(prev => prev.filter(r => r.id !== targetId));
            setReminders(prev => prev.filter(r => r.id !== targetId));
            setClasses(prev => prev.filter(c => c.id !== targetId));
            setGoals(prev => prev.filter(g => g.id !== targetId));
          }
        }
      )
      .subscribe((status) => {
        console.log(`[Supabase Realtime Subscription Status for "${activeProfileId}"]:`, status);
      });

    return () => {
      isMounted = false;
      console.log(`[Supabase Realtime Subscription Cleanup] Unsubscribing channel for profile: "${activeProfileId}"`);
      supabase.removeChannel(channel);
    };
  }, [activeProfileId]);

  const switchProfile = (profileId: string) => {
    const target = profiles.find(p => p.id === profileId);
    if (!target) return;

    setActiveProfileId(profileId);
    setUserNameState(target.name);

    // Clear previous UI state before fetching new profile
    setGroceries([]);
    setTasks([]);
    setHabits([]);
    setRoutines([]);
    setReminders([]);
    setClasses([]);
    setGoals([]);
  };

  const createProfile = (name: string, avatarEmoji: string, color: string) => {
    const newId = name.toLowerCase().replace(/\s+/g, '_');
    const newProfile: UserProfile = {
      id: newId,
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
    } catch {}
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
  const updateGoalProgress = async (id: string, delta: number) => {
    const target = goals.find(g => g.id === id);
    if (!target) return;
    const nextVal = Math.max(0, Math.min(target.target, parseFloat((target.current + delta).toFixed(1))));
    if (nextVal === target.target && target.current < target.target) {
      triggerConfetti();
    }
    setGoals(prev => prev.map(g => g.id === id ? { ...g, current: nextVal } : g));

    await updateProfileItemInSupabase(id, activeProfileId, {
      completed: nextVal >= target.target,
      metadata: { target: target.target, current: nextVal, unit: target.unit, iconName: target.iconName, color: target.color }
    });
  };

  const addGoal = async (newGoal: Omit<GoalItem, 'id'>) => {
    if (goals.length >= 3) return;
    const newId = generateUUID();
    console.log(`[User Action INSERT Goal]: title = "${newGoal.title}", profile_id = "${activeProfileId}"`);

    const inserted = await insertProfileItemToSupabase({
      id: newId,
      profile_id: activeProfileId,
      item_type: 'goal',
      title: newGoal.title,
      completed: false,
      metadata: { target: newGoal.target, current: newGoal.current, unit: newGoal.unit, iconName: newGoal.iconName, color: newGoal.color }
    });

    if (inserted) {
      console.log(`[User Action INSERT Goal Success]: Returned UUID = "${inserted.id}"`);
      const goal: GoalItem = { ...newGoal, id: inserted.id };
      setGoals(current => {
        const exists = current.some(g => g.id === inserted.id);
        if (exists) return current;
        return [...current, goal];
      });
    } else {
      console.error('[User Action INSERT Goal Failed]');
    }
  };

  // Task functions
  const toggleTask = async (id: string) => {
    const target = tasks.find(t => t.id === id);
    if (!target) return;
    const completed = !target.completed;
    if (completed) triggerConfetti();

    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed } : t));

    await updateProfileItemInSupabase(id, activeProfileId, { completed });
  };

  const addTask = async (taskData: Omit<TaskItem, 'id' | 'createdAt' | 'completed'>) => {
    const newId = generateUUID();
    console.log(`[User Action INSERT Task]: title = "${taskData.title}", profile_id = "${activeProfileId}"`);

    const inserted = await insertProfileItemToSupabase({
      id: newId,
      profile_id: activeProfileId,
      item_type: 'task',
      title: taskData.title,
      category: taskData.category,
      completed: false,
      metadata: { priority: taskData.priority }
    });

    if (inserted) {
      console.log(`[User Action INSERT Task Success]: Returned UUID = "${inserted.id}"`);
      const newTask: TaskItem = {
        id: inserted.id,
        title: inserted.title,
        category: (inserted.category as any) || 'Personal',
        completed: inserted.completed,
        priority: inserted.metadata?.priority || 'medium',
        createdAt: inserted.created_at || new Date().toISOString()
      };

      setTasks(current => {
        const exists = current.some(t => t.id === inserted.id);
        if (exists) return current;
        return [newTask, ...current];
      });
    } else {
      console.error('[User Action INSERT Task Failed]');
    }
  };

  const deleteTask = async (id: string) => {
    console.log(`[User Action DELETE Task]: id = "${id}"`);
    setTasks(prev => prev.filter(t => t.id !== id));
    await deleteProfileItemFromSupabase(id, activeProfileId);
  };

  // Habit functions
  const toggleHabitToday = async (id: string) => {
    const target = habits.find(h => h.id === id);
    if (!target) return;
    const isDone = !target.completedToday;
    let streak = target.streak;
    if (isDone) {
      streak += 1;
      triggerConfetti();
    } else {
      streak = Math.max(0, streak - 1);
    }
    const bestStreak = Math.max(target.bestStreak, streak);

    setHabits(prev => prev.map(h => h.id === id ? { ...h, completedToday: isDone, streak, bestStreak } : h));

    await updateProfileItemInSupabase(id, activeProfileId, {
      completed: isDone,
      metadata: { streak, bestStreak, iconName: target.iconName }
    });
  };

  const addHabit = async (habitData: Omit<HabitItem, 'id' | 'streak' | 'bestStreak' | 'completedToday'>) => {
    const newId = generateUUID();
    console.log(`[User Action INSERT Habit]: title = "${habitData.title}", profile_id = "${activeProfileId}"`);

    const inserted = await insertProfileItemToSupabase({
      id: newId,
      profile_id: activeProfileId,
      item_type: 'habit',
      title: habitData.title,
      completed: false,
      metadata: { streak: 0, bestStreak: 0, iconName: habitData.iconName, targetDaysPerWeek: habitData.targetDaysPerWeek }
    });

    if (inserted) {
      console.log(`[User Action INSERT Habit Success]: Returned UUID = "${inserted.id}"`);
      const newHabit: HabitItem = {
        id: inserted.id,
        title: inserted.title,
        iconName: inserted.metadata?.iconName || 'Zap',
        streak: 0,
        bestStreak: 0,
        targetDaysPerWeek: inserted.metadata?.targetDaysPerWeek || 7,
        completedToday: inserted.completed
      };

      setHabits(current => {
        const exists = current.some(h => h.id === inserted.id);
        if (exists) return current;
        return [newHabit, ...current];
      });
    } else {
      console.error('[User Action INSERT Habit Failed]');
    }
  };

  const deleteHabit = async (id: string) => {
    console.log(`[User Action DELETE Habit]: id = "${id}"`);
    setHabits(prev => prev.filter(h => h.id !== id));
    await deleteProfileItemFromSupabase(id, activeProfileId);
  };

  // Routine functions
  const toggleRoutineItemToday = async (id: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const target = routines.find(r => r.id === id);
    if (!target) return;
    const isCompleted = target.completedDates.includes(todayStr);
    let updatedDates: string[];
    if (isCompleted) {
      updatedDates = target.completedDates.filter(d => d !== todayStr);
    } else {
      updatedDates = [...target.completedDates, todayStr];
      triggerConfetti();
    }

    setRoutines(prev => prev.map(r => r.id === id ? { ...r, completedDates: updatedDates } : r));

    await updateProfileItemInSupabase(id, activeProfileId, {
      completed: updatedDates.length > 0,
      metadata: { day: target.day, iconName: target.iconName, completedDates: updatedDates }
    });
  };

  const addRoutineItem = async (item: Omit<RoutineTask, 'id' | 'completedDates'>) => {
    const newId = generateUUID();
    console.log(`[User Action INSERT Routine]: title = "${item.title}", profile_id = "${activeProfileId}"`);

    const inserted = await insertProfileItemToSupabase({
      id: newId,
      profile_id: activeProfileId,
      item_type: 'routine',
      title: item.title,
      completed: false,
      metadata: { day: item.day, iconName: item.iconName, completedDates: [] }
    });

    if (inserted) {
      console.log(`[User Action INSERT Routine Success]: Returned UUID = "${inserted.id}"`);
      const newRoutine: RoutineTask = {
        id: inserted.id,
        day: inserted.metadata?.day || 'Monday',
        title: inserted.title,
        iconName: inserted.metadata?.iconName || 'CheckCircle',
        completedDates: []
      };

      setRoutines(current => {
        const exists = current.some(r => r.id === inserted.id);
        if (exists) return current;
        return [newRoutine, ...current];
      });
    } else {
      console.error('[User Action INSERT Routine Failed]');
    }
  };

  const deleteRoutineItem = async (id: string) => {
    console.log(`[User Action DELETE Routine]: id = "${id}"`);
    setRoutines(prev => prev.filter(r => r.id !== id));
    await deleteProfileItemFromSupabase(id, activeProfileId);
  };

  // Reminder functions
  const dismissReminder = async (id: string) => {
    console.log(`[User Action Dismiss/Delete Reminder]: id = "${id}"`);
    setReminders(prev => prev.filter(r => r.id !== id));
    await deleteProfileItemFromSupabase(id, activeProfileId);
  };

  const addReminder = async (reminderData: Omit<ReminderItem, 'id' | 'dismissed'>) => {
    const newId = generateUUID();
    console.log(`[User Action INSERT Reminder]: title = "${reminderData.title}", profile_id = "${activeProfileId}"`);

    const inserted = await insertProfileItemToSupabase({
      id: newId,
      profile_id: activeProfileId,
      item_type: 'reminder',
      title: reminderData.title,
      category: reminderData.category,
      completed: false,
      metadata: { dueDate: reminderData.dueDate, iconName: reminderData.iconName, notes: reminderData.notes, amount: reminderData.amount }
    });

    if (inserted) {
      console.log(`[User Action INSERT Reminder Success]: Returned UUID = "${inserted.id}"`);
      const newRem: ReminderItem = {
        id: inserted.id,
        title: inserted.title,
        category: (inserted.category as any) || 'Personal',
        dueDate: inserted.metadata?.dueDate || new Date().toISOString().split('T')[0],
        iconName: inserted.metadata?.iconName || 'Bell',
        dismissed: inserted.completed
      };

      setReminders(current => {
        const exists = current.some(r => r.id === inserted.id);
        if (exists) return current;
        return [newRem, ...current];
      });
    } else {
      console.error('[User Action INSERT Reminder Failed]');
    }
  };

  // Gym functions
  const toggleExerciseToday = (exerciseId: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
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
      id: generateUUID(),
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

  const toggleGymWorkoutCompleted = async (day: DayOfWeek) => {
    const nextState = !gymCompletedDays[day];
    if (nextState) triggerConfetti();
    setGymCompletedDays(prev => ({ ...prev, [day]: nextState }));

    await insertProfileItemToSupabase({
      id: generateUUID(),
      profile_id: activeProfileId,
      item_type: 'gym_split',
      title: `Workout ${day}`,
      category: day,
      completed: nextState,
      metadata: { day }
    });
  };

  // Class functions
  const addClass = async (itemData: Omit<ClassItem, 'id'>) => {
    const newId = generateUUID();
    console.log(`[User Action INSERT Class]: name = "${itemData.name}", profile_id = "${activeProfileId}"`);

    const inserted = await insertProfileItemToSupabase({
      id: newId,
      profile_id: activeProfileId,
      item_type: 'class',
      title: itemData.name,
      completed: false,
      metadata: { day: itemData.day, time: itemData.time, location: itemData.location }
    });

    if (inserted) {
      console.log(`[User Action INSERT Class Success]: Returned UUID = "${inserted.id}"`);
      const newClass: ClassItem = {
        id: inserted.id,
        day: inserted.metadata?.day || 'Monday',
        name: inserted.title,
        time: inserted.metadata?.time || '09:00 AM',
        location: inserted.metadata?.location || 'Room 101',
        completed: inserted.completed
      };

      setClasses(current => {
        const exists = current.some(c => c.id === inserted.id);
        if (exists) return current;
        return [newClass, ...current];
      });
    } else {
      console.error('[User Action INSERT Class Failed]');
    }
  };

  const deleteClass = async (id: string) => {
    console.log(`[User Action DELETE Class]: id = "${id}"`);
    setClasses(prev => prev.filter(c => c.id !== id));
    await deleteProfileItemFromSupabase(id, activeProfileId);
  };

  const toggleClassCompleted = async (id: string) => {
    const target = classes.find(c => c.id === id);
    if (!target) return;
    const nextComp = !target.completed;
    if (nextComp) triggerConfetti();

    setClasses(prev => prev.map(c => c.id === id ? { ...c, completed: nextComp } : c));

    await updateProfileItemInSupabase(id, activeProfileId, { completed: nextComp });
  };

  // Grocery functions
  const addGroceryItem = async (itemData: Omit<GroceryItem, 'id' | 'completed'>) => {
    const newId = generateUUID();
    console.log(`[User Action INSERT Grocery]: name = "${itemData.name}", profile_id = "${activeProfileId}"`);

    const inserted = await insertProfileItemToSupabase({
      id: newId,
      profile_id: activeProfileId,
      item_type: 'grocery',
      title: itemData.name,
      category: itemData.category,
      completed: false,
      metadata: { quantity: itemData.quantity, iconName: itemData.iconName }
    });

    if (inserted) {
      console.log(`[User Action INSERT Grocery Success]: Returned UUID = "${inserted.id}"`);
      const newItem: GroceryItem = {
        id: inserted.id,
        name: inserted.title,
        category: (inserted.category as any) || 'Other',
        iconName: inserted.metadata?.iconName || 'ShoppingBag',
        completed: inserted.completed,
        quantity: inserted.metadata?.quantity || '1'
      };

      setGroceries(current => {
        const alreadyExists = current.some(g => g.id === inserted.id);
        if (alreadyExists) {
          console.log(`[Duplicate Detection]: Grocery id "${inserted.id}" already present in local state. Skipping duplicate append.`);
          return current;
        }
        return [newItem, ...current];
      });
    } else {
      console.error('[User Action INSERT Grocery Failed]');
    }
  };

  const deleteGroceryItem = async (id: string) => {
    console.log(`[User Action DELETE Grocery]: id = "${id}"`);
    setGroceries(prev => prev.filter(g => g.id !== id));
    await deleteProfileItemFromSupabase(id, activeProfileId);
  };

  const toggleGroceryItem = async (id: string) => {
    const target = groceries.find(g => g.id === id);
    if (!target) return;
    const nextComp = !target.completed;
    if (nextComp) triggerConfetti();

    console.log(`[User Action TOGGLE Grocery]: id = "${id}", completed = ${nextComp}`);
    setGroceries(prev => prev.map(g => g.id === id ? { ...g, completed: nextComp } : g));

    await updateProfileItemInSupabase(id, activeProfileId, { completed: nextComp });
  };

  const clearCompletedGroceries = async () => {
    const toDelete = groceries.filter(g => g.completed);
    console.log(`[User Action CLEAR COMPLETED Groceries]: deleting ${toDelete.length} items.`);
    setGroceries(prev => prev.filter(g => !g.completed));

    for (const g of toDelete) {
      await deleteProfileItemFromSupabase(g.id, activeProfileId);
    }
  };

  // Active Quote filtering
  const quotesForCategory = INITIAL_QUOTES.filter(q => q.category === selectedQuoteCategory);
  const activeQuote = quotesForCategory[0] || INITIAL_QUOTES[0];

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const resetAllData = () => {
    console.log('[Store Reset] Clearing local state arrays to empty.');
    setGoals([]);
    setTasks([]);
    setHabits([]);
    setRoutines([]);
    setReminders([]);
    setGymSplits([]);
    setGymCompletedDays({});
    setClasses([]);
    setGroceries([]);
    setUserNameState('Eve');
  };

  return (
    <StoreContext.Provider value={{
      userName,
      setUserName,
      profiles,
      currentProfile,
      activeProfileId,
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
      toggleAdminMode: () => setIsAdmin(prev => !prev),
      globalData,
      updateGlobalWorkoutSplits: (splits) => cloudSyncService.updateGlobalData(prev => ({ ...prev, workoutSplits: splits })),
      updateGlobalRoutines: (routines) => cloudSyncService.updateGlobalData(prev => ({ ...prev, routineTemplates: routines })),
      updateGlobalQuotes: (quotes) => cloudSyncService.updateGlobalData(prev => ({ ...prev, quotes: quotes as any })),
      updateGlobalAnnouncements: (announcements) => cloudSyncService.updateGlobalData(prev => ({ ...prev, announcements })),
      updateGlobalSettings: (settings) => cloudSyncService.updateGlobalData(prev => ({ ...prev, appSettings: settings }))
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
