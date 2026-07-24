'use client';

import React from 'react';
import { Search, Plus, Eye, EyeOff, Bell, Sparkles } from 'lucide-react';
import { NavigationTab, UserProfile } from '@/types';

interface HeaderProps {
  activeTab: NavigationTab;
  user: UserProfile;
  onOpenCommandPalette: () => void;
  onOpenNotifications: () => void;
  onQuickAdd: () => void;
  isFocusMode: boolean;
  setIsFocusMode: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  user,
  onOpenCommandPalette,
  onOpenNotifications,
  onQuickAdd,
  isFocusMode,
  setIsFocusMode,
}) => {
  const titles: Record<NavigationTab, { title: string; subtitle: string }> = {
    dashboard: { title: 'Today’s Overview', subtitle: 'Everything you need to do, eat, buy, and remember today.' },
    tasks: { title: 'To-Do & Tasks', subtitle: 'Things 3 style task management for Inbox, Today, and Upcoming.' },
    shopping: { title: 'Shopping Hub', subtitle: 'Multi-list shopping lists with running cost estimates.' },
    meals: { title: 'Weekly Meal Planner', subtitle: 'Plan breakfast, lunch, dinner, and auto-export groceries.' },
    pantry: { title: 'Pantry Inventory', subtitle: 'Track low-stock household items and restock alerts.' },
    calendar: { title: 'Integrated Calendar', subtitle: 'Unified daily, weekly, and monthly life events schedule.' },
    notes: { title: 'Personal Notes', subtitle: 'Rich markdown notes linked to tasks or shopping items.' },
    'goals-chores': { title: 'Goals & Recurring Chores', subtitle: 'Track habit progress and recurring household routines.' },
    analytics: { title: 'Life Analytics', subtitle: 'Productivity velocity, shopping spending, and habit streaks.' },
  };

  const current = titles[activeTab] || titles.dashboard;

  return (
    <header className="h-16 px-6 glass-panel border-b border-white/10 flex items-center justify-between sticky top-0 z-20 shrink-0 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {isFocusMode && (
          <button
            onClick={() => setIsFocusMode(false)}
            className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 text-xs font-semibold flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Exit Focus</span>
          </button>
        )}
        <div>
          <h1 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>{current.title}</span>
          </h1>
          <p className="text-[11px] text-slate-400 hidden sm:block">{current.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Global Search button */}
        <button
          onClick={onOpenCommandPalette}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 flex items-center gap-2 transition-all"
        >
          <Search className="w-3.5 h-3.5 text-teal-400" />
          <span className="hidden md:inline font-medium">Search life...</span>
          <kbd className="hidden md:inline px-1 py-0.5 text-[9px] font-mono bg-white/10 rounded text-slate-400">⌘K</kbd>
        </button>

        {/* Focus Mode Toggle */}
        <button
          onClick={() => setIsFocusMode(!isFocusMode)}
          title={isFocusMode ? 'Show Navigation' : 'Focus Mode'}
          className={`p-2 rounded-xl border transition-all ${
            isFocusMode
              ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-lg shadow-teal-500/20'
              : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
          }`}
        >
          {isFocusMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white relative"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-teal-400 absolute top-1.5 right-1.5 ring-2 ring-slate-900" />
        </button>

        {/* Quick Add */}
        <button
          onClick={onQuickAdd}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-teal-500/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Quick Add</span>
        </button>
      </div>
    </header>
  );
};
