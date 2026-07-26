import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  Bell, 
  Home, 
  Stethoscope, 
  FileText, 
  ShieldCheck, 
  Gift, 
  Package, 
  Plus, 
  Calendar, 
  X,
  Clock,
  Sparkles
} from 'lucide-react';

export const RemindersView: React.FC = () => {
  const { reminders, dismissReminder, addReminder } = useStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Bills' | 'Health' | 'Documents' | 'Birthdays' | 'Subscriptions' | 'Deliveries'>('Bills');
  const [dueDate, setDueDate] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const getIcon = (cat: string) => {
    switch (cat) {
      case 'Bills': return <Home size={20} color="var(--accent-warning)" />;
      case 'Health': return <Stethoscope size={20} color="var(--accent-rose)" />;
      case 'Documents': return <FileText size={20} color="var(--accent-teal)" />;
      case 'Birthdays': return <Gift size={20} color="var(--accent-purple)" />;
      case 'Deliveries': return <Package size={20} color="var(--accent-primary)" />;
      case 'Subscriptions': return <ShieldCheck size={20} color="var(--accent-success)" />;
      default: return <Bell size={20} color="var(--accent-primary)" />;
    }
  };

  const getDaysLeftText = (dueDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDateStr);
    due.setHours(0, 0, 0, 0);
    
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return { text: 'Today', color: 'var(--accent-rose)', bg: 'var(--accent-rose-soft)' };
    if (diffDays === 1) return { text: 'Tomorrow', color: 'var(--accent-warning)', bg: 'var(--accent-warning-soft)' };
    if (diffDays > 1) return { text: `In ${diffDays} days`, color: 'var(--accent-primary)', bg: 'var(--accent-soft)' };
    return { text: 'Past due', color: 'var(--text-tertiary)', bg: 'var(--bg-tertiary)' };
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    addReminder({
      title: title.trim(),
      category,
      dueDate,
      iconName: category,
      amount: amount.trim() || undefined,
      notes: notes.trim() || undefined
    });

    setTitle('');
    setDueDate('');
    setAmount('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  return (
    <div style={{ padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Important Reminders
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
            Calm visibility for life events & renewals
          </p>
        </div>

        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary"
          style={{ width: 'auto', padding: '8px 14px', fontSize: '0.85rem' }}
        >
          <Plus size={16} /> New Reminder
        </button>
      </div>

      {/* Reminders List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {reminders.length === 0 ? (
          <div className="aura-card" style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-tertiary)' }}>
            <Sparkles size={32} color="var(--accent-primary)" style={{ marginBottom: '8px', opacity: 0.8 }} />
            <p style={{ fontWeight: 600 }}>No active reminders</p>
            <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Your schedule is clear & calm.</p>
          </div>
        ) : (
          reminders.map((rem) => {
            const badge = getDaysLeftText(rem.dueDate);
            return (
              <div key={rem.id} className="aura-card" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                    <div style={{
                      background: 'var(--bg-tertiary)',
                      borderRadius: 'var(--radius-md)',
                      padding: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '2px'
                    }}>
                      {getIcon(rem.category)}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {rem.title}
                        </h3>
                        {rem.amount && (
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                            {rem.amount}
                          </span>
                        )}
                      </div>

                      {rem.notes && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                          {rem.notes}
                        </p>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} /> {rem.dueDate}
                        </span>
                        <span className="badge-pill" style={{ background: badge.bg, color: badge.color, fontSize: '0.7rem' }}>
                          <Clock size={10} /> {badge.text}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => dismissReminder(rem.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                    title="Dismiss reminder"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Reminder Modal */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>New Reminder</h3>
            
            <form onSubmit={handleAddReminder}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Passport Renewal, Dentist Appointment..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-text"
                  required
                  autoFocus
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="select-input"
                  >
                    <option value="Bills">Bills & Rent</option>
                    <option value="Health">Health & Medical</option>
                    <option value="Documents">Documents & Licenses</option>
                    <option value="Birthdays">Birthdays</option>
                    <option value="Subscriptions">Subscriptions</option>
                    <option value="Deliveries">Deliveries</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="input-text"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Cost / Amount (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. $1,850 or $45"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-text"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes (Optional)</label>
                <textarea
                  placeholder="Location or extra details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="textarea-input"
                  rows={2}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Create Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
