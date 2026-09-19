import React from 'react';
import { Search } from 'lucide-react';

interface TaskSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const TaskSearch: React.FC<TaskSearchProps> = ({ value, onChange }) => {
  return (
    <div className="relative">
      <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search tasks..."
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm text-slate-800 bg-white"
      />
    </div>
  );
};
