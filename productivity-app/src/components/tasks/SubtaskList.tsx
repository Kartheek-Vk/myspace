import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Subtask } from '../../types';
import { SubtaskItem } from './SubtaskItem';

interface SubtaskListProps {
  taskId: string;
  subtasks: Subtask[];
  onToggle: (subtaskId: string) => void;
  onDelete: (subtaskId: string) => void;
  onUpdate: (subtaskId: string, title: string) => void;
  onAdd: (title: string) => void;
}

export const SubtaskList: React.FC<SubtaskListProps> = ({
  taskId,
  subtasks,
  onToggle,
  onDelete,
  onUpdate,
  onAdd,
}) => {
  const [newTitle, setNewTitle] = useState('');

  const handleAdd = () => {
    if (newTitle.trim()) {
      onAdd(newTitle.trim());
      setNewTitle('');
    }
  };

  const sorted = [...subtasks].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {sorted.map((subtask) => (
          <SubtaskItem
            key={subtask.id}
            subtask={subtask}
            onToggle={() => onToggle(subtask.id)}
            onDelete={() => onDelete(subtask.id)}
            onUpdate={(title) => onUpdate(subtask.id, title)}
          />
        ))}
      </AnimatePresence>

      {/* Add new subtask */}
      <div className="flex items-center gap-2 pt-2">
        <div className="flex-1 flex items-center gap-2">
          <div className="w-5 h-5 rounded-md border-2 border-dashed border-slate-300 flex-shrink-0" />
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
            placeholder="Add a subtask..."
            className="flex-1 px-3 py-2 rounded-xl border border-dashed border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800"
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={!newTitle.trim()}
          className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors disabled:opacity-40"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};
