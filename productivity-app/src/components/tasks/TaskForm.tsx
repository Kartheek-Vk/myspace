import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, GripVertical } from 'lucide-react';
import { Task, TaskCreateDto, TaskCategory, TaskPriority, TaskStatus, TASK_CATEGORIES, TASK_PRIORITIES, TASK_STATUSES, SubtaskCreateDto } from '../../types';
import { getTodayStr } from '../../utils/helpers';

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (dto: TaskCreateDto) => void;
  onCancel: () => void;
  loading?: boolean;
}

interface SubtaskDraft {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel, loading }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [category, setCategory] = useState<TaskCategory>(task?.category || 'OTHER');
  const [subject, setSubject] = useState(task?.subject || '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'MEDIUM');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'NOT_STARTED');
  const [startDate, setStartDate] = useState(task?.startDate || getTodayStr());
  const [dueDate, setDueDate] = useState(task?.dueDate || '');
  const [startTime, setStartTime] = useState(task?.startTime || '');
  const [endTime, setEndTime] = useState(task?.endTime || '');
  const [estimatedMinutes, setEstimatedMinutes] = useState(task?.estimatedMinutes || 0);
  const [notes, setNotes] = useState(task?.notes || '');
  const [tags, setTags] = useState<string[]>(task?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [subtasks, setSubtasks] = useState<SubtaskDraft[]>(
    task?.subtasks.map(s => ({
      id: s.id,
      title: s.title,
      description: s.description,
      estimatedMinutes: s.estimatedMinutes,
    })) || []
  );
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Task title is required';
    if (title.trim().length > 200) newErrors.title = 'Title must be under 200 characters';
    if (startDate && dueDate && new Date(dueDate) < new Date(startDate)) {
      newErrors.dueDate = 'Due date cannot be before start date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const dto: TaskCreateDto = {
      title: title.trim(),
      description: description.trim(),
      category,
      subject: subject.trim(),
      priority,
      status,
      startDate,
      dueDate,
      startTime,
      endTime,
      estimatedMinutes: Number(estimatedMinutes) || 0,
      notes: notes.trim(),
      tags,
      subtasks: subtasks
        .filter(s => s.title.trim())
        .map((s, idx) => ({
          title: s.title.trim(),
          description: s.description.trim(),
          orderIndex: idx,
          estimatedMinutes: s.estimatedMinutes || 0,
        })),
    };

    onSubmit(dto);
  };

  const addSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks(prev => [
      ...prev,
      {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        title: newSubtaskTitle.trim(),
        description: '',
        estimatedMinutes: 0,
      },
    ]);
    setNewSubtaskTitle('');
  };

  const removeSubtask = (id: string) => {
    setSubtasks(prev => prev.filter(s => s.id !== id));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Task Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Learn Java Loops"
          className={`w-full px-4 py-2.5 rounded-xl border ${errors.title ? 'border-red-300 bg-red-50' : 'border-slate-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800`}
        />
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of the task..."
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800 resize-none"
        />
      </div>

      {/* Category & Subject */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as TaskCategory)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800 bg-white"
          >
            {TASK_CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject / Area</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Data Structures"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800"
          />
        </div>
      </div>

      {/* Priority & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800 bg-white"
          >
            {TASK_PRIORITIES.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
        {task && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800 bg-white"
            >
              {TASK_STATUSES.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl border ${errors.dueDate ? 'border-red-300 bg-red-50' : 'border-slate-200'} focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800`}
          />
          {errors.dueDate && <p className="text-xs text-red-500 mt-1">{errors.dueDate}</p>}
        </div>
      </div>

      {/* Times */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Estimated (min)</label>
          <input
            type="number"
            value={estimatedMinutes || ''}
            onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
            placeholder="e.g., 120"
            min={0}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional notes..."
          rows={2}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800 resize-none"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
            placeholder="Add a tag..."
            className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm text-slate-800"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors text-sm"
          >
            Add
          </button>
        </div>
      </div>

      {/* Subtasks */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Subtasks ({subtasks.filter(s => s.title.trim()).length})
        </label>
        
        {/* Existing subtasks */}
        <AnimatePresence>
          {subtasks.map((st, idx) => (
            <motion.div
              key={st.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2 mb-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100"
            >
              <GripVertical size={14} className="text-slate-300 flex-shrink-0" />
              <span className="text-xs text-slate-400 w-5 flex-shrink-0">{idx + 1}.</span>
              <input
                type="text"
                value={st.title}
                onChange={(e) => {
                  setSubtasks(prev => prev.map(s => s.id === st.id ? { ...s, title: e.target.value } : s));
                }}
                className="flex-1 px-2 py-1 rounded-lg border-0 bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-200 outline-none text-sm text-slate-800"
                placeholder="Subtask title"
              />
              <button
                type="button"
                onClick={() => removeSubtask(st.id)}
                className="p-1 rounded-lg hover:bg-red-100 transition-colors flex-shrink-0"
              >
                <X size={14} className="text-slate-400 hover:text-red-500" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add new subtask */}
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSubtask(); } }}
            placeholder="Add a subtask..."
            className="flex-1 px-4 py-2 rounded-xl border border-dashed border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm text-slate-800"
          />
          <button
            type="button"
            onClick={addSubtask}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-sm font-medium"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};
