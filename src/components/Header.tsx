import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Sun, Moon, Bell, Smartphone, Monitor, UserCheck, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications }) => {
  const { 
    userName, 
    setUserName, 
    theme, 
    toggleTheme, 
    notifications,
    resetAllData 
  } = useStore();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userName);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
    }
    setIsEditingName(false);
  };

  return (
    <header className="header-container" style={{ padding: '24px 24px 12px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          {formattedDate}
        </span>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Theme Toggle */}
          <button 
            className="icon-btn" 
            onClick={toggleTheme}
            title="Toggle Theme"
            style={{ width: '36px', height: '36px' }}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Notification Button */}
          <button 
            className="icon-btn" 
            onClick={onOpenNotifications}
            style={{ position: 'relative', width: '36px', height: '36px' }}
            title="Notifications"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-rose)'
              }} />
            )}
          </button>

          {/* Reset Demo Data Button */}
          <button 
            className="icon-btn" 
            onClick={() => {
              if (window.confirm("Reset dashboard data back to defaults?")) resetAllData();
            }}
            title="Reset Demo Data"
            style={{ width: '36px', height: '36px' }}
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        {isEditingName ? (
          <form onSubmit={handleNameSubmit} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              autoFocus
              className="input-text"
              style={{ fontSize: '1.5rem', fontWeight: 800, padding: '4px 8px' }}
            />
            <button type="submit" className="icon-btn" style={{ width: '32px', height: '32px' }}>
              <UserCheck size={16} />
            </button>
          </form>
        ) : (
          <h1 
            onClick={() => setIsEditingName(true)}
            style={{ 
              fontSize: '1.75rem', 
              fontWeight: 800, 
              color: 'var(--text-primary)',
              letterSpacing: '-0.5px',
              cursor: 'pointer'
            }}
            title="Click to edit name"
          >
            {getGreeting()}, <span style={{ color: 'var(--accent-primary)' }}>{userName}</span>
          </h1>
        )}
      </div>
    </header>
  );
};
