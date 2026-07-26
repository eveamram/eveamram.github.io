import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { ChevronLeft, ChevronRight, CheckSquare, Bell, Sparkles, Plus, Calendar as CalendarIcon, Clock, Check } from 'lucide-react';
import { DayOfWeek, TaskCategory, TaskPriority } from '../types';

export const CalendarView: React.FC = () => {
  const { tasks, reminders, routines, addTask, toggleTask } = useStore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Quick Task form for selected date
  const [taskTitle, setTaskTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Personal');
  const [priority, setPriority] = useState<TaskPriority>('medium');

  const daysOfWeekFull: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
  const goToToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now.toISOString().split('T')[0]);
  };

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
  const selDayOfWeekName = daysOfWeekFull[selDateObj.getDay()];

  const dayTasks = tasks.filter(t => t.dueDate === selectedDate);
  const dayReminders = reminders.filter(r => r.dueDate === selectedDate);
  const dayRoutines = routines.filter(r => r.day === selDayOfWeekName);

  const formattedSelectedTitle = selDateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

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
    <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Calendar Header Card */}
      <div className="aura-card" style={{ padding: '20px', marginBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarIcon size={20} color="var(--accent-primary)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
                {monthNames[month]} {year}
              </h2>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
              Select a date to view or schedule events
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button 
              className="badge-pill" 
              onClick={goToToday}
              style={{ background: 'var(--accent-soft)', color: 'var(--accent-primary)', border: 'none', cursor: 'pointer', padding: '6px 12px', fontWeight: 700 }}
            >
              Today
            </button>
            <button className="icon-btn" onClick={prevMonth} style={{ width: '34px', height: '34px' }} title="Previous Month">
              <ChevronLeft size={18} />
            </button>
            <button className="icon-btn" onClick={nextMonth} style={{ width: '34px', height: '34px' }} title="Next Month">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Day Name Header Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '10px' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
            <span key={i} style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {d}
            </span>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
          {calendarCells.map((cell, index) => {
            if (!cell) {
              return <div key={`empty-${index}`} style={{ height: '48px' }} />;
            }

            const isSelected = cell.dateStr === selectedDate;
            const isToday = cell.dateStr === new Date().toISOString().split('T')[0];

            // Check event indicators for this date
            const taskCount = tasks.filter(t => t.dueDate === cell.dateStr).length;
            const reminderCount = reminders.filter(r => r.dueDate === cell.dateStr).length;
            const hasEvents = taskCount > 0 || reminderCount > 0;

            return (
              <button
                key={cell.dateStr}
                onClick={() => setSelectedDate(cell.dateStr)}
                style={{
                  height: '48px',
                  borderRadius: 'var(--radius-sm)',
                  border: isToday ? '2px solid var(--accent-primary)' : isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  background: isSelected 
                    ? 'var(--accent-primary)' 
                    : isToday 
                    ? 'var(--accent-soft)' 
                    : 'var(--bg-tertiary)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                  fontWeight: isSelected || isToday ? 800 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isSelected ? '0 4px 12px rgba(0, 122, 255, 0.3)' : 'none'
                }}
              >
                <span>{cell.dayNumber}</span>
                
                {/* Event Indicator Dots */}
                <div style={{ display: 'flex', gap: '3px', position: 'absolute', bottom: '5px' }}>
                  {reminderCount > 0 && (
                    <span style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      backgroundColor: isSelected ? '#FFFFFF' : 'var(--accent-warning)'
                    }} />
                  )}
                  {taskCount > 0 && (
                    <span style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      backgroundColor: isSelected ? '#FFFFFF' : 'var(--accent-success)'
                    }} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda Timeline */}
      <div className="aura-card" style={{ padding: '20px', marginBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Selected Agenda
            </span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              {formattedSelectedTitle}
            </h3>
          </div>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary"
            style={{ width: 'auto', padding: '8px 14px', fontSize: '0.82rem', gap: '6px' }}
          >
            <Plus size={15} /> Add Task
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Day Routines */}
          {dayRoutines.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Sparkles size={14} color="var(--accent-purple)" />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-purple)' }}>
                  Recurring Day Routines
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {dayRoutines.map(r => (
                  <div 
                    key={r.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--accent-purple-soft)',
                      color: 'var(--accent-purple)',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                  >
                    <Clock size={12} />
                    <span>{r.title} ({r.day})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scheduled Tasks for Date */}
          {dayTasks.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <CheckSquare size={14} color="var(--accent-primary)" />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                  Scheduled Tasks
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {dayTasks.map(t => (
                  <div 
                    key={t.id}
                    onClick={() => toggleTask(t.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className={`checkbox-custom ${t.completed ? 'checked' : ''}`}>
                        {t.completed && <Check size={12} strokeWidth={3} />}
                      </div>
                      <span style={{
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        color: t.completed ? 'var(--text-tertiary)' : 'var(--text-primary)',
                        textDecoration: t.completed ? 'line-through' : 'none'
                      }}>
                        {t.title}
                      </span>
                    </div>

                    <span className="badge-pill" style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', fontSize: '0.72rem' }}>
                      {t.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scheduled Reminders */}
          {dayReminders.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Bell size={14} color="var(--accent-warning)" />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-warning)' }}>
                  Due Reminders
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {dayReminders.map(r => (
                  <div 
                    key={r.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--accent-warning-soft)',
                      border: '1px solid rgba(255, 149, 0, 0.2)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                      🔔 {r.title}
                    </span>
                    {r.amount && (
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-warning)' }}>
                        {r.amount}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {dayRoutines.length === 0 && dayTasks.length === 0 && dayReminders.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '24px 16px',
              color: 'var(--text-tertiary)',
              fontSize: '0.85rem',
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-color)'
            }}>
              No items scheduled for this date. Click "+ Add Task" to schedule something!
            </div>
          )}
        </div>
      </div>

      {/* Add Task for Date Modal */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '4px' }}>Add Event to Date</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '16px' }}>
              Scheduled for {formattedSelectedTitle} ({selectedDate})
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
                  Schedule Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
