import React from 'react';
import { useStore } from '../store/useStore';
import { ActiveTab } from '../types';
import { Home, CheckSquare, Activity, ShoppingBag, Bell, Calendar, ShieldCheck, Moon, Sun, X } from 'lucide-react';

interface SidebarProps {
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onOpenNotifications: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const SidebarNavigation: React.FC<SidebarProps> = ({ 
  onOpenAuth, 
  onOpenAdmin, 
  onOpenNotifications,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const { activeTab, setActiveTab, currentProfile, theme, toggleTheme, notifications } = useStore();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Today', icon: <Home size={18} /> },
    { id: 'tasks', label: 'To-Do', icon: <CheckSquare size={18} /> },
    { id: 'habits', label: 'Habits', icon: <Activity size={18} /> },
    { id: 'reminders', label: 'Reminders', icon: <Bell size={18} /> },
    { id: 'groceries', label: 'Groceries', icon: <ShoppingBag size={18} /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar size={18} /> },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleTabClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    if (onCloseMobile) onCloseMobile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 99999,
            display: 'block'
          }}
        />
      )}

      <aside
        className={`sidebar-container ${isOpenMobile ? 'mobile-open' : ''}`}
        style={{
          width: '260px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          background: 'var(--bg-card)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px 16px',
          boxSizing: 'border-box',
          flexShrink: 0
        }}
      >
      {/* Top Section: Brand & Nav Links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Brand Logo Header & Mobile Close */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 50%, #AF52DE 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(88, 86, 214, 0.3)',
              color: '#FFFFFF'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="8" stroke="white" strokeWidth="2.2" strokeOpacity="0.45" />
                <circle cx="12" cy="12" r="4.5" fill="white" />
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 900, letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
                AURA
              </span>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent-teal)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Dashboard
              </span>
            </div>
          </div>

          {isOpenMobile && onCloseMobile && (
            <button
              onClick={onCloseMobile}
              style={{
                background: 'var(--bg-tertiary)',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Close Menu"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Sidebar Nav Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: isActive ? 'var(--accent-teal-soft)' : 'transparent',
                  color: isActive ? 'var(--accent-teal)' : 'var(--text-secondary)',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 800 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', color: isActive ? 'var(--accent-teal)' : 'var(--text-tertiary)' }}>
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Profile & Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
        {/* Profile Card Button */}
        <button
          onClick={onOpenAuth}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 12px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            cursor: 'pointer',
            textAlign: 'left'
          }}
          title="Switch or Edit Profile"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.25rem' }}>{currentProfile.avatarEmoji}</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {currentProfile.name}
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>
                Active Profile
              </span>
            </div>
          </div>
        </button>

        {/* Quick Utility Actions */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={toggleTheme}
            className="btn-secondary"
            style={{ flex: 1, padding: '8px', fontSize: '0.78rem', gap: '6px' }}
            title="Toggle Light/Dark Theme"
          >
            {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />} Theme
          </button>

          <button
            onClick={onOpenAdmin}
            className="btn-secondary"
            style={{ padding: '8px 12px', fontSize: '0.78rem', color: 'var(--accent-teal)' }}
            title="Admin Panel"
          >
            <ShieldCheck size={16} />
          </button>
        </div>
      </div>
    </aside>
  </>
  );
};

export default SidebarNavigation;
