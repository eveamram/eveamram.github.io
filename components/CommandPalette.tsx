'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, CheckSquare, ShoppingBag, Utensils, FileText, Target, Calendar, ArrowRight } from 'lucide-react';
import { NavigationTab, LifeTask, ShoppingItem, MealPlan, LifeNote, LifeGoal } from '@/types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: NavigationTab) => void;
  tasks: LifeTask[];
  shoppingItems: ShoppingItem[];
  meals: MealPlan[];
  notes: LifeNote[];
  goals: LifeGoal[];
  onOpenQuickAdd: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  setActiveTab,
  tasks,
  shoppingItems,
  meals,
  notes,
  goals,
  onOpenQuickAdd,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        onOpenQuickAdd();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onOpenQuickAdd]);

  if (!isOpen) return null;

  const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(query.toLowerCase()));
  const filteredShopping = shoppingItems.filter(s => s.title.toLowerCase().includes(query.toLowerCase()));
  const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(query.toLowerCase()) || n.content.toLowerCase().includes(query.toLowerCase()));
  const filteredGoals = goals.filter(g => g.title.toLowerCase().includes(query.toLowerCase()));

  const handleSelectTab = (tab: NavigationTab) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl glass-panel rounded-2xl border border-white/20 p-4 shadow-2xl space-y-4 bg-slate-900/95">
        {/* Input Bar */}
        <div className="relative flex items-center border-b border-white/10 pb-3">
          <Search className="w-5 h-5 text-teal-400 absolute left-2" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search tasks, shopping, meals, notes, goals..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-8 py-2 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none font-medium"
          />
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto space-y-4 pr-1">
          {/* Quick Navigation Commands */}
          {!query && (
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-2">Quick Navigation</div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => handleSelectTab('dashboard')} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-between text-xs text-white">
                  <span className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-teal-400" />
                    <span>Today’s Overview</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button onClick={() => handleSelectTab('tasks')} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-between text-xs text-white">
                  <span className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-indigo-400" />
                    <span>Tasks & To-Do</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button onClick={() => handleSelectTab('shopping')} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-between text-xs text-white">
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-purple-400" />
                    <span>Shopping Lists</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button onClick={() => handleSelectTab('meals')} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-between text-xs text-white">
                  <span className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-amber-400" />
                    <span>Meal Planner</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
            </div>
          )}

          {/* Tasks Results */}
          {filteredTasks.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-2">Tasks ({filteredTasks.length})</div>
              {filteredTasks.map(t => (
                <div key={t.id} onClick={() => handleSelectTab('tasks')} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer flex items-center justify-between text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-3.5 h-3.5 text-teal-400" />
                    <span>{t.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{t.category}</span>
                </div>
              ))}
            </div>
          )}

          {/* Shopping Results */}
          {filteredShopping.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-2">Shopping Needed ({filteredShopping.length})</div>
              {filteredShopping.map(s => (
                <div key={s.id} onClick={() => handleSelectTab('shopping')} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer flex items-center justify-between text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-3.5 h-3.5 text-purple-400" />
                    <span>{s.title} ({s.quantity} {s.unit})</span>
                  </div>
                  <span className="text-[10px] text-purple-300 font-mono">{s.listName}</span>
                </div>
              ))}
            </div>
          )}

          {/* Notes Results */}
          {filteredNotes.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-2">Personal Notes ({filteredNotes.length})</div>
              {filteredNotes.map(n => (
                <div key={n.id} onClick={() => handleSelectTab('notes')} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer flex items-center justify-between text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>{n.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Note</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
