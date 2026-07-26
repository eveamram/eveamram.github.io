import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { ChevronLeft, ChevronRight, CheckSquare, Bell, Sparkles, Plus } from 'lucide-react';
import { DayOfWeek, TaskCategory, TaskPriority } from '../types';

export const CalendarView: React.FC = () => {
  const { tasks, reminders, routines, addTask } = useStore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Quick Task form for selected date
  const [taskTitle, setTaskTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Personal');
  const [priority, setPriority] = useState<TaskPriority>('medium');

  const daysOfWeek: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const totalDays = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Generate date grid cells
  const calendarCells = [];
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({ dayNumber: d, dateStr: formatted });
  }

  // Get items for selected date
  const selDateObj = new Date(selectedDate + 'T00:00:00');
  const selDayOfWeekName = daysOfWeek[selDateObj.getDay()];

  const dayTasks = tasks.filter(t => t.dueDate === selectedDate);
  const dayReminders = reminders.filter(r => r.dueDate === selectedDate);
  const dayRoutines = routines.filter(r => r.day === selDayOfWeekName);

  const handleCreateTaskForDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    addTask({
      title: taskTitle.trim(),
      category,
      priority,
      dueDate: selectedDate
    });

    setTaskTitle('');
    setIsAddModalOpen(false);
  };

  return (
    <div style={{ padding: '0 20px' }}>
      {/* Calendar Header Controls */}
      <div className="aura-card" style={{ padding: '16px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {monthNames[month]} {year}
          </h2>
          
          <div style={{ display: 'flex', gap: '6px' }}>
            <button className="icon-btn" onClick={prevMonth} style={{ width: '32px', height: '32px' }}>
              <ChevronLeft size={16} />
            </button>
            <button className="icon-btn" onClick={nextMonth} style={{ width: '32px', height: '32px' }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Day Name Labels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '8px' }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <span key={i} style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>
              {d}
            </span>
          ))}
        </div>

        {/* Date Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
          {calendarCells.map((cell, index) => {
            if (!cell) {
              return <div key={`empty-${index}`} style={{ height: '38px' }} />;
            }

            const isSelected = cell.dateStr === selectedDate;
            const isToday = cell.dateStr === new Date().toISOString().split('T')[0];

            // Check if events exist for this date
            const hasTask = tasks.some(t => t.dueDate === cell.dateStr);
            const hasRem = reminders.some(r => r.dueDate === cell.dateStr);

            return (
              <button
                key={cell.dateStr}
                onClick={() => setSelectedDate(cell.dateStr)}
                style={{
                  height: '38px',
                  borderRadius: 'var(--radius-sm)',
                  border: isToday ? '2px solid var(--accent-primary)' : '1px solid transparent',
                  background: isSelected ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                  fontWeight: isSelected || isToday ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <span>{cell.dayNumber}</span>
                <div style={{ display: 'flex', gap: '2px', position: 'absolute', bottom: '3px' }}>
                  {hasRem && (
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: isSelected ? '#FFF' : 'var(--accent-warning)' }} />
                  )}
                  {hasTask && (
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: isSelected ? '#FFF' : 'var(--accent-success)' }} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Schedule for {selectedDate} ({selDayOfWeekName})
          </h3>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '0.8rem' }}
          >
            <Plus size={14} /> Add to Date
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Recurring Routines for this day */}
          {dayRoutines.length > 0 && (
            <div className="aura-card" style={{ marginBottom: 0, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Sparkles size={14} color="var(--accent-purple)" />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  {selDayOfWeekName} Recurring Routines ({dayRoutines.length})
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {dayRoutines.map(r => (
                  <span key={r.id} className="badge-pill" style={{ background: 'var(--accent-purple-soft)', color: 'var(--accent-purple)' }}>
                    {r.title}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Scheduled Tasks for this date */}
          {dayTasks.length > 0 && (
            <div className="aura-card" style={{ marginBottom: 0, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <CheckSquare size={14} color="var(--accent-primary)" />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  Scheduled Tasks ({dayTasks.length})
                </span>
              </div>
              {dayTasks.map(t => (
                <div key={t.id} style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', padding: '4px 0' }}>
                  • {t.title} <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>({t.category})</span>
                </div>
              ))}
            </div>
          )}

          {/* Scheduled Reminders for this date */}
          {dayReminders.length > 0 && (
            <div className="aura-card" style={{ marginBottom: 0, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Bell size={14} color="var(--accent-warning)" />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  Reminders Due ({dayReminders.length})
                </span>
              </div>
              {dayReminders.map(r => (
                <div key={r.id} style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', padding: '4px 0' }}>
                  • {r.title} {r.amount && `(${r.amount})`}
                </div>
              ))}
            </div>
          )}

          {dayRoutines.length === 0 && dayTasks.length === 0 && dayReminders.length === 0 && (
            <div className="aura-card" style={{ textAlign: 'center', padding: '24px 16px', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
              No specific events or reminders set for this day. Click "+ Add to Date" above to add one!
            </div>
          )}
        </div>
      </div>

      {/* Add Task for Date Modal */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '4px' }}>Add Event / Task</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '16px' }}>
              Scheduled for {selectedDate} ({selDayOfWeekName})
            </p>

            <form onSubmit={handleCreateTaskForDate}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Flight booking, Doctor appointment..."
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="input-text"
                  required
                  autoFocus
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
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
                </div>

                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select 
                    value={priority} 
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="select-input"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Add to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
