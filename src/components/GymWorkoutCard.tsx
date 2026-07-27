import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../store/useStore';
import { Dumbbell, Pencil, Check, X, Plus } from 'lucide-react';
import { DayOfWeek } from '../types';

export const GymWorkoutCard: React.FC = () => {
  const { gymSplits, gymCompletedDays, toggleGymWorkoutCompleted, updateGymSplitFocusTitle, triggerConfetti } = useStore();

  const daysOfWeek: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Determine current day of week
  const todayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday...
  const todayDayName: DayOfWeek = daysOfWeek[todayIndex === 0 ? 6 : todayIndex - 1];

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(todayDayName);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCustomInputOpen, setIsCustomInputOpen] = useState(false);
  const [customInputText, setCustomInputText] = useState('');

  const workoutCategories = [
    'Rest Day',
    'Recovery Day',
    'Arms',
    'Chest',
    'Back',
    'Shoulders',
    'Legs',
    'Glutes',
    'Push',
    'Pull',
    'Full Body',
    'Cardio',
    'Core'
  ];

  const currentSplit = gymSplits.find(s => s.day === selectedDay) || { day: selectedDay, focusTitle: 'Rest Day', exercises: [] };
  const currentWorkoutType = currentSplit.focusTitle || 'Rest Day';
  const isCompleted = !!gymCompletedDays[selectedDay];

  const toggleWorkoutCompleted = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    toggleGymWorkoutCompleted(selectedDay);
  };

  const handleSelectCategory = (category: string) => {
    updateGymSplitFocusTitle(selectedDay, category);
    setIsEditModalOpen(false);
    setIsCustomInputOpen(false);
    triggerConfetti();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInputText.trim()) {
      updateGymSplitFocusTitle(selectedDay, customInputText.trim());
      setCustomInputText('');
      setIsCustomInputOpen(false);
      setIsEditModalOpen(false);
      triggerConfetti();
    }
  };

  return (
    <div className="aura-card" style={{ marginBottom: 0 }}>
      {/* Top Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'var(--accent-rose-soft)',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-rose)',
            flexShrink: 0
          }}>
            <Dumbbell size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>
              Gym & Workout Split
            </h3>
          </div>
        </div>

        <button
          onClick={() => setIsEditModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-tertiary)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-color)',
            fontWeight: 600,
            fontSize: '0.78rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title="Edit workout for this day"
        >
          <Pencil size={13} />
          <span>Edit</span>
        </button>
      </div>

      {/* Weekday Buttons Row */}
      <div className="scroll-hide" style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px' }}>
        {daysOfWeek.map((day) => {
          const isSelected = selectedDay === day;
          const isToday = todayDayName === day;
          const isDayDone = !!gymCompletedDays[day];
          const shortName = day.substring(0, 3);

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: isSelected ? '1px solid var(--accent-rose)' : '1px solid var(--border-color)',
                background: isSelected ? 'var(--accent-rose-soft)' : 'var(--bg-tertiary)',
                color: isSelected ? 'var(--accent-rose)' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: isSelected ? 800 : 500,
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>{shortName}</span>
              {isDayDone && (
                <Check size={12} strokeWidth={3} color={isSelected ? 'var(--accent-rose)' : 'var(--accent-success)'} />
              )}
              {!isDayDone && isToday && (
                <span style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor: isSelected ? 'var(--accent-rose)' : 'var(--accent-primary)'
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Selected Day Workout Display Card */}
      <div 
        style={{
          background: isCompleted ? 'var(--bg-card-hover)' : 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          border: isCompleted ? '1px solid var(--accent-success)' : '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
          {/* 1-Tap Completion Checkbox */}
          <div 
            onClick={toggleWorkoutCompleted}
            className={`checkbox-custom ${isCompleted ? 'checked' : ''}`}
            style={{ width: '28px', height: '28px', cursor: 'pointer' }}
            title={isCompleted ? "Mark workout incomplete" : "Mark workout complete"}
          >
            {isCompleted && <Check size={16} strokeWidth={3} />}
          </div>

          <div onClick={toggleWorkoutCompleted} style={{ cursor: 'pointer', flex: 1 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>
              {selectedDay} {selectedDay === todayDayName && '• Today'}
            </div>
            <div style={{ 
              fontSize: '1.3rem', 
              fontWeight: 800, 
              color: isCompleted ? 'var(--text-tertiary)' : 'var(--text-primary)', 
              letterSpacing: '-0.3px',
              textDecoration: isCompleted ? 'line-through' : 'none'
            }}>
              {currentWorkoutType}
            </div>
          </div>
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsEditModalOpen(true);
          }}
          style={{ 
            background: 'var(--accent-rose-soft)', 
            borderRadius: 'var(--radius-full)', 
            padding: '8px 14px', 
            fontSize: '0.78rem', 
            fontWeight: 700, 
            color: 'var(--accent-rose)',
            border: '1px solid var(--accent-rose)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer'
          }}
        >
          <span>Change</span>
        </button>
      </div>

      {/* Edit Workout Type Modal */}
      {isEditModalOpen && createPortal(
        <div 
          onClick={() => setIsEditModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            padding: '20px',
            boxSizing: 'border-box'
          }}
        >
          <div 
            className="animate-pop-in"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              width: '100%',
              maxWidth: '420px',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-color)',
              maxHeight: '80vh',
              overflowY: 'auto',
              margin: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Assign Workout Type
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                  Choose workout for {selectedDay}
                </p>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="icon-btn"
                style={{ width: '32px', height: '32px', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Category Options List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '16px' }}>
              {workoutCategories.map((cat) => {
                const isSelected = currentWorkoutType.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    onClick={() => handleSelectCategory(cat)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '2px solid var(--accent-rose)' : '1px solid var(--border-color)',
                      background: isSelected ? 'var(--accent-rose-soft)' : 'var(--bg-tertiary)',
                      color: isSelected ? 'var(--accent-rose)' : 'var(--text-primary)',
                      fontSize: '0.88rem',
                      fontWeight: isSelected ? 800 : 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{cat}</span>
                    {isSelected && <Check size={14} strokeWidth={3} />}
                  </button>
                );
              })}
            </div>

            {/* Custom Workout Option */}
            {!isCustomInputOpen ? (
              <button
                onClick={() => setIsCustomInputOpen(true)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--border-color)',
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={16} /> Custom Workout...
              </button>
            ) : (
              <form onSubmit={handleCustomSubmit} style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <input
                  type="text"
                  placeholder="Enter custom name (e.g. Pilates & Swimming)"
                  value={customInputText}
                  onChange={(e) => setCustomInputText(e.target.value)}
                  className="input-text"
                  style={{ fontSize: '0.85rem', padding: '10px 12px', flex: 1 }}
                  autoFocus
                />
                <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '10px 16px', fontSize: '0.85rem' }}>
                  Save
                </button>
              </form>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default GymWorkoutCard;
