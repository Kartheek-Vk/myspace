import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Clock, Calendar, BookOpen, Coffee, AlertTriangle, CheckCircle2, GraduationCap } from 'lucide-react';
import { useTomorrowStore, formatMinutes, ScheduleItem, FreeTimeBlock, TomorrowTask } from '../store/tomorrowStore';

const SCHEDULE_TYPES: ScheduleItem['type'][] = ['Class', 'College', 'Travel', 'Appointment', 'Personal', 'Other'];
const TYPE_ICONS: Record<string, string> = { Class: '🏫', College: '🎓', Travel: '🚗', Appointment: '📅', Personal: '🏃', Other: '📌' };

export const TomorrowPage: React.FC = () => {
  const {
    plan, addScheduleItem, removeScheduleItem,
    addFreeTimeBlock, removeFreeTimeBlock,
    addTask, removeTask, updateTask,
    getTotalFreeMinutes, getTotalPlannedMinutes, getFitStatus, checkConflicts,
  } = useTomorrowStore();

  const [newSchedTitle, setNewSchedTitle] = useState('');
  const [newSchedType, setNewSchedType] = useState<ScheduleItem['type']>('Class');
  const [newSchedStart, setNewSchedStart] = useState('');
  const [newSchedEnd, setNewSchedEnd] = useState('');
  const [newFtLabel, setNewFtLabel] = useState('');
  const [newFtStart, setNewFtStart] = useState('');
  const [newFtEnd, setNewFtEnd] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskMins, setNewTaskMins] = useState(30);

  const freeMin = getTotalFreeMinutes();
  const plannedMin = getTotalPlannedMinutes();
  const fitStatus = getFitStatus();
  const conflicts = checkConflicts();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayName = tomorrow.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const handleAddSchedule = () => {
    if (!newSchedTitle.trim() || !newSchedStart || !newSchedEnd) return;
    addScheduleItem({ title: newSchedTitle.trim(), type: newSchedType, startTime: newSchedStart, endTime: newSchedEnd, location: '', notes: '' });
    setNewSchedTitle(''); setNewSchedStart(''); setNewSchedEnd('');
  };

  const handleAddFreeTime = () => {
    if (!newFtLabel.trim() || !newFtStart || !newFtEnd) return;
    addFreeTimeBlock({ label: newFtLabel.trim(), startTime: newFtStart, endTime: newFtEnd });
    setNewFtLabel(''); setNewFtStart(''); setNewFtEnd('');
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    addTask({ title: newTaskTitle.trim(), estimatedMinutes: newTaskMins, required: true });
    setNewTaskTitle(''); setNewTaskMins(30);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Tomorrow</h1>
        <p className="text-sm text-slate-500 mt-1">{dayName} — Plan your day the night before.</p>
      </motion.div>

      {/* Fit Indicator */}
      {(freeMin > 0 || plannedMin > 0) && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`rounded-2xl p-5 border ${
          fitStatus === 'fits' ? 'bg-green-50 border-green-200' : fitStatus === 'almost' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-3">
            {fitStatus === 'fits' ? <CheckCircle2 size={24} className="text-green-600" /> :
             fitStatus === 'almost' ? <AlertTriangle size={24} className="text-amber-600" /> :
             <AlertTriangle size={24} className="text-red-600" />}
            <div>
              <h3 className={`font-bold ${fitStatus === 'fits' ? 'text-green-800' : fitStatus === 'almost' ? 'text-amber-800' : 'text-red-800'}`}>
                {fitStatus === 'fits' ? '✓ Your plan fits' : fitStatus === 'almost' ? '⚠ Almost full' : '⚠ Too much planned'}
              </h3>
              <p className="text-sm mt-1">
                <span className="font-medium">Planned:</span> {formatMinutes(plannedMin)} &nbsp;•&nbsp;
                <span className="font-medium">Free:</span> {formatMinutes(freeMin)} &nbsp;•&nbsp;
                {plannedMin <= freeMin ? (
                  <span className="font-medium">Remaining: {formatMinutes(freeMin - plannedMin)}</span>
                ) : (
                  <span className="font-medium text-red-700">Over: {formatMinutes(plannedMin - freeMin)}</span>
                )}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Conflicts */}
      {conflicts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <h3 className="font-bold text-red-800 text-sm mb-2">⚠ Time Conflicts</h3>
          {conflicts.map((c, i) => (
            <p key={i} className="text-xs text-red-700">{c.task1} overlaps with {c.task2}</p>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Classes & Commitments */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap size={18} className="text-blue-600" />
            <h2 className="font-bold text-slate-800">Classes & Commitments</h2>
          </div>
          <div className="space-y-2 mb-4">
            {plan.schedule.sort((a, b) => a.startTime.localeCompare(b.startTime)).map(item => (
              <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 group">
                <span className="text-lg">{TYPE_ICONS[item.type]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.startTime} – {item.endTime}</p>
                </div>
                <button onClick={() => removeScheduleItem(item.id)} className="opacity-0 group-hover:opacity-100"><X size={14} className="text-slate-400" /></button>
              </div>
            ))}
          </div>
          <div className="space-y-2 p-3 rounded-xl border border-dashed border-slate-200">
            <input value={newSchedTitle} onChange={e => setNewSchedTitle(e.target.value)} placeholder="e.g., Operating Systems" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
            <div className="grid grid-cols-3 gap-2">
              <select value={newSchedType} onChange={e => setNewSchedType(e.target.value as any)} className="px-2 py-2 rounded-lg border border-slate-200 text-xs">
                {SCHEDULE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input type="time" value={newSchedStart} onChange={e => setNewSchedStart(e.target.value)} className="px-2 py-2 rounded-lg border border-slate-200 text-xs" />
              <input type="time" value={newSchedEnd} onChange={e => setNewSchedEnd(e.target.value)} className="px-2 py-2 rounded-lg border border-slate-200 text-xs" />
            </div>
            <button onClick={handleAddSchedule} className="w-full py-2 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"><Plus size={14} /> Add</button>
          </div>
        </motion.div>

        {/* Free Time */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Coffee size={18} className="text-amber-600" />
            <h2 className="font-bold text-slate-800">My Free Time</h2>
            {freeMin > 0 && <span className="ml-auto text-sm font-semibold text-blue-600">{formatMinutes(freeMin)} total</span>}
          </div>
          <div className="space-y-2 mb-4">
            {plan.freeTime.sort((a, b) => a.startTime.localeCompare(b.startTime)).map(block => {
              const mins = parseInt(block.endTime.split(':')[0]) * 60 + parseInt(block.endTime.split(':')[1]) - parseInt(block.startTime.split(':')[0]) * 60 - parseInt(block.startTime.split(':')[1]);
              return (
                <div key={block.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-amber-50 group">
                  <Clock size={14} className="text-amber-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">{block.label}</p>
                    <p className="text-xs text-slate-500">{block.startTime} – {block.endTime} • {formatMinutes(mins)}</p>
                  </div>
                  <button onClick={() => removeFreeTimeBlock(block.id)} className="opacity-0 group-hover:opacity-100"><X size={14} className="text-slate-400" /></button>
                </div>
              );
            })}
          </div>
          <div className="space-y-2 p-3 rounded-xl border border-dashed border-slate-200">
            <input value={newFtLabel} onChange={e => setNewFtLabel(e.target.value)} placeholder="e.g., Morning, Evening" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
            <div className="grid grid-cols-2 gap-2">
              <input type="time" value={newFtStart} onChange={e => setNewFtStart(e.target.value)} className="px-2 py-2 rounded-lg border border-slate-200 text-xs" />
              <input type="time" value={newFtEnd} onChange={e => setNewFtEnd(e.target.value)} className="px-2 py-2 rounded-lg border border-slate-200 text-xs" />
            </div>
            <button onClick={handleAddFreeTime} className="w-full py-2 rounded-lg bg-amber-50 text-amber-600 text-sm font-medium hover:bg-amber-100 transition-colors flex items-center justify-center gap-1"><Plus size={14} /> Add Free Time</button>
          </div>
        </motion.div>
      </div>

      {/* Tomorrow's Tasks */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={18} className="text-purple-600" />
          <h2 className="font-bold text-slate-800">Tomorrow's Tasks</h2>
          {plannedMin > 0 && <span className="ml-auto text-sm font-semibold text-purple-600">{formatMinutes(plannedMin)} planned</span>}
        </div>
        <div className="space-y-2 mb-4">
          {plan.tasks.map(task => (
            <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl bg-purple-50/50 border border-purple-100 group">
              <input type="checkbox" checked={task.required} onChange={e => updateTask(task.id, { required: e.target.checked })} className="w-4 h-4 rounded accent-purple-600" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800">{task.title}</p>
                <p className="text-xs text-slate-500">{formatMinutes(task.estimatedMinutes)} {task.required && '• Required'}</p>
              </div>
              <input type="number" value={task.estimatedMinutes} onChange={e => updateTask(task.id, { estimatedMinutes: Number(e.target.value) })} className="w-16 px-2 py-1 rounded-lg border border-slate-200 text-xs text-center" min={5} step={5} />
              <span className="text-[10px] text-slate-400">min</span>
              <button onClick={() => removeTask(task.id)} className="opacity-0 group-hover:opacity-100"><X size={14} className="text-slate-400" /></button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleAddTask(); }} placeholder="Add a task..." className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm" />
          <input type="number" value={newTaskMins} onChange={e => setNewTaskMins(Number(e.target.value))} className="w-20 px-2 py-2.5 rounded-xl border border-slate-200 text-sm text-center" min={5} step={5} />
          <button onClick={handleAddTask} className="px-4 py-2.5 rounded-xl bg-purple-50 text-purple-600 font-medium hover:bg-purple-100 transition-colors"><Plus size={16} /></button>
        </div>
      </motion.div>

      {/* Visual Timeline */}
      {(plan.schedule.length > 0 || plan.tasks.length > 0) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-bold text-slate-800 mb-4">Timeline Preview</h2>
          <div className="relative pl-8">
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-200" />
            {[...plan.schedule.map(s => ({ time: s.startTime, label: s.title, icon: TYPE_ICONS[s.type], type: 'schedule' })),
              ...plan.freeTime.map(f => ({ time: f.startTime, label: `${f.label} (Free)`, icon: '☕', type: 'free' })),
              ...plan.tasks.map(t => ({ time: t.scheduledStart || '23:59', label: t.title, icon: '📚', type: 'task' })),
            ].sort((a, b) => a.time.localeCompare(b.time)).map((item, idx) => (
              <div key={idx} className="relative mb-4 last:mb-0">
                <div className="absolute -left-5 w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: item.type === 'schedule' ? '#3b82f6' : item.type === 'free' ? '#f59e0b' : '#8b5cf6' }} />
                <div className="ml-2">
                  <span className="text-xs font-medium text-slate-400">{item.time}</span>
                  <p className="text-sm text-slate-700">{item.icon} {item.label}</p>
                </div>
              </div>
            ))}
            {plan.schedule.length === 0 && plan.freeTime.length === 0 && plan.tasks.length === 0 && (
              <p className="text-sm text-slate-400">Add items to see your timeline</p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
