import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { SmartAssistant } from './SmartAssistant';
import { GymWorkoutCard } from './GymWorkoutCard';
import { DailyRoutineCard } from './DailyRoutineCard';
import { ClassesScheduleCard } from './ClassesScheduleCard';
import { QuoteCard } from './QuoteCard';
import { 
  CheckCircle2, 
  Flame, 
  Droplet, 
  Plus, 
  Search, 
  ChevronRight,
  AlertCircle,
  Quote,
  Eye,
  EyeOff
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
    waterGlassesToday, 
    incrementWater, 
    decrementWater,
    setActiveTab,
    toggleTask
  } = useStore();

  const [showWaterWidget, setShowWaterWidget] = useState(false);

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

  const topPriorities = tasks.filter(t => !t.completed && t.priority === 'high').slice(0, 3);

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
            Here is your daily life overview and focus areas for today.
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

      {/* Today Progress Grid */}
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

        {/* Customizable Widget: Quote or Hydration */}
        {showWaterWidget ? (
          <div className="aura-card" style={{ marginBottom: 0, padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                Daily Hydration
              </span>
              <button 
                onClick={() => setShowWaterWidget(false)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
                title="Swap to Quote of the Day"
              >
                <Quote size={14} /> Quote
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {waterGlassesToday}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginLeft: '4px' }}>/ 8 glasses</span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button 
                  onClick={decrementWater}
                  className="btn-secondary"
                  style={{ width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  -
                </button>
                <button 
                  onClick={incrementWater}
                  className="btn-primary"
                  style={{ width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <QuoteCard />
            <button 
              onClick={() => setShowWaterWidget(true)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '130px',
                background: 'none',
                border: 'none',
                color: 'var(--text-tertiary)',
                cursor: 'pointer',
                fontSize: '0.7rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
              title="Show Hydration Tracker"
            >
              <Droplet size={12} color="var(--accent-primary)" /> Water
            </button>
          </div>
        )}
      </div>

      {/* Main Content Split Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', alignItems: 'start' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <SmartAssistant />
          <GymWorkoutCard />

          {/* Top Priorities Card */}
          {topPriorities.length > 0 && (
            <div className="aura-card" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={18} color="var(--accent-rose)" /> Top Priorities
                </h3>
                <button 
                  onClick={() => setActiveTab('tasks')}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                >
                  View All <ChevronRight size={14} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {topPriorities.map(task => (
                  <div 
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-tertiary)',
                      cursor: 'pointer'
                    }}
                  >
                    <div className="checkbox-custom" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>
                      {task.title}
                    </span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-rose)', textTransform: 'uppercase', padding: '2px 6px', borderRadius: '4px', background: 'var(--accent-rose-soft)' }}>
                      High
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <DailyRoutineCard />
          <ClassesScheduleCard />
        </div>
      </div>
    </div>
  );
};
