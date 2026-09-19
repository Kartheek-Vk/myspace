import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ActivityEntry {
  id: string;
  type: 'task_created' | 'task_completed' | 'subtask_completed' | 'subtask_uncompleted' | 'task_deleted' | 'task_rescheduled' | 'finish_line_completed' | 'reward_unlocked' | 'journal_entry' | 'tomorrow_planned';
  title: string;
  detail: string;
  timestamp: string;
  icon: string;
}

interface ActivityState {
  entries: ActivityEntry[];
  addEntry: (entry: Omit<ActivityEntry, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  getRecentEntries: (limit?: number) => ActivityEntry[];
  getEntriesForDate: (date: string) => ActivityEntry[];
}

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (entry) => {
        const newEntry: ActivityEntry = {
          ...entry,
          id: genId(),
          timestamp: new Date().toISOString(),
        };
        set((s) => ({ entries: [newEntry, ...s.entries].slice(0, 500) })); // Keep last 500
      },

      clearHistory: () => set({ entries: [] }),

      getRecentEntries: (limit = 20) => get().entries.slice(0, limit),

      getEntriesForDate: (date) => {
        return get().entries.filter(e => e.timestamp.startsWith(date));
      },
    }),
    { name: 'myspace-activity' }
  )
);

export function getActivityIcon(type: ActivityEntry['type']): string {
  const icons: Record<string, string> = {
    task_created: '📝',
    task_completed: '✅',
    subtask_completed: '☑️',
    subtask_uncompleted: '⬜',
    task_deleted: '🗑️',
    task_rescheduled: '📅',
    finish_line_completed: '🎯',
    reward_unlocked: '🎉',
    journal_entry: '📓',
    tomorrow_planned: '🌅',
  };
  return icons[type] || '📌';
}
