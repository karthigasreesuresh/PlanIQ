import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, Calendar, LogOut, Bell } from 'lucide-react';

export default function Navbar({ onMenuOpen, title }) {
  const { user, logout } = useAuth();

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 glass-nav border-b border-slate-800/80 sticky top-0 z-30">
      {/* Left: Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuOpen}
          className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 lg:hidden focus:outline-none"
          title="Open Menu"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="font-bold text-xl text-slate-100 tracking-tight font-sans">
            {title}
          </h1>
          <p className="hidden sm:block text-xs text-slate-400 font-medium">
            {getGreeting()}, <span className="text-brand-400">{user?.name}</span>! Ready to organize your goals?
          </p>
        </div>
      </div>

      {/* Right: Date, Notifications, User Badge */}
      <div className="flex items-center gap-4">
        {/* Date Display */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/50 border border-slate-800 text-xs font-semibold text-slate-400">
          <Calendar size={14} className="text-brand-400" />
          <span>{getFormattedDate()}</span>
        </div>

        {/* Notifications Icon (Mock) */}
        <button 
          className="relative p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors"
          title="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
        </button>

        <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

        {/* User Mini Avatar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 text-white font-bold text-sm shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="hidden sm:block text-sm font-semibold text-slate-300">
            {user?.name ? user.name.split(' ')[0] : 'User'}
          </span>
        </div>
      </div>
    </header>
  );
}
