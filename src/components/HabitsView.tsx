import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  Flame, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Droplets, 
  Dumbbell, 
  BookOpen, 
  Moon, 
  Pill, 
  HeartPulse, 
  Activity, 
  BedDouble, 
  Footprints, 
  Sparkles 
} from 'lucide-react';

export const HabitsView: React.FC = () => {
  const { habits, toggleHabitToday, addHabit } = useStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newIcon, setNewIcon] = useState('Flame');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplets': return <Droplets size={20} color="var(--accent-primary)" />;
      case 'Dumbbell': return <Dumbbell size={20} color="var(--accent-warning)" />;
      case 'BookOpen': return <BookOpen size={20} color="var(--accent-purple)" />;
      case 'Moon': return <Moon size={20} color="var(--accent-teal)" />;
      case 'Pill': return <Pill size={20} color="var(--accent-rose)" />;
      case 'HeartPulse': return <HeartPulse size={20} color="var(--accent-rose)" />;
      case 'Activity': return <Activity size={20} color="var(--accent-success)" />;
      case 'BedDouble': return <BedDouble size={20} color="var(--accent-purple)" />;
      case 'Footprints': return <Footprints size={20} color="var(--accent-success)" />;
      default: return <Sparkles size={20} color="var(--accent-primary)" />;
    }
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addHabit({
      title: newTitle.trim(),
      iconName: newIcon,
      targetDaysPerWeek: 7
    });

    setNewTitle('');
    setIsAddModalOpen(false);
  };

  const completedCount = habits.filter(h => h.completedToday).length;

  return (
    <div style={{ padding: '0 20px' }}>
      {/* Header & Stats Banner */}
      <div className="aura-card" style={{ background: 'var(--accent-soft)', border: 'none', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Daily Consistency
            </span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              {completedCount} of {habits.length} Done Today
            </h2>
          </div>
          <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Flame size={20} color="var(--accent-warning)" fill="var(--accent-warning)" />
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {Math.max(...habits.map(h => h.streak))}d
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Your Daily Habits
        </h3>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary"
          style={{ width: 'auto', padding: '8px 14px', fontSize: '0.85rem' }}
        >
          <Plus size={16} /> New Habit
        </button>
      </div>

      {/* Habit Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {habits.map((h) => (
          <div 
            key={h.id} 
            className="aura-card aura-card-interactive"
            onClick={() => toggleHabitToday(h.id)}
            style={{
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: h.completedToday ? 'var(--bg-card-hover)' : 'var(--bg-card)',
              borderColor: h.completedToday ? 'var(--accent-success)' : 'var(--border-color)',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {getIcon(h.iconName)}
              </div>

              <div>
                <h4 style={{ 
                  fontSize: '0.95rem', 
                  fontWeight: 700, 
                  color: 'var(--text-primary)',
                  textDecoration: h.completedToday ? 'line-through' : 'none',
                  opacity: h.completedToday ? 0.8 : 1
                }}>
                  {h.title}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Flame size={12} color="var(--accent-warning)" /> {h.streak} day streak
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Best: {h.bestStreak}d
                  </span>
                </div>
              </div>
            </div>

            {/* 1-Tap Toggle Circle */}
            <div style={{ cursor: 'pointer' }}>
              {h.completedToday ? (
                <CheckCircle2 size={26} color="var(--accent-success)" fill="var(--accent-success-soft)" />
              ) : (
                <Circle size={26} color="var(--text-muted)" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Habit Modal */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>Add Daily Habit</h3>
            
            <form onSubmit={handleAddHabit}>
              <div className="form-group">
                <label className="form-label">Habit Title</label>
                <input
                  type="text"
                  placeholder="e.g. 10,000 Steps, Cold Shower, Reading..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="input-text"
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Icon Style</label>
                <select 
                  value={newIcon}
                  onChange={(e) => setNewIcon(e.target.value)}
                  className="select-input"
                >
                  <option value="Droplets">Water / Hydration</option>
                  <option value="Dumbbell">Gym / Movement</option>
                  <option value="BookOpen">Reading / Learning</option>
                  <option value="Moon">Sleep / Skincare</option>
                  <option value="Pill">Vitamins / Supplements</option>
                  <option value="HeartPulse">Meditation / Mindfulness</option>
                  <option value="Activity">Stretching / Yoga</option>
                  <option value="Footprints">Walking / Steps</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Create Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
