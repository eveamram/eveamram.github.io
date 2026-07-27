import React from 'react';
import { useStore } from '../store/useStore';
import { SmartAssistant } from './SmartAssistant';
import { GymWorkoutCard } from './GymWorkoutCard';
import { DailyRoutineCard } from './DailyRoutineCard';
import { ClassesScheduleCard } from './ClassesScheduleCard';
import { TasksView } from './TasksView';
import { 
  CheckCircle2, 
  Flame, 
  Bell,
  Plus, 
  Search, 
  ChevronRight,
  Calendar,
  Clock
} from 'lucide-react';

interface HomeDashboardViewProps {
  onOpenQuickAdd: (context?: string) => void;
  onOpenCommandPalette: () => void;
}

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({ onOpenQuickAdd, onOpenCommandPalette }) => {
  const { 
    currentProfile, 
    tasks, 
    habits, 
    reminders,
    setActiveTab
  } = useStore();

  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Stats calculation
  const completedHabitsCount = habits.filter(h => h.completedToday).length;
  const habitsTotal = habits.length || 1;
  const habitPercentage = Math.round((completedHabitsCount / habitsTotal) * 100);

  const completedTasksCount = tasks.filter(t => t.completed).length;
  const tasksTotal = tasks.length || 1;
  const taskPercentage = Math.round((completedTasksCount / tasksTotal) * 100);

  // Active upcoming reminder
  const activeReminders = reminders.filter(r => !r.dismissed);
  const nextReminder = activeReminders[0];

  return (
    <div style={{ padding: '0 20px', maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Welcome Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-tertiary) 100%)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '1.4rem' }}>{currentProfile.avatarEmoji}</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {currentProfile.name}'s Workspace
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            {getGreeting()}, {currentProfile.name}
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Here is your daily life overview, tasks, and routines for today.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={onOpenCommandPalette}
            className="btn-secondary"
            style={{ padding: '10px 16px', fontSize: '0.85rem', gap: '6px' }}
          >
            <Search size={16} /> <kbd style={{ fontSize: '0.72rem', opacity: 0.8 }}>⌘K</kbd>
          </button>
          <button 
            onClick={() => onOpenQuickAdd('task')}
            className="btn-primary"
            style={{ width: 'auto', padding: '10px 18px', fontSize: '0.85rem', gap: '6px' }}
          >
            <Plus size={16} /> Quick Add
          </button>
        </div>
      </div>

      {/* Today Progress & Important Reminder Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {/* Habit Completion Progress */}
        <div className="aura-card" style={{ marginBottom: 0, padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              Habit Progress
            </span>
            <Flame size={18} color="var(--accent-warning)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {completedHabitsCount}/{habits.length}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              ({habitPercentage}% done)
            </span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ width: `${habitPercentage}%`, height: '100%', background: 'linear-gradient(90deg, #FF9500, #FFCC00)', transition: 'width 0.4s ease' }} />
          </div>
        </div>

        {/* Task Completion Progress */}
        <div className="aura-card" style={{ marginBottom: 0, padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              Tasks Completed
            </span>
            <CheckCircle2 size={18} color="var(--accent-success)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {completedTasksCount}/{tasks.length}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              ({taskPercentage}% done)
            </span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ width: `${taskPercentage}%`, height: '100%', background: 'linear-gradient(90deg, #34C759, #30B0C7)', transition: 'width 0.4s ease' }} />
          </div>
        </div>

        {/* Important Reminder Card */}
        <div 
          className="aura-card aura-card-interactive" 
          onClick={() => setActiveTab('reminders')}
          style={{ marginBottom: 0, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Bell size={14} color="var(--accent-rose)" /> Important Reminder
            </span>
            <button style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}>
              View All <ChevronRight size={12} />
            </button>
          </div>

          {nextReminder ? (
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                {nextReminder.title}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                <span className="badge-pill" style={{ background: 'var(--accent-rose-soft)', color: 'var(--accent-rose)', padding: '2px 8px', fontSize: '0.7rem' }}>
                  {nextReminder.category}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Calendar size={12} /> Due: {nextReminder.dueDate}
                </span>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '0.88rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
              No upcoming urgent reminders set.
            </div>
          )}
        </div>
      </div>

      {/* Main Content Split Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', alignItems: 'start' }}>
        {/* Left Column: Smart Assistant, Gym Workout, and To-Do List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <SmartAssistant />
          <TasksView />
          <GymWorkoutCard />
        </div>

        {/* Right Column: Daily Routine & Schedule */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <DailyRoutineCard />
          <ClassesScheduleCard />
        </div>
      </div>
    </div>
  );
};
