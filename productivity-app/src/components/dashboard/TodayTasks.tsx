import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { TodayTaskItem } from '../../types';
import { ProgressBar } from '../common/ProgressBar';
import { getCategoryColor, getCategoryLabel, getPriorityColor, getPriorityLabel } from '../../utils/helpers';

interface TodayTasksProps {
  tasks: TodayTaskItem[];
}

export const TodayTasks: React.FC<TodayTasksProps> = ({ tasks }) => {
  const navigate = useNavigate();

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 border border-slate-200"
      >
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Today's Tasks</h3>
        <div className="text-center py-8">
          <p className="text-slate-400 text-sm">No tasks scheduled for today</p>
          <button
            onClick={() => navigate('/app/tasks')}
            className="mt-3 text-sm text-blue-600 font-medium hover:text-blue-700"
          >
            Create a task →
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl p-6 border border-slate-200"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Today's Tasks</h3>
        <button
          onClick={() => navigate('/app/tasks')}
          className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1"
        >
          View all <ArrowRight size={12} />
        </button>
      </div>

      <div className="space-y-3">
        {tasks.map((task, idx) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + idx * 0.05 }}
            onClick={() => navigate(`/tasks/${task.id}`)}
            className="p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-sm cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <h4 className="text-sm font-medium text-slate-800 truncate">{task.title}</h4>
              </div>
              <span className="text-sm font-semibold text-slate-700 flex-shrink-0 ml-2">
                {task.progressPercentage}%
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: getCategoryColor(task.category) + '15',
                  color: getCategoryColor(task.category),
                }}
              >
                {getCategoryLabel(task.category)}
              </span>
              {task.totalSubtasks > 0 && (
                <span className="text-[10px] text-slate-500">
                  {task.completedSubtasks}/{task.totalSubtasks}
                </span>
              )}
            </div>
            <ProgressBar percentage={task.progressPercentage} height={4} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
