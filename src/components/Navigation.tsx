import React from 'react';
import { useStore } from '../store/useStore';
import { ActiveTab } from '../types';
import { Home, CheckSquare, Activity, Bell, Calendar } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab } = useStore();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Today', icon: <Home size={20} /> },
    { id: 'tasks', label: 'To-Do', icon: <CheckSquare size={20} /> },
    { id: 'habits', label: 'Habits', icon: <Activity size={20} /> },
    { id: 'reminders', label: 'Reminders', icon: <Bell size={20} /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar size={20} /> },
  ];

  const handleTabClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    // Scroll parent container to top smoothly
    const container = document.querySelector('.app-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleTabClick(item.id)}
            className={`nav-item ${isActive ? 'active' : ''}`}
            aria-label={item.label}
          >
            <div style={{ 
              transform: isActive ? 'scale(1.15) translateY(-2px)' : 'scale(1)', 
              transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {item.icon}
            </div>
            <span style={{ fontSize: '0.72rem', marginTop: '2px' }}>{item.label}</span>
            {isActive && (
              <span style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-primary)',
                marginTop: '1px'
              }} />
            )}
          </button>
        );
      })}
    </nav>
  );
};
