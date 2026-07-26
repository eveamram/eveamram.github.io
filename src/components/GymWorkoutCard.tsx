import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Dumbbell, Flame, Clock, Check, Edit2 } from 'lucide-react';
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
    'Push (Chest, Shoulders & Triceps)',
    'Pull (Back & Biceps)',
    'Legs & Lower Body',
    'Abs & Core Circuit',
    'Biking & Cycling Session',
    'Outdoor Run',
    'Morning Abs & Evening Biking',
    'Rest & Active Recovery'
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
                Gym & Workout Split
              </h3>
              {selectedDay === todayDayName && (
                <span className="badge-pill" style={{ background: 'var(--accent-rose-soft)', color: 'var(--accent-rose)', padding: '2px 8px', fontSize: '0.7rem' }}>
                  <Flame size={10} /> Today
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '2px' }}>
              Select day & choose your workout focus
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

      {/* Selected Day Focus Banner */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {selectedDay}'s Workout Focus
              </span>
              <button
                onClick={() => setIsEditingTitle(prev => !prev)}
                className="icon-btn"
                style={{ width: '24px', height: '24px' }}
                title="Change workout focus for this day"
              >
                <Edit2 size={12} />
              </button>
            </div>

            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
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

        {/* Change Split / Focus Picker */}
        <div style={{ marginTop: '4px' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '8px' }}>
            Choose Focus for {selectedDay}:
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
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
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {preset}
                </button>
              );
            })}
          </div>

          {isEditingTitle && (
            <form onSubmit={handleCustomTitleSubmit} style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Or type custom focus title..."
                value={customTitleInput}
                onChange={(e) => setCustomTitleInput(e.target.value)}
                className="input-text"
                style={{ fontSize: '0.85rem', padding: '6px 10px', flex: 1 }}
                autoFocus
              />
              <button type="submit" className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                Save
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
