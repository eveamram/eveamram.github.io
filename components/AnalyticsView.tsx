'use client';

import React from 'react';
import { BarChart3, Flame, CheckCircle2, DollarSign, Calendar, TrendingUp } from 'lucide-react';

interface AnalyticsViewProps {
  streakDays: number;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  streakDays,
}) => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-20 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-teal-400" />
            <span>Life Productivity Analytics</span>
          </h1>
          <p className="text-xs text-slate-400">Weekly task velocity, shopping spending trends, and habit consistency.</p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-300 flex items-center gap-1">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Active Streak: {streakDays} Days</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Tasks Completed (Week)</span>
          <div className="text-2xl font-black text-white font-mono">28 Tasks</div>
          <p className="text-[11px] text-teal-400 font-bold">↑ 14% productivity velocity</p>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Shopping Spending</span>
          <div className="text-2xl font-black text-purple-300 font-mono">$184.50</div>
          <p className="text-[11px] text-purple-300 font-bold">Within monthly budget</p>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Meal Planning Rate</span>
          <div className="text-2xl font-black text-amber-300 font-mono">100%</div>
          <p className="text-[11px] text-amber-300 font-bold">7 Days Planned</p>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Habit Consistency</span>
          <div className="text-2xl font-black text-emerald-300 font-mono">94%</div>
          <p className="text-[11px] text-emerald-400 font-bold">Top Tier Discipline</p>
        </div>
      </div>
    </div>
  );
};
