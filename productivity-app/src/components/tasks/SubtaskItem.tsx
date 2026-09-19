import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, Edit2, X, Save } from 'lucide-react';
import { Subtask } from '../../types';

interface SubtaskItemProps {
  subtask: Subtask;
  onToggle: () => void;
  onDelete: () => void;
  onUpdate: (title: string) => void;
}

export const SubtaskItem: React.FC<SubtaskItemProps> = ({ subtask, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(subtask.title);

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(editTitle.trim());
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
        subtask.completed ? 'bg-green-50/50' : 'bg-slate-50 hover:bg-slate-100'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
          subtask.completed
            ? 'bg-green-500 border-green-500'
            : 'border-slate-300 hover:border-blue-400'
        }`}
      >
        {subtask.completed && <Check size={12} className="text-white" />}
      </button>

      {/* Title */}
      {isEditing ? (
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') setIsEditing(false);
            }}
            className="flex-1 px-2 py-1 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
            autoFocus
          />
          <button onClick={handleSave} className="p-1 rounded-lg hover:bg-green-100">
            <Save size={14} className="text-green-600" />
          </button>
          <button onClick={() => setIsEditing(false)} className="p-1 rounded-lg hover:bg-slate-200">
            <X size={14} className="text-slate-500" />
          </button>
        </div>
      ) : (
        <span
          className={`flex-1 text-sm ${
            subtask.completed ? 'line-through text-slate-400' : 'text-slate-700'
          }`}
        >
          {subtask.title}
        </span>
      )}

      {/* Actions */}
      {!isEditing && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <Edit2 size={12} className="text-slate-500" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 size={12} className="text-red-500" />
          </button>
        </div>
      )}
    </motion.div>
  );
};
