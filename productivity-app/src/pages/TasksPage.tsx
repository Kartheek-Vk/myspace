import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Plus, ListTodo } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskSearch } from '../components/tasks/TaskSearch';
import { TaskForm } from '../components/tasks/TaskForm';
import { DeleteDialog } from '../components/common/DeleteDialog';
import { Modal } from '../components/common/Modal';
import { Task } from '../types';
import { isToday, isOverdue, isUpcoming } from '../utils/helpers';

export const TasksPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    tasks,
    loading,
    filter,
    categoryFilter,
    priorityFilter,
    searchQuery,
    fetchTasks,
    fetchDashboard,
    createTask,
    updateTask,
    deleteTask,
    setFilter,
    setCategoryFilter,
    setPriorityFilter,
    setSearchQuery,
    getFilteredTasks,
  } = useTaskStore();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTasks();
    if (searchParams.get('create') === 'true') {
      setIsCreateOpen(true);
      setSearchParams({});
    }
  }, []);

  const filteredTasks = getFilteredTasks();

  const taskCounts = {
    ALL: tasks.length,
    TODAY: tasks.filter(t => isToday(t.dueDate) || isToday(t.startDate)).length,
    UPCOMING: tasks.filter(t => isUpcoming(t.dueDate)).length,
    OVERDUE: tasks.filter(t => isOverdue(t.dueDate, t.status)).length,
    COMPLETED: tasks.filter(t => t.status === 'COMPLETED').length,
    IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    NOT_STARTED: tasks.filter(t => t.status === 'NOT_STARTED').length,
  };

  const handleCreate = async (dto: any) => {
    setIsSubmitting(true);
    try {
      await createTask(dto);
      setIsCreateOpen(false);
      fetchDashboard();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (dto: any) => {
    if (!editingTask) return;
    setIsSubmitting(true);
    try {
      await updateTask(editingTask.id, dto);
      setEditingTask(null);
      fetchDashboard();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingTask) return;
    setIsSubmitting(true);
    try {
      await deleteTask(deletingTask.id);
      setDeletingTask(null);
      fetchDashboard();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Tasks</h1>
          <p className="text-sm text-slate-500 mt-1">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
        >
          <Plus size={18} />
          New Task
        </button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <TaskSearch value={searchQuery} onChange={setSearchQuery} />
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <TaskFilters
          filter={filter}
          categoryFilter={categoryFilter}
          priorityFilter={priorityFilter}
          onFilterChange={setFilter}
          onCategoryChange={setCategoryFilter}
          onPriorityChange={setPriorityFilter}
          taskCounts={taskCounts}
        />
      </motion.div>

      {/* Task List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-400">Loading tasks...</div>
        </div>
      ) : filteredTasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-64 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <ListTodo size={28} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-600">No tasks found</h3>
          <p className="text-sm text-slate-400 mt-1">
            {tasks.length === 0 ? 'Create your first task to get started.' : 'Try adjusting your filters.'}
          </p>
          {tasks.length === 0 && (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Create Task
            </button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={(t) => setEditingTask(t)}
                onDelete={(t) => setDeletingTask(t)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create Task Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Task" size="lg">
        <TaskForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateOpen(false)}
          loading={isSubmitting}
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal isOpen={!!editingTask} onClose={() => setEditingTask(null)} title="Edit Task" size="lg">
        {editingTask && (
          <TaskForm
            task={editingTask}
            onSubmit={handleUpdate}
            onCancel={() => setEditingTask(null)}
            loading={isSubmitting}
          />
        )}
      </Modal>

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Delete "${deletingTask?.title}"? This will also delete all associated subtasks. This action cannot be undone.`}
        loading={isSubmitting}
      />
    </div>
  );
};
