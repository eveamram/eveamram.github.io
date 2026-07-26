import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Target, Plus, Trophy, PiggyBank, BookMarked, Award, Flame, Check } from 'lucide-react';

export const GoalsView: React.FC = () => {
  const { goals, updateGoalProgress, addGoal, setTodaysMainGoalId, todaysMainGoalId } = useStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [unit, setUnit] = useState('$');
  const [color, setColor] = useState('#34C759');

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !target) return;

    addGoal({
      title: title.trim(),
      current: 0,
      target: parseFloat(target),
      unit: unit.trim() || 'units',
      iconName: 'Target',
      color
    });

    setTitle('');
    setTarget('');
    setIsAddModalOpen(false);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'PiggyBank': return <PiggyBank size={24} color="#34C759" />;
      case 'Trophy': return <Trophy size={24} color="#FF9500" />;
      case 'BookMarked': return <BookMarked size={24} color="#AF52DE" />;
      default: return <Target size={24} color="var(--accent-primary)" />;
    }
  };

  return (
    <div style={{ padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Major Life Focus Goals
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
            Up to 3 core goals to keep you centered daily
          </p>
        </div>

        {goals.length < 3 && (
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary"
            style={{ width: 'auto', padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <Plus size={16} /> Add Goal
          </button>
        )}
      </div>

      {/* Goals Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {goals.map((g) => {
          const percentage = Math.min(100, Math.round((g.current / g.target) * 100));
          const isFeaturedToday = g.id === todaysMainGoalId;

          return (
            <div key={g.id} className="aura-card" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getIcon(g.iconName)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {g.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {g.unit === '$' ? `$${g.current.toLocaleString()}` : `${g.current} ${g.unit}`} / {g.unit === '$' ? `$${g.target.toLocaleString()}` : `${g.target} ${g.unit}`}
                      </span>
                    </div>
                  </div>
                </div>

                {isFeaturedToday ? (
                  <span className="badge-pill" style={{ background: 'var(--accent-rose-soft)', color: 'var(--accent-rose)' }}>
                    <Flame size={12} /> Today's Focus
                  </span>
                ) : (
                  <button
                    onClick={() => setTodaysMainGoalId(g.id)}
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-full)',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--text-tertiary)',
                      cursor: 'pointer'
                    }}
                  >
                    Set as Today's Focus
                  </button>
                )}
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  <span>Progress</span>
                  <span>{percentage}%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '10px',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    backgroundColor: g.color || 'var(--accent-primary)',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>

              {/* Slider for smooth progress updates */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-tertiary)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>
                  Update:
                </span>
                <input
                  type="range"
                  min={0}
                  max={g.target}
                  step={g.target > 100 ? 50 : 1}
                  value={g.current}
                  onChange={(e) => updateGoalProgress(g.id, parseFloat(e.target.value) - g.current)}
                  style={{ flex: 1, accentColor: g.color || 'var(--accent-primary)', cursor: 'pointer' }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>Add Life Goal (Max 3)</h3>

            <form onSubmit={handleAddGoal}>
              <div className="form-group">
                <label className="form-label">Goal Title</label>
                <input
                  type="text"
                  placeholder="e.g. Save $10,000, Learn French..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-text"
                  required
                  autoFocus
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Target Number</label>
                  <input
                    type="number"
                    placeholder="10000"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="input-text"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Unit</label>
                  <input
                    type="text"
                    placeholder="$, books, km, lbs"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="input-text"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
