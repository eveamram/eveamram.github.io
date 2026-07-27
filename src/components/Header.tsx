import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Sun, Moon, Bell, UserCheck, RefreshCw, ShieldCheck, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenNotifications, 
  onOpenAuth, 
  onOpenAdmin, 
  isSidebarOpen,
  onToggleSidebar 
}) => {
  const { 
    userName, 
    setUserName, 
    theme, 
    toggleTheme, 
    currentProfile,
    notifications,
    resetAllData,
    globalData
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
    weekday: 'short',
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
    <header className="header-container" style={{ padding: '20px 24px 12px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        {/* Concentric Ring Aura Brand Logo, Open/Close Menu Button & Date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onToggleSidebar}
            className="sidebar-toggle-btn"
            title={isSidebarOpen ? "Close Side Menu" : "Open Side Menu"}
            style={{
              padding: '8px 12px',
              fontSize: '0.82rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: isSidebarOpen ? 'var(--accent-soft)' : 'var(--bg-tertiary)',
              color: isSidebarOpen ? 'var(--accent-primary)' : 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
            <span style={{ fontSize: '0.8rem' }}>{isSidebarOpen ? 'Close Menu' : 'Menu'}</span>
          </button>

          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 50%, #AF52DE 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(88, 86, 214, 0.35)',
            color: '#FFFFFF'
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" stroke="white" strokeWidth="2.2" strokeOpacity="0.45" />
              <circle cx="12" cy="12" r="4.5" fill="white" />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.6px', color: 'var(--text-primary)', lineHeight: 1 }}>
              AURA
            </span>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.6px', textTransform: 'uppercase', marginTop: '3px' }}>
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Admin Control Panel Button */}
          <button
            className="icon-btn"
            onClick={onOpenAdmin}
            title="Open Admin Control Panel"
            style={{ width: '36px', height: '36px', color: 'var(--accent-teal)', background: 'var(--accent-teal-soft)' }}
          >
            <ShieldCheck size={18} />
          </button>

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

      {/* Greeting Banner */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <h1 
          style={{ 
            fontSize: '1.75rem', 
            fontWeight: 800, 
            color: 'var(--text-primary)',
            letterSpacing: '-0.5px'
          }}
        >
          {getGreeting()}
        </h1>
      </div>
    </header>
  );
};

export default Header;
