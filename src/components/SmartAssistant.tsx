import React from 'react';
import { useStore } from '../store/useStore';
import { Sparkles, Calendar, AlertCircle, Award, CheckCircle } from 'lucide-react';

export const SmartAssistant: React.FC = () => {
  const { habits, reminders, routines } = useStore();

  const getSmartInsight = () => {
    const today = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = days[today.getDay()];
    const todayStr = today.toISOString().split('T')[0];

    // Check Saturday Weekend Reset
    if (currentDay === 'Saturday') {
      const satRoutines = routines.filter(r => r.day === 'Saturday');
      const doneCount = satRoutines.filter(r => r.completedDates.includes(todayStr)).length;
      if (doneCount < satRoutines.length) {
        return {
          title: `It's Saturday — Time for your Weekend Reset!`,
          body: `You've completed ${doneCount} of ${satRoutines.length} weekend reset tasks (Laundry, Vacuuming, Meal prep).`,
          icon: <Calendar size={20} color="var(--accent-purple)" />,
          bg: 'var(--accent-purple-soft)'
        };
      }
    }

    // Check Sunday Reset for Week
    if (currentDay === 'Sunday') {
      return {
        title: `Sunday Weekly Reset`,
        body: `Review your calendar, plan your upcoming week, and refill your vitamins for a calm Monday.`,
        icon: <Calendar size={20} color="var(--accent-teal)" />,
        bg: 'var(--accent-teal-soft)'
      };
    }

    // Check upcoming rent or urgent reminders
    const rentReminder = reminders.find(r => r.title.toLowerCase().includes('rent') || r.category === 'Bills');
    if (rentReminder) {
      const due = new Date(rentReminder.dueDate);
      const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 3600 * 24));
      if (diffDays >= 0 && diffDays <= 3) {
        return {
          title: `Rent Due in ${diffDays === 0 ? 'Today' : `${diffDays} Days`}`,
          body: `${rentReminder.title} (${rentReminder.amount || ''}) is upcoming. Autopay or review setting.`,
          icon: <AlertCircle size={20} color="var(--accent-warning)" />,
          bg: 'var(--accent-warning-soft)'
        };
      }
    }

    // Check Habit Streaks
    const completedTodayCount = habits.filter(h => h.completedToday).length;
    if (completedTodayCount >= 4) {
      return {
        title: `Habit Momentum Active!`,
        body: `You've completed ${completedTodayCount} habits today. Keep your streaks growing strong.`,
        icon: <Award size={20} color="var(--accent-success)" />,
        bg: 'var(--accent-success-soft)'
      };
    }

    // Gym Check
    const gymHabit = habits.find(h => h.title.toLowerCase().includes('gym'));
    if (gymHabit && !gymHabit.completedToday) {
      return {
        title: `Movement & Gym Reminder`,
        body: `A quick 20-minute movement or workout session today will keep your 4-day streak going!`,
        icon: <CheckCircle size={20} color="var(--accent-primary)" />,
        bg: 'var(--accent-soft)'
      };
    }

    // Default Calming Assistant Greeting
    return {
      title: `Daily Life Balance`,
      body: `Your routines are automated for ${currentDay}. Take life one simple step at a time today.`,
      icon: <Sparkles size={20} color="var(--accent-primary)" />,
      bg: 'var(--accent-soft)'
    };
  };

  const insight = getSmartInsight();

  return (
    <div className="aura-card animate-fade-in" style={{ background: insight.bg, border: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-sm)',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {insight.icon}
        </div>
        <div>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            Smart Daily Assistant
          </span>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {insight.title}
          </h3>
        </div>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.45', paddingLeft: '2px' }}>
        {insight.body}
      </p>
    </div>
  );
};
