'use client';

import React, { useState } from 'react';
import { User, X, Check } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSaveUser: (user: any) => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSaveUser,
}) => {
  const [name, setName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveUser({ ...user, fullName: name, email });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md glass-panel rounded-2xl border border-white/20 p-6 shadow-2xl space-y-4 bg-slate-900">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-white font-extrabold text-sm">
            <User className="w-4 h-4 text-teal-400" />
            <span>Profile & Life Settings</span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-3 text-xs">
          <div>
            <label className="text-slate-400 font-bold uppercase text-[10px]">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="text-slate-400 font-bold uppercase text-[10px]">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-xl bg-white/5 text-slate-300">
              Cancel
            </button>
            <button type="submit" className="px-4 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold shadow">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
