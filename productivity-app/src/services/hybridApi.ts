/**
 * Hybrid API client that routes between server API and localStorage.
 * 
 * - Authenticated users → serverTaskApi (HTTP with JWT)
 * - Guest users → localStorageTaskApi (IndexedDB/localStorage)
 * 
 * This maintains the guest mode functionality while enabling real API calls.
 */
import { Task, Subtask, TaskCreateDto, SubtaskCreateDto, TaskStatus, DashboardTaskSummary } from '../types';
import { serverTaskApi } from './serverApi';
import { taskApi as localStorageTaskApi } from './apiClient';
import { useAuthStore } from '../store/authStore';

function isGuestMode(): boolean {
  const state = useAuthStore.getState();
  return state.isGuest || state.authMode === 'guest';
}

export const hybridTaskApi = {
  async getTasks(): Promise<Task[]> {
    if (isGuestMode()) {
      return localStorageTaskApi.getTasks();
    }
    return serverTaskApi.getTasks();
  },

  async getTask(id: string): Promise<Task | null> {
    if (isGuestMode()) {
      return localStorageTaskApi.getTask(id);
    }
    return serverTaskApi.getTask(id);
  },

  async createTask(dto: TaskCreateDto): Promise<Task> {
    if (isGuestMode()) {
      return localStorageTaskApi.createTask(dto);
    }
    return serverTaskApi.createTask(dto);
  },

  async updateTask(id: string, dto: Partial<TaskCreateDto> & { status?: TaskStatus }): Promise<Task | null> {
    if (isGuestMode()) {
      return localStorageTaskApi.updateTask(id, dto);
    }
    return serverTaskApi.updateTask(id, dto);
  },

  async deleteTask(id: string): Promise<boolean> {
    if (isGuestMode()) {
      return localStorageTaskApi.deleteTask(id);
    }
    return serverTaskApi.deleteTask(id);
  },

  async rescheduleTask(id: string, newDueDate: string): Promise<Task | null> {
    if (isGuestMode()) {
      return localStorageTaskApi.rescheduleTask(id, newDueDate);
    }
    return serverTaskApi.rescheduleTask(id, newDueDate);
  },

  // Subtask operations
  async createSubtask(taskId: string, dto: SubtaskCreateDto): Promise<Subtask | null> {
    if (isGuestMode()) {
      return localStorageTaskApi.createSubtask(taskId, dto);
    }
    return serverTaskApi.createSubtask(taskId, dto);
  },

  async updateSubtask(taskId: string, subtaskId: string, dto: Partial<SubtaskCreateDto>): Promise<Subtask | null> {
    if (isGuestMode()) {
      return localStorageTaskApi.updateSubtask(taskId, subtaskId, dto);
    }
    return serverTaskApi.updateSubtask(taskId, subtaskId, dto);
  },

  async deleteSubtask(taskId: string, subtaskId: string): Promise<boolean> {
    if (isGuestMode()) {
      return localStorageTaskApi.deleteSubtask(taskId, subtaskId);
    }
    return serverTaskApi.deleteSubtask(taskId, subtaskId);
  },

  async toggleSubtask(taskId: string, subtaskId: string): Promise<Subtask | null> {
    if (isGuestMode()) {
      return localStorageTaskApi.toggleSubtask(taskId, subtaskId);
    }
    return serverTaskApi.toggleSubtask(taskId, subtaskId);
  },

  async reorderSubtasks(taskId: string, subtaskIds: string[]): Promise<boolean> {
    if (isGuestMode()) {
      return localStorageTaskApi.reorderSubtasks(taskId, subtaskIds);
    }
    return serverTaskApi.reorderSubtasks(taskId, subtaskIds);
  },

  async getDashboard(): Promise<DashboardTaskSummary> {
    if (isGuestMode()) {
      return localStorageTaskApi.getDashboard();
    }
    return serverTaskApi.getDashboard();
  },
};
