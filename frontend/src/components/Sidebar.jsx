import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  CheckSquare, 
  User, 
  LogOut, 
  Sparkles,
  X
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Profile & Account', path: '/profile', icon: User },
  ];

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 glass-card border-r border-slate-800 transition-transform duration-300 lg:translate-x-0 lg:static lg:z-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80">
          <Link to="/dashboard" className="flex items-center gap-2" onClick={onClose}>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-white font-bold text-lg shadow-lg shadow-brand-500/20">
              P
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-300 bg-clip-text text-transparent font-sans">
              PlanIQ
            </span>
          </Link>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  active 
                    ? 'bg-brand-500/10 text-brand-400 border-l-2 border-brand-500 shadow-inner' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon 
                  size={18} 
                  className={`transition-transform duration-300 group-hover:scale-110 ${
                    active ? 'text-brand-400' : 'text-slate-400 group-hover:text-slate-300'
                  }`} 
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer User Info */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/30">
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 font-semibold text-xs text-white">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold text-xs text-slate-200 truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
