'use client';

import React from 'react';
import { Bell, X, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignments: any[];
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-16 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm glass-panel rounded-2xl border border-white/20 p-4 shadow-2xl space-y-3 bg-slate-900/95">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2 text-white font-bold text-xs">
            <Bell className="w-4 h-4 text-teal-400" />
            <span>Notifications & Reminders</span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-200">
            <div className="font-bold">🛒 Pantry Restock Reminder</div>
            <div className="text-[10px] text-slate-300 mt-0.5">Almond milk and eggs are below low-stock threshold.</div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
            <div className="font-bold">⏰ Rent & Utility Bill Due</div>
            <div className="text-[10px] text-slate-300 mt-0.5">Pay monthly rent before 5:00 PM today.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
