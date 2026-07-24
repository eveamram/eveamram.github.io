'use client';

import React from 'react';
import { 
  CheckSquare, 
  ShoppingBag, 
  Utensils, 
  Sparkles, 
  Flame, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Circle, 
  Plus, 
  ArrowRight, 
  Clock, 
  Package, 
  AlertTriangle 
} from 'lucide-react';
import { 
  UserProfile, 
  LifeTask, 
  ShoppingItem, 
  MealPlan, 
  PantryItem, 
  CalendarEvent, 
  LifeGoal, 
  RecurringChore, 
  NavigationTab 
} from '@/types';
import { formatDate } from '@/lib/utils';

interface DashboardViewProps {
  user: UserProfile;
  tasks: LifeTask[];
  shoppingItems: ShoppingItem[];
  meals: MealPlan[];
  pantryItems: PantryItem[];
  events: CalendarEvent[];
  goals: LifeGoal[];
  chores: RecurringChore[];
  streakDays: number;
  setActiveTab: (tab: NavigationTab) => void;
  onToggleTask: (id: string) => void;
  onOpenQuickAdd: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  tasks,
  shoppingItems,
  meals,
  pantryItems,
  events,
  goals,
  chores,
  streakDays,
  setActiveTab,
  onToggleTask,
  onOpenQuickAdd,
}) => {
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => !t.isCompleted);
  const completedTodayTasks = tasks.filter(t => t.isCompleted);
  const neededShopping = shoppingItems.filter(s => !s.isBought);
  const lowStockPantry = pantryItems.filter(p => p.isLowStock);
  const todayMeals = meals.filter(m => m.dayOfWeek === 'Mon'); // Monday as demo current day

  const completionPercentage = tasks.length > 0
    ? Math.round((completedTodayTasks.length / tasks.length) * 100)
    : 0;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-20 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl glass-panel border border-teal-500/20 bg-gradient-to-r from-teal-950/40 via-indigo-950/30 to-purple-950/40 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{streakDays} Day Streak</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back, {user.fullName.split(' ')[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            You have <strong className="text-teal-300">{todayTasks.length} tasks due today</strong>, <strong className="text-purple-300">{neededShopping.length} shopping items needed</strong>, and 4 meals planned.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={onOpenQuickAdd}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-500 via-indigo-600 to-purple-600 hover:from-teal-400 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-teal-500/20 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Smart Quick Add</span>
          </button>
        </div>

        {/* Subtle Decorative Glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      </div>

      {/* Metric Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          onClick={() => setActiveTab('tasks')}
          className="p-4 rounded-2xl glass-panel glass-panel-hover border border-white/10 space-y-2 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-extrabold tracking-wider">Today's Tasks</span>
            <CheckSquare className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-mono">{todayTasks.length}</span>
            <span className="text-[10px] text-teal-400 font-bold">{completionPercentage}% done</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-teal-400 rounded-full transition-all duration-500" style={{ width: `${completionPercentage}%` }} />
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('shopping')}
          className="p-4 rounded-2xl glass-panel glass-panel-hover border border-white/10 space-y-2 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-extrabold tracking-wider">Shopping Needed</span>
            <ShoppingBag className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-mono">{neededShopping.length}</span>
            <span className="text-[10px] text-purple-300 font-bold">5 Lists</span>
          </div>
          <p className="text-[10px] text-slate-400 truncate">Groceries, Costco, Target</p>
        </div>

        <div 
          onClick={() => setActiveTab('meals')}
          className="p-4 rounded-2xl glass-panel glass-panel-hover border border-white/10 space-y-2 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-extrabold tracking-wider">Today's Meals</span>
            <Utensils className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-mono">{todayMeals.length}</span>
            <span className="text-[10px] text-amber-300 font-bold">Planned</span>
          </div>
          <p className="text-[10px] text-slate-400 truncate">Salmon Bowl, Avocado Toast</p>
        </div>

        <div 
          onClick={() => setActiveTab('pantry')}
          className="p-4 rounded-2xl glass-panel glass-panel-hover border border-white/10 space-y-2 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-extrabold tracking-wider">Low Stock Pantry</span>
            <Package className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-300 font-mono">{lowStockPantry.length}</span>
            <span className="text-[10px] text-amber-300 font-bold">Restock</span>
          </div>
          <p className="text-[10px] text-amber-300/80 truncate">Milk, Eggs running low</p>
        </div>
      </div>

      {/* Main Content Grid: Today's Tasks & Today's Meals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks Column (2 cols) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl border border-white/10 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-teal-400" />
              <h2 className="text-sm font-extrabold text-white">Today's Priority To-Do List</h2>
            </div>

            <button
              onClick={() => setActiveTab('tasks')}
              className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1"
            >
              <span>View All Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {todayTasks.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-teal-400 mx-auto" />
                <p className="text-xs text-slate-300 font-bold">All today's tasks completed!</p>
              </div>
            ) : (
              todayTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleTask(t.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-teal-400 transition-colors"
                    >
                      <Circle className="w-5 h-5" />
                    </button>

                    <div>
                      <h3 className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors">{t.title}</h3>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-slate-300">{t.category}</span>
                        {t.dueTime && <span>{t.dueTime}</span>}
                      </div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    t.priority === 'High' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                    t.priority === 'Medium' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                    'bg-slate-500/20 text-slate-300 border-slate-500/30'
                  }`}>
                    {t.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Today's Meals & Shopping Glance (1 col) */}
        <div className="space-y-6">
          {/* Meals Glance */}
          <div className="glass-panel rounded-2xl border border-white/10 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-amber-400" />
                <h2 className="text-sm font-extrabold text-white">Today's Meals</h2>
              </div>
              <button onClick={() => setActiveTab('meals')} className="text-xs font-bold text-amber-400 hover:text-amber-300">
                Plan
              </button>
            </div>

            <div className="space-y-3">
              {todayMeals.map(m => (
                <div key={m.id} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">{m.mealType}</span>
                    <span className="text-[10px] font-mono text-slate-400">{m.prepTimeMins} mins</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{m.title}</h4>
                </div>
              ))}
            </div>
          </div>

          {/* Habit Goals Bar */}
          <div className="glass-panel rounded-2xl border border-white/10 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-teal-400" />
                <h2 className="text-sm font-extrabold text-white">Habit Progress</h2>
              </div>
              <button onClick={() => setActiveTab('goals-chores')} className="text-xs font-bold text-teal-400 hover:text-teal-300">
                Goals
              </button>
            </div>

            <div className="space-y-3">
              {goals.slice(0, 3).map(g => (
                <div key={g.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-white">{g.title}</span>
                    <span className="font-mono text-teal-300">{g.currentProgress} / {g.targetProgress} {g.unit}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ backgroundColor: g.color, width: `${(g.currentProgress / g.targetProgress) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
