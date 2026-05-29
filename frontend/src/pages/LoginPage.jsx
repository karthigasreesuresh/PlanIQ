import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login, error, clearError, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Clear errors on page load
    clearError();
    setFormError('');
    
    // Redirect if already logged in
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    clearError();

    // Validations
    if (!email.trim() || !password) {
      setFormError('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      // Handled in Context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-[25%] left-[25%] w-[400px] h-[400px] rounded-full bg-brand-500/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[25%] right-[25%] w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none"></div>

      {/* Main Container */}
      <div className="w-full max-w-md z-10">
        {/* Back Link to Landing */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white font-bold text-lg shadow-lg shadow-brand-500/20">
              P
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white font-sans">
              PlanIQ
            </span>
          </Link>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Welcome back! Access your intelligent workspace.
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 rounded-2xl border border-slate-800/80 shadow-2xl">
          <h2 className="text-xl font-bold text-slate-100 text-center tracking-tight mb-6 font-sans">
            Account Log In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error alerts */}
            {(formError || error) && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>{formError || error}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-100 text-sm transition-all placeholder-slate-600"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-100 text-sm transition-all placeholder-slate-600"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-bold text-sm transition-all shadow-lg shadow-brand-500/25 disabled:opacity-50 flex items-center justify-center gap-1.5 mt-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-400 hover:text-brand-350 hover:underline font-semibold">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}
