import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DrawerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const DrawerPanel: React.FC<DrawerPanelProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '460px'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'stretch',
        zIndex: 999999,
        transition: 'opacity 0.2s ease'
      }}
    >
      {/* Desktop Slide-over Right Panel & Mobile Bottom Sheet */}
      <div
        className="drawer-surface animate-slide-right"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)',
          width: '100%',
          maxWidth,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-12px 0 40px rgba(0, 0, 0, 0.1)',
          borderLeft: '1px solid var(--border-color)',
          padding: '24px',
          boxSizing: 'border-box',
          overflowY: 'auto'
        }}
      >
        {/* Panel Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            {title && (
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
                {title}
              </h2>
            )}
            {subtitle && (
              <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: '2px', display: 'block' }}>
                {subtitle}
              </span>
            )}
          </div>

          <button 
            className="icon-btn" 
            onClick={onClose}
            style={{ width: '32px', height: '32px', flexShrink: 0 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Panel Body */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DrawerPanel;
