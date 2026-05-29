import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import TaskModal from '../components/TaskModal';
import { 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ListTodo, 
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await api.tasks.getStats();
      setStats(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleCreateTask = async (taskData) => {
    await api.tasks.createTask(taskData);
    await fetchStats(); // Refresh stats
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-semibold">Compiling workspace data...</p>
        </div>
      </div>
    );
  }

  // Calculate SVG progress ring values
  const percentage = stats?.completionPercentage || 0;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Upper Layout: Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white font-sans tracking-tight">Overview Dashboard</h2>
          <p className="text-sm text-slate-400">Real-time health reports on your active task pipelines.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white text-sm font-bold shadow-md shadow-brand-500/20 transition-all active:scale-95"
        >
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-450 text-sm">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Overdue Warning Alert */}
      {stats?.overdueTasks > 0 && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 animate-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-rose-400 flex-shrink-0" size={20} />
            <div>
              <p className="font-semibold text-sm">Action required: Overdue deadlines detected</p>
              <p className="text-xs text-rose-400/80">You have {stats.overdueTasks} task(s) currently past their due dates.</p>
            </div>
          </div>
          <Link to="/tasks?status=Pending" className="text-xs font-bold underline hover:text-white flex items-center gap-1">
            Resolve Now
            <ArrowRight size={12} />
          </Link>
        </div>
      )}

      {/* Stats Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Tasks Card */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Tasks</p>
            <h3 className="text-3xl font-extrabold text-white mt-1 font-sans">{stats?.totalTasks}</h3>
            <p className="text-[10px] text-slate-500 mt-1">Stored in active registry</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-350">
            <ListTodo size={22} />
          </div>
        </div>

        {/* Completed Tasks Card */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed</p>
            <h3 className="text-3xl font-extrabold text-emerald-400 mt-1 font-sans">{stats?.completedTasks}</h3>
            <p className="text-[10px] text-emerald-500/80 mt-1">Done & archived</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 size={22} />
          </div>
        </div>

        {/* In Progress Tasks Card */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">In Progress</p>
            <h3 className="text-3xl font-extrabold text-amber-400 mt-1 font-sans">{stats?.inProgressTasks}</h3>
            <p className="text-[10px] text-amber-500/85 mt-1">Currently working on</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock size={22} />
          </div>
        </div>

        {/* High Priority Tasks Card */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">High Priority</p>
            <h3 className="text-3xl font-extrabold text-rose-450 mt-1 font-sans">{stats?.highPriorityTasks}</h3>
            <p className="text-[10px] text-rose-500 mt-1">Requires immediate care</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertTriangle size={22} />
          </div>
        </div>
      </div>

      {/* Middle Layout: Productivity Chart & Status Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Productivity Ring (SVG Chart) */}
        <div className="p-6 rounded-2xl glass-card border border-slate-800/80 flex flex-col items-center justify-center text-center">
          <div className="w-full text-left mb-4">
            <h4 className="font-bold text-slate-200 text-sm">Productivity Progress</h4>
            <p className="text-xs text-slate-500">Ratio of completed tasks over total assigned.</p>
          </div>

          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* SVG Ring */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="88"
                cy="88"
                r={radius}
                className="text-slate-800"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="88"
                cy="88"
                r={radius}
                className="text-brand-500 transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="url(#progress-gradient)"
                fill="transparent"
              />
              <defs>
                <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#85a4ff" />
                  <stop offset="100%" stopColor="#3352eb" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Percentage */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-white tracking-tight">{percentage}%</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Completed</span>
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-850">
            <div className="text-center">
              <p className="text-xs text-slate-500">Status Check</p>
              <p className="text-base font-bold text-emerald-400 mt-0.5">{stats?.completedTasks} / {stats?.totalTasks}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500">Remaining</p>
              <p className="text-base font-bold text-slate-350 mt-0.5">{(stats?.totalTasks || 0) - (stats?.completedTasks || 0)} Tasks</p>
            </div>
          </div>
        </div>

        {/* Recent Tasks List */}
        <div className="p-6 rounded-2xl glass-card border border-slate-800/80 lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-slate-200 text-sm">Recent Task Actions</h4>
              <p className="text-xs text-slate-500">Latest task additions and modifications.</p>
            </div>
            <Link to="/tasks" className="text-xs text-brand-400 hover:text-brand-350 font-bold flex items-center gap-1 group">
              <span>View All Tasks</span>
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Recent list container */}
          <div className="flex-1 space-y-3">
            {stats?.recentTasks && stats.recentTasks.length > 0 ? (
              stats.recentTasks.map((task) => (
                <div 
                  key={task._id} 
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/40 border border-slate-900 hover:border-slate-850 hover:bg-slate-900/70 transition-all"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {/* Status Dot */}
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      task.status === 'Completed' 
                        ? 'bg-emerald-500' 
                        : task.status === 'In Progress' 
                          ? 'bg-amber-500' 
                          : 'bg-slate-500'
                    }`}></span>
                    <div className="overflow-hidden">
                      <p className={`font-semibold text-sm text-slate-200 truncate ${
                        task.status === 'Completed' ? 'line-through text-slate-500' : ''
                      }`}>{task.title}</p>
                      <p className="text-[10px] text-slate-500">
                        Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  
                  {/* Priority Badge */}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    task.priority === 'High' 
                      ? 'bg-rose-500/10 text-rose-400' 
                      : task.priority === 'Medium' 
                        ? 'bg-amber-500/10 text-amber-400' 
                        : 'bg-emerald-500/10 text-emerald-450'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                <p className="text-sm text-slate-500 italic">No tasks created yet.</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="text-xs text-brand-400 font-bold hover:underline mt-1"
                >
                  Create your first task now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
}
