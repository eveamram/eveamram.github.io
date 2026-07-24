'use client';

import React, { useState } from 'react';
import { Utensils, Plus, ShoppingBag, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import { MealPlan, DayOfWeek, MealType, ShoppingItem } from '@/types';
import { triggerConfetti } from '@/lib/utils';

interface MealPlannerViewProps {
  meals: MealPlan[];
  onAddMealPlan: (meal: MealPlan) => void;
  onAddShoppingItem: (item: ShoppingItem) => void;
}

export const MealPlannerView: React.FC<MealPlannerViewProps> = ({
  meals,
  onAddMealPlan,
  onAddShoppingItem,
}) => {
  const days: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const mealTypes: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Mon');
  const [isExported, setIsExported] = useState(false);

  const dayMeals = meals.filter(m => m.dayOfWeek === selectedDay);

  const handleGenerateGroceryList = () => {
    let count = 0;
    meals.forEach(m => {
      m.ingredients.forEach(ing => {
        onAddShoppingItem({
          id: `shop_gen_${Date.now()}_${count}`,
          listName: 'Groceries',
          title: ing,
          quantity: 1,
          unit: 'item',
          category: 'Produce',
          estimatedPrice: 4.50,
          isBought: false,
          addedAt: new Date().toISOString(),
        });
        count++;
      });
    });

    setIsExported(true);
    triggerConfetti();
    setTimeout(() => setIsExported(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-20 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Utensils className="w-6 h-6 text-amber-400" />
            <span>Weekly Meal Planner & Grocery Exporter</span>
          </h1>
          <p className="text-xs text-slate-400">Plan Monday through Sunday recipes and automatically generate your shopping list with 1-click.</p>
        </div>

        <button
          onClick={handleGenerateGroceryList}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{isExported ? '✓ Added to Groceries!' : 'Auto-Generate Grocery List'}</span>
        </button>
      </div>

      {/* Days Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {days.map(d => (
          <button
            key={d}
            onClick={() => setSelectedDay(d)}
            className={`px-4 py-3 rounded-2xl border text-xs font-bold transition-all shrink-0 ${
              selectedDay === d
                ? 'bg-amber-950/40 border-amber-500/50 text-white ring-1 ring-amber-500/30'
                : 'glass-panel border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <div>{d}</div>
            <div className="text-[10px] text-amber-300 font-mono mt-0.5">
              {meals.filter(m => m.dayOfWeek === d).length} Meals
            </div>
          </button>
        ))}
      </div>

      {/* Meals Grid for Selected Day */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mealTypes.map(type => {
          const typeMeal = dayMeals.find(m => m.mealType === type);

          return (
            <div key={type} className="glass-panel rounded-2xl border border-white/10 p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400">{type}</span>
                {typeMeal && <span className="text-[10px] text-slate-400 font-mono">{typeMeal.prepTimeMins} mins prep</span>}
              </div>

              {typeMeal ? (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white">{typeMeal.title}</h3>
                  {typeMeal.notes && <p className="text-xs text-slate-400">{typeMeal.notes}</p>}

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Ingredients</span>
                    <div className="flex flex-wrap gap-1.5">
                      {typeMeal.ingredients.map((ing, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-amber-200">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-slate-500 italic">
                  No {type.toLowerCase()} planned for {selectedDay}.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
