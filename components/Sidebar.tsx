'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  ShoppingBag, 
  Utensils, 
  Package, 
  Calendar as CalendarIcon, 
  FileText, 
  Target, 
  BarChart3, 
  Sparkles, 
  Plus, 
  Sun, 
  Moon, 
  Command, 
  Flame 
} from 'lucide-react';
import { NavigationTab, UserProfile } from '@/types';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  user: UserProfile;
  streakDays: number;
  onOpenQuickAdd: () => void;
  onOpenCommandPalette: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  user,
  streakDays,
  onOpenQuickAdd,
  onOpenCommandPalette,
  theme,
  toggleTheme,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Today’s Life', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks & To-Do', icon: CheckSquare, badge: '3' },
    { id: 'shopping', label: 'Shopping Lists', icon: ShoppingBag, badge: '5' },
    { id: 'meals', label: 'Meal Planner', icon: Utensils },
    { id: 'pantry', label: 'Pantry Inventory', icon: Package, alert: true },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'goals-chores', label: 'Goals & Chores', icon: Target },
    { id: 'analytics', label: 'Life Analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 h-screen flex flex-col glass-panel border-r border-white/10 shrink-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
              Aura
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-widest text-teal-400">Personal Life OS</p>
          </div>
        </div>

        <button 
          onClick={toggleTheme}
          title="Toggle Theme"
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>
      </div>

      {/* Smart Quick Add Button */}
      <div className="px-3 py-3 space-y-2">
        <button
          onClick={onOpenQuickAdd}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-teal-500 via-indigo-600 to-purple-600 hover:from-teal-400 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-between shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Smart Quick Add</span>
          </span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white/20 rounded">⌘N</kbd>
        </button>

        <button
          onClick={onOpenCommandPalette}
          className="w-full py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition-all"
        >
          <span className="flex items-center gap-2">
            <Command className="w-3.5 h-3.5 text-teal-400" />
            <span>Search life...</span>
          </span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white/10 rounded text-slate-400">⌘K</kbd>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase px-3 mb-2">
          Everyday Life
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as NavigationTab)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative',
                isActive
                  ? 'bg-gradient-to-r from-teal-500/20 via-indigo-600/20 to-purple-600/20 text-white border border-teal-500/30 shadow-md shadow-teal-500/10'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn('w-4 h-4 transition-colors', 
                  isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200'
                )} />
                <span>{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.alert && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                )}
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    {item.badge}
                  </span>
                )}
              </div>

              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-teal-400 rounded-r-full shadow-lg shadow-teal-400" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User & Habit Streak Footer */}
      <div className="p-3 border-t border-white/5 space-y-2">
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <div>
              <div className="text-[10px] text-amber-300/70 uppercase font-bold">Habit Streak</div>
              <div className="text-xs font-bold text-amber-200">{streakDays} Days Consistent 🔥</div>
            </div>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-white/5 flex items-center gap-3">
          <img src={user.avatarUrl} alt={user.fullName} className="w-8 h-8 rounded-lg object-cover ring-2 ring-teal-500/30" />
          <div className="overflow-hidden flex-1">
            <div className="text-xs font-bold text-slate-100 truncate">{user.fullName}</div>
            <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
