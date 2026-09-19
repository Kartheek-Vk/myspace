import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ListChecks, CheckCircle2, Clock, Circle, XCircle, TrendingUp } from 'lucide-react';

interface TaskSummaryCardsProps {
  summary: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    notStartedTasks: number;
    cancelledTasks: number;
    totalSubtasks: number;
    completedSubtasks: number;
    progressPercentage: number;
  };
  title?: string;
}

export const TaskSummaryCards: React.FC<TaskSummaryCardsProps> = ({ summary, title = 'Today' }) => {
  const cards = [
    {
      label: 'Total Tasks',
      value: summary.totalTasks,
      icon: ListChecks,
      color: '#3b82f6',
      bg: '#eff6ff',
    },
    {
      label: 'Completed',
      value: summary.completedTasks,
      icon: CheckCircle2,
      color: '#22c55e',
      bg: '#f0fdf4',
    },
    {
      label: 'In Progress',
      value: summary.inProgressTasks,
      icon: Clock,
      color: '#8b5cf6',
      bg: '#f5f3ff',
    },
    {
      label: 'Not Started',
      value: summary.notStartedTasks,
      icon: Circle,
      color: '#94a3b8',
      bg: '#f8fafc',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">{title} Summary</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
            className="bg-white rounded-xl p-4 border border-slate-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: card.bg }}
              >
                <card.icon size={16} style={{ color: card.color }} />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-800">{card.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
