import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { 
  Search, 
  CheckSquare, 
  ShoppingBag, 
  Activity, 
  Bell, 
  Calendar, 
  Home, 
  Plus, 
  User, 
  Moon, 
  Sun,
  X,
  ChevronRight
} from 'lucide-react';
import { ActiveTab } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuickAdd: (context?: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onOpenQuickAdd }) => {
  const { 
    tasks, 
    groceries, 
    habits, 
    reminders, 
    setActiveTab, 
    profiles, 
    activeProfileId, 
    switchProfile,
    theme,
    toggleTheme,
    toggleTask
  } = useStore();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or context
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(query.toLowerCase()));
  const filteredGroceries = groceries.filter(g => g.name.toLowerCase().includes(query.toLowerCase()));
  const filteredHabits = habits.filter(h => h.title.toLowerCase().includes(query.toLowerCase()));
  const filteredReminders = reminders.filter(r => r.title.toLowerCase().includes(query.toLowerCase()));

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    onClose();
  };

  const handleSelectProfile = (id: string) => {
    switchProfile(id);
    onClose();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '80px',
        paddingLeft: '16px',
        paddingRight: '16px',
        animation: 'fadeIn 0.2s ease'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '600px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '80vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-color)', gap: '12px' }}>
          <Search size={20} color="var(--accent-primary)" />
          <input
            type="text"
            placeholder="Type a command or search tasks, groceries, habits..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              color: 'var(--text-primary)',
              fontWeight: 500
            }}
          />
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Results List */}
        <div className="scroll-hide" style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
          {query.trim() === '' ? (
            <>
              {/* Quick Actions */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', paddingLeft: '8px' }}>
                  Quick Actions
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button
                    onClick={() => { onClose(); onOpenQuickAdd('task'); }}
                    className="palette-item"
                  >
                    <Plus size={16} color="var(--accent-primary)" />
                    <span>Create New Task</span>
                  </button>
                  <button
                    onClick={() => { onClose(); onOpenQuickAdd('grocery'); }}
                    className="palette-item"
                  >
                    <ShoppingBag size={16} color="var(--accent-warning)" />
                    <span>Add Grocery Item</span>
                  </button>
                  <button
                    onClick={toggleTheme}
                    className="palette-item"
                  >
                    {theme === 'dark' ? <Sun size={16} color="#FFD60A" /> : <Moon size={16} color="var(--accent-purple)" />}
                    <span>Toggle Theme ({theme === 'dark' ? 'Light' : 'Dark'})</span>
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', paddingLeft: '8px' }}>
                  Navigate To
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button onClick={() => handleSelectTab('home')} className="palette-item">
                    <Home size={16} color="var(--accent-primary)" />
                    <span>Today Overview</span>
                  </button>
                  <button onClick={() => handleSelectTab('tasks')} className="palette-item">
                    <CheckSquare size={16} color="var(--accent-primary)" />
                    <span>To-Do List</span>
                  </button>
                  <button onClick={() => handleSelectTab('habits')} className="palette-item">
                    <Activity size={16} color="var(--accent-success)" />
                    <span>Habits & Fitness</span>
                  </button>
                  <button onClick={() => handleSelectTab('groceries')} className="palette-item">
                    <ShoppingBag size={16} color="var(--accent-warning)" />
                    <span>Grocery Shopping</span>
                  </button>
                  <button onClick={() => handleSelectTab('reminders')} className="palette-item">
                    <Bell size={16} color="var(--accent-rose)" />
                    <span>Important Reminders</span>
                  </button>
                  <button onClick={() => handleSelectTab('calendar')} className="palette-item">
                    <Calendar size={16} color="var(--accent-purple)" />
                    <span>Calendar Schedule</span>
                  </button>
                </div>
              </div>

              {/* Profiles */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', paddingLeft: '8px' }}>
                  Switch Profile
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {profiles.map(p => (
                    <button 
                      key={p.id} 
                      onClick={() => handleSelectProfile(p.id)} 
                      className={`palette-item ${p.id === activeProfileId ? 'active' : ''}`}
                    >
                      <User size={16} color={p.color} />
                      <span>{p.avatarEmoji} {p.name}</span>
                      {p.id === activeProfileId && <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700 }}>Active</span>}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div>
              {/* Filtered Tasks */}
              {filteredTasks.length > 0 && (
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px', paddingLeft: '8px' }}>
                    Tasks ({filteredTasks.length})
                  </div>
                  {filteredTasks.map(t => (
                    <div 
                      key={t.id} 
                      onClick={() => { toggleTask(t.id); onClose(); }} 
                      className="palette-item"
                    >
                      <CheckSquare size={16} color={t.completed ? 'var(--accent-success)' : 'var(--text-tertiary)'} />
                      <span style={{ textDecoration: t.completed ? 'line-through' : 'none' }}>{t.title}</span>
                      <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{t.category}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Filtered Groceries */}
              {filteredGroceries.length > 0 && (
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px', paddingLeft: '8px' }}>
                    Groceries ({filteredGroceries.length})
                  </div>
                  {filteredGroceries.map(g => (
                    <div key={g.id} onClick={() => { handleSelectTab('groceries'); }} className="palette-item">
                      <ShoppingBag size={16} color="var(--accent-warning)" />
                      <span>{g.name}</span>
                      <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{g.category}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Filtered Habits */}
              {filteredHabits.length > 0 && (
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px', paddingLeft: '8px' }}>
                    Habits ({filteredHabits.length})
                  </div>
                  {filteredHabits.map(h => (
                    <div key={h.id} onClick={() => { handleSelectTab('habits'); }} className="palette-item">
                      <Activity size={16} color="var(--accent-success)" />
                      <span>{h.title}</span>
                      <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>🔥 {h.streak} day streak</span>
                    </div>
                  ))}
                </div>
              )}

              {filteredTasks.length === 0 && filteredGroceries.length === 0 && filteredHabits.length === 0 && (
                <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-tertiary)' }}>
                  <p>No matching items found for "{query}".</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Keyboard Footer */}
        <div style={{ padding: '10px 16px', background: 'var(--bg-tertiary)', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
          <span>Press <kbd style={{ padding: '2px 6px', background: 'var(--bg-card)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>ESC</kbd> to close</span>
          <span><kbd style={{ padding: '2px 6px', background: 'var(--bg-card)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>⌘K</kbd> Command Palette</span>
        </div>
      </div>
    </div>
  );
};
