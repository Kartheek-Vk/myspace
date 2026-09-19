/**
 * Server-side API implementation using Axios.
 * 
 * This replaces the localStorage-based taskApi for authenticated users.
 * All requests go through the backend with JWT authentication.
 */
import apiClient from './api';
import { Task, Subtask, TaskCreateDto, SubtaskCreateDto, TaskStatus, DashboardTaskSummary } from '../types';

export const serverTaskApi = {
  async getTasks(): Promise<Task[]> {
    const response = await apiClient.get('/tasks');
    return response.data;
  },

  async getTask(id: string): Promise<Task | null> {
    try {
      const response = await apiClient.get(`/tasks/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  },

  async createTask(dto: TaskCreateDto): Promise<Task> {
    const response = await apiClient.post('/tasks', dto);
    return response.data;
  },

  async updateTask(id: string, dto: Partial<TaskCreateDto> & { status?: TaskStatus }): Promise<Task | null> {
    try {
      const response = await apiClient.put(`/tasks/${id}`, dto);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  },

  async deleteTask(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/tasks/${id}`);
      return true;
    } catch (error: any) {
      if (error.response?.status === 404) return false;
      throw error;
    }
  },

  async rescheduleTask(id: string, newDueDate: string): Promise<Task | null> {
    try {
      const response = await apiClient.patch(`/tasks/${id}/reschedule`, { dueDate: newDueDate });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  },

  // Subtask operations
  async createSubtask(taskId: string, dto: SubtaskCreateDto): Promise<Subtask | null> {
    try {
      const response = await apiClient.post(`/tasks/${taskId}/subtasks`, dto);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  },

  async updateSubtask(taskId: string, subtaskId: string, dto: Partial<SubtaskCreateDto>): Promise<Subtask | null> {
    try {
      const response = await apiClient.put(`/tasks/${taskId}/subtasks/${subtaskId}`, dto);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  },

  async deleteSubtask(taskId: string, subtaskId: string): Promise<boolean> {
    try {
      await apiClient.delete(`/tasks/${taskId}/subtasks/${subtaskId}`);
      return true;
    } catch (error: any) {
      if (error.response?.status === 404) return false;
      throw error;
    }
  },

  async toggleSubtask(taskId: string, subtaskId: string): Promise<Subtask | null> {
    try {
      const response = await apiClient.patch(`/tasks/${taskId}/subtasks/${subtaskId}/complete`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  },

  async reorderSubtasks(taskId: string, subtaskIds: string[]): Promise<boolean> {
    // Note: Backend doesn't have a reorder endpoint yet, so we update each subtask's orderIndex
    try {
      await Promise.all(
        subtaskIds.map((id, idx) =>
          apiClient.put(`/tasks/${taskId}/subtasks/${id}`, { orderIndex: idx })
        )
      );
      return true;
    } catch (error: any) {
      if (error.response?.status === 404) return false;
      throw error;
    }
  },

  async getDashboard(): Promise<DashboardTaskSummary> {
    const response = await apiClient.get('/dashboard/task-summary');
    return response.data;
  },
};
