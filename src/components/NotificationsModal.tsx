import React from 'react';
import { useStore } from '../store/useStore';
import { X, Bell, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const { notifications, dismissNotification } = useStore();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'assistant': return <Sparkles size={18} color="var(--accent-purple)" />;
      case 'reminder': return <AlertCircle size={18} color="var(--accent-warning)" />;
      case 'streak': return <CheckCircle2 size={18} color="var(--accent-success)" />;
      default: return <Bell size={18} color="var(--accent-primary)" />;
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          width: '100%',
          maxWidth: '440px',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-color)',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Daily Notifications
          </h2>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {notifications.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            <Bell size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
            <p>No new notifications right now. Everything is peaceful!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notifications.map((n) => (
              <div 
                key={n.id}
                style={{
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div style={{ paddingTop: '2px' }}>{getIcon(n.type)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {n.title}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                      {n.date}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    {n.body}
                  </p>
                </div>
                <button 
                  onClick={() => dismissNotification(n.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '2px' }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
