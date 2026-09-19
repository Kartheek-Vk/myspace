import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, CheckCircle2, Target, Calendar, Zap } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { ProgressBar } from '../components/common/ProgressBar';
import { getCategoryColor, getCategoryLabel } from '../utils/helpers';
import { TaskCategory, TASK_CATEGORIES } from '../types';

export const AnalyticsPage: React.FC = () => {
  const { tasks, fetchTasks } = useTaskStore();

  useEffect(() => { fetchTasks(); }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const notStarted = tasks.filter(t => t.status === 'NOT_STARTED').length;
  const cancelled = tasks.filter(t => t.status === 'CANCELLED').length;

  const allSubtasks = tasks.reduce((sum, t) => sum + t.subtasks.length, 0);
  const completedSubtasks = tasks.reduce((sum, t) => sum + t.subtasks.filter(s => s.completed).length, 0);
  const overallProgress = allSubtasks > 0 ? Math.round((completedSubtasks / allSubtasks) * 100) : (totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0);

  // Category breakdown
  const categoryData = TASK_CATEGORIES.map(cat => {
    const catTasks = tasks.filter(t => t.category === cat.value);
    const catCompleted = catTasks.filter(t => t.status === 'COMPLETED').length;
    const catSubtasks = catTasks.reduce((s, t) => s + t.subtasks.length, 0);
    const catCompletedSubs = catTasks.reduce((s, t) => s + t.subtasks.filter(st => st.completed).length, 0);
    return { ...cat, total: catTasks.length, completed: catCompleted, subtasks: catSubtasks, completedSubtasks: catCompletedSubs, color: getCategoryColor(cat.value) };
  }).filter(c => c.total > 0);

  // Priority breakdown
  const priorities = ['URGENT', 'HIGH', 'MEDIUM', 'LOW'];
  const priorityData = priorities.map(p => ({
    priority: p,
    total: tasks.filter(t => t.priority === p).length,
    completed: tasks.filter(t => t.priority === p && t.status === 'COMPLETED').length,
    color: p === 'URGENT' ? '#ef4444' : p === 'HIGH' ? '#f97316' : p === 'MEDIUM' ? '#eab308' : '#22c55e',
  })).filter(p => p.total > 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Track your consistency and see how far you've come.</p>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: totalTasks, icon: Target, color: '#3b82f6', bg: '#eff6ff' },
          { label: 'Completed', value: completedTasks, icon: CheckCircle2, color: '#22c55e', bg: '#f0fdf4' },
          { label: 'In Progress', value: inProgress, icon: Zap, color: '#8b5cf6', bg: '#f5f3ff' },
          { label: 'Subtasks Done', value: `${completedSubtasks}/${allSubtasks}`, icon: TrendingUp, color: '#f97316', bg: '#fff7ed' },
        ].map((card, idx) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: card.bg }}>
              <card.icon size={18} style={{ color: card.color }} />
            </div>
            <p className="text-2xl font-bold text-slate-800">{card.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Overall Progress */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-slate-800">Overall Progress</h2>
          <span className="text-2xl font-bold text-blue-600">{overallProgress}%</span>
        </div>
        <ProgressBar percentage={overallProgress} height={10} />
        <p className="text-sm text-slate-500 mt-2">{completedSubtasks} of {allSubtasks} subtasks completed across all tasks</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-bold text-slate-800 mb-4">By Category</h2>
          {categoryData.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No data yet</p>
          ) : (
            <div className="space-y-3">
              {categoryData.map(cat => (
                <div key={cat.value}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">{cat.label}</span>
                    <span className="text-xs text-slate-500">{cat.completed}/{cat.total} tasks</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${cat.total > 0 ? Math.round((cat.completed / cat.total) * 100) : 0}%`, backgroundColor: cat.color }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Priority Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-bold text-slate-800 mb-4">By Priority</h2>
          {priorityData.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No data yet</p>
          ) : (
            <div className="space-y-3">
              {priorityData.map(p => (
                <div key={p.priority}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">{p.priority}</span>
                    <span className="text-xs text-slate-500">{p.completed}/{p.total}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0}%`, backgroundColor: p.color }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Status Breakdown */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-4">Status Breakdown</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Not Started', value: notStarted, color: '#94a3b8' },
            { label: 'In Progress', value: inProgress, color: '#8b5cf6' },
            { label: 'Completed', value: completedTasks, color: '#22c55e' },
            { label: 'Cancelled', value: cancelled, color: '#ef4444' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: stat.color + '15' }}>
                <span className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</span>
              </div>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
