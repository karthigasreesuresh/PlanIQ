import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../utils/api';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import ConfirmModal from '../components/ConfirmModal';
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Trash2, 
  ClipboardList, 
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

export default function TasksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtering & Sorting State
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [priority, setPriority] = useState(searchParams.get('priority') || '');
  const [sortBy, setSortBy] = useState('dueDate');

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null); // Loaded when editing
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Load URL params if changed
  useEffect(() => {
    const urlStatus = searchParams.get('status') || '';
    const urlPriority = searchParams.get('priority') || '';
    if (urlStatus !== status) setStatus(urlStatus);
    if (urlPriority !== priority) setPriority(urlPriority);
  }, [searchParams]);

  // Fetch tasks helper
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await api.tasks.getTasks({
        search,
        status,
        priority,
        sortBy
      });
      setTasks(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch tasks list.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks on query update
  useEffect(() => {
    fetchTasks();
  }, [search, status, priority, sortBy]);

  // Sync state filters back to search params
  const updateUrlParams = (newStatus, newPriority) => {
    const params = {};
    if (newStatus) params.status = newStatus;
    if (newPriority) params.priority = newPriority;
    setSearchParams(params);
  };

  const handleStatusFilterChange = (e) => {
    const val = e.target.value;
    setStatus(val);
    updateUrlParams(val, priority);
  };

  const handlePriorityFilterChange = (e) => {
    const val = e.target.value;
    setPriority(val);
    updateUrlParams(status, val);
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatus('');
    setPriority('');
    setSortBy('dueDate');
    setSearchParams({});
  };

  // Create or Update task
  const handleTaskSubmit = async (taskData) => {
    if (selectedTask) {
      // Edit mode
      await api.tasks.updateTask(selectedTask._id, taskData);
    } else {
      // Create mode
      await api.tasks.createTask(taskData);
    }
    fetchTasks();
  };

  // Quick checkbox complete/incomplete toggle
  const handleStatusToggle = async (task) => {
    const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      // Optimistic Update
      setTasks(prev => prev.map(t => t._id === task._id ? { ...t, status: nextStatus } : t));
      await api.tasks.updateTask(task._id, { status: nextStatus });
    } catch (err) {
      // Rollback
      fetchTasks();
    }
  };

  // Open Edit Modal
  const handleEditClick = (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  // Open Delete Warning Modal
  const handleDeleteClick = (id) => {
    setTaskIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Delete Action confirmed
  const handleConfirmDelete = async () => {
    if (!taskIdToDelete) return;
    setDeleting(true);
    try {
      await api.tasks.deleteTask(taskIdToDelete);
      setIsDeleteModalOpen(false);
      setTaskIdToDelete(null);
      fetchTasks();
    } catch (err) {
      setError('Failed to delete task. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white font-sans tracking-tight">Task Registry</h2>
          <p className="text-sm text-slate-400">Add, edit, organize, and filter tasks.</p>
        </div>
        <button
          onClick={() => {
            setSelectedTask(null);
            setIsTaskModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white text-sm font-bold shadow-md shadow-brand-500/20 transition-all active:scale-95"
        >
          <Plus size={16} />
          <span>Add Task</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-450 text-sm">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Query Filters Panel */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800/80 flex flex-col md:flex-row gap-4 items-center">
        {/* Search Input */}
        <div className="relative w-full md:flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by task title or description..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800 focus:border-brand-500 focus:outline-none text-slate-100 text-sm placeholder-slate-650"
          />
        </div>

        {/* Dropdown filters container */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 w-full md:w-auto">
          {/* Status Dropdown */}
          <select
            value={status}
            onChange={handleStatusFilterChange}
            className="px-3.5 py-2 rounded-xl bg-slate-900/60 border border-slate-800 focus:border-brand-500 focus:outline-none text-slate-350 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Priority Dropdown */}
          <select
            value={priority}
            onChange={handlePriorityFilterChange}
            className="px-3.5 py-2 rounded-xl bg-slate-900/60 border border-slate-800 focus:border-brand-500 focus:outline-none text-slate-350 text-sm"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-900/60 border border-slate-800 focus:border-brand-500 focus:outline-none text-slate-350 text-sm"
          >
            <option value="dueDate">Due Date</option>
            <option value="recent">Recently Added</option>
          </select>

          {/* Reset Filters button */}
          {(search || status || priority || sortBy !== 'dueDate') && (
            <button
              onClick={handleClearFilters}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1 col-span-2 sm:col-span-1"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Tasks Grid Container */}
      {loading && tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-8 h-8 border-3 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
          <p className="text-slate-500 text-xs mt-3 font-medium">Querying task registry...</p>
        </div>
      ) : tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onStatusToggle={handleStatusToggle}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl border border-dashed border-slate-800/80 glass-card">
          <div className="p-4 rounded-full bg-slate-900/80 border border-slate-800 text-slate-500 mb-4">
            <ClipboardList size={32} />
          </div>
          <h3 className="font-bold text-lg text-slate-200">No Tasks Found</h3>
          <p className="text-sm text-slate-400 text-center max-w-sm mt-1 mb-6">
            There are no tasks that match your search filters. Try clearing filters or create a new task.
          </p>
          <button
            onClick={() => {
              setSelectedTask(null);
              setIsTaskModalOpen(true);
            }}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400 text-sm font-semibold hover:bg-brand-500/20 transition-all"
          >
            <Plus size={16} />
            <span>Create New Task</span>
          </button>
        </div>
      )}

      {/* Task Creation/Editing Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleTaskSubmit}
        task={selectedTask}
      />

      {/* Task Deletion Confirmation Warning Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTaskIdToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message="Are you sure you want to permanently delete this task? This action cannot be undone."
        loading={deleting}
      />
    </div>
  );
}
