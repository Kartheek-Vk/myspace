import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { Task } from '../../types';
import { ProgressBar } from '../common/ProgressBar';
import {
  calculateProgress,
  formatDateShort,
  getCategoryColor,
  getCategoryLabel,
  getPriorityColor,
  getPriorityLabel,
  getStatusColor,
  getStatusLabel,
  isOverdue,
} from '../../utils/helpers';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const progress = calculateProgress(task.subtasks);
  const completedSubtasks = task.subtasks.filter(s => s.completed).length;
  const totalSubtasks = task.subtasks.length;
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
      onClick={() => navigate(`/tasks/${task.id}`)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
            {task.title}
          </h3>
          {task.subject && (
            <p className="text-sm text-slate-500 mt-0.5">{task.subject}</p>
          )}
        </div>
        <div className="flex items-center gap-1 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(task); }}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Edit2 size={14} className="text-slate-500" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(task); }}
            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} className="text-red-500" />
          </button>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          style={{
            backgroundColor: getCategoryColor(task.category) + '15',
            color: getCategoryColor(task.category),
          }}
        >
          {getCategoryLabel(task.category)}
        </span>
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          style={{
            backgroundColor: getPriorityColor(task.priority) + '15',
            color: getPriorityColor(task.priority),
          }}
        >
          {getPriorityLabel(task.priority)} Priority
        </span>
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          style={{
            backgroundColor: getStatusColor(task.status) + '15',
            color: getStatusColor(task.status),
          }}
        >
          {getStatusLabel(task.status)}
        </span>
      </div>

      {/* Due Date */}
      {task.dueDate && (
        <div className="flex items-center gap-1.5 mb-3">
          <Calendar size={14} className={overdue ? 'text-red-500' : 'text-slate-400'} />
          <span className={`text-xs font-medium ${overdue ? 'text-red-500' : 'text-slate-500'}`}>
            {overdue ? 'Overdue: ' : 'Due: '}{formatDateShort(task.dueDate)}
          </span>
          {task.estimatedMinutes > 0 && (
            <>
              <span className="text-slate-300">•</span>
              <Clock size={14} className="text-slate-400" />
              <span className="text-xs text-slate-500">{task.estimatedMinutes} min</span>
            </>
          )}
        </div>
      )}

      {/* Progress */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-semibold text-slate-700">{progress}%</span>
          {totalSubtasks > 0 && (
            <span className="text-xs text-slate-500">
              {completedSubtasks} / {totalSubtasks} subtasks
            </span>
          )}
          {totalSubtasks === 0 && (
            <span className="text-xs text-slate-500">No subtasks</span>
          )}
        </div>
        <ProgressBar percentage={progress} height={6} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-400">
          {totalSubtasks === 0 ? 'Simple task' : `${totalSubtasks} subtask${totalSubtasks > 1 ? 's' : ''}`}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/tasks/${task.id}`); }}
          className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-700"
        >
          Open <ExternalLink size={12} />
        </button>
      </div>
    </motion.div>
  );
};
