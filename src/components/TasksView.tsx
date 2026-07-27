import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { TaskCategory, TaskPriority } from '../types';
import { 
  User, 
  Home, 
  Heart, 
  ShoppingCart, 
  Briefcase, 
  Plane, 
  Check, 
  Plus, 
  Trash2, 
  Calendar, 
  AlertCircle, 
  Sparkles,
  Pencil,
  X
} from 'lucide-react';

export const TasksView: React.FC = () => {
  const { tasks, toggleTask, addTask, updateTask, deleteTask } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Editing Task State
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<TaskCategory>('Personal');
  const [editPriority, setEditPriority] = useState<TaskPriority>('medium');

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

  // Sort so active tasks appear first, completed tasks appear next (with strikethrough, staying visible)
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  const startEditing = (task: any) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditCategory(task.category);
    setEditPriority(task.priority || 'medium');
  };

  const saveEditing = (id: string) => {
    if (!editTitle.trim()) return;
    updateTask(id, {
      title: editTitle.trim(),
      category: editCategory,
      priority: editPriority
    });
    setEditingTaskId(null);
  };

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

  const getCategoryIcon = (cat: TaskCategory) => {
    switch (cat) {
      case 'Personal': return <User size={14} color="#007AFF" />;
      case 'Apartment': return <Home size={14} color="#34C759" />;
      case 'Health': return <Heart size={14} color="#FF2D55" />;
      case 'Shopping': return <ShoppingCart size={14} color="#FF9500" />;
      case 'Work': return <Briefcase size={14} color="#AF52DE" />;
      case 'Travel': return <Plane size={14} color="#5856D6" />;
      default: return <Sparkles size={14} color="var(--accent-primary)" />;
    }
  };

  const getCategoryBadgeStyle = (cat: TaskCategory) => {
    switch (cat) {
      case 'Personal': return { bg: 'rgba(0, 122, 255, 0.12)', color: '#007AFF' };
      case 'Apartment': return { bg: 'rgba(52, 199, 89, 0.12)', color: '#34C759' };
      case 'Health': return { bg: 'rgba(255, 45, 85, 0.12)', color: '#FF2D55' };
      case 'Shopping': return { bg: 'rgba(255, 149, 0, 0.12)', color: '#FF9500' };
      case 'Work': return { bg: 'rgba(175, 82, 222, 0.12)', color: '#AF52DE' };
      case 'Travel': return { bg: 'rgba(88, 86, 214, 0.12)', color: '#5856D6' };
      default: return { bg: 'var(--accent-soft)', color: 'var(--accent-primary)' };
    }
  };

  const getPriorityColor = (p: TaskPriority) => {
    switch (p) {
      case 'high': return '#FF3B30';
      case 'medium': return '#FF9500';
      case 'low': return '#8E8E93';
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
                fontWeight: isSelected ? 700 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {cat !== 'All' && getCategoryIcon(cat as TaskCategory)}
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Header & Add Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          To-Do List <span style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>({filteredTasks.filter(t => !t.completed).length} active)</span>
        </h2>
        <button 
          onClick={() => setIsAddModalOpen(prev => !prev)}
          className="btn-primary"
          style={{ width: 'auto', padding: '8px 14px', fontSize: '0.85rem', gap: '4px' }}
        >
          <Plus size={16} /> {isAddModalOpen ? 'Close Options' : 'More Options'}
        </button>
      </div>

      {/* 1-Tap Quick Add Task Input */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          if (title.trim()) {
            addTask({
              title: title.trim(),
              category: (selectedCategory !== 'All' ? selectedCategory as any : 'Personal'),
              priority: 'medium'
            });
            setTitle('');
          }
        }}
        style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}
      >
        <input
          type="text"
          placeholder="Add a new to-do task (Press Enter)..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-text"
          style={{ flex: 1, fontSize: '0.88rem', padding: '10px 14px' }}
        />
        <button 
          type="submit" 
          className="btn-primary" 
          style={{ width: 'auto', padding: '10px 18px', fontSize: '0.85rem' }}
        >
          Add
        </button>
      </form>

      {/* Inline Detailed Task Form */}
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
              Save Task
            </button>
          </div>
        </form>
      )}

      {/* Main Unified Task List (Completed tasks stay visible with clean strike-through) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        {sortedTasks.length === 0 ? (
          <div className="aura-card" style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-tertiary)' }}>
            <Check size={32} color="var(--accent-success)" style={{ marginBottom: '8px', opacity: 0.8 }} />
            <p style={{ fontWeight: 600 }}>All clear for {selectedCategory}!</p>
            <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>No tasks found in this section.</p>
          </div>
        ) : (
          sortedTasks.map((t) => {
            const catBadge = getCategoryBadgeStyle(t.category);
            const isEditing = editingTaskId === t.id;

            if (isEditing) {
              return (
                <div key={t.id} className="aura-card" style={{ border: '1px solid var(--accent-primary)', padding: '14px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="input-text"
                      autoFocus
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select 
                        value={editCategory} 
                        onChange={(e) => setEditCategory(e.target.value as TaskCategory)}
                        className="select-input"
                        style={{ flex: 1 }}
                      >
                        <option value="Personal">Personal</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Health">Health</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Work">Work</option>
                        <option value="Travel">Travel</option>
                      </select>
                      <select 
                        value={editPriority} 
                        onChange={(e) => setEditPriority(e.target.value as TaskPriority)}
                        className="select-input"
                        style={{ flex: 1 }}
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
                      <button 
                        onClick={() => setEditingTaskId(null)} 
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      >
                        <X size={14} /> Cancel
                      </button>
                      <button 
                        onClick={() => saveEditing(t.id)} 
                        className="btn-primary"
                        style={{ width: 'auto', padding: '6px 16px', fontSize: '0.8rem' }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div 
                key={t.id} 
                className="aura-card aura-card-interactive" 
                style={{ 
                  marginBottom: 0,
                  opacity: t.completed ? 0.65 : 1,
                  background: t.completed ? 'var(--bg-tertiary)' : 'var(--bg-card)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  {/* Checkbox */}
                  <div 
                    className={`checkbox-custom ${t.completed ? 'checked' : ''}`}
                    onClick={() => toggleTask(t.id)}
                    style={{ marginTop: '2px', flexShrink: 0, cursor: 'pointer' }}
                  >
                    {t.completed && <Check size={14} strokeWidth={3} />}
                  </div>

                  {/* Task Content */}
                  <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => toggleTask(t.id)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h3 style={{ 
                        fontSize: '0.95rem', 
                        fontWeight: t.completed ? 500 : 700, 
                        color: t.completed ? 'var(--text-tertiary)' : 'var(--text-primary)',
                        textDecoration: t.completed ? 'line-through' : 'none'
                      }}>
                        {t.title}
                      </h3>
                    </div>

                    {t.notes && (
                      <p style={{ 
                        fontSize: '0.8rem', 
                        color: 'var(--text-secondary)', 
                        marginBottom: '6px',
                        textDecoration: t.completed ? 'line-through' : 'none' 
                      }}>
                        {t.notes}
                      </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                      {/* Colorful Category Pill with Icon */}
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-full)',
                        background: catBadge.bg,
                        color: catBadge.color,
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}>
                        {getCategoryIcon(t.category)}
                        <span>{t.category}</span>
                      </span>

                      {/* Due Date */}
                      {t.dueDate && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} /> {t.dueDate}
                        </span>
                      )}

                      {/* Priority Tag */}
                      <span style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 800, 
                        color: getPriorityColor(t.priority), 
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'var(--bg-secondary)',
                        border: `1px solid ${getPriorityColor(t.priority)}33`
                      }}>
                        <AlertCircle size={10} /> {t.priority}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons: Edit Pencil & Delete Trash */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button 
                      onClick={() => startEditing(t)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                      title="Edit task"
                    >
                      <Pencil size={14} />
                    </button>
                    <button 
                      onClick={() => deleteTask(t.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                      title="Delete task"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};


