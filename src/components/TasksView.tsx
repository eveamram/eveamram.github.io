import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { TaskCategory, TaskPriority } from '../types';
import { Check, Plus, Trash2, Calendar, AlertCircle, ChevronDown, ChevronUp, Tag } from 'lucide-react';

export const TasksView: React.FC = () => {
  const { tasks, toggleTask, addTask, deleteTask } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showCompleted, setShowCompleted] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New task form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Personal');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const categories: string[] = ['All', 'Personal', 'Apartment', 'Health', 'Shopping', 'Work', 'Travel'];

  const filteredTasks = tasks.filter(t => {
    if (selectedCategory !== 'All' && t.category !== selectedCategory) return false;
    return true;
  });

  const activeTasks = filteredTasks.filter(t => !t.completed);
  const completedTasks = filteredTasks.filter(t => t.completed);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      category,
      priority,
      dueDate: dueDate || undefined,
      notes: notes.trim() || undefined
    });

    setTitle('');
    setNotes('');
    setDueDate('');
    setIsAddModalOpen(false);
  };

  const getCategoryClass = (cat: TaskCategory) => {
    switch (cat) {
      case 'Personal': return 'badge-personal';
      case 'Apartment': return 'badge-apartment';
      case 'Health': return 'badge-health';
      case 'Shopping': return 'badge-shopping';
      case 'Work': return 'badge-work';
      case 'Travel': return 'badge-travel';
      default: return 'badge-personal';
    }
  };

  const getPriorityColor = (p: TaskPriority) => {
    switch (p) {
      case 'high': return 'var(--accent-rose)';
      case 'medium': return 'var(--accent-warning)';
      case 'low': return 'var(--text-tertiary)';
    }
  };

  return (
    <div style={{ padding: '0 20px' }}>
      {/* Category Filter Horizontal Bar */}
      <div className="scroll-hide" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '8px' }}>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: isSelected ? 'var(--accent-primary)' : 'var(--bg-card)',
                color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                border: '1px solid ' + (isSelected ? 'var(--accent-primary)' : 'var(--border-color)'),
                borderRadius: 'var(--radius-full)',
                padding: '6px 14px',
                fontSize: '0.8rem',
                fontWeight: isSelected ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Header & Add Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          To-Do List <span style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>({activeTasks.length})</span>
        </h2>
        <button 
          onClick={() => setIsAddModalOpen(prev => !prev)}
          className="btn-primary"
          style={{ width: 'auto', padding: '8px 14px', fontSize: '0.85rem', gap: '4px' }}
        >
          <Plus size={16} /> {isAddModalOpen ? 'Close' : 'New Task'}
        </button>
      </div>

      {/* Inline Create Task Form */}
      {isAddModalOpen && (
        <form 
          onSubmit={handleCreateTask}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px', 
            padding: '16px', 
            borderRadius: 'var(--radius-md)', 
            background: 'var(--bg-card)', 
            border: '1px solid var(--accent-primary)', 
            marginBottom: '16px',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <input
            type="text"
            placeholder="Task Title (e.g. Schedule oil change)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-text"
            required
            autoFocus
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
              className="select-input"
            >
              <option value="Personal">Personal</option>
              <option value="Apartment">Apartment</option>
              <option value="Health">Health</option>
              <option value="Shopping">Shopping</option>
              <option value="Work">Work</option>
              <option value="Travel">Travel</option>
            </select>

            <select 
              value={priority} 
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="select-input"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input-text"
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Notes / context (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-text"
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0 20px', fontSize: '0.85rem' }}>
              Add Task
            </button>
          </div>
        </form>
      )}

      {/* Active Tasks List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        {activeTasks.length === 0 ? (
          <div className="aura-card" style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-tertiary)' }}>
            <Check size={32} color="var(--accent-success)" style={{ marginBottom: '8px', opacity: 0.8 }} />
            <p style={{ fontWeight: 600 }}>All clear for {selectedCategory}!</p>
            <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>No active tasks remaining. Enjoy your day.</p>
          </div>
        ) : (
          activeTasks.map((t) => (
            <div key={t.id} className="aura-card aura-card-interactive" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div 
                  className="checkbox-custom"
                  onClick={() => toggleTask(t.id)}
                  style={{ marginTop: '2px' }}
                >
                  {t.completed && <Check size={14} strokeWidth={3} />}
                </div>

                <div style={{ flex: 1 }} onClick={() => toggleTask(t.id)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {t.title}
                    </h3>
                  </div>

                  {t.notes && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      {t.notes}
                    </p>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span className={`badge-pill ${getCategoryClass(t.category)}`}>
                      <Tag size={10} /> {t.category}
                    </span>

                    {t.dueDate && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} /> {t.dueDate}
                      </span>
                    )}

                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 700, 
                      color: getPriorityColor(t.priority), 
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px'
                    }}>
                      <AlertCircle size={10} /> {t.priority}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => deleteTask(t.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                  title="Delete task"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Completed Section Toggle */}
      {completedTasks.length > 0 && (
        <div>
          <button 
            onClick={() => setShowCompleted(!showCompleted)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-tertiary)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              margin: '0 auto 12px auto'
            }}
          >
            Completed ({completedTasks.length}) {showCompleted ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showCompleted && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', opacity: 0.75 }}>
              {completedTasks.map((t) => (
                <div key={t.id} className="aura-card" style={{ marginBottom: 0, padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div 
                      onClick={() => toggleTask(t.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flex: 1 }}
                    >
                      <div className="checkbox-custom checked">
                        <Check size={14} strokeWidth={3} />
                      </div>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', textDecoration: 'line-through' }}>
                        {t.title}
                      </span>
                    </div>
                    <button 
                      onClick={() => deleteTask(t.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
