import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Dumbbell, Check, Plus, Flame } from 'lucide-react';
import { DayOfWeek, ExerciseItem } from '../types';

export const GymWorkoutCard: React.FC = () => {
  const { gymSplits, toggleExerciseToday, addExerciseToDay } = useStore();

  const daysOfWeek: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Determine current day of week
  const todayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday...
  const todayDayName: DayOfWeek = daysOfWeek[todayIndex === 0 ? 6 : todayIndex - 1];

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(todayDayName);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [exerciseName, setExerciseName] = useState('');
  const [setsReps, setSetsReps] = useState('');

  const currentSplit = gymSplits.find(s => s.day === selectedDay) || gymSplits[0];
  const todayStr = new Date().toISOString().split('T')[0];

  const completedCount = currentSplit.exercises.filter((ex: ExerciseItem) => ex.completedDates.includes(todayStr)).length;
  const totalCount = currentSplit.exercises.length;
  const isFullyCompleted = totalCount > 0 && completedCount === totalCount;

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exerciseName.trim()) return;

    addExerciseToDay(selectedDay, exerciseName.trim(), setsReps.trim() || '3 sets x 10-12 reps');
    setExerciseName('');
    setSetsReps('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="aura-card" style={{ marginBottom: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: isFullyCompleted ? 'var(--accent-success-soft)' : 'var(--accent-rose-soft)',
            borderRadius: 'var(--radius-md)',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isFullyCompleted ? 'var(--accent-success)' : 'var(--accent-rose)'
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
              {currentSplit.focusTitle}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="icon-btn"
          title="Add Exercise"
          style={{ width: '32px', height: '32px' }}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Day Selector Tabs */}
      <div className="scroll-hide" style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '10px' }}>
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

      {/* Exercise List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {currentSplit.exercises.map((ex: ExerciseItem) => {
          const isCompleted = ex.completedDates.includes(todayStr);

          return (
            <div
              key={ex.id}
              onClick={() => toggleExerciseToday(ex.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: isCompleted ? 'var(--bg-tertiary)' : 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                opacity: isCompleted ? 0.65 : 1
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className={`checkbox-custom ${isCompleted ? 'checked' : ''}`}>
                  {isCompleted && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                </div>
                <div>
                  <span style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    textDecoration: isCompleted ? 'line-through' : 'none'
                  }}>
                    {ex.name}
                  </span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>
                    {ex.setsReps}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {currentSplit.exercises.length === 0 && (
          <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
            No exercises added for {selectedDay}. Tap "+" above to add your workout!
          </div>
        )}
      </div>

      {/* Add Exercise Modal Sheet */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '4px' }}>Add Exercise</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '16px' }}>
              For {selectedDay}'s {currentSplit.focusTitle}
            </p>

            <form onSubmit={handleAddExercise}>
              <div className="form-group">
                <label className="form-label">Exercise Name</label>
                <input
                  type="text"
                  placeholder="e.g. Incline DB Press, Cable Flyes..."
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  className="input-text"
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Sets & Reps</label>
                <input
                  type="text"
                  placeholder="e.g. 4 sets x 10-12 reps"
                  value={setsReps}
                  onChange={(e) => setSetsReps(e.target.value)}
                  className="input-text"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Save Exercise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
