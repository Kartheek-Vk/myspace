import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Calendar } from 'lucide-react';

interface RescheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newDate: string) => void;
  currentDueDate: string;
  taskTitle: string;
}

export const RescheduleDialog: React.FC<RescheduleDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentDueDate,
  taskTitle,
}) => {
  const [newDate, setNewDate] = useState(currentDueDate || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDate) {
      onConfirm(newDate);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reschedule Task" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-sm font-medium text-slate-700">{taskTitle}</p>
          {currentDueDate && (
            <p className="text-xs text-slate-500 mt-1">Current due date: {new Date(currentDueDate).toLocaleDateString()}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">New Due Date</label>
          <div className="relative">
            <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800"
              required
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Reschedule
          </button>
        </div>
      </form>
    </Modal>
  );
};
