import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ListTodo, Clock } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { Task } from '../types';
import { getCategoryColor, getCategoryLabel, getPriorityColor, isToday } from '../utils/helpers';
import { ProgressBar } from '../components/common/ProgressBar';

export const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, fetchTasks } = useTaskStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => { fetchTasks(); }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getTasksForDate = (day: number): Task[] => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(t => t.dueDate === dateStr || t.startDate === dateStr);
  };

  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());
  const selectedTasks = selectedDay ? getTasksForDate(selectedDay) : [];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Calendar</h1>
        <p className="text-sm text-slate-500 mt-1">See your tasks, deadlines and plans together.</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">{monthName}</h2>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-slate-100 transition-colors"><ChevronLeft size={18} className="text-slate-600" /></button>
              <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">Today</button>
              <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-slate-100 transition-colors"><ChevronRight size={18} className="text-slate-600" /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {days.map(d => <span key={d} className="text-xs font-medium text-slate-400 py-2">{d}</span>)}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayTasks = getTasksForDate(day);
              const isTodayDate = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const isSelected = day === selectedDay;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`relative p-2 rounded-xl text-sm transition-all duration-200 ${
                    isSelected ? 'bg-blue-600 text-white shadow-md' :
                    isTodayDate ? 'bg-blue-50 text-blue-700 font-semibold' :
                    'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {day}
                  {dayTasks.length > 0 && (
                    <div className="flex justify-center gap-0.5 mt-1">
                      {dayTasks.slice(0, 3).map((t, idx) => (
                        <div key={idx} className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/70' : ''}`} style={!isSelected ? { backgroundColor: getCategoryColor(t.category) } : {}} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Selected Day Tasks */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-1">
            {selectedDay ? `${currentDate.toLocaleString('default', { month: 'long' })} ${selectedDay}` : 'Select a day'}
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} scheduled
          </p>

          {selectedTasks.length === 0 ? (
            <div className="text-center py-8">
              <Clock size={32} className="text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-400">No tasks for this day</p>
              <button onClick={() => navigate('/app/tasks')} className="mt-3 text-xs text-blue-600 font-medium hover:text-blue-700">Create a task →</button>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedTasks.map(task => {
                const completed = task.subtasks.filter(s => s.completed).length;
                const total = task.subtasks.length;
                const progress = total > 0 ? Math.round((completed / total) * 100) : (task.status === 'COMPLETED' ? 100 : 0);

                return (
                  <div key={task.id} onClick={() => navigate(`/tasks/${task.id}`)} className="p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-sm cursor-pointer transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: getCategoryColor(task.category) + '15', color: getCategoryColor(task.category) }}>
                        {getCategoryLabel(task.category)}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-slate-800 mb-2">{task.title}</h4>
                    {total > 0 && (
                      <div>
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>{completed}/{total}</span>
                          <span>{progress}%</span>
                        </div>
                        <ProgressBar percentage={progress} height={4} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
