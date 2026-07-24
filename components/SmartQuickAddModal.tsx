'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, X, CheckSquare, ShoppingBag, Utensils, RefreshCw, ArrowRight } from 'lucide-react';
import { parseNaturalLanguageInput, ParsedItemResult } from '@/lib/parser';
import { LifeTask, ShoppingItem, MealPlan, RecurringChore } from '@/types';

interface SmartQuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: LifeTask) => void;
  onAddShoppingItem: (item: ShoppingItem) => void;
  onAddMealPlan: (meal: MealPlan) => void;
  onAddChore: (chore: RecurringChore) => void;
}

export const SmartQuickAddModal: React.FC<SmartQuickAddModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  onAddShoppingItem,
  onAddMealPlan,
  onAddChore,
}) => {
  const [inputText, setInputText] = useState('');
  const [parsedResult, setParsedResult] = useState<ParsedItemResult | null>(null);

  useEffect(() => {
    if (inputText.trim()) {
      setParsedResult(parseNaturalLanguageInput(inputText));
    } else {
      setParsedResult(null);
    }
  }, [inputText]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !parsedResult) return;

    if (parsedResult.type === 'shopping') {
      const newShop: ShoppingItem = {
        id: `shop_${Date.now()}`,
        listName: parsedResult.shoppingList || 'Groceries',
        title: parsedResult.title,
        quantity: 1,
        unit: 'item',
        category: (parsedResult.category as any) || 'Produce',
        estimatedPrice: parsedResult.estimatedPrice || 6.50,
        isBought: false,
        addedAt: new Date().toISOString(),
      };
      onAddShoppingItem(newShop);
    } else if (parsedResult.type === 'meal') {
      const newMeal: MealPlan = {
        id: `meal_${Date.now()}`,
        dayOfWeek: parsedResult.dayOfWeek || 'Wed',
        mealType: parsedResult.mealType || 'Dinner',
        title: parsedResult.title,
        prepTimeMins: 20,
        ingredients: ['Fresh Ingredients'],
      };
      onAddMealPlan(newMeal);
    } else if (parsedResult.type === 'chore') {
      const newChore: RecurringChore = {
        id: `chore_${Date.now()}`,
        title: parsedResult.title,
        frequency: 'Weekly',
        nextDueDate: new Date().toISOString().split('T')[0],
        isDoneThisCycle: false,
      };
      onAddChore(newChore);
    } else {
      const newTask: LifeTask = {
        id: `tsk_${Date.now()}`,
        title: parsedResult.title,
        dueDate: parsedResult.dueDate || new Date().toISOString().split('T')[0],
        dueTime: parsedResult.dueTime || '09:00 AM',
        priority: parsedResult.priority || 'Medium',
        category: (parsedResult.category as any) || 'Personal',
        tags: ['quick-add'],
        isCompleted: false,
        subtasks: [],
        createdAt: new Date().toISOString(),
      };
      onAddTask(newTask);
    }

    setInputText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl glass-panel rounded-2xl border border-teal-500/30 p-6 shadow-2xl space-y-4 bg-slate-900/90">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2 text-teal-400 font-black text-sm">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Smart Natural Language Quick Add</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              autoFocus
              placeholder="Type naturally (e.g. 'Buy organic milk for Costco', 'Laundry Sunday', 'Chicken tacos Wednesday dinner', 'Pay rent tomorrow')"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 font-medium"
            />
          </div>

          {/* Parsed Live Intelligence Pills */}
          {parsedResult && (
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2 animate-in fade-in duration-150">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Auto-Detected Destination
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-black text-white flex items-center gap-1.5 ${
                    parsedResult.type === 'shopping' ? 'bg-purple-600' :
                    parsedResult.type === 'meal' ? 'bg-amber-600' :
                    parsedResult.type === 'chore' ? 'bg-teal-600' : 'bg-indigo-600'
                  }`}>
                    {parsedResult.type === 'shopping' && <ShoppingBag className="w-3.5 h-3.5" />}
                    {parsedResult.type === 'meal' && <Utensils className="w-3.5 h-3.5" />}
                    {parsedResult.type === 'task' && <CheckSquare className="w-3.5 h-3.5" />}
                    <span className="capitalize">{parsedResult.type}</span>
                  </span>

                  <span className="font-bold text-white">{parsedResult.title}</span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  {parsedResult.shoppingList && (
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                      List: {parsedResult.shoppingList}
                    </span>
                  )}
                  {parsedResult.dayOfWeek && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                      {parsedResult.dayOfWeek} {parsedResult.mealType}
                    </span>
                  )}
                  {parsedResult.dueDate && (
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                      Due: {parsedResult.dueDate}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="text-[11px] text-slate-400">
              Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-slate-300">Enter ↵</kbd> to add instantaneously
            </div>

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 via-indigo-600 to-purple-600 hover:from-teal-400 hover:to-purple-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-teal-500/20"
            >
              <span>Create Item</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
