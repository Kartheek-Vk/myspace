import { create } from 'zustand';
import { Task, TaskFilter, TaskCategory, TaskPriority, DashboardTaskSummary } from '../types';
import { hybridTaskApi } from '../services/hybridApi';
import { isToday, isOverdue, isUpcoming } from '../utils/helpers';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filter: TaskFilter;
  categoryFilter: TaskCategory | 'ALL';
  priorityFilter: TaskPriority | 'ALL';
  searchQuery: string;
  dashboard: DashboardTaskSummary | null;

  // Actions
  fetchTasks: () => Promise<void>;
  fetchDashboard: () => Promise<void>;
  createTask: (dto: any) => Promise<Task>;
  updateTask: (id: string, dto: any) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  rescheduleTask: (id: string, dueDate: string) => Promise<void>;
  createSubtask: (taskId: string, dto: any) => Promise<void>;
  updateSubtask: (taskId: string, subtaskId: string, dto: any) => Promise<void>;
  deleteSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  reorderSubtasks: (taskId: string, subtaskIds: string[]) => Promise<void>;
  setFilter: (filter: TaskFilter) => void;
  setCategoryFilter: (category: TaskCategory | 'ALL') => void;
  setPriorityFilter: (priority: TaskPriority | 'ALL') => void;
  setSearchQuery: (query: string) => void;
  getFilteredTasks: () => Task[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,
  filter: 'ALL',
  categoryFilter: 'ALL',
  priorityFilter: 'ALL',
  searchQuery: '',
  dashboard: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const tasks = await hybridTaskApi.getTasks();
      set({ tasks, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchDashboard: async () => {
    try {
      const dashboard = await hybridTaskApi.getDashboard();
      set({ dashboard });
    } catch (err: any) {
      console.error('Dashboard fetch error:', err);
    }
  },

  createTask: async (dto) => {
    const task = await hybridTaskApi.createTask(dto);
    set(state => ({ tasks: [...state.tasks, task] }));
    get().fetchDashboard();
    return task;
  },

  updateTask: async (id, dto) => {
    const updated = await hybridTaskApi.updateTask(id, dto);
    if (updated) {
      set(state => ({
        tasks: state.tasks.map(t => t.id === id ? updated : t),
      }));
      get().fetchDashboard();
    }
  },

  deleteTask: async (id) => {
    const success = await hybridTaskApi.deleteTask(id);
    if (success) {
      set(state => ({ tasks: state.tasks.filter(t => t.id !== id) }));
      get().fetchDashboard();
    }
  },

  rescheduleTask: async (id, dueDate) => {
    const updated = await hybridTaskApi.rescheduleTask(id, dueDate);
    if (updated) {
      set(state => ({
        tasks: state.tasks.map(t => t.id === id ? updated : t),
      }));
      get().fetchDashboard();
    }
  },

  createSubtask: async (taskId, dto) => {
    await hybridTaskApi.createSubtask(taskId, dto);
    await get().fetchTasks();
    get().fetchDashboard();
  },

  updateSubtask: async (taskId, subtaskId, dto) => {
    await hybridTaskApi.updateSubtask(taskId, subtaskId, dto);
    await get().fetchTasks();
    get().fetchDashboard();
  },

  deleteSubtask: async (taskId, subtaskId) => {
    await hybridTaskApi.deleteSubtask(taskId, subtaskId);
    await get().fetchTasks();
    get().fetchDashboard();
  },

  toggleSubtask: async (taskId, subtaskId) => {
    await hybridTaskApi.toggleSubtask(taskId, subtaskId);
    await get().fetchTasks();
    get().fetchDashboard();
  },

  reorderSubtasks: async (taskId, subtaskIds) => {
    await hybridTaskApi.reorderSubtasks(taskId, subtaskIds);
    await get().fetchTasks();
  },

  setFilter: (filter) => set({ filter }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setPriorityFilter: (priorityFilter) => set({ priorityFilter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  getFilteredTasks: () => {
    const { tasks, filter, categoryFilter, priorityFilter, searchQuery } = get();
    
    let filtered = [...tasks];

    // Date-based filter
    switch (filter) {
      case 'TODAY':
        filtered = filtered.filter(t => isToday(t.dueDate) || isToday(t.startDate));
        break;
      case 'UPCOMING':
        filtered = filtered.filter(t => isUpcoming(t.dueDate));
        break;
      case 'OVERDUE':
        filtered = filtered.filter(t => isOverdue(t.dueDate, t.status));
        break;
      case 'COMPLETED':
        filtered = filtered.filter(t => t.status === 'COMPLETED');
        break;
      case 'IN_PROGRESS':
        filtered = filtered.filter(t => t.status === 'IN_PROGRESS');
        break;
      case 'NOT_STARTED':
        filtered = filtered.filter(t => t.status === 'NOT_STARTED');
        break;
    }

    // Category filter
    if (categoryFilter !== 'ALL') {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }

    // Priority filter
    if (priorityFilter !== 'ALL') {
      filtered = filtered.filter(t => t.priority === priorityFilter);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t => t.title.toLowerCase().includes(q));
    }

    // Sort: by due date, then priority
    const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    filtered.sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        const dateCompare = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        if (dateCompare !== 0) return dateCompare;
      }
      return (priorityOrder[a.priority] ?? 4) - (priorityOrder[b.priority] ?? 4);
    });

    return filtered;
  },
}));
