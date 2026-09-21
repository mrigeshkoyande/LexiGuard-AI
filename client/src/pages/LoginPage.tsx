import React, { useState } from 'react';
import { Sparkles, AlertCircle, ArrowRight, Lock, Mail, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LegalCore } from '../components/3d/LegalCore';

interface LoginPageProps {
  onNavigate: (view: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await demoLogin();
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] grid grid-cols-1 lg:grid-cols-12 bg-lexi-midnight border-y border-lexi-gold/15">
      {/* Left 3D Luxury Editorial Visual Column */}
      <div className="hidden lg:flex lg:col-span-5 relative bg-gradient-to-br from-lexi-navy via-slate-950 to-lexi-midnight p-12 flex-col justify-between overflow-hidden border-r border-lexi-gold/15">
        {/* Subtle background 3D Core */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <LegalCore />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lexi-gold/15 border border-lexi-gold/40 flex items-center justify-center text-lexi-gold font-serif font-bold text-xl shadow-lg">
              §
            </div>
            <div>
              <span className="font-serif font-bold text-white text-lg tracking-wide block">
                LEXIGUARD <span className="text-lexi-gold">AI</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
                Institutional Workspace
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 my-auto py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lexi-gold/10 border border-lexi-gold/30 text-lexi-gold text-xs font-serif italic mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Precise Clause Source Traceability
          </div>
          <h1 className="font-serif text-3xl xl:text-4xl text-white font-bold tracking-tight leading-tight">
            Legal clarity, without the complexity.
          </h1>
          <p className="text-slate-300 text-sm mt-4 leading-relaxed max-w-md">
            Sign in to access zero-retention neural contract review, bidirectional clause audit trails, and board-ready counsel briefs.
          </p>

          <div className="mt-8 space-y-3">
            {[
              '100% Clause-level source verification',
              'Bank-grade AES-256 client-side isolation',
              'Deterministic risk scoring & redline alerts',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-xs text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-lexi-gold shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 pt-6 border-t border-lexi-gold/15 text-[11px] text-slate-400 font-mono flex items-center justify-between">
          <span>LEXIGUARD SYSTEM V2.4</span>
          <span className="text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            SOC-2 Type II Compliant
          </span>
        </div>
      </div>

      {/* Right Form Column */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex lg:hidden items-center gap-2 px-3 py-1 rounded-full bg-lexi-gold/10 border border-lexi-gold/30 text-lexi-gold text-xs font-serif italic mb-4">
              § LexiGuard AI
            </div>
            <h2 className="font-serif text-3xl font-bold text-white tracking-tight">
              Sign In to Your Workspace
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Enter your credentials or launch the instant demo workspace.
            </p>
          </div>

          {/* Demo One-Click Access */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full mb-6 p-4 rounded-xl bg-gradient-to-r from-lexi-navy via-slate-900 to-lexi-navy hover:from-slate-800 hover:to-slate-800 border border-lexi-gold/40 text-lexi-gold hover:text-amber-200 text-xs font-semibold flex items-center justify-center gap-2.5 shadow-xl transition-all group"
          >
            <Sparkles className="w-4 h-4 text-lexi-gold group-hover:scale-110 transition-transform" />
            <span>Launch Instant Demo (Pre-loaded Master Services Agreement)</span>
          </button>

          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-lexi-midnight px-3 text-[11px] text-slate-500 uppercase tracking-widest font-mono">
              Or credentials
            </span>
            <div className="border-t border-slate-800 w-full" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-sans">
                Corporate or Personal Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="counsel@firm.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 focus:border-lexi-gold/70 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300 font-sans">Password</label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to registered email in production.')}
                  className="text-[11px] text-lexi-gold hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 focus:border-lexi-gold/70 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-lexi-gold hover:bg-amber-600 text-lexi-midnight font-bold text-xs uppercase tracking-wider shadow-lg shadow-lexi-gold/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <span>{loading ? 'Verifying Authorization...' : 'Access Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              New to LexiGuard AI?{' '}
              <button
                onClick={() => onNavigate('register')}
                className="text-lexi-gold hover:underline font-semibold ml-1"
              >
                Create an Institutional Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
