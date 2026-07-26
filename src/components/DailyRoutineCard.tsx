import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { DayOfWeek } from '../types';
import { Check, Calendar, Plus, Trash2, Sparkles } from 'lucide-react';

export const DailyRoutineCard: React.FC = () => {
  const { routines, toggleRoutineItemToday, addRoutineItem, deleteRoutineItem } = useStore();

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const todayIndex = new Date().getDay(); // 0 is Sun, 1 is Mon...
  const todayDayName: DayOfWeek = days[todayIndex === 0 ? 6 : todayIndex - 1]; // map to Mon..Sun index

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(todayDayName);
  const [newRoutineText, setNewRoutineText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const dayRoutines = routines.filter(r => r.day === selectedDay);

  const handleAddRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoutineText.trim()) return;
    addRoutineItem({
      day: selectedDay,
      title: newRoutineText.trim(),
      iconName: 'CheckSquare'
    });
    setNewRoutineText('');
    setIsAdding(false);
  };

  const getDaySubtitle = (day: DayOfWeek) => {
    switch (day) {
      case 'Saturday': return 'Weekend Reset';
      case 'Sunday': return 'Reset for the Week';
      case 'Monday': return 'Week Kickoff';
      default: return 'Daily Routine';
    }
  };

  return (
    <div className="aura-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={16} color="var(--accent-purple)" />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            Daily Routine System
          </span>
        </div>
        <span className="badge-pill" style={{ background: 'var(--accent-purple-soft)', color: 'var(--accent-purple)' }}>
          {getDaySubtitle(selectedDay)}
        </span>
      </div>

      {/* Day Selector Pill Bar */}
      <div className="scroll-hide" style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '12px' }}>
        {days.map((day) => {
          const isSelected = selectedDay === day;
          const isToday = day === todayDayName;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              style={{
                background: isSelected ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                border: '1px solid ' + (isSelected ? 'var(--accent-primary)' : 'var(--border-color)'),
                borderRadius: 'var(--radius-full)',
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: isSelected ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s ease'
              }}
            >
              {day.substring(0, 3)}
              {isToday && (
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: isSelected ? '#FFF' : 'var(--accent-primary)' }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Routine Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
        {dayRoutines.length === 0 ? (
          <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
            No routines set for {selectedDay}. Click "+" below to add one!
          </div>
        ) : (
          dayRoutines.map((r) => {
            const isDone = r.completedDates.includes(todayStr);
            return (
              <div 
                key={r.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-tertiary)',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div 
                  onClick={() => toggleRoutineItemToday(r.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flex: 1 }}
                >
                  <div className={`checkbox-custom ${isDone ? 'checked' : ''}`}>
                    {isDone && <Check size={14} strokeWidth={3} />}
                  </div>
                  <span style={{
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: isDone ? 'var(--text-tertiary)' : 'var(--text-primary)',
                    textDecoration: isDone ? 'line-through' : 'none'
                  }}>
                    {r.title}
                  </span>
                </div>

                <button 
                  onClick={() => deleteRoutineItem(r.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                  title="Remove item"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Add Custom Routine Item */}
      {isAdding ? (
        <form onSubmit={handleAddRoutine} style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
          <input
            type="text"
            placeholder={`Add ${selectedDay} routine item...`}
            value={newRoutineText}
            onChange={(e) => setNewRoutineText(e.target.value)}
            className="input-text"
            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            autoFocus
          />
          <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '8px 16px', fontSize: '0.85rem' }}>
            Add
          </button>
        </form>
      ) : (
        <button 
          onClick={() => setIsAdding(true)}
          className="btn-secondary"
          style={{ width: '100%', fontSize: '0.8rem', padding: '8px' }}
        >
          <Plus size={14} /> Add Routine Item to {selectedDay}
        </button>
      )}
    </div>
  );
};
