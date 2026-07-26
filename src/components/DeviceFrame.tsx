import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
  enabled: boolean;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children, enabled }) => {
  if (!enabled) {
    return <div className="app-container animate-fade-in">{children}</div>;
  }

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).replace(' ', '');

  return (
    <div className="app-container device-shell animate-fade-in">
      {/* iOS Status Bar Mockup (Hidden on actual phone screen) */}
      <div 
        className="ios-status-bar-mock"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 24px 4px 24px',
          fontSize: '0.8rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          zIndex: 999,
          background: 'var(--bg-primary)'
        }}
      >
        <span>{currentTime}</span>
        
        {/* Dynamic Island / Notch Mockup */}
        <div style={{
          width: '90px',
          height: '24px',
          backgroundColor: '#000000',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1c1c1e', marginRight: '6px' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Signal size={12} />
          <Wifi size={12} />
          <Battery size={14} />
        </div>
      </div>

      {children}

      {/* iOS Home Indicator Bar */}
      <div style={{
        position: 'fixed',
        bottom: '8px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '130px',
        height: '4px',
        backgroundColor: 'var(--text-muted)',
        opacity: 0.5,
        borderRadius: '2px',
        zIndex: 1001,
        pointerEvents: 'none'
      }} />
    </div>
  );
};
