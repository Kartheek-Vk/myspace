import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ScheduleItem {
  id: string;
  title: string;
  type: 'Class' | 'College' | 'Travel' | 'Appointment' | 'Personal' | 'Other';
  startTime: string;
  endTime: string;
  location: string;
  notes: string;
}

export interface FreeTimeBlock {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
}

export interface TomorrowTask {
  id: string;
  title: string;
  estimatedMinutes: number;
  linkedTaskId?: string;
  required: boolean;
  assignedBlockId?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
}

export interface TomorrowPlan {
  date: string;
  schedule: ScheduleItem[];
  freeTime: FreeTimeBlock[];
  tasks: TomorrowTask[];
}

interface TomorrowState {
  plan: TomorrowPlan;
  addScheduleItem: (item: Omit<ScheduleItem, 'id'>) => void;
  removeScheduleItem: (id: string) => void;
  addFreeTimeBlock: (block: Omit<FreeTimeBlock, 'id'>) => void;
  removeFreeTimeBlock: (id: string) => void;
  addTask: (task: Omit<TomorrowTask, 'id'>) => void;
  removeTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<TomorrowTask>) => void;
  getTotalFreeMinutes: () => number;
  getTotalPlannedMinutes: () => number;
  getFitStatus: () => 'fits' | 'almost' | 'over';
  checkConflicts: () => { task1: string; task2: string }[];
}

function getTomorrowStr(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

export const useTomorrowStore = create<TomorrowState>()(
  persist(
    (set, get) => ({
      plan: {
        date: getTomorrowStr(),
        schedule: [],
        freeTime: [],
        tasks: [],
      },

      addScheduleItem: (item) => {
        set((s) => ({
          plan: { ...s.plan, schedule: [...s.plan.schedule, { ...item, id: genId() }] },
        }));
      },

      removeScheduleItem: (id) => {
        set((s) => ({
          plan: { ...s.plan, schedule: s.plan.schedule.filter(i => i.id !== id) },
        }));
      },

      addFreeTimeBlock: (block) => {
        set((s) => ({
          plan: { ...s.plan, freeTime: [...s.plan.freeTime, { ...block, id: genId() }] },
        }));
      },

      removeFreeTimeBlock: (id) => {
        set((s) => ({
          plan: { ...s.plan, freeTime: s.plan.freeTime.filter(b => b.id !== id) },
        }));
      },

      addTask: (task) => {
        set((s) => ({
          plan: { ...s.plan, tasks: [...s.plan.tasks, { ...task, id: genId() }] },
        }));
      },

      removeTask: (id) => {
        set((s) => ({
          plan: { ...s.plan, tasks: s.plan.tasks.filter(t => t.id !== id) },
        }));
      },

      updateTask: (id, updates) => {
        set((s) => ({
          plan: {
            ...s.plan,
            tasks: s.plan.tasks.map(t => t.id === id ? { ...t, ...updates } : t),
          },
        }));
      },

      getTotalFreeMinutes: () => {
        return get().plan.freeTime.reduce((sum, b) => {
          return sum + (timeToMinutes(b.endTime) - timeToMinutes(b.startTime));
        }, 0);
      },

      getTotalPlannedMinutes: () => {
        return get().plan.tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);
      },

      getFitStatus: () => {
        const free = get().getTotalFreeMinutes();
        const planned = get().getTotalPlannedMinutes();
        if (free === 0) return 'fits';
        const ratio = planned / free;
        if (planned > free) return 'over';
        if (ratio > 0.9) return 'almost';
        return 'fits';
      },

      checkConflicts: () => {
        const tasks = get().plan.tasks.filter(t => t.scheduledStart && t.scheduledEnd);
        const conflicts: { task1: string; task2: string }[] = [];
        for (let i = 0; i < tasks.length; i++) {
          for (let j = i + 1; j < tasks.length; j++) {
            const a = tasks[i], b = tasks[j];
            const aStart = timeToMinutes(a.scheduledStart!);
            const aEnd = timeToMinutes(a.scheduledEnd!);
            const bStart = timeToMinutes(b.scheduledStart!);
            const bEnd = timeToMinutes(b.scheduledEnd!);
            if (aStart < bEnd && bStart < aEnd) {
              conflicts.push({ task1: a.title, task2: b.title });
            }
          }
        }
        return conflicts;
      },
    }),
    { name: 'myspace-tomorrow' }
  )
);

export function formatMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
