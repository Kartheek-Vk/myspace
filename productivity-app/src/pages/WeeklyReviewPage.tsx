import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, CheckCircle2, BarChart3, PenTool, Save } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { useActivityStore } from '../store/activityStore';
import { ProgressBar } from '../components/common/ProgressBar';
import { getCategoryLabel, getCategoryColor } from '../utils/helpers';
import { TASK_CATEGORIES } from '../types';

const REVIEW_KEY = 'myspace_weekly_reviews';

interface WeeklyReview { weekStart: string; wentWell: string; didntGoWell: string; changeNextWeek: string; savedAt: string; }
function loadReviews(): WeeklyReview[] { try { return JSON.parse(localStorage.getItem(REVIEW_KEY) || '[]'); } catch { return []; } }
function saveReviews(r: WeeklyReview[]) { localStorage.setItem(REVIEW_KEY, JSON.stringify(r)); }

function getWeekStart(): string {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().split('T')[0];
}

export const WeeklyReviewPage: React.FC = () => {
  const { tasks, fetchTasks } = useTaskStore();
  const { entries } = useActivityStore();
  const [wentWell, setWentWell] = useState('');
  const [didntGoWell, setDidntGoWell] = useState('');
  const [changeNextWeek, setChangeNextWeek] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetchTasks(); }, []);

  // Load existing review for this week
  useEffect(() => {
    const reviews = loadReviews();
    const current = reviews.find(r => r.weekStart === getWeekStart());
    if (current) { setWentWell(current.wentWell); setDidntGoWell(current.didntGoWell); setChangeNextWeek(current.changeNextWeek); }
  }, []);

  // Calculate weekly stats
  const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - weekStart.getDay()); weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart); weekEnd.setDate(weekEnd.getDate() + 7);

  const weekTasks = tasks.filter(t => {
    const created = new Date(t.createdAt);
    return created >= weekStart && created < weekEnd;
  });

  const completedThisWeek = tasks.filter(t => {
    if (!t.completedAt) return false;
    const completed = new Date(t.completedAt);
    return completed >= weekStart && completed < weekEnd;
  });

  const totalSubtasks = tasks.reduce((s, t) => s + t.subtasks.length, 0);
  const completedSubtasks = tasks.reduce((s, t) => s + t.subtasks.filter(st => st.completed).length, 0);
  const overallProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Category distribution
  const categoryStats = TASK_CATEGORIES.map(cat => ({
    label: cat.label,
    count: tasks.filter(t => t.category === cat.value).length,
    color: getCategoryColor(cat.value),
  })).filter(c => c.count > 0);

  const weekActivities = entries.filter(e => new Date(e.timestamp) >= weekStart);

  const handleSave = () => {
    const reviews = loadReviews();
    const idx = reviews.findIndex(r => r.weekStart === getWeekStart());
    const review: WeeklyReview = { weekStart: getWeekStart(), wentWell, didntGoWell, changeNextWeek, savedAt: new Date().toISOString() };
    if (idx >= 0) reviews[idx] = review; else reviews.unshift(review);
    saveReviews(reviews);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Weekly Review</h1>
          <p className="text-sm text-slate-500 mt-1">Week of {weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
        </div>
        <button onClick={handleSave} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
          <Save size={16} /> {saved ? 'Saved!' : 'Save Review'}
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Tasks Created', value: weekTasks.length, color: '#3b82f6' },
          { label: 'Tasks Completed', value: completedThisWeek.length, color: '#22c55e' },
          { label: 'Total Subtasks', value: `${completedSubtasks}/${totalSubtasks}`, color: '#8b5cf6' },
          { label: 'Overall Progress', value: `${overallProgress}%`, color: '#f97316' },
        ].map(stat => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs text-slate-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Overall Progress */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-slate-800">Overall Progress</h2>
          <span className="text-xl font-bold text-blue-600">{overallProgress}%</span>
        </div>
        <ProgressBar percentage={overallProgress} height={10} />
      </div>

      {/* Category Distribution */}
      {categoryStats.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="font-bold text-slate-800 mb-4">Category Distribution</h2>
          <div className="space-y-3">
            {categoryStats.map(cat => (
              <div key={cat.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700">{cat.label}</span>
                  <span className="text-slate-500">{cat.count} tasks</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(cat.count / tasks.length) * 100}%`, backgroundColor: cat.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reflection */}
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-bold text-green-700 mb-3 flex items-center gap-2"><CheckCircle2 size={16} /> What went well?</h3>
          <textarea value={wentWell} onChange={e => setWentWell(e.target.value)} placeholder="What accomplishments or progress are you proud of this week?" rows={3} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm resize-none" />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-bold text-amber-700 mb-3 flex items-center gap-2"><BarChart3 size={16} /> What didn't go well?</h3>
          <textarea value={didntGoWell} onChange={e => setDidntGoWell(e.target.value)} placeholder="Any obstacles, missed goals, or things that didn't work?" rows={3} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm resize-none" />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-bold text-blue-700 mb-3 flex items-center gap-2"><TrendingUp size={16} /> What should I change next week?</h3>
          <textarea value={changeNextWeek} onChange={e => setChangeNextWeek(e.target.value)} placeholder="What will you do differently next week?" rows={3} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm resize-none" />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h2 className="font-bold text-slate-800 mb-4">This Week's Activity</h2>
        {weekActivities.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">No activity recorded this week</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {weekActivities.slice(0, 30).map(entry => (
              <div key={entry.id} className="flex items-start gap-3 p-2 rounded-lg">
                <span className="text-lg">{entry.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700">{entry.title}</p>
                  {entry.detail && <p className="text-xs text-slate-400">{entry.detail}</p>}
                </div>
                <span className="text-[10px] text-slate-400 flex-shrink-0">{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
