import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../store/useStore';
import { UserProfile } from '../types';
import { Plus, Check, ShieldCheck, X, Pencil } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { profiles, currentProfile, switchProfile, createProfile, updateProfile } = useStore();

  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [profileNameInput, setProfileNameInput] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('✨');
  const [selectedColor, setSelectedColor] = useState('#007AFF');

  if (!isOpen) return null;

  const avatarOptions = [
    '✨', '🌿', '🏋️‍♀️', '🚀', '⚡', '💡', '🎨', '🧘', '👑', '🎯', 
    '🌸', '☕', '🔥', '📚', '🌟', '🦄', '🎧', '🌊', '🌙', '💎'
  ];
  const colorOptions = ['#007AFF', '#AF52DE', '#34C759', '#FF9500', '#FF2D55', '#30B0C7'];

  const handleStartCreate = () => {
    setProfileNameInput('');
    setSelectedEmoji('✨');
    setSelectedColor('#007AFF');
    setEditingProfileId(null);
    setMode('create');
  };

  const handleStartEdit = (e: React.MouseEvent, profile: UserProfile) => {
    e.stopPropagation();
    setEditingProfileId(profile.id);
    setProfileNameInput(profile.name);
    setSelectedEmoji(profile.avatarEmoji || '✨');
    setSelectedColor(profile.color || '#007AFF');
    setMode('edit');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileNameInput.trim()) return;

    if (mode === 'edit' && editingProfileId) {
      updateProfile(editingProfileId, profileNameInput.trim(), selectedEmoji, selectedColor);
    } else {
      createProfile(profileNameInput.trim(), selectedEmoji, selectedColor);
    }

    setMode('list');
    setEditingProfileId(null);
    onClose();
  };

  const handleSwitch = (profile: UserProfile) => {
    switchProfile(profile.id);
    onClose();
  };

  const modalContent = (
    <div 
      className="modal-backdrop" 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        padding: '20px'
      }}
    >
      <div 
        className="modal-sheet animate-pop-in" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          width: '100%',
          maxWidth: '440px',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-color)',
          maxHeight: '85vh',
          overflowY: 'auto',
          margin: 'auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} color="var(--accent-primary)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {mode === 'edit' ? 'Edit Profile & Avatar' : mode === 'create' ? 'Create Account Profile' : 'Switch Profile'}
              </h2>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {mode === 'list' 
                ? 'Select who is using Aura dashboard today' 
                : 'Customize your avatar emoji, profile name, and color theme'}
            </p>
          </div>

          <button className="icon-btn" onClick={onClose} style={{ width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        </div>

        {mode === 'list' ? (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {profiles.map((p) => {
                const isActive = currentProfile?.id === p.id;

                return (
                  <div
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
                      transition: 'all 0.2s ease'
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
                          {isActive ? 'Logged In Now' : 'Tap to switch'}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={(e) => handleStartEdit(e, p)}
                        style={{
                          background: 'var(--bg-tertiary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '6px 10px',
                          color: 'var(--text-secondary)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.2s ease'
                        }}
                        title="Edit profile name & icon"
                      >
                        <Pencil size={13} /> Edit
                      </button>

                      {isActive && (
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
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleStartCreate}
              className="btn-secondary"
              style={{ width: '100%', gap: '8px', padding: '12px' }}
            >
              <Plus size={16} /> Create New Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Profile Name</label>
              <input
                type="text"
                placeholder="e.g. Eve, Alex, Jordan..."
                value={profileNameInput}
                onChange={(e) => setProfileNameInput(e.target.value)}
                className="input-text"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Choose Avatar Icon</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', maxHeight: '120px', overflowY: 'auto', padding: '4px 0' }}>
                {avatarOptions.map(emoji => (
                  <button
                    type="button"
                    key={emoji}
                    onClick={() => setSelectedEmoji(emoji)}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-md)',
                      border: selectedEmoji === emoji ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      background: selectedEmoji === emoji ? 'var(--accent-soft)' : 'var(--bg-tertiary)',
                      fontSize: '1.3rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

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
              <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setMode('list')}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                {mode === 'edit' ? 'Save Profile Changes' : 'Create Profile'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
