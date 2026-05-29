import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { 
  User, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  LogOut, 
  Activity, 
  CheckCircle,
  Database,
  Lock
} from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const data = await api.tasks.getStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load profile metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserStats();
  }, []);

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  const getJoinedDate = () => {
    if (!user?.createdAt) return 'Recent';
    return new Date(user.createdAt).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-white font-sans tracking-tight">Account Profile</h2>
        <p className="text-sm text-slate-400">Manage security settings and view profile overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: User Profile Card */}
        <div className="p-6 rounded-2xl glass-card border border-slate-800/80 flex flex-col items-center text-center space-y-4 md:col-span-1">
          {/* Avatar Ring */}
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-650 p-1 shadow-lg shadow-brand-500/10">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-bold text-3xl text-white">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="absolute bottom-0 right-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-slate-950 flex items-center justify-center" title="Online Status"></span>
          </div>

          <div>
            <h3 className="font-bold text-lg text-white">{user?.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Right Column: Account Meta & Details */}
        <div className="space-y-6 md:col-span-2">
          {/* Account Details Widget */}
          <div className="p-6 rounded-2xl glass-card border border-slate-800/80 space-y-4">
            <h4 className="font-bold text-slate-200 text-sm pb-2 border-b border-slate-850">Personal Details</h4>
            
            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-2">
                  <User size={15} />
                  Display Name
                </span>
                <span className="font-medium text-slate-200">{user?.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-2">
                  <Mail size={15} />
                  Email Address
                </span>
                <span className="font-medium text-slate-200">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-2">
                  <Calendar size={15} />
                  Joined Date
                </span>
                <span className="font-medium text-slate-200">{getJoinedDate()}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Snapshot */}
          <div className="p-6 rounded-2xl glass-card border border-slate-800/80 space-y-4">
            <h4 className="font-bold text-slate-200 text-sm pb-2 border-b border-slate-850">Workspace Metrics</h4>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-900">
                <p className="text-xs text-slate-500">Tasks Saved</p>
                <p className="text-xl font-extrabold text-white mt-1">
                  {loading ? '...' : stats?.totalTasks || 0}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-900">
                <p className="text-xs text-slate-500">Completed</p>
                <p className="text-xl font-extrabold text-emerald-450 mt-1">
                  {loading ? '...' : stats?.completedTasks || 0}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-900">
                <p className="text-xs text-slate-500">Completion %</p>
                <p className="text-xl font-extrabold text-brand-400 mt-1">
                  {loading ? '...' : `${stats?.completionPercentage || 0}%`}
                </p>
              </div>
            </div>
          </div>

          {/* Security & System Info */}
          <div className="p-6 rounded-2xl glass-card border border-slate-800/80 space-y-4">
            <h4 className="font-bold text-slate-200 text-sm pb-2 border-b border-slate-850 flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-brand-400" />
              Security Specifications
            </h4>
            
            <div className="space-y-3.5 text-xs text-slate-400 leading-relaxed">
              <div className="flex gap-3">
                <Lock size={16} className="text-brand-400 mt-0.5 flex-shrink-0" />
                <p>
                  <strong className="text-slate-200">Password Hashing:</strong> Passwords are encrypted one-way using bcryptjs salt encryption keys in the database.
                </p>
              </div>
              <div className="flex gap-3">
                <Activity size={16} className="text-brand-400 mt-0.5 flex-shrink-0" />
                <p>
                  <strong className="text-slate-200">Session Handshake:</strong> Protected routes authenticate user requests via JWT Bearer headers, expiring in 7 days.
                </p>
              </div>
              <div className="flex gap-3">
                <Database size={16} className="text-brand-400 mt-0.5 flex-shrink-0" />
                <p>
                  <strong className="text-slate-200">Active Storage:</strong> Operating on {stats?.database || (api.tasks ? 'Dual-Database Adapter Mode' : '...')}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
