import { Subtask, Task, TaskStatus } from '../types';

export function calculateProgress(subtasks: Subtask[]): number {
  if (subtasks.length === 0) return 0;
  const completed = subtasks.filter(s => s.completed).length;
  return Math.round((completed / subtasks.length) * 100);
}

export function calculateStatusFromSubtasks(subtasks: Subtask[], currentStatus: TaskStatus): TaskStatus {
  if (currentStatus === 'CANCELLED') return 'CANCELLED';
  if (subtasks.length === 0) return currentStatus;
  const completed = subtasks.filter(s => s.completed).length;
  if (completed === 0) return 'NOT_STARTED';
  if (completed === subtasks.length) return 'COMPLETED';
  return 'IN_PROGRESS';
}

export function calculateStatusFromProgress(progress: number, currentStatus: TaskStatus): TaskStatus {
  if (currentStatus === 'CANCELLED') return 'CANCELLED';
  if (progress === 0) return 'NOT_STARTED';
  if (progress === 100) return 'COMPLETED';
  return 'IN_PROGRESS';
}

export function isToday(dateStr: string): boolean {
  if (!dateStr) return false;
  const today = new Date();
  const date = new Date(dateStr);
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export function isOverdue(dateStr: string, status: TaskStatus): boolean {
  if (!dateStr || status === 'COMPLETED' || status === 'CANCELLED') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);
  return date < today;
}

export function isUpcoming(dateStr: string): boolean {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);
  return date > today;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateShort(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getTodayStr(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'URGENT': return '#ef4444';
    case 'HIGH': return '#f97316';
    case 'MEDIUM': return '#eab308';
    case 'LOW': return '#22c55e';
    default: return '#94a3b8';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'COMPLETED': return '#22c55e';
    case 'IN_PROGRESS': return '#3b82f6';
    case 'NOT_STARTED': return '#94a3b8';
    case 'CANCELLED': return '#ef4444';
    default: return '#94a3b8';
  }
}

export function getCategoryColor(category: string): string {
  switch (category) {
    case 'LIFE': return '#8b5cf6';
    case 'BTECH': return '#06b6d4';
    case 'DSA': return '#f97316';
    case 'JAVA_DAA': return '#ef4444';
    case 'PYTHON': return '#22c55e';
    case 'PROJECT': return '#3b82f6';
    case 'CAREER': return '#ec4899';
    case 'OTHER': return '#94a3b8';
    default: return '#94a3b8';
  }
}

export function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    LIFE: 'Life',
    BTECH: 'B.Tech',
    DSA: 'DSA',
    JAVA_DAA: 'Java / DAA',
    PYTHON: 'Python',
    PROJECT: 'Project',
    CAREER: 'Career',
    OTHER: 'Other',
  };
  return map[category] || category;
}

export function getPriorityLabel(priority: string): string {
  const map: Record<string, string> = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    URGENT: 'Urgent',
  };
  return map[priority] || priority;
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    NOT_STARTED: 'Not Started',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  };
  return map[status] || status;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
