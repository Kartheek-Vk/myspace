import { Task, Subtask, TaskCreateDto, SubtaskCreateDto, TaskStatus, DashboardTaskSummary } from '../types';
import { calculateProgress, calculateStatusFromSubtasks, generateId, getTodayStr, isToday } from '../utils/helpers';

const TASKS_KEY = 'productivity_app_tasks';

function loadTasks(): Task[] {
  try {
    const data = localStorage.getItem(TASKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveTasks(tasks: Task[]): void {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function recalculateTask(task: Task): Task {
  const sorted = [...task.subtasks].sort((a, b) => a.orderIndex - b.orderIndex);
  const updated = { ...task, subtasks: sorted };
  
  if (sorted.length === 0) {
    if (task.status !== 'CANCELLED') {
      if (task.status === 'COMPLETED') {
        updated.status = 'COMPLETED';
      } else {
        updated.status = 'NOT_STARTED';
      }
    }
    return updated;
  }
  
  const progress = calculateProgress(sorted);
  const newStatus = calculateStatusFromSubtasks(sorted, task.status);
  updated.status = newStatus;
  updated.completedAt = newStatus === 'COMPLETED' ? new Date().toISOString() : null;
  
  return updated;
}

// Simulate network delay
const delay = (ms: number = 100) => new Promise(resolve => setTimeout(resolve, ms));

export const taskApi = {
  async getTasks(): Promise<Task[]> {
    await delay(50);
    return loadTasks();
  },

  async getTask(id: string): Promise<Task | null> {
    await delay(50);
    const tasks = loadTasks();
    return tasks.find(t => t.id === id) || null;
  },

  async createTask(dto: TaskCreateDto): Promise<Task> {
    await delay(100);
    const tasks = loadTasks();
    const now = new Date().toISOString();
    
    const subtasks: Subtask[] = (dto.subtasks || []).map((s: SubtaskCreateDto, idx: number) => ({
      id: generateId(),
      taskId: '',
      title: s.title,
      description: s.description || '',
      status: 'NOT_STARTED' as TaskStatus,
      completed: false,
      orderIndex: s.orderIndex ?? idx,
      estimatedMinutes: s.estimatedMinutes || 0,
      createdAt: now,
      updatedAt: now,
      completedAt: null,
    }));

    const task: Task = {
      id: generateId(),
      title: dto.title,
      description: dto.description || '',
      category: dto.category || 'OTHER',
      subject: dto.subject || '',
      priority: dto.priority || 'MEDIUM',
      status: dto.status || 'NOT_STARTED',
      startDate: dto.startDate || '',
      dueDate: dto.dueDate || '',
      startTime: dto.startTime || '',
      endTime: dto.endTime || '',
      estimatedMinutes: dto.estimatedMinutes || 0,
      notes: dto.notes || '',
      tags: dto.tags || [],
      createdAt: now,
      updatedAt: now,
      completedAt: null,
      subtasks: subtasks,
    };

    // Set taskId on subtasks
    task.subtasks = task.subtasks.map(s => ({ ...s, taskId: task.id }));
    
    // Recalculate
    const finalTask = recalculateTask(task);
    tasks.push(finalTask);
    saveTasks(tasks);
    return finalTask;
  },

  async updateTask(id: string, dto: Partial<TaskCreateDto> & { status?: TaskStatus }): Promise<Task | null> {
    await delay(100);
    const tasks = loadTasks();
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;

    const existing = tasks[idx];
    const updated: Task = {
      ...existing,
      title: dto.title ?? existing.title,
      description: dto.description ?? existing.description,
      category: dto.category ?? existing.category,
      subject: dto.subject ?? existing.subject,
      priority: dto.priority ?? existing.priority,
      status: dto.status ?? existing.status,
      startDate: dto.startDate ?? existing.startDate,
      dueDate: dto.dueDate ?? existing.dueDate,
      startTime: dto.startTime ?? existing.startTime,
      endTime: dto.endTime ?? existing.endTime,
      estimatedMinutes: dto.estimatedMinutes ?? existing.estimatedMinutes,
      notes: dto.notes ?? existing.notes,
      tags: dto.tags ?? existing.tags,
      updatedAt: new Date().toISOString(),
    };

    const finalTask = recalculateTask(updated);
    tasks[idx] = finalTask;
    saveTasks(tasks);
    return finalTask;
  },

  async deleteTask(id: string): Promise<boolean> {
    await delay(100);
    const tasks = loadTasks();
    const filtered = tasks.filter(t => t.id !== id);
    if (filtered.length === tasks.length) return false;
    saveTasks(filtered);
    return true;
  },

  async rescheduleTask(id: string, newDueDate: string): Promise<Task | null> {
    await delay(100);
    const tasks = loadTasks();
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    tasks[idx] = { ...tasks[idx], dueDate: newDueDate, updatedAt: new Date().toISOString() };
    saveTasks(tasks);
    return tasks[idx];
  },

  // Subtask operations
  async createSubtask(taskId: string, dto: SubtaskCreateDto): Promise<Subtask | null> {
    await delay(80);
    const tasks = loadTasks();
    const idx = tasks.findIndex(t => t.id === taskId);
    if (idx === -1) return null;

    const now = new Date().toISOString();
    const subtask: Subtask = {
      id: generateId(),
      taskId,
      title: dto.title,
      description: dto.description || '',
      status: 'NOT_STARTED',
      completed: false,
      orderIndex: dto.orderIndex ?? tasks[idx].subtasks.length,
      estimatedMinutes: dto.estimatedMinutes || 0,
      createdAt: now,
      updatedAt: now,
      completedAt: null,
    };

    tasks[idx].subtasks.push(subtask);
    tasks[idx] = recalculateTask(tasks[idx]);
    tasks[idx].updatedAt = now;
    saveTasks(tasks);
    return subtask;
  },

  async updateSubtask(taskId: string, subtaskId: string, dto: Partial<SubtaskCreateDto>): Promise<Subtask | null> {
    await delay(80);
    const tasks = loadTasks();
    const tIdx = tasks.findIndex(t => t.id === taskId);
    if (tIdx === -1) return null;

    const sIdx = tasks[tIdx].subtasks.findIndex(s => s.id === subtaskId);
    if (sIdx === -1) return null;

    const now = new Date().toISOString();
    tasks[tIdx].subtasks[sIdx] = {
      ...tasks[tIdx].subtasks[sIdx],
      title: dto.title ?? tasks[tIdx].subtasks[sIdx].title,
      description: dto.description ?? tasks[tIdx].subtasks[sIdx].description,
      orderIndex: dto.orderIndex ?? tasks[tIdx].subtasks[sIdx].orderIndex,
      estimatedMinutes: dto.estimatedMinutes ?? tasks[tIdx].subtasks[sIdx].estimatedMinutes,
      updatedAt: now,
    };

    tasks[tIdx] = recalculateTask(tasks[tIdx]);
    tasks[tIdx].updatedAt = now;
    saveTasks(tasks);
    return tasks[tIdx].subtasks[sIdx];
  },

  async deleteSubtask(taskId: string, subtaskId: string): Promise<boolean> {
    await delay(80);
    const tasks = loadTasks();
    const tIdx = tasks.findIndex(t => t.id === taskId);
    if (tIdx === -1) return false;

    const before = tasks[tIdx].subtasks.length;
    tasks[tIdx].subtasks = tasks[tIdx].subtasks.filter(s => s.id !== subtaskId);
    if (tasks[tIdx].subtasks.length === before) return false;

    tasks[tIdx] = recalculateTask(tasks[tIdx]);
    tasks[tIdx].updatedAt = new Date().toISOString();
    saveTasks(tasks);
    return true;
  },

  async toggleSubtask(taskId: string, subtaskId: string): Promise<Subtask | null> {
    await delay(50);
    const tasks = loadTasks();
    const tIdx = tasks.findIndex(t => t.id === taskId);
    if (tIdx === -1) return null;

    const sIdx = tasks[tIdx].subtasks.findIndex(s => s.id === subtaskId);
    if (sIdx === -1) return null;

    const now = new Date().toISOString();
    const subtask = tasks[tIdx].subtasks[sIdx];
    tasks[tIdx].subtasks[sIdx] = {
      ...subtask,
      completed: !subtask.completed,
      status: !subtask.completed ? 'COMPLETED' : 'NOT_STARTED',
      completedAt: !subtask.completed ? now : null,
      updatedAt: now,
    };

    tasks[tIdx] = recalculateTask(tasks[tIdx]);
    tasks[tIdx].updatedAt = now;
    saveTasks(tasks);
    return tasks[tIdx].subtasks[sIdx];
  },

  async reorderSubtasks(taskId: string, subtaskIds: string[]): Promise<boolean> {
    await delay(50);
    const tasks = loadTasks();
    const tIdx = tasks.findIndex(t => t.id === taskId);
    if (tIdx === -1) return false;

    subtaskIds.forEach((id, idx) => {
      const sIdx = tasks[tIdx].subtasks.findIndex(s => s.id === id);
      if (sIdx !== -1) {
        tasks[tIdx].subtasks[sIdx].orderIndex = idx;
        tasks[tIdx].subtasks[sIdx].updatedAt = new Date().toISOString();
      }
    });

    tasks[tIdx] = recalculateTask(tasks[tIdx]);
    saveTasks(tasks);
    return true;
  },

  async getDashboard(): Promise<DashboardTaskSummary> {
    await delay(50);
    const tasks = loadTasks();
    const todayStr = getTodayStr();

    // Today's tasks: tasks where startDate or dueDate is today
    const todayTasks = tasks.filter(t => {
      return isToday(t.startDate) || isToday(t.dueDate);
    });

    const todayCompleted = todayTasks.filter(t => t.status === 'COMPLETED').length;
    const todayInProgress = todayTasks.filter(t => t.status === 'IN_PROGRESS').length;
    const todayNotStarted = todayTasks.filter(t => t.status === 'NOT_STARTED').length;
    const todayCancelled = todayTasks.filter(t => t.status === 'CANCELLED').length;

    let todayTotalSubtasks = 0;
    let todayCompletedSubtasks = 0;
    todayTasks.forEach(t => {
      todayTotalSubtasks += t.subtasks.length;
      todayCompletedSubtasks += t.subtasks.filter(s => s.completed).length;
    });

    // If today's tasks have no subtasks, count the tasks themselves
    let todayProgress = 0;
    if (todayTotalSubtasks > 0) {
      todayProgress = Math.round((todayCompletedSubtasks / todayTotalSubtasks) * 100);
    } else if (todayTasks.length > 0) {
      // Tasks without subtasks: completed tasks / total tasks
      const tasksWithoutSubtasks = todayTasks.filter(t => t.subtasks.length === 0);
      const completedWithoutSubtasks = tasksWithoutSubtasks.filter(t => t.status === 'COMPLETED').length;
      todayProgress = Math.round((completedWithoutSubtasks / todayTasks.length) * 100);
    }

    // Overall
    const allCompleted = tasks.filter(t => t.status === 'COMPLETED').length;
    const allInProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const allNotStarted = tasks.filter(t => t.status === 'NOT_STARTED').length;
    const allCancelled = tasks.filter(t => t.status === 'CANCELLED').length;
    let allTotalSubtasks = 0;
    let allCompletedSubtasks = 0;
    tasks.forEach(t => {
      allTotalSubtasks += t.subtasks.length;
      allCompletedSubtasks += t.subtasks.filter(s => s.completed).length;
    });

    let overallProgress = 0;
    if (allTotalSubtasks > 0) {
      overallProgress = Math.round((allCompletedSubtasks / allTotalSubtasks) * 100);
    } else if (tasks.length > 0) {
      overallProgress = Math.round((allCompleted / tasks.length) * 100);
    }

    return {
      today: {
        totalTasks: todayTasks.length,
        completedTasks: todayCompleted,
        inProgressTasks: todayInProgress,
        notStartedTasks: todayNotStarted,
        cancelledTasks: todayCancelled,
        totalSubtasks: todayTotalSubtasks,
        completedSubtasks: todayCompletedSubtasks,
        progressPercentage: todayProgress,
      },
      overall: {
        totalTasks: tasks.length,
        completedTasks: allCompleted,
        inProgressTasks: allInProgress,
        notStartedTasks: allNotStarted,
        cancelledTasks: allCancelled,
        totalSubtasks: allTotalSubtasks,
        completedSubtasks: allCompletedSubtasks,
        progressPercentage: overallProgress,
      },
      todayTasks: todayTasks.map(t => ({
        id: t.id,
        title: t.title,
        category: t.category,
        priority: t.priority,
        status: t.status,
        totalSubtasks: t.subtasks.length,
        completedSubtasks: t.subtasks.filter(s => s.completed).length,
        progressPercentage: t.subtasks.length > 0
          ? Math.round((t.subtasks.filter(s => s.completed).length / t.subtasks.length) * 100)
          : (t.status === 'COMPLETED' ? 100 : 0),
      })),
    };
  },
};
