import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, Target, BookOpen, Briefcase, Calendar as CalendarIcon, FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '../../store/taskStore';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  id: string;
  type: 'task' | 'note' | 'journal' | 'goal' | 'project' | 'career';
  title: string;
  subtitle: string;
  icon: React.ElementType;
  path: string;
  color: string;
}

export const GlobalSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { tasks } = useTaskStore();

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Search logic
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }

    const q = query.toLowerCase();
    const found: SearchResult[] = [];

    // Search tasks
    tasks.filter(t => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q) || t.subject?.toLowerCase().includes(q))
      .slice(0, 5)
      .forEach(t => found.push({ id: t.id, type: 'task', title: t.title, subtitle: `${t.category} • ${t.status}`, icon: Target, path: `/app/tasks/${t.id}`, color: '#3b82f6' }));

    // Search notes
    try {
      const notes = JSON.parse(localStorage.getItem('myspace_notes') || '[]');
      notes.filter((n: any) => n.title.toLowerCase().includes(q) || n.content?.toLowerCase().includes(q))
        .slice(0, 3)
        .forEach((n: any) => found.push({ id: n.id, type: 'note', title: n.title, subtitle: 'Note', icon: FileText, path: '/app/notes', color: '#8b5cf6' }));
    } catch {}

    // Search goals
    try {
      const goals = JSON.parse(localStorage.getItem('myspace_goals_v2') || '[]');
      goals.filter((g: any) => g.title.toLowerCase().includes(q) || g.description?.toLowerCase().includes(q))
        .slice(0, 3)
        .forEach((g: any) => found.push({ id: g.id, type: 'goal', title: g.title, subtitle: `Goal • ${g.status}`, icon: Target, path: '/app/goals', color: '#22c55e' }));
    } catch {}

    // Search journal
    try {
      const journal = JSON.parse(localStorage.getItem('myspace_journal') || '[]');
      journal.filter((j: any) => j.planned?.some((p: string) => p.toLowerCase().includes(q)) || j.completed?.some((c: string) => c.toLowerCase().includes(q)) || j.learned?.toLowerCase().includes(q))
        .slice(0, 3)
        .forEach((j: any) => found.push({ id: j.date, type: 'journal', title: `Journal: ${j.date}`, subtitle: 'Journal Entry', icon: BookOpen, path: '/app/journal', color: '#f97316' }));
    } catch {}

    // Search projects
    const projectTasks = tasks.filter(t => t.category === 'PROJECT' && (t.title.toLowerCase().includes(q) || t.subject?.toLowerCase().includes(q)));
    if (projectTasks.length > 0) {
      found.push({ id: 'projects', type: 'project', title: `${projectTasks.length} project task(s) found`, subtitle: 'Projects', icon: FolderOpen, path: '/app/projects', color: '#06b6d4' });
    }

    // Search career
    try {
      const skills = JSON.parse(localStorage.getItem('myspace_skills') || '[]');
      const matchingSkills = skills.filter((s: any) => s.name.toLowerCase().includes(q));
      if (matchingSkills.length > 0) {
        found.push({ id: 'career', type: 'career', title: `${matchingSkills.length} skill(s) found`, subtitle: 'Career', icon: Briefcase, path: '/app/career', color: '#ec4899' });
      }
    } catch {}

    setResults(found.slice(0, 10));
  }, [query, tasks]);

  const handleSelect = (result: SearchResult) => {
    navigate(result.path);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <>
      {/* Search Button */}
      <button
        onClick={() => { setIsOpen(true); setTimeout(() => inputRef.current?.focus(), 100); }}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors text-sm text-slate-600"
      >
        <Search size={16} />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-white border border-slate-200 text-slate-400">⌘K</kbd>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div className="fixed inset-0 bg-black/40 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} />
            <motion.div
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
                <Search size={20} className="text-slate-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search tasks, notes, goals, journal..."
                  className="flex-1 text-sm outline-none bg-transparent"
                />
                <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-slate-100">
                  <X size={16} className="text-slate-400" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {query && results.length === 0 && (
                  <div className="p-8 text-center text-sm text-slate-400">No results found</div>
                )}
                {results.map(result => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleSelect(result)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: result.color + '15' }}>
                      <result.icon size={16} style={{ color: result.color }} />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{result.title}</p>
                      <p className="text-xs text-slate-500">{result.subtitle}</p>
                    </div>
                  </button>
                ))}
                {!query && (
                  <div className="p-8 text-center text-sm text-slate-400">Start typing to search...</div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
