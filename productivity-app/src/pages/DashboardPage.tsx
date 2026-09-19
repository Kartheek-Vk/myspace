import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Sparkles, TrendingUp, Play, CalendarDays, Target, CheckCircle2, Circle, Zap } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { useProfileStore } from '../store/profileStore';
import { useFinishLineStore } from '../store/finishLineStore';
import { useTomorrowStore, formatMinutes } from '../store/tomorrowStore';
import { DashboardProgress } from '../components/dashboard/DashboardProgress';
import { TaskSummaryCards } from '../components/dashboard/TaskSummaryCards';
import { TodayTasks } from '../components/dashboard/TodayTasks';
import { ProgressBar } from '../components/common/ProgressBar';
import { FocusTimer } from '../components/common/FocusTimer';
import { CelebrationScreen } from '../components/common/CelebrationScreen';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { dashboard, fetchDashboard, fetchTasks, tasks, toggleSubtask } = useTaskStore();
  const { profile, getGreeting, getDisplayName } = useProfileStore();
  const { requiredTaskIds, addRequired, removeRequired, isRequired, rewardUnlocked, setRewardUnlocked, showCelebration, setShowCelebration, resetForNewDay } = useFinishLineStore();
  const tomorrowStore = useTomorrowStore();

  const [focusOpen, setFocusOpen] = useState(false);
  const [focusTask, setFocusTask] = useState<{ taskTitle: string; subtaskTitle: string } | null>(null);

  useEffect(() => {
    fetchTasks();
    fetchDashboard();
    resetForNewDay();
  }, []);

  // Check if reward should be unlocked
  useEffect(() => {
    if (!dashboard || requiredTaskIds.length === 0) return;
    const requiredTasks = tasks.filter(t => requiredTaskIds.includes(t.id));
    if (requiredTasks.length === 0) return;

    const allComplete = requiredTasks.every(t => {
      if (t.subtasks.length === 0) return t.status === 'COMPLETED';
      return t.subtasks.every(s => s.completed);
    });

    if (allComplete && !rewardUnlocked && profile.rewardEnabled) {
      setRewardUnlocked(true);
      setShowCelebration(true);
    }
  }, [tasks, requiredTaskIds, dashboard]);

  const todayTasks = tasks.filter(t => {
    const today = new Date().toISOString().split('T')[0];
    return t.startDate === today || t.dueDate === today;
  });

  // Find next incomplete subtask
  const nextAction = (() => {
    for (const task of todayTasks) {
      if (task.status === 'COMPLETED' || task.status === 'CANCELLED') continue;
      if (task.subtasks.length === 0 && task.status !== 'COMPLETED') {
        return { taskTitle: task.title, subtaskTitle: 'Complete this task', taskId: task.id, subtaskId: null };
      }
      const incomplete = task.subtasks.find(s => !s.completed);
      if (incomplete) {
        return { taskTitle: task.title, subtaskTitle: incomplete.title, taskId: task.id, subtaskId: incomplete.id };
      }
    }
    return null;
  })();

  // Finish Line stats
  const requiredTasks = tasks.filter(t => requiredTaskIds.includes(t.id));
  const requiredComplete = requiredTasks.filter(t => {
    if (t.subtasks.length === 0) return t.status === 'COMPLETED';
    return t.subtasks.every(s => s.completed);
  }).length;
  const requiredTotalSubs = requiredTasks.reduce((s, t) => s + t.subtasks.length, 0);
  const requiredDoneSubs = requiredTasks.reduce((s, t) => s + t.subtasks.filter(st => st.completed).length, 0);
  const finishLinePercent = requiredTaskIds.length > 0 ? Math.round((requiredComplete / requiredTaskIds.length) * 100) : 0;

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const name = getDisplayName();
  const greeting = getGreeting();

  // Tomorrow stats
  const tmFreeMin = tomorrowStore.getTotalFreeMinutes();
  const tmPlannedMin = tomorrowStore.getTotalPlannedMinutes();
  const tmFitStatus = tomorrowStore.getFitStatus();

  if (!dashboard) return <div className="flex items-center justify-center h-64"><div className="text-slate-400">Loading...</div></div>;
  const { today: todayData, overall, todayTasks: todayTaskItems } = dashboard;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Personalized Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-4xl">{profile.avatar}</span>
          <div>
            <p className="text-sm text-slate-500">{dateStr}</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
              {greeting}, {name} <span className="inline-block animate-bounce">👋</span>
            </h1>
            {profile.favoriteQuote && (
              <p className="text-sm text-slate-500 italic mt-1">"{profile.favoriteQuote}"</p>
            )}
          </div>
        </div>
        <button onClick={() => navigate('/app/tasks?create=true')} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-md shadow-blue-200">
          <Plus size={18} /> New Task
        </button>
      </motion.div>

      {/* Today's Progress */}
      <DashboardProgress percentage={todayData.progressPercentage} completedSubtasks={todayData.completedSubtasks} totalSubtasks={todayData.totalSubtasks} />

      {/* Finish Line */}
      {todayTasks.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target size={18} className="text-orange-500" />
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Today's Finish Line</h3>
            {rewardUnlocked && <span className="ml-auto text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">🎉 Reward Unlocked!</span>}
          </div>
          <div className="space-y-2">
            {todayTasks.map(task => {
              const req = isRequired(task.id);
              const done = task.subtasks.length > 0 ? task.subtasks.every(s => s.completed) : task.status === 'COMPLETED';
              return (
                <div key={task.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 group">
                  <button onClick={() => req ? removeRequired(task.id) : addRequired(task.id)} title={req ? 'Remove from finish line' : 'Add to finish line'}>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${req ? 'bg-orange-500 border-orange-500' : 'border-slate-300'}`}>
                      {req && <Target size={10} className="text-white" />}
                    </div>
                  </button>
                  <div className="flex-1 cursor-pointer" onClick={() => navigate(`/app/tasks/${task.id}`)}>
                    <span className={`text-sm ${done ? 'line-through text-slate-400' : 'text-slate-700'}`}>{task.title}</span>
                  </div>
                  {done ? <CheckCircle2 size={16} className="text-green-500" /> : <Circle size={16} className="text-slate-300" />}
                </div>
              );
            })}
          </div>
          {requiredTaskIds.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">{requiredComplete}/{requiredTaskIds.length} required tasks</span>
                <span className="text-sm font-bold text-orange-600">{finishLinePercent}%</span>
              </div>
              <ProgressBar percentage={finishLinePercent} height={6} color="#f97316" />
            </div>
          )}
        </motion.div>
      )}

      {/* Just Start */}
      {nextAction && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-5 text-white">
          <p className="text-xs font-medium uppercase tracking-wide opacity-80 mb-1">Next Action</p>
          <h3 className="text-lg font-bold mb-1">{nextAction.subtaskTitle}</h3>
          <p className="text-sm opacity-80 mb-4">{nextAction.taskTitle}</p>
          <button onClick={() => { setFocusTask({ taskTitle: nextAction.taskTitle, subtaskTitle: nextAction.subtaskTitle }); setFocusOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 font-medium text-sm transition-colors">
            <Play size={14} /> Just Start
          </button>
        </motion.div>
      )}

      {/* Task Summary */}
      <TaskSummaryCards summary={todayData} title="Today" />

      {/* Today's Tasks */}
      <TodayTasks tasks={todayTaskItems} />

      {/* Tomorrow Preview */}
      {(tmFreeMin > 0 || tmPlannedMin > 0 || tomorrowStore.plan.schedule.length > 0) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-blue-600" />
              <h3 className="font-bold text-slate-800">Tomorrow</h3>
            </div>
            <button onClick={() => navigate('/app/tomorrow')} className="text-xs text-blue-600 font-medium">View →</button>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-lg font-bold text-slate-800">{tomorrowStore.plan.schedule.length > 0 ? `${tomorrowStore.plan.schedule.length}` : '—'}</p>
              <p className="text-xs text-slate-500">Classes</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-3">
              <p className="text-lg font-bold text-amber-700">{formatMinutes(tmFreeMin)}</p>
              <p className="text-xs text-amber-600">Free Time</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-3">
              <p className="text-lg font-bold text-purple-700">{formatMinutes(tmPlannedMin)}</p>
              <p className="text-xs text-purple-600">Planned</p>
            </div>
          </div>
          {tmFreeMin > 0 && (
            <div className={`mt-3 p-2 rounded-lg text-xs font-medium text-center ${tmFitStatus === 'fits' ? 'bg-green-50 text-green-700' : tmFitStatus === 'almost' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
              {tmFitStatus === 'fits' ? '✓ Plan fits' : tmFitStatus === 'almost' ? '⚠ Almost full' : '⚠ Over capacity'}
            </div>
          )}
        </motion.div>
      )}

      {/* Personal Wish */}
      {profile.personalWish && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-5 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-purple-600" />
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Your Wish</span>
          </div>
          <p className="text-sm text-slate-700 italic">"{profile.personalWish}"</p>
        </motion.div>
      )}

      {/* Overall Progress */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-blue-600" />
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Overall Progress</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div><p className="text-2xl font-bold text-slate-800">{overall.totalTasks}</p><p className="text-xs text-slate-500">Total Tasks</p></div>
          <div><p className="text-2xl font-bold text-green-600">{overall.completedTasks}</p><p className="text-xs text-slate-500">Completed</p></div>
          <div><p className="text-2xl font-bold text-slate-800">{overall.completedSubtasks}/{overall.totalSubtasks}</p><p className="text-xs text-slate-500">Subtasks</p></div>
          <div><p className="text-2xl font-bold text-blue-600">{overall.progressPercentage}%</p><p className="text-xs text-slate-500">Progress</p></div>
        </div>
        <ProgressBar percentage={overall.progressPercentage} height={8} />
      </motion.div>

      {/* Focus Timer */}
      {focusTask && <FocusTimer isOpen={focusOpen} onClose={() => setFocusOpen(false)} taskTitle={focusTask.taskTitle} subtaskTitle={focusTask.subtaskTitle} />}

      {/* Celebration */}
      <CelebrationScreen
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        completedTasks={requiredComplete}
        totalTasks={requiredTaskIds.length}
        completedSubtasks={requiredDoneSubs}
        totalSubtasks={requiredTotalSubs}
      />
    </div>
  );
};
