import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Plus, X, Target, TrendingUp, Award } from 'lucide-react';
import { ProgressBar } from '../components/common/ProgressBar';

interface Skill { id: string; name: string; level: number; color: string; }
interface Goal { id: string; title: string; completed: boolean; }

const SKILLS_KEY = 'myspace_skills';
const GOALS_KEY = 'myspace_goals';

function loadSkills(): Skill[] { try { return JSON.parse(localStorage.getItem(SKILLS_KEY) || '[]'); } catch { return []; } }
function saveSkills(s: Skill[]) { localStorage.setItem(SKILLS_KEY, JSON.stringify(s)); }
function loadGoals(): Goal[] { try { return JSON.parse(localStorage.getItem(GOALS_KEY) || '[]'); } catch { return []; } }
function saveGoals(g: Goal[]) { localStorage.setItem(GOALS_KEY, JSON.stringify(g)); }

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'];

export const CareerPage: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [newGoal, setNewGoal] = useState('');

  useEffect(() => { setSkills(loadSkills()); setGoals(loadGoals()); }, []);

  const addSkill = () => {
    if (!newSkill.trim()) return;
    const s = [...skills, { id: Date.now().toString(), name: newSkill.trim(), level: 30, color: COLORS[skills.length % COLORS.length] }];
    setSkills(s); saveSkills(s); setNewSkill('');
  };

  const updateSkillLevel = (id: string, level: number) => {
    const s = skills.map(sk => sk.id === id ? { ...sk, level } : sk);
    setSkills(s); saveSkills(s);
  };

  const removeSkill = (id: string) => { const s = skills.filter(sk => sk.id !== id); setSkills(s); saveSkills(s); };

  const addGoal = () => {
    if (!newGoal.trim()) return;
    const g = [...goals, { id: Date.now().toString(), title: newGoal.trim(), completed: false }];
    setGoals(g); saveGoals(g); setNewGoal('');
  };

  const toggleGoal = (id: string) => { const g = goals.map(gl => gl.id === id ? { ...gl, completed: !gl.completed } : gl); setGoals(g); saveGoals(g); };
  const removeGoal = (id: string) => { const g = goals.filter(gl => gl.id !== id); setGoals(g); saveGoals(g); };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Career</h1>
        <p className="text-sm text-slate-500 mt-1">Keep your long-term direction visible while working on today's tasks.</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skills */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award size={18} className="text-purple-600" />
            <h2 className="text-lg font-bold text-slate-800">Skills</h2>
          </div>
          <div className="space-y-4 mb-4">
            {skills.map(skill => (
              <div key={skill.id} className="group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{skill.level}%</span>
                    <button onClick={() => removeSkill(skill.id)} className="opacity-0 group-hover:opacity-100"><X size={12} className="text-slate-400" /></button>
                  </div>
                </div>
                <input type="range" min={0} max={100} value={skill.level} onChange={e => updateSkillLevel(skill.id, Number(e.target.value))} className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ background: `linear-gradient(to right, ${skill.color} ${skill.level}%, #e2e8f0 ${skill.level}%)` }} />
              </div>
            ))}
            {skills.length === 0 && <p className="text-sm text-slate-400 text-center py-4">Add skills to track your growth</p>}
          </div>
          <div className="flex gap-2">
            <input value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addSkill(); }} placeholder="Add a skill..." className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm" />
            <button onClick={addSkill} className="p-2 rounded-xl bg-purple-50 text-purple-600"><Plus size={16} /></button>
          </div>
        </motion.div>

        {/* Career Goals */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target size={18} className="text-amber-600" />
            <h2 className="text-lg font-bold text-slate-800">Career Goals</h2>
          </div>
          <div className="space-y-2 mb-4">
            {goals.map(goal => (
              <div key={goal.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 group">
                <button onClick={() => toggleGoal(goal.id)} className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${goal.completed ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
                  {goal.completed && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                </button>
                <span className={`text-sm flex-1 ${goal.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>{goal.title}</span>
                <button onClick={() => removeGoal(goal.id)} className="opacity-0 group-hover:opacity-100"><X size={12} className="text-slate-400" /></button>
              </div>
            ))}
            {goals.length === 0 && <p className="text-sm text-slate-400 text-center py-4">Add career goals to stay focused</p>}
          </div>
          <div className="flex gap-2">
            <input value={newGoal} onChange={e => setNewGoal(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addGoal(); }} placeholder="Add a career goal..." className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm" />
            <button onClick={addGoal} className="p-2 rounded-xl bg-amber-50 text-amber-600"><Plus size={16} /></button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
