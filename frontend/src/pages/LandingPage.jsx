import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Shield, 
  BarChart3, 
  SlidersHorizontal, 
  Zap, 
  ArrowRight,
  Database,
  CheckCircle2
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning-Fast CRUD',
      desc: 'Create, organize, and toggle status on tasks with simple, keyboard-friendly layouts.'
    },
    {
      icon: BarChart3,
      title: 'Premium Analytics',
      desc: 'Track productivity percentages and task splits directly on a glassmorphic dashboard.'
    },
    {
      icon: SlidersHorizontal,
      title: 'Advanced Filter & Sort',
      desc: 'Live query parsing allows sorting by due dates or finding specific high-priority tasks in milliseconds.'
    },
    {
      icon: Shield,
      title: 'JWT-Secured Accounts',
      desc: 'Protect data and restrict access. Only you can view or modify your task lists.'
    },
    {
      icon: Database,
      title: 'Flexible Storage Layer',
      desc: 'Switch seamlessly between MongoDB cloud or zero-config local JSON file storage.'
    },
    {
      icon: Sparkles,
      title: 'Overdue Deadline Alerts',
      desc: 'Dynamic indicators color-code upcoming goals, flagging missed due dates instantly.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-950">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-500/10 blur-[120px] animate-pulse-slow pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse-slow pointer-events-none"></div>

      {/* Navbar */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-white font-bold text-lg shadow-lg shadow-brand-500/20">
            P
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white font-sans">
            PlanIQ
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            to="/login" 
            className="text-slate-400 hover:text-white font-medium text-sm transition-colors px-3 py-1.5 rounded-lg"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition-all px-4 py-2 rounded-xl shadow-lg shadow-brand-500/10"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 pt-16 pb-24 flex flex-col items-center justify-center text-center z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold mb-6">
          <Sparkles size={12} />
          <span>Intelligent Productivity Workspace</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white font-sans max-w-3xl leading-[1.1] mb-6">
          Organize Your Tasks with{' '}
          <span className="bg-gradient-to-r from-brand-400 via-indigo-400 to-brand-600 bg-clip-text text-transparent">
            Absolute Intelligence
          </span>
        </h1>

        <p className="text-base md:text-lg text-slate-400 max-w-2xl leading-relaxed mb-10">
          PlanIQ is a modern, high-standard task management SaaS that consolidates your checklist, priority statuses, and deadline warnings into a premium visual control room.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center w-full sm:w-auto mb-16">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-bold text-base transition-all shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 group"
          >
            Start for Free
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:bg-slate-800/80 text-slate-200 hover:text-white font-bold text-base transition-all flex items-center justify-center"
          >
            Live Demo
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="w-full mt-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-sans mb-12">
            Engineered for High Performance
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div 
                  key={idx} 
                  className="p-6 rounded-2xl glass-card border border-slate-800/80 text-left hover:border-slate-700 transition-all hover:translate-y-[-4px]"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mb-4">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-bold text-lg text-slate-100 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/50 py-8 z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-brand-400 to-brand-600 text-white font-bold text-sm">
              P
            </div>
            <span className="font-bold text-sm tracking-tight text-white font-sans">
              PlanIQ
            </span>
          </div>
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} PlanIQ. Designed by Google DeepMind Anti Gravity Agent. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-slate-500">
            <span className="hover:text-slate-400 cursor-pointer">Privacy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
