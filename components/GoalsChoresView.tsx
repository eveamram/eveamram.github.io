'use client';

import React from 'react';
import { Target, RefreshCw, Flame, CheckCircle2, Circle } from 'lucide-react';
import { LifeGoal, RecurringChore } from '@/types';

interface GoalsChoresViewProps {
  goals: LifeGoal[];
  chores: RecurringChore[];
  onToggleChore: (id: string) => void;
}

export const GoalsChoresView: React.FC<GoalsChoresViewProps> = ({
  goals,
  chores,
  onToggleChore,
}) => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-20 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Target className="w-6 h-6 text-teal-400" />
            <span>Personal Goals & Recurring Household Chores</span>
          </h1>
          <p className="text-xs text-slate-400">Track habit milestones and automated recurring household schedules.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goals Progress */}
        <div className="glass-panel rounded-2xl border border-white/10 p-5 space-y-4">
          <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Habits & Goal Milestones</span>
          </h2>

          <div className="space-y-4">
            {goals.map(g => (
              <div key={g.id} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{g.title}</span>
                  <span className="text-xs font-mono font-bold text-teal-300">{g.currentProgress} / {g.targetProgress} {g.unit}</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ backgroundColor: g.color, width: `${(g.currentProgress / g.targetProgress) * 100}%` }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>Streak: <strong className="text-amber-300">{g.streakDays} Days</strong></span>
                  <span>Category: {g.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recurring Chores */}
        <div className="glass-panel rounded-2xl border border-white/10 p-5 space-y-4">
          <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-indigo-400" />
            <span>Recurring Household Chores</span>
          </h2>

          <div className="space-y-3">
            {chores.map(c => (
              <div key={c.id} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => onToggleChore(c.id)} className="p-1 text-slate-400 hover:text-teal-400">
                    {c.isDoneThisCycle ? <CheckCircle2 className="w-5 h-5 text-teal-400" /> : <Circle className="w-5 h-5" />}
                  </button>
                  <div>
                    <h4 className={`text-xs font-bold ${c.isDoneThisCycle ? 'line-through text-slate-400' : 'text-white'}`}>{c.title}</h4>
                    <span className="text-[10px] text-slate-400 mt-0.5">{c.frequency} • Next due: {c.nextDueDate}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-white/10 text-indigo-300 font-bold">{c.frequency}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
