import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PenTool, Plus, CheckCircle2, Circle, X, Save } from 'lucide-react';

interface JournalEntry {
  id: string;
  date: string;
  planned: string[];
  completed: string[];
  learned: string;
  wentWrong: string;
  tomorrow: string[];
  createdAt: string;
}

const JOURNAL_KEY = 'myspace_journal';

function loadJournal(): JournalEntry[] {
  try { const d = localStorage.getItem(JOURNAL_KEY); return d ? JSON.parse(d) : []; } catch { return []; }
}
function saveJournal(entries: JournalEntry[]) {
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
}

export const JournalPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [editing, setEditing] = useState(false);
  const [planned, setPlanned] = useState<string[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [learned, setLearned] = useState('');
  const [wentWrong, setWentWrong] = useState('');
  const [tomorrow, setTomorrow] = useState<string[]>([]);
  const [newPlanned, setNewPlanned] = useState('');
  const [newCompleted, setNewCompleted] = useState('');
  const [newTomorrow, setNewTomorrow] = useState('');

  useEffect(() => {
    const all = loadJournal();
    setEntries(all);
    const existing = all.find(e => e.date === selectedDate);
    if (existing) {
      setPlanned(existing.planned);
      setCompleted(existing.completed);
      setLearned(existing.learned);
      setWentWrong(existing.wentWrong);
      setTomorrow(existing.tomorrow);
    } else {
      setPlanned([]); setCompleted([]); setLearned(''); setWentWrong(''); setTomorrow([]);
    }
  }, [selectedDate]);

  const handleSave = () => {
    const all = loadJournal();
    const idx = all.findIndex(e => e.date === selectedDate);
    const entry: JournalEntry = {
      id: selectedDate, date: selectedDate, planned, completed, learned, wentWrong, tomorrow,
      createdAt: new Date().toISOString(),
    };
    if (idx >= 0) all[idx] = entry; else all.unshift(entry);
    all.sort((a, b) => b.date.localeCompare(a.date));
    saveJournal(all);
    setEntries(all);
    setEditing(false);
  };

  const addToList = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, val: string, setVal: React.Dispatch<React.SetStateAction<string>>) => {
    if (val.trim()) { setList([...list, val.trim()]); setVal(''); setEditing(true); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Journal</h1>
          <p className="text-sm text-slate-500 mt-1">Remember what you planned, what happened, and what you learned.</p>
        </div>
        <button onClick={handleSave} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
          <Save size={16} /> Save
        </button>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Date picker / entries list */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-slate-200 p-5">
          <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm mb-4" />
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Recent Entries</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {entries.length === 0 && <p className="text-xs text-slate-400">No entries yet</p>}
            {entries.map(e => (
              <button key={e.id} onClick={() => setSelectedDate(e.date)} className={`w-full text-left p-2.5 rounded-xl text-sm transition-colors ${e.date === selectedDate ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-slate-50 text-slate-600'}`}>
                {new Date(e.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                <span className="block text-[10px] text-slate-400 mt-0.5">{e.completed.length} completed • {e.planned.length} planned</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Journal Content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-4">
          {/* What I Planned */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2"><PenTool size={14} /> What I Planned</h3>
            <div className="space-y-1.5 mb-2">
              {planned.map((item, i) => (
                <div key={i} className="flex items-center gap-2 group">
                  <Circle size={14} className="text-slate-300" />
                  <span className="text-sm text-slate-700 flex-1">{item}</span>
                  <button onClick={() => { setPlanned(planned.filter((_, j) => j !== i)); setEditing(true); }} className="opacity-0 group-hover:opacity-100"><X size={12} className="text-slate-400" /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newPlanned} onChange={e => setNewPlanned(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addToList(planned, setPlanned, newPlanned, setNewPlanned); }} placeholder="Add planned item..." className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm" />
              <button onClick={() => addToList(planned, setPlanned, newPlanned, setNewPlanned)} className="p-2 rounded-xl bg-blue-50 text-blue-600"><Plus size={16} /></button>
            </div>
          </div>

          {/* What I Completed */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-3 flex items-center gap-2"><CheckCircle2 size={14} /> What I Completed</h3>
            <div className="space-y-1.5 mb-2">
              {completed.map((item, i) => (
                <div key={i} className="flex items-center gap-2 group">
                  <CheckCircle2 size={14} className="text-green-500" />
                  <span className="text-sm text-slate-700 flex-1">{item}</span>
                  <button onClick={() => { setCompleted(completed.filter((_, j) => j !== i)); setEditing(true); }} className="opacity-0 group-hover:opacity-100"><X size={12} className="text-slate-400" /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newCompleted} onChange={e => setNewCompleted(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addToList(completed, setCompleted, newCompleted, setNewCompleted); }} placeholder="Add completed item..." className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm" />
              <button onClick={() => addToList(completed, setCompleted, newCompleted, setNewCompleted)} className="p-2 rounded-xl bg-green-50 text-green-600"><Plus size={16} /></button>
            </div>
          </div>

          {/* What I Learned + What Went Wrong */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-3">What I Learned</h3>
              <textarea value={learned} onChange={e => { setLearned(e.target.value); setEditing(true); }} placeholder="What did you learn today?" rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm resize-none" />
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-amber-600 uppercase tracking-wide mb-3">What Went Wrong</h3>
              <textarea value={wentWrong} onChange={e => { setWentWrong(e.target.value); setEditing(true); }} placeholder="Any obstacles or issues?" rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm resize-none" />
            </div>
          </div>

          {/* Tomorrow */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3">Tomorrow</h3>
            <div className="space-y-1.5 mb-2">
              {tomorrow.map((item, i) => (
                <div key={i} className="flex items-center gap-2 group">
                  <span className="text-blue-400 text-xs">→</span>
                  <span className="text-sm text-slate-700 flex-1">{item}</span>
                  <button onClick={() => { setTomorrow(tomorrow.filter((_, j) => j !== i)); setEditing(true); }} className="opacity-0 group-hover:opacity-100"><X size={12} className="text-slate-400" /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newTomorrow} onChange={e => setNewTomorrow(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addToList(tomorrow, setTomorrow, newTomorrow, setNewTomorrow); }} placeholder="Plan for tomorrow..." className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm" />
              <button onClick={() => addToList(tomorrow, setTomorrow, newTomorrow, setNewTomorrow)} className="p-2 rounded-xl bg-blue-50 text-blue-600"><Plus size={16} /></button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
