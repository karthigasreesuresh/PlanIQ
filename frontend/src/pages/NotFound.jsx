import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-5">
      <div className="p-4 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-450 animate-bounce">
        <AlertCircle size={40} />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-4xl font-extrabold tracking-tight text-white font-sans">404 - Page Not Found</h2>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
      </div>

      <Link
        to={isAuthenticated ? '/dashboard' : '/'}
        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-sm font-semibold transition-all hover:scale-[1.02]"
      >
        <ArrowLeft size={16} />
        <span>Return to Workspace</span>
      </Link>
    </div>
  );
}
