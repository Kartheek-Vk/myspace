import React from 'react';
import { motion } from 'framer-motion';
import {
  ListTodo,
  CalendarDays,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Circle,
} from 'lucide-react';
import { TaskFilter, TaskCategory, TaskPriority, TASK_CATEGORIES, TASK_PRIORITIES } from '../../types';

interface TaskFiltersProps {
  filter: TaskFilter;
  categoryFilter: TaskCategory | 'ALL';
  priorityFilter: TaskPriority | 'ALL';
  onFilterChange: (filter: TaskFilter) => void;
  onCategoryChange: (category: TaskCategory | 'ALL') => void;
  onPriorityChange: (priority: TaskPriority | 'ALL') => void;
  taskCounts: Record<string, number>;
}

const filterOptions: { value: TaskFilter; label: string; icon: React.ElementType }[] = [
  { value: 'ALL', label: 'All', icon: ListTodo },
  { value: 'TODAY', label: 'Today', icon: CalendarDays },
  { value: 'UPCOMING', label: 'Upcoming', icon: Clock },
  { value: 'OVERDUE', label: 'Overdue', icon: AlertTriangle },
  { value: 'IN_PROGRESS', label: 'In Progress', icon: Loader2 },
  { value: 'COMPLETED', label: 'Completed', icon: CheckCircle2 },
  { value: 'NOT_STARTED', label: 'Not Started', icon: Circle },
];

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filter,
  categoryFilter,
  priorityFilter,
  onFilterChange,
  onCategoryChange,
  onPriorityChange,
  taskCounts,
}) => {
  return (
    <div className="space-y-4">
      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onFilterChange(opt.value)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              filter === opt.value
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            <opt.icon size={14} />
            {opt.label}
            {taskCounts[opt.value] !== undefined && (
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                filter === opt.value ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {taskCounts[opt.value]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Category & Priority Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value as TaskCategory | 'ALL')}
          className="px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
        >
          <option value="ALL">All Categories</option>
          {TASK_CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value as TaskPriority | 'ALL')}
          className="px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
        >
          <option value="ALL">All Priorities</option>
          {TASK_PRIORITIES.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
