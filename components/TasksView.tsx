'use client';

import React, { useState } from 'react';
import { CheckSquare, Plus, Circle, CheckCircle2, Inbox, Calendar, Star, Clock, Filter, Tag, Trash2 } from 'lucide-react';
import { LifeTask, Priority, TaskCategory } from '@/types';
import { SmartQuickAddModal } from '@/components/SmartQuickAddModal';

interface TasksViewProps {
  tasks: LifeTask[];
  onAddTask: (task: LifeTask) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (val: boolean) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  isQuickAddOpen,
  setIsQuickAddOpen,
}) => {
  const [section, setSection] = useState<'today' | 'inbox' | 'upcoming' | 'completed'>('today');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredTasks = tasks.filter(t => {
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    if (section === 'today') return !t.isCompleted && !t.isInbox;
    if (section === 'inbox') return !t.isCompleted && t.isInbox;
    if (section === 'upcoming') return !t.isCompleted;
    if (section === 'completed') return t.isCompleted;
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-20 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-teal-400" />
            <span>Things 3 Style Task Manager</span>
          </h1>
          <p className="text-xs text-slate-400">Zero friction task organization with natural language quick add and subtasks.</p>
        </div>

        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Section Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 glass-panel rounded-2xl border border-white/10">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSection('today')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              section === 'today' ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Today</span>
          </button>

          <button
            onClick={() => setSection('inbox')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              section === 'inbox' ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Inbox</span>
          </button>

          <button
            onClick={() => setSection('upcoming')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              section === 'upcoming' ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Upcoming</span>
          </button>

          <button
            onClick={() => setSection('completed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              section === 'completed' ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed</span>
          </button>
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="Personal">Personal</option>
          <option value="Work">Work</option>
          <option value="Home">Home</option>
          <option value="Health">Health</option>
          <option value="Finance">Finance</option>
        </select>
      </div>

      {/* Task List */}
      <div className="glass-panel rounded-2xl border border-white/10 p-5 space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-teal-400/60 mx-auto" />
            <h3 className="text-sm font-bold text-white">No tasks in this section</h3>
            <p className="text-xs text-slate-400">Use Smart Quick Add (Cmd+N) to capture anything on your mind.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition-all space-y-2 ${
                task.isCompleted ? 'bg-white/2 border-white/5 opacity-60' : 'bg-white/5 border-white/10 hover:border-teal-500/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className="p-1 text-slate-400 hover:text-teal-400 transition-colors"
                  >
                    {task.isCompleted ? <CheckCircle2 className="w-5 h-5 text-teal-400" /> : <Circle className="w-5 h-5" />}
                  </button>

                  <div>
                    <h3 className={`text-xs font-bold ${task.isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                      {task.title}
                    </h3>
                    {task.notes && <p className="text-[11px] text-slate-400 mt-0.5">{task.notes}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-slate-300">
                    {task.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    task.priority === 'High' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                    task.priority === 'Medium' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                    'bg-slate-500/20 text-slate-300 border-slate-500/30'
                  }`}>
                    {task.priority}
                  </span>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Subtasks */}
              {task.subtasks && task.subtasks.length > 0 && (
                <div className="ml-8 pt-2 space-y-1 border-t border-white/5">
                  {task.subtasks.map(s => (
                    <div key={s.id} className="flex items-center gap-2 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                      <span>{s.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
