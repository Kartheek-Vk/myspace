import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Code2, GraduationCap, Briefcase, Rocket, BookOpen } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { TaskCard } from '../components/tasks/TaskCard';
import { DeleteDialog } from '../components/common/DeleteDialog';
import { Task, TaskCategory, TASK_CATEGORIES } from '../types';
import { getCategoryColor, getCategoryLabel } from '../utils/helpers';
import { useState } from 'react';

export const LearningPage: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, fetchTasks, deleteTask } = useTaskStore();
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  useEffect(() => { fetchTasks(); }, []);

  const categories = [
    { key: 'BTECH' as TaskCategory, icon: GraduationCap, desc: 'College subjects and coursework' },
    { key: 'DSA' as TaskCategory, icon: Code2, desc: 'Data structures and algorithms' },
    { key: 'JAVA_DAA' as TaskCategory, icon: Code2, desc: 'Java programming and DAA' },
    { key: 'PYTHON' as TaskCategory, icon: Code2, desc: 'Python learning and practice' },
    { key: 'PROJECT' as TaskCategory, icon: Rocket, desc: 'Personal and academic projects' },
    { key: 'CAREER' as TaskCategory, icon: Briefcase, desc: 'Career development and goals' },
  ];

  const handleDelete = async () => {
    if (deletingTask) {
      await deleteTask(deletingTask.id);
      setDeletingTask(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Learning</h1>
          <p className="text-sm text-slate-500 mt-1">Keep your learning organized. You control the roadmap.</p>
        </div>
        <button onClick={() => navigate('/app/tasks?create=true')} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
          <Plus size={16} /> New Task
        </button>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, idx) => {
          const catTasks = tasks.filter(t => t.category === cat.key);
          const completed = catTasks.filter(t => t.status === 'COMPLETED').length;
          const inProgress = catTasks.filter(t => t.status === 'IN_PROGRESS').length;
          const color = getCategoryColor(cat.key);

          return (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => navigate(`/tasks?category=${cat.key}`)}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '15' }}>
                  <cat.icon size={18} style={{ color }} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{getCategoryLabel(cat.key)}</h3>
                  <p className="text-xs text-slate-500">{cat.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>{catTasks.length} tasks</span>
                <span className="text-green-600">{completed} done</span>
                <span className="text-blue-600">{inProgress} active</span>
              </div>
              <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${catTasks.length > 0 ? Math.round((completed / catTasks.length) * 100) : 0}%`, backgroundColor: color }} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Tasks */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Learning Tasks</h2>
        {tasks.filter(t => ['BTECH', 'DSA', 'JAVA_DAA', 'PYTHON'].includes(t.category)).length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <BookOpen size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400">No learning tasks yet</p>
            <button onClick={() => navigate('/app/tasks?create=true')} className="mt-3 text-sm text-blue-600 font-medium">Create your first learning task →</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            <AnimatePresence>
              {tasks.filter(t => ['BTECH', 'DSA', 'JAVA_DAA', 'PYTHON'].includes(t.category)).slice(0, 6).map(task => (
                <TaskCard key={task.id} task={task} onEdit={() => navigate(`/tasks/${task.id}`)} onDelete={setDeletingTask} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      <DeleteDialog isOpen={!!deletingTask} onClose={() => setDeletingTask(null)} onConfirm={handleDelete} title="Delete Task" message={`Delete "${deletingTask?.title}"? This will also delete all subtasks.`} />
    </div>
  );
};
