export type TaskCategory = 'Personal' | 'Apartment' | 'Health' | 'Shopping' | 'Work' | 'Travel';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface TaskItem {
  id: string;
  title: string;
  category: TaskCategory;
  completed: boolean;
  completedAt?: string;
  priority: TaskPriority;
  dueDate?: string; // YYYY-MM-DD
  notes?: string;
  recurring?: 'none' | 'daily' | 'weekly' | 'monthly';
  createdAt: string;
}

export interface HabitItem {
  id: string;
  title: string;
  iconName: string;
  streak: number;
  bestStreak: number;
  lastCompletedDate?: string; // YYYY-MM-DD
  targetDaysPerWeek: number;
  completedToday: boolean;
}

export interface ReminderItem {
  id: string;
  title: string;
  category: 'Bills' | 'Health' | 'Documents' | 'Birthdays' | 'Subscriptions' | 'Deliveries';
  dueDate: string; // YYYY-MM-DD
  iconName: string;
  notes?: string;
  amount?: string;
  dismissed?: boolean;
}

export interface GoalItem {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  iconName: string;
  color: string;
}

export type QuoteCategory = 
  | 'Discipline'
  | 'Consistency'
  | 'Success'
  | 'Confidence'
  | 'Happiness'
  | 'Gratitude'
  | 'Fitness'
  | 'Health'
  | 'Productivity'
  | 'Focus'
  | 'Growth'
  | 'Leadership'
  | 'Kindness'
  | 'Resilience'
  | 'Stoicism'
  | 'Morning Motivation'
  | 'Evening Reflection'
  | 'New Beginnings'
  | 'Mindfulness'
  | 'Self Improvement';

export interface QuoteItem {
  id: string;
  text: string;
  author: string;
  category: QuoteCategory;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface RoutineTask {
  id: string;
  day: DayOfWeek;
  title: string;
  completedDates: string[]; // array of YYYY-MM-DD
  iconName: string;
}

export interface ExerciseItem {
  id: string;
  name: string;
  setsReps: string;
  completedDates: string[]; // YYYY-MM-DD
}

export interface GymSplitDay {
  day: DayOfWeek;
  focusTitle: string;
  exercises: ExerciseItem[];
}

export type MoodType = 'Calm 🌿' | 'Energized ⚡' | 'Focused 🎯' | 'Tired 🥱' | 'Grateful 🙏';

export interface MoodLog {
  date: string;
  mood: MoodType;
  note?: string;
}

export interface HydrationLog {
  date: string;
  glasses: number;
}

export interface UserProfile {
  id: string;
  name: string;
  avatarEmoji: string;
  color: string;
  createdAt: string;
}

export type ViewMode = 'phone' | 'computer';
export type AppTheme = 'light' | 'dark';
export type ActiveTab = 'home' | 'tasks' | 'habits' | 'groceries' | 'reminders' | 'calendar';

export interface UserNotification {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  type: 'assistant' | 'reminder' | 'streak';
}

export interface ClassItem {
  id: string;
  day: DayOfWeek;
  name: string;
  time: string;
  location: string;
  type?: string;
  completed?: boolean;
}

export type GroceryCategory = 'Produce' | 'Dairy & Eggs' | 'Pantry' | 'Bakery' | 'Frozen' | 'Beverages' | 'Personal Care' | 'Other';

export interface GroceryItem {
  id: string;
  name: string;
  category: GroceryCategory;
  iconName: string;
  completed: boolean;
  quantity?: string;
}
