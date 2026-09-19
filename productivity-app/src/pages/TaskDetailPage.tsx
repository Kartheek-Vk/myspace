import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  Tag,
  FileText,
  CalendarClock,
} from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { ProgressBar } from '../components/common/ProgressBar';
import { SubtaskList } from '../components/tasks/SubtaskList';
import { DeleteDialog } from '../components/common/DeleteDialog';
import { RescheduleDialog } from '../components/tasks/RescheduleDialog';
import { Modal } from '../components/common/Modal';
import { TaskForm } from '../components/tasks/TaskForm';
import {
  calculateProgress,
  formatDate,
  getCategoryColor,
  getCategoryLabel,
  getPriorityColor,
  getPriorityLabel,
  getStatusColor,
  getStatusLabel,
  isOverdue,
} from '../utils/helpers';

export const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    tasks,
    fetchTasks,
    fetchDashboard,
    deleteTask,
    toggleSubtask,
    deleteSubtask,
    updateSubtask,
    createSubtask,
    rescheduleTask,
    updateTask,
  } = useTaskStore();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const task = tasks.find(t => t.id === id);

  if (!task) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-slate-400">Task not found</p>
          <button
            onClick={() => navigate('/app/tasks')}
            className="mt-3 text-sm text-blue-600 font-medium hover:text-blue-700"
          >
            ← Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  const progress = calculateProgress(task.subtasks);
  const completedSubtasks = task.subtasks.filter(s => s.completed).length;
  const totalSubtasks = task.subtasks.length;
  const overdue = isOverdue(task.dueDate, task.status);

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteTask(task.id);
      navigate('/app/tasks');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleSubtask = async (subtaskId: string) => {
    await toggleSubtask(task.id, subtaskId);
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    await deleteSubtask(task.id, subtaskId);
  };

  const handleUpdateSubtask = async (subtaskId: string, title: string) => {
    await updateSubtask(task.id, subtaskId, { title });
  };

  const handleAddSubtask = async (title: string) => {
    await createSubtask(task.id, { title, description: '', orderIndex: task.subtasks.length, estimatedMinutes: 0 });
  };

  const handleReschedule = async (newDate: string) => {
    await rescheduleTask(task.id, newDate);
    setIsRescheduleOpen(false);
  };

  const handleEdit = async (dto: any) => {
    setIsSubmitting(true);
    try {
      await updateTask(task.id, dto);
      setIsEditOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/app/tasks')}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Tasks
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Task Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">{task.title}</h1>
              {task.subject && (
                <p className="text-sm text-slate-500">{task.subject}</p>
              )}
            </div>
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => setIsEditOpen(true)}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                title="Edit"
              >
                <Edit2 size={16} className="text-slate-600" />
              </button>
              <button
                onClick={() => setIsRescheduleOpen(true)}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                title="Reschedule"
              >
                <CalendarClock size={16} className="text-slate-600" />
              </button>
              <button
                onClick={() => setIsDeleteOpen(true)}
                className="p-2 rounded-xl border border-red-200 hover:bg-red-50 transition-colors"
                title="Delete"
              >
                <Trash2 size={16} className="text-red-500" />
              </button>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: getCategoryColor(task.category) + '15',
                color: getCategoryColor(task.category),
              }}
            >
              {getCategoryLabel(task.category)}
            </span>
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: getPriorityColor(task.priority) + '15',
                color: getPriorityColor(task.priority),
              }}
            >
              {getPriorityLabel(task.priority)} Priority
            </span>
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: getStatusColor(task.status) + '15',
                color: getStatusColor(task.status),
              }}
            >
              {getStatusLabel(task.status)}
            </span>
            {overdue && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">
                Overdue
              </span>
            )}
          </div>

          {/* Meta info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            {task.startDate && (
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">Start</p>
                  <p className="text-slate-700 font-medium">{formatDate(task.startDate)}</p>
                </div>
              </div>
            )}
            {task.dueDate && (
              <div className="flex items-center gap-2">
                <Calendar size={14} className={overdue ? 'text-red-500' : 'text-slate-400'} />
                <div>
                  <p className="text-xs text-slate-400">Due</p>
                  <p className={`font-medium ${overdue ? 'text-red-600' : 'text-slate-700'}`}>
                    {formatDate(task.dueDate)}
                  </p>
                </div>
              </div>
            )}
            {task.estimatedMinutes > 0 && (
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">Estimated</p>
                  <p className="text-slate-700 font-medium">
                    {task.estimatedMinutes >= 60
                      ? `${Math.floor(task.estimatedMinutes / 60)}h ${task.estimatedMinutes % 60}m`
                      : `${task.estimatedMinutes} min`}
                  </p>
                </div>
              </div>
            )}
            {task.startTime && (
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">Time</p>
                  <p className="text-slate-700 font-medium">
                    {task.startTime}{task.endTime ? ` - ${task.endTime}` : ''}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-600">{task.description}</p>
            </div>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag size={14} className="text-slate-400" />
                {task.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Progress</h2>
          <div className="flex items-center gap-4 mb-3">
            <span className="text-3xl font-bold text-slate-800">{progress}%</span>
            <span className="text-sm text-slate-500">
              {totalSubtasks > 0
                ? `${completedSubtasks} / ${totalSubtasks} subtasks completed`
                : task.status === 'COMPLETED' ? 'Completed (no subtasks)' : 'No subtasks'}
            </span>
          </div>
          <ProgressBar percentage={progress} height={10} />
        </div>

        {/* Subtasks */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
            Subtasks {totalSubtasks > 0 && `(${completedSubtasks}/${totalSubtasks})`}
          </h2>
          <SubtaskList
            taskId={task.id}
            subtasks={task.subtasks}
            onToggle={handleToggleSubtask}
            onDelete={handleDeleteSubtask}
            onUpdate={handleUpdateSubtask}
            onAdd={handleAddSubtask}
          />
        </div>

        {/* Notes */}
        {task.notes && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={16} className="text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Notes</h2>
            </div>
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{task.notes}</p>
          </div>
        )}
      </motion.div>

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Delete "${task.title}"? This will also delete all ${totalSubtasks} associated subtasks. This action cannot be undone.`}
        loading={isSubmitting}
      />

      {/* Reschedule Dialog */}
      <RescheduleDialog
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        onConfirm={handleReschedule}
        currentDueDate={task.dueDate}
        taskTitle={task.title}
      />

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Task" size="lg">
        <TaskForm
          task={task}
          onSubmit={handleEdit}
          onCancel={() => setIsEditOpen(false)}
          loading={isSubmitting}
        />
      </Modal>
    </div>
  );
};
