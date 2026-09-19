import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, Plus, ExternalLink, Clock, CheckCircle2 } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { getCategoryColor, getPriorityLabel } from '../utils/helpers';
import { ProgressBar } from '../components/common/ProgressBar';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, fetchTasks } = useTaskStore();

  useEffect(() => { fetchTasks(); }, []);

  const projectTasks = tasks.filter(t => t.category === 'PROJECT');
  const projects = projectTasks.reduce((acc, task) => {
    const subject = task.subject || 'General';
    if (!acc[subject]) acc[subject] = [];
    acc[subject].push(task);
    return acc;
  }, {} as Record<string, typeof projectTasks>);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Projects</h1>
          <p className="text-sm text-slate-500 mt-1">Track your projects, milestones and deliverables.</p>
        </div>
        <button onClick={() => navigate('/app/tasks?create=true')} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
          <Plus size={16} /> New Project Task
        </button>
      </motion.div>

      {Object.keys(projects).length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <FolderOpen size={40} className="text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-600">No projects yet</h3>
          <p className="text-sm text-slate-400 mt-1">Create a task with "Project" category to start tracking.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(projects).map(([name, pTasks]) => {
            const totalSubtasks = pTasks.reduce((s, t) => s + t.subtasks.length, 0);
            const doneSubtasks = pTasks.reduce((s, t) => s + t.subtasks.filter(st => st.completed).length, 0);
            const progress = totalSubtasks > 0 ? Math.round((doneSubtasks / totalSubtasks) * 100) : (pTasks.filter(t => t.status === 'COMPLETED').length > 0 ? Math.round((pTasks.filter(t => t.status === 'COMPLETED').length / pTasks.length) * 100) : 0);

            return (
              <motion.div key={name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <FolderOpen size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{name}</h3>
                      <p className="text-xs text-slate-500">{pTasks.length} tasks • {progress}% complete</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{progress}%</span>
                </div>
                <ProgressBar percentage={progress} height={6} />
                <div className="mt-4 space-y-2">
                  {pTasks.map(task => {
                    const tp = task.subtasks.length > 0 ? Math.round((task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100) : (task.status === 'COMPLETED' ? 100 : 0);
                    return (
                      <div key={task.id} onClick={() => navigate(`/tasks/${task.id}`)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                        {task.status === 'COMPLETED' ? <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" /> : <Clock size={16} className="text-slate-400 flex-shrink-0" />}
                        <span className="text-sm text-slate-700 flex-1">{task.title}</span>
                        <span className="text-xs font-medium text-slate-500">{tp}%</span>
                        <ExternalLink size={12} className="text-slate-400" />
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
