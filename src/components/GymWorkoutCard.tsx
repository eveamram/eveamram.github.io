import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Dumbbell, Flame, Check, Edit2, Plus } from 'lucide-react';
import { DayOfWeek } from '../types';

export const GymWorkoutCard: React.FC = () => {
  const { gymSplits, updateGymSplitFocusTitle, triggerConfetti } = useStore();

  const daysOfWeek: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Determine current day of week
  const todayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday...
  const todayDayName: DayOfWeek = daysOfWeek[todayIndex === 0 ? 6 : todayIndex - 1];

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(todayDayName);
  const [completedToday, setCompletedToday] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [customTitleInput, setCustomTitleInput] = useState('');

  const currentSplit = gymSplits.find(s => s.day === selectedDay) || gymSplits[0];

  const splitPresets = [
    'Abs & Biking',
    'Outdoor Run',
    'Core & Biking',
    'Run & Abs',
    'Biking & Cardio',
    'Abs & Trail Run',
    'Rest & Recovery'
  ];

  const handleToggleComplete = () => {
    setCompletedToday(prev => {
      const next = !prev;
      if (next) triggerConfetti();
      return next;
    });
  };

  const handleSelectPreset = (title: string) => {
    updateGymSplitFocusTitle(selectedDay, title);
    setIsEditingTitle(false);
  };

  const handleCustomTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTitleInput.trim()) {
      updateGymSplitFocusTitle(selectedDay, customTitleInput.trim());
      setCustomTitleInput('');
    }
    setIsEditingTitle(false);
  };

  return (
    <div className="aura-card" style={{ marginBottom: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: completedToday ? 'var(--accent-success-soft)' : 'var(--accent-rose-soft)',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: completedToday ? 'var(--accent-success)' : 'var(--accent-rose)'
          }}>
            <Dumbbell size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
                Gym & Workout Split
              </h3>
              {selectedDay === todayDayName && (
                <span className="badge-pill" style={{ background: 'var(--accent-rose-soft)', color: 'var(--accent-rose)', padding: '2px 8px', fontSize: '0.7rem' }}>
                  <Flame size={10} /> Today
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Today is <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{currentSplit.focusTitle}</span> day
              </p>
              <button
                onClick={() => setIsEditingTitle(prev => !prev)}
                className="icon-btn"
                style={{ width: '22px', height: '22px', border: 'none', background: 'transparent' }}
                title="Change workout focus for this day"
              >
                <Edit2 size={13} color="var(--text-tertiary)" />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleToggleComplete}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            background: completedToday ? 'var(--accent-success)' : 'var(--bg-tertiary)',
            color: completedToday ? '#FFFFFF' : 'var(--text-secondary)',
            border: completedToday ? 'none' : '1px solid var(--border-color)',
            fontWeight: 700,
            fontSize: '0.78rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {completedToday && <Check size={13} strokeWidth={3} />}
          <span>{completedToday ? 'Completed' : 'Mark Done'}</span>
        </button>
      </div>

      {/* Day Selector Tabs */}
      <div className="scroll-hide" style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '12px' }}>
        {daysOfWeek.map((day) => {
          const isSelected = selectedDay === day;
          const isToday = todayDayName === day;
          const shortName = day.substring(0, 3);

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: isToday ? '1px solid var(--accent-rose)' : '1px solid var(--border-color)',
                background: isSelected ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: isSelected ? '#FFFFFF' : isToday ? 'var(--accent-rose)' : 'var(--text-secondary)',
                fontSize: '0.78rem',
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

      {/* Split Selector / Custom Focus Options */}
      {isEditingTitle && (
        <div style={{
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
          border: '1px solid var(--border-color)',
          marginTop: '8px'
        }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '8px' }}>
            Choose focus for {selectedDay}:
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
            {splitPresets.map((preset) => {
              const isActive = currentSplit.focusTitle === preset;
              return (
                <button
                  key={preset}
                  onClick={() => handleSelectPreset(preset)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 'var(--radius-full)',
                    border: isActive ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    background: isActive ? 'var(--accent-soft)' : 'var(--bg-card)',
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer'
                  }}
                >
                  {preset}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleCustomTitleSubmit} style={{ display: 'flex', gap: '6px' }}>
            <input
              type="text"
              placeholder="Or type custom day focus..."
              value={customTitleInput}
              onChange={(e) => setCustomTitleInput(e.target.value)}
              className="input-text"
              style={{ fontSize: '0.8rem', padding: '6px 10px', flex: 1 }}
              autoFocus
            />
            <button type="submit" className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
              Save
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
