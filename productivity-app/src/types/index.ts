export type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskCategory = 'LIFE' | 'BTECH' | 'DSA' | 'JAVA_DAA' | 'PYTHON' | 'PROJECT' | 'CAREER' | 'OTHER';

export const TASK_CATEGORIES: { value: TaskCategory; label: string }[] = [
  { value: 'LIFE', label: 'Life' },
  { value: 'BTECH', label: 'B.Tech' },
  { value: 'DSA', label: 'DSA' },
  { value: 'JAVA_DAA', label: 'Java / DAA' },
  { value: 'PYTHON', label: 'Python' },
  { value: 'PROJECT', label: 'Project' },
  { value: 'CAREER', label: 'Career' },
  { value: 'OTHER', label: 'Other' },
];

export const TASK_PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
];

export const TASK_STATUSES: { value: TaskStatus; label: string }[] = [
  { value: 'NOT_STARTED', label: 'Not Started' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  description: string;
  status: TaskStatus;
  completed: boolean;
  orderIndex: number;
  estimatedMinutes: number;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  subject: string;
  priority: TaskPriority;
  status: TaskStatus;
  startDate: string;
  dueDate: string;
  startTime: string;
  endTime: string;
  estimatedMinutes: number;
  notes: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  subtasks: Subtask[];
}

export interface TaskCreateDto {
  title: string;
  description: string;
  category: TaskCategory;
  subject: string;
  priority: TaskPriority;
  status: TaskStatus;
  startDate: string;
  dueDate: string;
  startTime: string;
  endTime: string;
  estimatedMinutes: number;
  notes: string;
  tags: string[];
  subtasks: SubtaskCreateDto[];
}

export interface SubtaskCreateDto {
  title: string;
  description: string;
  orderIndex: number;
  estimatedMinutes: number;
}

export interface DashboardTaskSummary {
  today: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    notStartedTasks: number;
    cancelledTasks: number;
    totalSubtasks: number;
    completedSubtasks: number;
    progressPercentage: number;
  };
  overall: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    notStartedTasks: number;
    cancelledTasks: number;
    totalSubtasks: number;
    completedSubtasks: number;
    progressPercentage: number;
  };
  todayTasks: TodayTaskItem[];
}

export interface TodayTaskItem {
  id: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  totalSubtasks: number;
  completedSubtasks: number;
  progressPercentage: number;
}

export type TaskFilter = 'ALL' | 'TODAY' | 'UPCOMING' | 'OVERDUE' | 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED';
