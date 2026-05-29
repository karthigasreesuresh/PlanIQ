import React from 'react';
import { 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Edit2, 
  Trash2 
} from 'lucide-react';

export default function TaskCard({ task, onEdit, onDelete, onStatusToggle }) {
  const { title, description, priority, status, dueDate, createdAt } = task;

  // Determine priority styles
  const getPriorityStyles = () => {
    switch (priority) {
      case 'High':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'Low':
      default:
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    }
  };

  // Check if task is overdue
  const isOverdue = () => {
    if (status === 'Completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dueDate) < today;
  };

  // Check if task is due today
  const isDueToday = () => {
    const today = new Date();
    const due = new Date(dueDate);
    return (
      due.getDate() === today.getDate() &&
      due.getMonth() === today.getMonth() &&
      due.getFullYear() === today.getFullYear()
    );
  };

  // Format dates
  const formatDueDate = (dateStr) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  const getDueDateLabel = () => {
    if (status === 'Completed') {
      return (
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <CheckCircle2 size={13} className="text-emerald-500" />
          Completed
        </span>
      );
    }
    
    if (isOverdue()) {
      return (
        <span className="flex items-center gap-1 text-xs font-bold text-rose-400 animate-pulse">
          <AlertCircle size={13} />
          Overdue: {formatDueDate(dueDate)}
        </span>
      );
    }

    if (isDueToday()) {
      return (
        <span className="flex items-center gap-1 text-xs font-semibold text-amber-400">
          <Clock size={13} />
          Due Today
        </span>
      );
    }

    return (
      <span className="flex items-center gap-1 text-xs text-slate-400">
        <Calendar size={13} />
        Due: {formatDueDate(dueDate)}
      </span>
    );
  };

  return (
    <div className={`p-5 rounded-2xl glass-card transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl hover:border-slate-700/80 ${
      status === 'Completed' ? 'opacity-70' : ''
    }`}>
      {/* Card Header: Title & Checkbox */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-start gap-3">
          <button 
            onClick={() => onStatusToggle(task)}
            className="mt-1 flex-shrink-0 text-slate-500 hover:text-brand-400 transition-colors"
            title={status === 'Completed' ? 'Mark Incomplete' : 'Mark Completed'}
          >
            {status === 'Completed' ? (
              <CheckCircle2 className="w-5 h-5 text-brand-400 fill-brand-400/10" />
            ) : (
              <Circle className="w-5 h-5 text-slate-400 hover:scale-110 transition-transform" />
            )}
          </button>
          
          <div>
            <h3 className={`font-semibold text-base text-slate-100 ${
              status === 'Completed' ? 'line-through text-slate-400' : ''
            }`}>
              {title}
            </h3>
          </div>
        </div>

        {/* Priority Badge */}
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityStyles()}`}>
          {priority}
        </span>
      </div>

      {/* Description */}
      <p className={`text-sm text-slate-400 mb-4 ml-8 line-clamp-2 ${
        status === 'Completed' ? 'line-through text-slate-500' : ''
      }`}>
        {description || <span className="italic text-slate-600">No description provided</span>}
      </p>

      <div className="h-px bg-slate-800/60 my-3 ml-8"></div>

      {/* Card Footer: Due Date & Actions */}
      <div className="flex items-center justify-between ml-8">
        {/* Due Date Indicator */}
        {getDueDateLabel()}

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-400 hover:bg-slate-800 transition-all"
            title="Edit Task"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-all"
            title="Delete Task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
