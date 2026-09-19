import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FinishLineState {
  requiredTaskIds: string[];
  rewardUnlocked: boolean;
  showCelebration: boolean;
  addRequired: (taskId: string) => void;
  removeRequired: (taskId: string) => void;
  isRequired: (taskId: string) => boolean;
  setRewardUnlocked: (val: boolean) => void;
  setShowCelebration: (val: boolean) => void;
  resetForNewDay: () => void;
  lastResetDate: string;
}

const todayStr = () => new Date().toISOString().split('T')[0];

export const useFinishLineStore = create<FinishLineState>()(
  persist(
    (set, get) => ({
      requiredTaskIds: [],
      rewardUnlocked: false,
      showCelebration: false,
      lastResetDate: todayStr(),

      addRequired: (taskId) => set((s) => ({
        requiredTaskIds: s.requiredTaskIds.includes(taskId) ? s.requiredTaskIds : [...s.requiredTaskIds, taskId],
      })),

      removeRequired: (taskId) => set((s) => ({
        requiredTaskIds: s.requiredTaskIds.filter(id => id !== taskId),
      })),

      isRequired: (taskId) => get().requiredTaskIds.includes(taskId),

      setRewardUnlocked: (val) => set({ rewardUnlocked: val }),
      setShowCelebration: (val) => set({ showCelebration: val }),

      resetForNewDay: () => {
        const today = todayStr();
        if (get().lastResetDate !== today) {
          set({ requiredTaskIds: [], rewardUnlocked: false, showCelebration: false, lastResetDate: today });
        }
      },
    }),
    { name: 'myspace-finishline' }
  )
);
