import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Dumbbell, Flame, Clock, Check } from 'lucide-react';
import { DayOfWeek } from '../types';

export const GymWorkoutCard: React.FC = () => {
  const { gymSplits, triggerConfetti } = useStore();

  const daysOfWeek: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Determine current day of week
  const todayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday...
  const todayDayName: DayOfWeek = daysOfWeek[todayIndex === 0 ? 6 : todayIndex - 1];

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(todayDayName);
  const [completedToday, setCompletedToday] = useState(false);

  const currentSplit = gymSplits.find(s => s.day === selectedDay) || gymSplits[0];

  const handleToggleComplete = () => {
    setCompletedToday(prev => {
      const next = !prev;
      if (next) triggerConfetti();
      return next;
    });
  };

  return (
    <div className="aura-card" style={{ marginBottom: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: completedToday ? 'var(--accent-success-soft)' : 'var(--accent-rose-soft)',
            borderRadius: 'var(--radius-md)',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: completedToday ? 'var(--accent-success)' : 'var(--accent-rose)'
          }}>
            <Dumbbell size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Exercise Day Focus
              </h3>
              {selectedDay === todayDayName && (
                <span className="badge-pill" style={{ background: 'var(--accent-rose-soft)', color: 'var(--accent-rose)', padding: '2px 8px', fontSize: '0.7rem' }}>
                  <Flame size={10} /> Today
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '2px' }}>
              {selectedDay}'s Scheduled Workout Focus
            </p>
          </div>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="scroll-hide" style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '14px' }}>
        {daysOfWeek.map((day) => {
          const isSelected = selectedDay === day;
          const isToday = todayDayName === day;
          const shortName = day.substring(0, 3);

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                border: isToday ? '1px solid var(--accent-rose)' : '1px solid var(--border-color)',
                background: isSelected ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: isSelected ? '#FFFFFF' : isToday ? 'var(--accent-rose)' : 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: isSelected || isToday ? 700 : 500,
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.2s ease'
              }}
            >
              {shortName}
            </button>
          );
        })}
      </div>

      {/* Time of Day Focus Banner */}
      <div style={{
        background: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {selectedDay} Time of Day Focus
            </span>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              {currentSplit.focusTitle}
            </h4>
          </div>

          <button
            onClick={handleToggleComplete}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: 'var(--radius-full)',
              background: completedToday ? 'var(--accent-success)' : 'var(--accent-rose)',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {completedToday ? <Check size={14} strokeWidth={3} /> : <Clock size={14} />}
            <span>{completedToday ? 'Workout Done' : 'Mark Done'}</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
          <span className="badge-pill" style={{ background: 'var(--accent-rose-soft)', color: 'var(--accent-rose)', padding: '6px 12px', fontSize: '0.78rem', fontWeight: 700 }}>
            ☀️ Morning: Abs & Core Circuit
          </span>
          <span className="badge-pill" style={{ background: 'var(--accent-purple-soft)', color: 'var(--accent-purple)', padding: '6px 12px', fontSize: '0.78rem', fontWeight: 700 }}>
            🚴 Afternoon: Biking Session
          </span>
          <span className="badge-pill" style={{ background: 'var(--accent-soft)', color: 'var(--accent-primary)', padding: '6px 12px', fontSize: '0.78rem', fontWeight: 700 }}>
            🏃 Evening: Outdoor Run
          </span>
        </div>
      </div>
    </div>
  );
};
