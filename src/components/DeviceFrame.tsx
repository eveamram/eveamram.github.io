import React from 'react';

interface DeviceFrameProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  return (
    <div className="app-container">
      {children}
    </div>
  );
};
