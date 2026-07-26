import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { UserProfile } from '../types';
import { User, Plus, Check, ShieldCheck, X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { profiles, currentProfile, switchProfile, createProfile } = useStore();

  const [isCreating, setIsCreating] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('✨');
  const [selectedColor, setSelectedColor] = useState('#007AFF');

  if (!isOpen) return null;

  const avatarOptions = ['✨', '🌿', '🏋️‍♀️', '🚀', '⚡', '💡', '🎨', '🧘', '👑', '🎯'];
  const colorOptions = ['#007AFF', '#AF52DE', '#34C759', '#FF9500', '#FF2D55', '#30B0C7'];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;

    createProfile(newProfileName.trim(), selectedEmoji, selectedColor);
    setNewProfileName('');
    setIsCreating(false);
    onClose();
  };

  const handleSwitch = (profile: UserProfile) => {
    switchProfile(profile.id);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet animate-slide-up" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="modal-handle" />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} color="var(--accent-primary)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {isCreating ? 'Create Account Profile' : 'Switch Profile'}
              </h2>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {isCreating ? 'Each profile saves its own routines, tasks & fitness splits' : 'Select who is using Aura dashboard today'}
            </p>
          </div>

          <button className="icon-btn" onClick={onClose} style={{ width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        </div>

        {!isCreating ? (
          <div>
            {/* List of User Profiles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {profiles.map((p) => {
                const isActive = currentProfile?.id === p.id;

                return (
                  <button
                    key={p.id}
                    onClick={() => handleSwitch(p)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: isActive ? `2px solid ${p.color || 'var(--accent-primary)'}` : '1px solid var(--border-color)',
                      background: isActive ? 'var(--bg-tertiary)' : 'var(--bg-card)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: p.color ? `${p.color}20` : 'var(--accent-soft)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.4rem'
                      }}>
                        {p.avatarEmoji || '✨'}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {p.name}
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                          {isActive ? 'Logged In Now' : 'Tap to log in'}
                        </span>
                      </div>
                    </div>

                    {isActive ? (
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: p.color || 'var(--accent-primary)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Check size={14} strokeWidth={3} />
                      </div>
                    ) : (
                      <span className="badge-pill" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                        Log In
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setIsCreating(true)}
              className="btn-secondary"
              style={{ width: '100%', gap: '8px', padding: '12px' }}
            >
              <Plus size={16} /> Create New Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreateSubmit}>
            <div className="form-group">
              <label className="form-label">Profile Name</label>
              <input
                type="text"
                placeholder="e.g. Alex, Jordan, Sarah..."
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                className="input-text"
                required
                autoFocus
              />
            </div>

            {/* Avatar Selector */}
            <div className="form-group">
              <label className="form-label">Choose Avatar Emoji</label>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }} className="scroll-hide">
                {avatarOptions.map(emoji => (
                  <button
                    type="button"
                    key={emoji}
                    onClick={() => setSelectedEmoji(emoji)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-sm)',
                      border: selectedEmoji === emoji ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      background: selectedEmoji === emoji ? 'var(--accent-soft)' : 'var(--bg-tertiary)',
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color Selector */}
            <div className="form-group">
              <label className="form-label">Choose Theme Accent Color</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {colorOptions.map(color => (
                  <button
                    type="button"
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: color,
                      border: selectedColor === color ? '3px solid var(--text-primary)' : 'none',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease',
                      transform: selectedColor === color ? 'scale(1.15)' : 'scale(1)'
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
              <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setIsCreating(false)}>
                Back
              </button>
              <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                Log In & Save Profile
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
