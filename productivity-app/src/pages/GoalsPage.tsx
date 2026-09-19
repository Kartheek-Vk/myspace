import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, X, CheckCircle2, Circle, Calendar, TrendingUp, Flag } from 'lucide-react';
import { ProgressBar } from '../components/common/ProgressBar';

interface Milestone { id: string; title: string; completed: boolean; targetDate: string; }
interface Goal { id: string; title: string; description: string; targetDate: string; status: 'active' | 'completed' | 'paused'; milestones: Milestone[]; createdAt: string; }

const GOALS_KEY = 'myspace_goals_v2';
function loadGoals(): Goal[] { try { return JSON.parse(localStorage.getItem(GOALS_KEY) || '[]'); } catch { return []; } }
function saveGoals(g: Goal[]) { localStorage.setItem(GOALS_KEY, JSON.stringify(g)); }

export const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDate, setNewDate] = useState('');
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  const [newMilestone, setNewMilestone] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('');

  useEffect(() => { setGoals(loadGoals()); }, []);

  const createGoal = () => {
    if (!newTitle.trim()) return;
    const goal: Goal = { id: Date.now().toString(), title: newTitle.trim(), description: newDesc.trim(), targetDate: newDate, status: 'active', milestones: [], createdAt: new Date().toISOString() };
    const updated = [goal, ...goals];
    setGoals(updated); saveGoals(updated); setShowCreate(false); setNewTitle(''); setNewDesc(''); setNewDate('');
  };

  const toggleGoalStatus = (id: string) => {
    const updated = goals.map(g => g.id === id ? { ...g, status: g.status === 'completed' ? 'active' as const : 'completed' as const } : g);
    setGoals(updated); saveGoals(updated);
  };

  const deleteGoal = (id: string) => {
    const updated = goals.filter(g => g.id !== id);
    setGoals(updated); saveGoals(updated);
  };

  const addMilestone = (goalId: string) => {
    if (!newMilestone.trim()) return;
    const updated = goals.map(g => g.id === goalId ? { ...g, milestones: [...g.milestones, { id: Date.now().toString(), title: newMilestone.trim(), completed: false, targetDate: newMilestoneDate }] } : g);
    setGoals(updated); saveGoals(updated); setNewMilestone(''); setNewMilestoneDate('');
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    const updated = goals.map(g => g.id === goalId ? { ...g, milestones: g.milestones.map(m => m.id === milestoneId ? { ...m, completed: !m.completed } : m) } : g);
    setGoals(updated); saveGoals(updated);
  };

  const deleteMilestone = (goalId: string, milestoneId: string) => {
    const updated = goals.map(g => g.id === goalId ? { ...g, milestones: g.milestones.filter(m => m.id !== milestoneId) } : g);
    setGoals(updated); saveGoals(updated);
  };

  const getGoalProgress = (goal: Goal) => {
    if (goal.milestones.length === 0) return goal.status === 'completed' ? 100 : 0;
    return Math.round((goal.milestones.filter(m => m.completed).length / goal.milestones.length) * 100);
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Goals</h1>
          <p className="text-sm text-slate-500 mt-1">Track your long-term goals and milestones.</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
          <Plus size={16} /> New Goal
        </button>
      </motion.div>

      {/* Create Goal */}
      {showCreate && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
          <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Goal title..." className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium" />
          <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Description..." rows={2} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm resize-none" />
          <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm" />
          <div className="flex gap-2">
            <button onClick={createGoal} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium">Create Goal</button>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm">Cancel</button>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{activeGoals.length}</p>
          <p className="text-xs text-slate-500">Active Goals</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{completedGoals.length}</p>
          <p className="text-xs text-slate-500">Completed</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{goals.reduce((s, g) => s + g.milestones.length, 0)}</p>
          <p className="text-xs text-slate-500">Milestones</p>
        </div>
      </div>

      {/* Active Goals */}
      <div className="space-y-4">
        <h2 className="font-bold text-slate-800">Active Goals</h2>
        {activeGoals.length === 0 && <p className="text-sm text-slate-400 text-center py-8 bg-white rounded-2xl border border-slate-200">No active goals yet. Create one to get started!</p>}
        {activeGoals.map(goal => {
          const progress = getGoalProgress(goal);
          const isExpanded = expandedGoal === goal.id;
          return (
            <motion.div key={goal.id} layout className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-5 cursor-pointer" onClick={() => setExpandedGoal(isExpanded ? null : goal.id)}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><Target size={18} className="text-blue-600" /></div>
                    <div>
                      <h3 className="font-bold text-slate-800">{goal.title}</h3>
                      {goal.description && <p className="text-xs text-slate-500 mt-0.5">{goal.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-blue-600">{progress}%</span>
                    <button onClick={e => { e.stopPropagation(); toggleGoalStatus(goal.id); }} className="p-1.5 rounded-lg hover:bg-green-50"><CheckCircle2 size={16} className="text-slate-400 hover:text-green-500" /></button>
                    <button onClick={e => { e.stopPropagation(); deleteGoal(goal.id); }} className="p-1.5 rounded-lg hover:bg-red-50"><X size={16} className="text-slate-400 hover:text-red-500" /></button>
                  </div>
                </div>
                <ProgressBar percentage={progress} height={6} />
                {goal.milestones.length > 0 && <p className="text-xs text-slate-500 mt-2">{goal.milestones.filter(m => m.completed).length}/{goal.milestones.length} milestones</p>}
                {goal.targetDate && <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Calendar size={10} /> Target: {new Date(goal.targetDate).toLocaleDateString()}</p>}
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Milestones</h4>
                  <div className="space-y-2 mb-3">
                    {goal.milestones.map(m => (
                      <div key={m.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 group">
                        <button onClick={() => toggleMilestone(goal.id, m.id)}>
                          {m.completed ? <CheckCircle2 size={18} className="text-green-500" /> : <Circle size={18} className="text-slate-300" />}
                        </button>
                        <span className={`text-sm flex-1 ${m.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>{m.title}</span>
                        {m.targetDate && <span className="text-[10px] text-slate-400">{new Date(m.targetDate).toLocaleDateString()}</span>}
                        <button onClick={() => deleteMilestone(goal.id, m.id)} className="opacity-0 group-hover:opacity-100"><X size={12} className="text-slate-400" /></button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input value={newMilestone} onChange={e => setNewMilestone(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addMilestone(goal.id); }} placeholder="Add milestone..." className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm" />
                    <input type="date" value={newMilestoneDate} onChange={e => setNewMilestoneDate(e.target.value)} className="w-36 px-2 py-2 rounded-xl border border-slate-200 text-xs" />
                    <button onClick={() => addMilestone(goal.id)} className="p-2 rounded-xl bg-blue-50 text-blue-600"><Plus size={16} /></button>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-bold text-slate-800">Completed Goals</h2>
          {completedGoals.map(goal => (
            <div key={goal.id} className="bg-green-50 rounded-xl p-4 border border-green-100 flex items-center gap-3">
              <CheckCircle2 size={20} className="text-green-500" />
              <span className="text-sm text-slate-700 line-through flex-1">{goal.title}</span>
              <button onClick={() => toggleGoalStatus(goal.id)} className="text-xs text-slate-500 hover:text-blue-600">Reactivate</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
