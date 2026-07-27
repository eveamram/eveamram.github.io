import React from 'react';
import { useStore } from '../store/useStore';
import { Bell, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface HeaderProps {
  onOpenNotifications: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenNotifications, 
  isSidebarOpen,
  onToggleSidebar 
}) => {
  const { notifications, currentProfile } = useStore();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="header-container" style={{ padding: '16px 24px 8px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left Side: Side Menu Toggle Button & Active Character Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onToggleSidebar}
            className="sidebar-toggle-btn"
            title={isSidebarOpen ? "Close Side Menu" : "Open Side Menu"}
            style={{
              padding: '8px 14px',
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
            <span style={{ fontSize: '0.82rem' }}>{isSidebarOpen ? 'Close Menu' : 'Menu'}</span>
          </button>

          {/* Active Character Profile Logo Badge */}
          <div 
            onClick={onToggleSidebar}
            title={`Active Character: ${currentProfile.name}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '1rem' }}>{currentProfile.avatarEmoji}</span>
            <span>{currentProfile.name}</span>
          </div>
        </div>

        {/* Right Side: Notification Button */}
        <button 
          className="icon-btn" 
          onClick={onOpenNotifications}
          style={{ position: 'relative', width: '38px', height: '38px' }}
          title="Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-rose)'
            }} />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
