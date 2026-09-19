import React from 'react';
import { motion } from 'framer-motion';
import { CircularProgress } from '../common/CircularProgress';
import { Target } from 'lucide-react';

interface DashboardProgressProps {
  percentage: number;
  completedSubtasks: number;
  totalSubtasks: number;
}

export const DashboardProgress: React.FC<DashboardProgressProps> = ({
  percentage,
  completedSubtasks,
  totalSubtasks,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <Target size={18} className="text-blue-600" />
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Today's Progress</h3>
      </div>

      <div className="flex items-center gap-6">
        <CircularProgress percentage={percentage} size={100} strokeWidth={10} />
        <div>
          <p className="text-3xl font-bold text-slate-800">{percentage}%</p>
          <p className="text-sm text-slate-500 mt-1">
            {completedSubtasks} / {totalSubtasks} subtasks completed
          </p>
          {totalSubtasks === 0 && (
            <p className="text-xs text-slate-400 mt-2">No tasks scheduled for today</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
