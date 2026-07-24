'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { CalendarEvent } from '@/types';

interface CalendarViewProps {
  events: CalendarEvent[];
  onOpenQuickAdd: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  onOpenQuickAdd,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingArray = Array.from({ length: firstDayIndex }, (_, i) => i);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-20 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-teal-400" />
            <span>Integrated Life Calendar</span>
          </h1>
          <p className="text-xs text-slate-400">Unified schedule for tasks, meals, appointments, birthdays, and chores.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button onClick={handlePrevMonth} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-white">{monthNames[month]} {year}</span>
            <button onClick={handleNextMonth} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenQuickAdd}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-bold text-xs flex items-center gap-1 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="glass-panel rounded-2xl border border-white/10 p-4 space-y-2">
        <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 uppercase py-2 border-b border-white/10">
          <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {paddingArray.map((_, i) => (
            <div key={`pad-${i}`} className="h-24 rounded-xl bg-white/[0.01] border border-white/5 opacity-30" />
          ))}

          {daysArray.map(day => {
            const isToday = day === new Date().getDate() && month === new Date().getMonth();
            const dayEvents = events.filter(e => {
              const d = new Date(e.eventDate);
              return d.getDate() === day && d.getMonth() === month;
            });

            return (
              <div
                key={day}
                className={`h-24 p-2 rounded-xl border flex flex-col justify-between ${
                  isToday ? 'bg-teal-950/40 border-teal-500/50 ring-1 ring-teal-500/30' : 'bg-white/5 border-white/5'
                }`}
              >
                <span className={`text-xs font-bold ${isToday ? 'w-5 h-5 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center' : 'text-slate-300'}`}>
                  {day}
                </span>

                <div className="space-y-1 overflow-y-auto max-h-12">
                  {dayEvents.map(evt => (
                    <div key={evt.id} className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white truncate" style={{ backgroundColor: evt.color }}>
                      {evt.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
