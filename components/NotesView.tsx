'use client';

import React, { useState } from 'react';
import { FileText, Plus, Eye, Edit3, Tag } from 'lucide-react';
import { LifeNote } from '@/types';

interface NotesViewProps {
  notes: LifeNote[];
  onAddNote: (note: LifeNote) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  onAddNote,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState(notes[0]?.id || null);
  const [isPreview, setIsPreview] = useState(false);

  const selectedNote = notes.find(n => n.id === selectedNoteId) || notes[0];
  const [title, setTitle] = useState(selectedNote?.title || '');
  const [content, setContent] = useState(selectedNote?.content || '');

  const handleSelect = (n: LifeNote) => {
    setSelectedNoteId(n.id);
    setTitle(n.title);
    setContent(n.content);
  };

  const handleNewNote = () => {
    const newNote: LifeNote = {
      id: `n_${Date.now()}`,
      title: 'Untitled Note',
      content: '# New Personal Note\n\nWrite markdown ideas, wishlist, or recipe notes here...',
      tags: ['personal'],
      updatedAt: new Date().toISOString(),
    };
    onAddNote(newNote);
    handleSelect(newNote);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-20 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-400" />
            <span>Personal Markdown Notes</span>
          </h1>
          <p className="text-xs text-slate-400">Replace random sticky notes with linked markdown documents.</p>
        </div>

        <button onClick={handleNewNote} className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 text-white font-bold text-xs flex items-center gap-1 shadow">
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel rounded-2xl border border-white/10 p-4 space-y-2">
          {notes.map(n => (
            <div
              key={n.id}
              onClick={() => handleSelect(n)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                selectedNote?.id === n.id ? 'bg-amber-950/30 border-amber-500/50 text-white' : 'bg-white/5 border-white/5 text-slate-300 hover:border-white/20'
              }`}
            >
              <h4 className="text-xs font-bold">{n.title}</h4>
            </div>
          ))}
        </div>

        {selectedNote && (
          <div className="lg:col-span-2 glass-panel rounded-2xl border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
              >
                {isPreview ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{isPreview ? 'Edit' : 'Preview'}</span>
              </button>
            </div>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-xl font-black text-white focus:outline-none"
            />

            {!isPreview ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-96 bg-black/40 p-4 rounded-xl border border-white/10 text-xs text-white font-mono leading-relaxed focus:outline-none resize-none"
              />
            ) : (
              <div className="h-96 p-4 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-200 leading-relaxed overflow-y-auto whitespace-pre-wrap">
                {content}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
