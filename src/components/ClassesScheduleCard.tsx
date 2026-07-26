import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { DayOfWeek } from '../types';
import { GraduationCap, Clock, MapPin, Plus, Trash2, CheckCircle2, X } from 'lucide-react';

export interface ClassItem {
  id: string;
  day: DayOfWeek;
  name: string;
  time: string;
  location: string;
  type?: string; // e.g. Lecture, Lab, Seminar, Online
  completed?: boolean;
}

const INITIAL_CLASSES: ClassItem[] = [
  { id: 'c1', day: 'Monday', name: 'Computer Science 101', time: '09:00 AM - 10:30 AM', location: 'Turing Hall 201', type: 'Lecture' },
  { id: 'c2', day: 'Monday', name: 'Calculus II', time: '11:00 AM - 12:30 PM', location: 'Math Building 104', type: 'Lecture' },
  { id: 'c3', day: 'Tuesday', name: 'Organic Chemistry Lab', time: '01:00 PM - 03:30 PM', location: 'Science Center 302', type: 'Lab' },
  { id: 'c4', day: 'Wednesday', name: 'Computer Science 101', time: '09:00 AM - 10:30 AM', location: 'Turing Hall 201', type: 'Lecture' },
  { id: 'c5', day: 'Thursday', name: 'Psychology & Cognition', time: '02:00 PM - 03:30 PM', location: 'Humanities 115', type: 'Seminar' },
  { id: 'c6', day: 'Friday', name: 'Linear Algebra', time: '10:00 AM - 11:30 AM', location: 'Math Building 108', type: 'Lecture' },
];

export const ClassesScheduleCard: React.FC = () => {
  const { triggerConfetti } = useStore();
  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const todayIndex = new Date().getDay(); // 0 is Sun, 1 is Mon...
  const todayDayName: DayOfWeek = days[todayIndex === 0 ? 6 : todayIndex - 1];

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(todayDayName);
  const [classList, setClassList] = useState<ClassItem[]>(() => {
    const saved = localStorage.getItem('aura_dashboard_classes_v1');
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassTime, setNewClassTime] = useState('');
  const [newClassLocation, setNewClassLocation] = useState('');
  const [newClassType, setNewClassType] = useState('Lecture');

  const saveClasses = (newList: ClassItem[]) => {
    setClassList(newList);
    localStorage.setItem('aura_dashboard_classes_v1', JSON.stringify(newList));
  };

  const handleToggleClassCompleted = (id: string) => {
    const updated = classList.map(c => c.id === id ? { ...c, completed: !c.completed } : c);
    saveClasses(updated);
    triggerConfetti();
  };

  const handleDeleteClass = (id: string) => {
    const updated = classList.filter(c => c.id !== id);
    saveClasses(updated);
  };

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const newClass: ClassItem = {
      id: 'c_' + Date.now(),
      day: selectedDay,
      name: newClassName.trim(),
      time: newClassTime.trim() || '10:00 AM - 11:30 AM',
      location: newClassLocation.trim() || 'Main Campus',
      type: newClassType
    };

    saveClasses([...classList, newClass]);
    setNewClassName('');
    setNewClassTime('');
    setNewClassLocation('');
    setIsAddModalOpen(false);
  };

  const dayClasses = classList.filter(c => c.day === selectedDay);

  return (
    <div className="aura-card">
      {/* Top Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: 'var(--accent-purple-soft)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-purple)'
          }}>
            <GraduationCap size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>
              Classes of the Day
            </h3>
          </div>
        </div>

        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary"
          style={{ width: 'auto', padding: '6px 12px', fontSize: '0.78rem', gap: '4px' }}
        >
          <Plus size={14} /> Add Class
        </button>
      </div>

      {/* Weekday Selector Pill Bar */}
      <div className="scroll-hide" style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '14px' }}>
        {days.map((day) => {
          const isSelected = selectedDay === day;
          const isToday = day === todayDayName;
          const count = classList.filter(c => c.day === day).length;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              style={{
                background: isSelected ? 'var(--accent-purple)' : 'var(--bg-tertiary)',
                color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                border: '1px solid ' + (isSelected ? 'var(--accent-purple)' : 'var(--border-color)'),
                borderRadius: 'var(--radius-full)',
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: isSelected ? 800 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
            >
              <span>{day.substring(0, 3)}</span>
              {count > 0 && (
                <span style={{
                  fontSize: '0.68rem',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                  background: isSelected ? 'rgba(255,255,255,0.25)' : 'var(--accent-purple-soft)',
                  color: isSelected ? '#FFFFFF' : 'var(--accent-purple)',
                  fontWeight: 700
                }}>
                  {count}
                </span>
              )}
              {isToday && (
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: isSelected ? '#FFF' : 'var(--accent-purple)' }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Classes List for Selected Day */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {dayClasses.length === 0 ? (
          <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
            <p style={{ fontWeight: 600 }}>No classes scheduled for {selectedDay}</p>
            <p style={{ fontSize: '0.78rem', marginTop: '2px', opacity: 0.8 }}>Enjoy your free time or add a study session!</p>
          </div>
        ) : (
          dayClasses.map((item) => (
            <div
              key={item.id}
              style={{
                background: item.completed ? 'var(--bg-tertiary)' : 'var(--bg-card)',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                opacity: item.completed ? 0.7 : 1,
                transition: 'all 0.2s ease'
              }}
            >
              <div 
                onClick={() => handleToggleClassCompleted(item.id)}
                style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', flex: 1 }}
              >
                <div style={{ paddingTop: '2px' }}>
                  <CheckCircle2 
                    size={20} 
                    color={item.completed ? 'var(--accent-success)' : 'var(--text-muted)'} 
                    fill={item.completed ? 'var(--accent-success-soft)' : 'transparent'} 
                  />
                </div>
                <div>
                  <h4 style={{ 
                    fontSize: '0.92rem', 
                    fontWeight: 700, 
                    color: 'var(--text-primary)',
                    textDecoration: item.completed ? 'line-through' : 'none'
                  }}>
                    {item.name}
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginTop: '4px', fontSize: '0.76rem', color: 'var(--text-tertiary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={12} color="var(--accent-primary)" /> {item.time}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <MapPin size={12} color="var(--accent-rose)" /> {item.location}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {item.type && (
                  <span className="badge-pill" style={{ background: 'var(--accent-purple-soft)', color: 'var(--accent-purple)', fontSize: '0.7rem' }}>
                    {item.type}
                  </span>
                )}
                <button
                  onClick={() => handleDeleteClass(item.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                  title="Remove class"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Class Modal */}
      {isAddModalOpen && (
        <div 
          onClick={() => setIsAddModalOpen(false)}
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
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Add Class for {selectedDay}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="icon-btn" style={{ cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddClass}>
              <div className="form-group">
                <label className="form-label">Course Name</label>
                <input
                  type="text"
                  placeholder="e.g. Psychology 101, Calculus II..."
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="input-text"
                  required
                  autoFocus
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Class Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM - 11:30 AM"
                    value={newClassTime}
                    onChange={(e) => setNewClassTime(e.target.value)}
                    className="input-text"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select 
                    value={newClassType} 
                    onChange={(e) => setNewClassType(e.target.value)}
                    className="select-input"
                  >
                    <option value="Lecture">Lecture</option>
                    <option value="Lab">Lab Session</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Online">Online / Zoom</option>
                    <option value="Recitation">Recitation</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Location / Room</label>
                <input
                  type="text"
                  placeholder="e.g. Turing Hall 201 or Zoom Link"
                  value={newClassLocation}
                  onChange={(e) => setNewClassLocation(e.target.value)}
                  className="input-text"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassesScheduleCard;
