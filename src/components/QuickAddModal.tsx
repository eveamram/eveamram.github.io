import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { TaskCategory, TaskPriority, GroceryCategory } from '../types';
import { CheckSquare, ShoppingBag, Bell, Activity, X } from 'lucide-react';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: string;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose, defaultType = 'task' }) => {
  const { addTask, addGroceryItem, addReminder, addHabit, showToast } = useStore();

  const [itemType, setItemType] = useState<'task' | 'grocery' | 'reminder' | 'habit'>(defaultType as any || 'task');

  // Form states
  const [title, setTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState<TaskCategory>('Personal');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
  const [groceryCategory, setGroceryCategory] = useState<GroceryCategory>('Produce');
  const [quantity, setQuantity] = useState('1');
  const [reminderDate, setReminderDate] = useState('');
  const [habitIcon, setHabitIcon] = useState('Droplets');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (itemType === 'task') {
      addTask({
        title: title.trim(),
        category: taskCategory,
        priority: taskPriority
      });
      showToast(`Task "${title.trim()}" created!`, 'success');
    } else if (itemType === 'grocery') {
      addGroceryItem({
        name: title.trim(),
        category: groceryCategory,
        iconName: 'ShoppingBag',
        quantity: quantity.trim() || '1'
      });
      showToast(`Added "${title.trim()}" to grocery list!`, 'success');
    } else if (itemType === 'reminder') {
      addReminder({
        title: title.trim(),
        category: 'Bills',
        dueDate: reminderDate || new Date().toISOString().split('T')[0],
        iconName: 'Bell'
      });
      showToast(`Reminder "${title.trim()}" set!`, 'success');
    } else if (itemType === 'habit') {
      addHabit({
        title: title.trim(),
        iconName: habitIcon,
        targetDaysPerWeek: 7
      });
      showToast(`Habit "${title.trim()}" started!`, 'success');
    }

    setTitle('');
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
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-lg)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Smart Quick Add
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Type Selector Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', background: 'var(--bg-tertiary)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
          {[
            { id: 'task', label: 'Task', icon: <CheckSquare size={14} /> },
            { id: 'grocery', label: 'Grocery', icon: <ShoppingBag size={14} /> },
            { id: 'reminder', label: 'Reminder', icon: <Bell size={14} /> },
            { id: 'habit', label: 'Habit', icon: <Activity size={14} /> }
          ].map((tab) => {
            const isSelected = itemType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setItemType(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: isSelected ? 'var(--bg-card)' : 'transparent',
                  color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input
            type="text"
            placeholder={
              itemType === 'task' ? 'What needs to get done?' :
              itemType === 'grocery' ? 'e.g. Organic Milk, Avocados...' :
              itemType === 'reminder' ? 'e.g. Dentist appointment...' :
              'e.g. Drink 8 glasses of water...'
            }
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-text"
            required
            autoFocus
            style={{ fontSize: '0.95rem', padding: '12px 14px' }}
          />

          {itemType === 'task' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <select 
                value={taskCategory} 
                onChange={(e) => setTaskCategory(e.target.value as TaskCategory)}
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
                value={taskPriority} 
                onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                className="select-input"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          )}

          {itemType === 'grocery' && (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
              <select 
                value={groceryCategory} 
                onChange={(e) => setGroceryCategory(e.target.value as GroceryCategory)}
                className="select-input"
              >
                <option value="Produce">Produce</option>
                <option value="Dairy & Eggs">Dairy & Eggs</option>
                <option value="Pantry">Pantry</option>
                <option value="Bakery">Bakery</option>
                <option value="Frozen">Frozen</option>
                <option value="Beverages">Beverages</option>
                <option value="Personal Care">Personal Care</option>
                <option value="Other">Other</option>
              </select>

              <input
                type="text"
                placeholder="Qty (e.g. 1 bag)"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="input-text"
              />
            </div>
          )}

          {itemType === 'reminder' && (
            <input
              type="date"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              className="input-text"
              required
            />
          )}

          {itemType === 'habit' && (
            <select 
              value={habitIcon} 
              onChange={(e) => setHabitIcon(e.target.value)}
              className="select-input"
            >
              <option value="Droplets">Water / Hydration</option>
              <option value="Dumbbell">Gym / Movement</option>
              <option value="BookOpen">Reading / Learning</option>
              <option value="Moon">Sleep / Skincare</option>
              <option value="Pill">Vitamins / Supplements</option>
              <option value="HeartPulse">Meditation</option>
              <option value="Activity">Stretching / Yoga</option>
              <option value="Footprints">Walking / Steps</option>
            </select>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ width: 'auto' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0 24px' }}>
              Save {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
