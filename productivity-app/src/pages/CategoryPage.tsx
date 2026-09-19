import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, ListTodo } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { TaskCard } from '../components/tasks/TaskCard';
import { DeleteDialog } from '../components/common/DeleteDialog';
import { Task, TaskCategory } from '../types';
import { getCategoryColor, getCategoryLabel } from '../utils/helpers';
import { ProgressBar } from '../components/common/ProgressBar';

interface CategoryPageProps {
  category: TaskCategory;
  icon: React.ElementType;
  description: string;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ category, icon: Icon, description }) => {
  const navigate = useNavigate();
  const { tasks, fetchTasks, deleteTask } = useTaskStore();
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  useEffect(() => { fetchTasks(); }, []);

  const catTasks = tasks.filter(t => t.category === category);
  const completed = catTasks.filter(t => t.status === 'COMPLETED').length;
  const inProgress = catTasks.filter(t => t.status === 'IN_PROGRESS').length;
  const notStarted = catTasks.filter(t => t.status === 'NOT_STARTED').length;
  const color = getCategoryColor(category);
  const allSubtasks = catTasks.reduce((sum, t) => sum + t.subtasks.length, 0);
  const completedSubtasks = catTasks.reduce((sum, t) => sum + t.subtasks.filter(s => s.completed).length, 0);
  const progress = allSubtasks > 0 ? Math.round((completedSubtasks / allSubtasks) * 100) : (catTasks.length > 0 ? Math.round((completed / catTasks.length) * 100) : 0);

  const handleDelete = async () => { if (deletingTask) { await deleteTask(deletingTask.id); setDeletingTask(null); } };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '15' }}>
            <Icon size={22} style={{ color }} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">{getCategoryLabel(category)}</h1>
            <p className="text-sm text-slate-500 mt-0.5">{description}</p>
          </div>
        </div>
        <button onClick={() => navigate('/app/tasks?create=true')} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
          <Plus size={16} /> New Task
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: catTasks.length, color: '#3b82f6' },
          { label: 'Completed', value: completed, color: '#22c55e' },
          { label: 'In Progress', value: inProgress, color: '#8b5cf6' },
          { label: 'Not Started', value: notStarted, color: '#94a3b8' },
          { label: 'Progress', value: `${progress}%`, color },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-3 border border-slate-200">
            <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-slate-700">Overall Progress</span>
          <span className="text-slate-500">{completedSubtasks}/{allSubtasks} subtasks</span>
        </div>
        <ProgressBar percentage={progress} height={8} />
      </div>

      {/* Tasks */}
      {catTasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <ListTodo size={32} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400">No {getCategoryLabel(category)} tasks yet</p>
          <button onClick={() => navigate('/app/tasks?create=true')} className="mt-3 text-sm text-blue-600 font-medium">Create your first task →</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          <AnimatePresence>
            {catTasks.map(task => <TaskCard key={task.id} task={task} onEdit={() => navigate(`/tasks/${task.id}`)} onDelete={setDeletingTask} />)}
          </AnimatePresence>
        </div>
      )}

      <DeleteDialog isOpen={!!deletingTask} onClose={() => setDeletingTask(null)} onConfirm={handleDelete} title="Delete Task" message={`Delete "${deletingTask?.title}"?`} />
    </div>
  );
};
