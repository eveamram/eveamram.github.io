export type Priority = 'High' | 'Medium' | 'Low';
export type TaskCategory = 'Personal' | 'Work' | 'Home' | 'Health' | 'Finance';
export type ShoppingCategory = 'Produce' | 'Dairy' | 'Pantry' | 'Household' | 'Snacks' | 'Meat' | 'Beverages';
export type ShoppingListName = 'Groceries' | 'Apartment' | 'Costco' | 'Amazon' | 'Target';
export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface LifeTask {
  id: string;
  title: string;
  notes?: string;
  dueDate: string; // YYYY-MM-DD or ISO string
  dueTime?: string;
  priority: Priority;
  category: TaskCategory;
  tags: string[];
  isCompleted: boolean;
  isInbox?: boolean;
  recurring?: 'Daily' | 'Weekly' | 'Monthly' | 'None';
  reminderTime?: string;
  subtasks: Subtask[];
  createdAt: string;
}

export interface ShoppingItem {
  id: string;
  listName: ShoppingListName;
  title: string;
  quantity: number;
  unit?: string;
  category: ShoppingCategory;
  estimatedPrice?: number;
  isBought: boolean;
  notes?: string;
  addedAt: string;
}

export interface MealPlan {
  id: string;
  dayOfWeek: DayOfWeek;
  mealType: MealType;
  title: string;
  recipe?: string;
  prepTimeMins?: number;
  ingredients: string[];
  notes?: string;
}

export interface PantryItem {
  id: string;
  name: string;
  category: ShoppingCategory;
  quantity: number;
  unit: string;
  expirationDate?: string;
  lowStockThreshold: number;
  isLowStock: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  eventDate: string; // YYYY-MM-DD
  time?: string;
  category: 'Task' | 'Meal' | 'Appointment' | 'Birthday' | 'Reminder';
  color: string;
}

export interface LifeGoal {
  id: string;
  title: string;
  category: string;
  currentProgress: number;
  targetProgress: number;
  unit: string;
  color: string;
  streakDays: number;
}

export interface RecurringChore {
  id: string;
  title: string;
  frequency: 'Daily' | 'Weekly' | 'Bi-weekly' | 'Monthly';
  lastCompletedDate?: string;
  nextDueDate: string;
  isDoneThisCycle: boolean;
}

export interface LifeNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  linkedTaskId?: string;
  linkedShoppingId?: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  dailyGoalTarget: number;
  weeklyProductivityScore: number;
}

export type NavigationTab = 
  | 'dashboard'
  | 'tasks'
  | 'shopping'
  | 'meals'
  | 'pantry'
  | 'calendar'
  | 'notes'
  | 'goals-chores'
  | 'analytics';
