import React from 'react';
import { useStore } from '../store/useStore';
import { QuoteCategory } from '../types';
import { Quote, Sparkles } from 'lucide-react';

export const QuoteCard: React.FC = () => {
  const { activeQuote, selectedQuoteCategory, setSelectedQuoteCategory } = useStore();

  const categories: QuoteCategory[] = [
    'Discipline',
    'Consistency',
    'Success',
    'Confidence',
    'Happiness',
    'Gratitude',
    'Fitness',
    'Health',
    'Productivity',
    'Focus',
    'Growth',
    'Leadership',
    'Kindness',
    'Resilience',
    'Stoicism',
    'Morning Motivation',
    'Evening Reflection',
    'New Beginnings',
    'Mindfulness',
    'Self Improvement'
  ];

  return (
    <div className="aura-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Quote size={16} color="var(--accent-primary)" />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            Quote of the Day
          </span>
        </div>

        {/* Category Dropdown/Selector */}
        <select 
          value={selectedQuoteCategory}
          onChange={(e) => setSelectedQuoteCategory(e.target.value as QuoteCategory)}
          style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-full)',
            padding: '4px 10px',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <blockquote style={{
        fontSize: '0.95rem',
        fontWeight: 500,
        fontStyle: 'italic',
        color: 'var(--text-primary)',
        lineHeight: '1.5',
        marginBottom: '8px'
      }}>
        "{activeQuote.text}"
      </blockquote>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
          — {activeQuote.author}
        </span>
        <span className="badge-pill" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)', fontSize: '0.7rem' }}>
          <Sparkles size={10} /> {activeQuote.category}
        </span>
      </div>
    </div>
  );
};
