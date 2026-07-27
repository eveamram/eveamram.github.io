import React from 'react';
import { useStore } from '../store/useStore';
import { Bell, PanelLeftClose, PanelLeftOpen, Search, Plus, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  onOpenNotifications: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenCommandPalette: () => void;
  onOpenQuickAdd: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenNotifications, 
  isSidebarOpen,
  onToggleSidebar,
  onOpenCommandPalette,
  onOpenQuickAdd
}) => {
  const { notifications, currentProfile, saveStatus, theme, toggleTheme } = useStore();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="header-container" style={{ padding: '16px 24px 8px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
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
            title={`Active Profile: ${currentProfile.name}`}
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

          {/* Cloud Auto-Save Status Badge */}
          <div 
            title={saveStatus === 'saved' ? 'All changes saved to cloud database' : saveStatus === 'saving' ? 'Saving changes...' : saveStatus === 'offline' ? 'You are currently offline' : 'Save error'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: saveStatus === 'error' ? 'var(--accent-rose-soft)' : 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: saveStatus === 'error' ? 'var(--accent-rose)' : saveStatus === 'saving' ? 'var(--accent-primary)' : 'var(--text-tertiary)',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: saveStatus === 'saved' ? 'var(--accent-success)' : saveStatus === 'saving' ? 'var(--accent-primary)' : saveStatus === 'offline' ? 'var(--accent-warning)' : 'var(--accent-rose)'
            }} />
            <span>{saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving...' : saveStatus === 'offline' ? 'Offline' : 'Error'}</span>
          </div>
        </div>

        {/* Right Side: Command Center, Quick Add, Notifications, Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Command Palette Button */}
          <button
            onClick={onOpenCommandPalette}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.8rem', gap: '6px', height: '38px' }}
            title="Search & Commands (⌘K)"
          >
            <Search size={16} />
            <span className="desktop-only" style={{ fontWeight: 600 }}>Search</span>
            <kbd style={{ fontSize: '0.7rem', padding: '1px 4px', background: 'var(--bg-card)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>⌘K</kbd>
          </button>

          {/* Quick Add Button */}
          <button
            onClick={onOpenQuickAdd}
            className="btn-primary"
            style={{ padding: '6px 14px', fontSize: '0.8rem', gap: '4px', height: '38px' }}
            title="Quick Add Task, Grocery, or Habit"
          >
            <Plus size={16} />
            <span className="desktop-only">Add</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="icon-btn"
            style={{ width: '38px', height: '38px' }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={18} color="#FFD60A" /> : <Moon size={18} color="var(--accent-purple)" />}
          </button>

          {/* Notifications */}
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
      </div>
    </header>
  );
};

export default Header;
