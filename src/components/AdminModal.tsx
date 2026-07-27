import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { DayOfWeek } from '../types';
import { DrawerPanel } from './common/DrawerPanel';
import { 
  ShieldCheck, 
  Dumbbell, 
  Calendar, 
  Megaphone, 
  Settings, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const { 
    globalData, 
    updateGlobalWorkoutSplits, 
    updateGlobalRoutines, 
    updateGlobalAnnouncements,
    updateGlobalSettings 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'splits' | 'routines' | 'announcements' | 'settings'>('splits');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Edit Workout Splits state
  const [splitDraft, setSplitDraft] = useState(globalData.workoutSplits);

  // Announcements draft state
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');

  // Routine task draft state
  const [routineTitle, setRoutineTitle] = useState('');
  const [routineDay, setRoutineDay] = useState<DayOfWeek>('Monday');

  // App settings state
  const [globalNoticeDraft, setGlobalNoticeDraft] = useState(globalData.appSettings.globalNotice);

  if (!isOpen) return null;

  const showSaveToast = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleSaveSplits = () => {
    updateGlobalWorkoutSplits(splitDraft);
    showSaveToast('Global workout splits saved & synced live!');
  };

  const handleUpdateSplitTitle = (day: DayOfWeek, title: string) => {
    setSplitDraft(prev => prev.map(s => s.day === day ? { ...s, focusTitle: title } : s));
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementMessage.trim()) return;

    const newAnn = {
      id: 'ann_' + Date.now(),
      title: announcementTitle.trim(),
      message: announcementMessage.trim(),
      date: new Date().toISOString().split('T')[0],
      priority: 'high' as const
    };

    updateGlobalAnnouncements([newAnn, ...globalData.announcements]);
    setAnnouncementTitle('');
    setAnnouncementMessage('');
    showSaveToast('Announcement broadcasted to all users live!');
  };

  const handleDeleteAnnouncement = (id: string) => {
    updateGlobalAnnouncements(globalData.announcements.filter(a => a.id !== id));
    showSaveToast('Announcement removed.');
  };

  const handleAddRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routineTitle.trim()) return;

    const newRoutine = {
      id: 'r_' + Date.now(),
      day: routineDay,
      title: routineTitle.trim(),
      completedDates: [],
      iconName: 'Sparkles'
    };

    updateGlobalRoutines([...globalData.routineTemplates, newRoutine]);
    setRoutineTitle('');
    showSaveToast('Global routine template added!');
  };

  const handleDeleteRoutine = (id: string) => {
    updateGlobalRoutines(globalData.routineTemplates.filter(r => r.id !== id));
    showSaveToast('Global routine template removed.');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateGlobalSettings({
      ...globalData.appSettings,
      globalNotice: globalNoticeDraft
    });
    showSaveToast('Global app settings updated live!');
  };

  return (
    <DrawerPanel
      isOpen={isOpen}
      onClose={onClose}
      title="Global Admin Control Panel"
      subtitle="Changes sync live to all connected devices in real time"
      maxWidth="540px"
    >

        {/* Success Toast Banner */}
        {successMessage && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--accent-teal-soft)',
            color: 'var(--accent-teal)',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle size={16} />
            {successMessage}
          </div>
        )}

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '16px' }}>
          {[
            { id: 'splits', label: 'Workout Splits', icon: <Dumbbell size={16} /> },
            { id: 'routines', label: 'Routines', icon: <Calendar size={16} /> },
            { id: 'announcements', label: 'Announcements', icon: <Megaphone size={16} /> },
            { id: 'settings', label: 'Global Settings', icon: <Settings size={16} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: activeTab === tab.id ? 'var(--accent-teal-soft)' : 'transparent',
                color: activeTab === tab.id ? 'var(--accent-teal)' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: activeTab === tab.id ? 700 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
          {/* 1. Workout Splits */}
          {activeTab === 'splits' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Edit Global Weekly Workout Split
                </span>
                <button 
                  onClick={handleSaveSplits}
                  className="btn-primary" 
                  style={{ padding: '6px 14px', fontSize: '0.78rem', gap: '6px' }}
                >
                  <Save size={14} /> Save & Broadcast
                </button>
              </div>

              {splitDraft.map(split => (
                <div 
                  key={split.day} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <span style={{ width: '90px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-teal)' }}>
                    {split.day}
                  </span>
                  <input
                    type="text"
                    value={split.focusTitle}
                    onChange={(e) => handleUpdateSplitTitle(split.day, e.target.value)}
                    style={{
                      flex: 1,
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* 2. Routine Templates */}
          {activeTab === 'routines' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <form onSubmit={handleAddRoutine} style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={routineDay}
                  onChange={(e) => setRoutineDay(e.target.value as DayOfWeek)}
                  className="input-text"
                  style={{ width: '110px' }}
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Routine task (e.g. 15min Morning Meditation)..."
                  value={routineTitle}
                  onChange={(e) => setRoutineTitle(e.target.value)}
                  className="input-text"
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '0 14px', fontSize: '0.8rem' }}>
                  <Plus size={14} /> Add
                </button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                {globalData.routineTemplates.map(r => (
                  <div
                    key={r.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge-pill" style={{ fontSize: '0.65rem' }}>{r.day}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{r.title}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteRoutine(r.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Global Announcements */}
          {activeTab === 'announcements' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <form onSubmit={handleAddAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Announcement Title (e.g. New Features Updated!)..."
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  className="input-text"
                  required
                />
                <textarea
                  placeholder="Message content for all app users..."
                  value={announcementMessage}
                  onChange={(e) => setAnnouncementMessage(e.target.value)}
                  className="input-text"
                  style={{ minHeight: '60px', resize: 'vertical' }}
                  required
                />
                <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end', padding: '8px 16px' }}>
                  <Megaphone size={14} /> Broadcast Announcement
                </button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                {globalData.announcements.map(ann => (
                  <div
                    key={ann.id}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>{ann.title}</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>{ann.date}</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{ann.message}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteAnnouncement(ann.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Global Settings */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Global App Banner Notice</label>
                <input
                  type="text"
                  value={globalNoticeDraft}
                  onChange={(e) => setGlobalNoticeDraft(e.target.value)}
                  className="input-text"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                  App Version: {globalData.appSettings.version}
                </span>
                <button type="submit" className="btn-primary" style={{ padding: '8px 16px' }}>
                  <Save size={14} /> Save Global Notice
                </button>
              </div>
            </form>
          )}
        </div>
    </DrawerPanel>
  );
};

export default AdminModal;
