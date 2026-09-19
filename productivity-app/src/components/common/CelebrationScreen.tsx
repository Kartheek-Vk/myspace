import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, X, Sparkles } from 'lucide-react';
import { useProfileStore } from '../../store/profileStore';
import { useFinishLineStore } from '../../store/finishLineStore';

interface CelebrationScreenProps {
  isOpen: boolean;
  onClose: () => void;
  completedTasks: number;
  totalTasks: number;
  completedSubtasks: number;
  totalSubtasks: number;
}

export const CelebrationScreen: React.FC<CelebrationScreenProps> = ({ isOpen, onClose, completedTasks, totalTasks, completedSubtasks, totalSubtasks }) => {
  const { profile, getDisplayName } = useProfileStore();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const name = getDisplayName();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Confetti */}
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    backgroundColor: ['#3b82f6', '#22c55e', '#f97316', '#8b5cf6', '#ec4899', '#eab308'][i % 6],
                  }}
                  initial={{ top: '-5%', opacity: 1, rotate: 0 }}
                  animate={{ top: '105%', opacity: 0, rotate: Math.random() * 720 }}
                  transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 1.5, ease: 'easeIn' }}
                />
              ))}
            </div>
          )}

          <motion.div
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center overflow-hidden"
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 z-10"><X size={18} className="text-slate-400" /></button>

            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-green-50 opacity-50" />

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', damping: 10 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4"
              >
                <PartyPopper size={36} className="text-white" />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">
                  You did it, {name}! 🎉
                </h2>
                <p className="text-sm text-slate-500 mb-6">Today's plan: 100% complete</p>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-2xl font-bold text-blue-700">{completedTasks}/{totalTasks}</p>
                  <p className="text-xs text-blue-600">Tasks Done</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3">
                  <p className="text-2xl font-bold text-green-700">{completedSubtasks}/{totalSubtasks}</p>
                  <p className="text-xs text-green-600">Subtasks Done</p>
                </div>
              </motion.div>

              {profile.rewardEnabled && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-5 mb-4 border border-purple-100">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles size={16} className="text-purple-600" />
                    <h3 className="font-bold text-purple-800">{profile.rewardType} Unlocked</h3>
                  </div>
                  <p className="text-sm text-purple-700 italic">"{profile.rewardMessage}"</p>
                  <p className="text-xs text-purple-500 mt-2">{profile.rewardDuration} minutes of well-earned fun</p>
                </motion.div>
              )}

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Enjoy Your Reward 😌
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
