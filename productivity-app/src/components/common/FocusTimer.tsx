import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, X, CheckCircle2 } from 'lucide-react';

interface FocusTimerProps {
  isOpen: boolean;
  onClose: () => void;
  taskTitle: string;
  subtaskTitle?: string;
  defaultMinutes?: number;
  onComplete?: () => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({ isOpen, onClose, taskTitle, subtaskTitle, defaultMinutes = 25, onComplete }) => {
  const [duration, setDuration] = useState(defaultMinutes * 60);
  const [remaining, setRemaining] = useState(defaultMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(defaultMinutes);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && remaining > 0) {
      intervalRef.current = window.setInterval(() => {
        setRemaining(r => {
          if (r <= 1) {
            setIsRunning(false);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, remaining]);

  const presets = [15, 25, 45, 60];
  const progress = duration > 0 ? ((duration - remaining) / duration) * 100 : 0;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const isComplete = remaining === 0 && duration > 0;

  const selectPreset = (mins: number) => {
    setSelectedPreset(mins);
    setDuration(mins * 60);
    setRemaining(mins * 60);
    setIsRunning(false);
  };

  const reset = () => {
    setRemaining(duration);
    setIsRunning(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100"><X size={18} className="text-slate-400" /></button>

            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Focus Session</p>
            <h3 className="text-lg font-bold text-slate-800 mb-1">{subtaskTitle || taskTitle}</h3>
            {subtaskTitle && <p className="text-xs text-slate-500 mb-4">{taskTitle}</p>}

            {/* Timer Circle */}
            <div className="relative w-48 h-48 mx-auto my-6">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                <circle cx="50" cy="50" r="44" fill="none" stroke={isComplete ? '#22c55e' : '#3b82f6'} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 44}`} strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress / 100)}`} className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {isComplete ? (
                  <CheckCircle2 size={40} className="text-green-500" />
                ) : (
                  <>
                    <span className="text-4xl font-bold text-slate-800">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
                    <span className="text-xs text-slate-500 mt-1">{isRunning ? 'Focusing...' : 'Ready'}</span>
                  </>
                )}
              </div>
            </div>

            {/* Presets */}
            {!isRunning && !isComplete && (
              <div className="flex justify-center gap-2 mb-6">
                {presets.map(mins => (
                  <button key={mins} onClick={() => selectPreset(mins)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedPreset === mins ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {mins}m
                  </button>
                ))}
              </div>
            )}

            {/* Controls */}
            <div className="flex justify-center gap-3">
              {isComplete ? (
                <div className="space-y-3">
                  <p className="text-sm text-green-700 font-medium">Session complete! 🎯</p>
                  <p className="text-xs text-slate-500">Mark the subtask complete manually when ready.</p>
                  <div className="flex gap-2 justify-center">
                    <button onClick={reset} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200">Restart</button>
                    <button onClick={onClose} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">Done</button>
                  </div>
                </div>
              ) : (
                <>
                  <button onClick={() => setIsRunning(!isRunning)} className={`px-6 py-3 rounded-xl font-medium text-sm flex items-center gap-2 ${isRunning ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                    {isRunning ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Start</>}
                  </button>
                  <button onClick={reset} className="px-4 py-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"><RotateCcw size={16} /></button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
