import React from 'react';
import { useStore } from '../store/useStore';
import { Target, Plus, Minus, ChevronRight, Award } from 'lucide-react';

export const GoalsCard: React.FC = () => {
  const { goals, todaysMainGoalId, setTodaysMainGoalId, updateGoalProgress, setActiveTab } = useStore();

  const mainGoal = goals.find(g => g.id === todaysMainGoalId) || goals[0];

  if (!mainGoal) return null;

  const percentage = Math.min(100, Math.round((mainGoal.current / mainGoal.target) * 100));

  return (
    <div className="aura-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Target size={16} color="var(--accent-rose)" />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            Today's Main Focus
          </span>
        </div>

        <button 
          onClick={() => setActiveTab('reminders')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent-primary)',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '2px'
          }}
        >
          All Goals <ChevronRight size={14} />
        </button>
      </div>

      {/* Main Goal Selector Dropdown */}
      <div style={{ marginBottom: '12px' }}>
        <select
          value={mainGoal.id}
          onChange={(e) => setTodaysMainGoalId(e.target.value)}
          style={{
            width: '100%',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {goals.map(g => (
            <option key={g.id} value={g.id}>{g.title}</option>
          ))}
        </select>
      </div>

      {/* Progress Bar & Value */}
      <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {mainGoal.unit === '$' ? `$${mainGoal.current.toLocaleString()}` : `${mainGoal.current} ${mainGoal.unit}`} / {mainGoal.unit === '$' ? `$${mainGoal.target.toLocaleString()}` : `${mainGoal.target} ${mainGoal.unit}`}
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-success)' }}>
            {percentage}%
          </span>
        </div>

        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: mainGoal.color || 'var(--accent-primary)',
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* Quick Increment Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
          <Award size={14} color="var(--accent-warning)" />
          <span>Keep your top life focus visible daily</span>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button 
            className="icon-btn" 
            style={{ width: '28px', height: '28px' }} 
            onClick={() => updateGoalProgress(mainGoal.id, -1)}
            title="Decrement"
          >
            <Minus size={14} />
          </button>
          <button 
            className="icon-btn" 
            style={{ width: '28px', height: '28px', background: 'var(--accent-soft)', color: 'var(--accent-primary)' }} 
            onClick={() => updateGoalProgress(mainGoal.id, 1)}
            title="Increment progress"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
