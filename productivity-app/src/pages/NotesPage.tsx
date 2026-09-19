import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Trash2, Save, X } from 'lucide-react';

interface Note { id: string; title: string; content: string; category: string; createdAt: string; updatedAt: string; }
const NOTES_KEY = 'myspace_notes';
function loadNotes(): Note[] { try { return JSON.parse(localStorage.getItem(NOTES_KEY) || '[]'); } catch { return []; } }
function saveNotes(n: Note[]) { localStorage.setItem(NOTES_KEY, JSON.stringify(n)); }

export const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => { setNotes(loadNotes()); }, []);

  const createNote = () => {
    const note: Note = { id: Date.now().toString(), title: 'Untitled Note', content: '', category: 'General', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const updated = [note, ...notes];
    setNotes(updated); saveNotes(updated); setSelectedNote(note); setEditTitle(note.title); setEditContent(note.content);
  };

  const saveNote = () => {
    if (!selectedNote) return;
    const updated = notes.map(n => n.id === selectedNote.id ? { ...n, title: editTitle, content: editContent, updatedAt: new Date().toISOString() } : n);
    setNotes(updated); saveNotes(updated);
    setSelectedNote({ ...selectedNote, title: editTitle, content: editContent });
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated); saveNotes(updated);
    if (selectedNote?.id === id) { setSelectedNote(null); }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Notes</h1>
          <p className="text-sm text-slate-500 mt-1">Capture ideas, concepts and quick thoughts.</p>
        </div>
        <button onClick={createNote} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
          <Plus size={16} /> New Note
        </button>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Notes list */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 max-h-[70vh] overflow-y-auto">
          {notes.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No notes yet. Create one!</p>}
          <div className="space-y-2">
            {notes.map(note => (
              <button key={note.id} onClick={() => { setSelectedNote(note); setEditTitle(note.title); setEditContent(note.content); }} className={`w-full text-left p-3 rounded-xl transition-colors ${selectedNote?.id === note.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50 border border-transparent'}`}>
                <h4 className="text-sm font-medium text-slate-800 truncate">{note.title}</h4>
                <p className="text-xs text-slate-400 mt-1 truncate">{note.content || 'Empty note'}</p>
                <p className="text-[10px] text-slate-300 mt-1">{new Date(note.updatedAt).toLocaleDateString()}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
          {selectedNote ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="flex-1 text-xl font-bold text-slate-800 border-0 outline-none bg-transparent" placeholder="Note title" />
                <button onClick={saveNote} className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100"><Save size={16} /></button>
                <button onClick={() => deleteNote(selectedNote.id)} className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100"><Trash2 size={16} /></button>
              </div>
              <textarea value={editContent} onChange={e => setEditContent(e.target.value)} placeholder="Start writing..." rows={20} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 resize-none outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <FileText size={40} className="text-slate-300 mb-3" />
              <p className="text-slate-400">Select a note or create a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
