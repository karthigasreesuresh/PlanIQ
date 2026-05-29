import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Lock, Mail, User, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const { register, error, clearError, isAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setFormError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password);
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
        {/* Logo Section */}
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
            Join PlanIQ today and take control of your task workflows.
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 rounded-2xl border border-slate-800/80 shadow-2xl">
          <h2 className="text-xl font-bold text-slate-100 text-center tracking-tight mb-6 font-sans">
            Create Free Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error alerts */}
            {(formError || error) && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>{formError || error}</span>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-100 text-sm transition-all placeholder-slate-600"
                  required
                />
              </div>
            </div>

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
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-100 text-sm transition-all placeholder-slate-600"
                  required
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Retype password"
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Sign Up</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-350 hover:underline font-semibold">
            Log In Instead
          </Link>
        </p>
      </div>
    </div>
  );
}
