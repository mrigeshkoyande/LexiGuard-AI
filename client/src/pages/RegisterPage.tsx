import React, { useState } from 'react';
import { AlertCircle, ArrowRight, Lock, Mail, User, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LegalCore } from '../components/3d/LegalCore';

interface RegisterPageProps {
  onNavigate: (view: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(email, password, name);
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] grid grid-cols-1 lg:grid-cols-12 bg-lexi-midnight border-y border-lexi-gold/15">
      {/* Left 3D Luxury Editorial Visual Column */}
      <div className="hidden lg:flex lg:col-span-5 relative bg-gradient-to-br from-lexi-navy via-slate-950 to-lexi-midnight p-12 flex-col justify-between overflow-hidden border-r border-lexi-gold/15">
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
            Enterprise-Grade Contract Intelligence
          </div>
          <h1 className="font-serif text-3xl xl:text-4xl text-white font-bold tracking-tight leading-tight">
            Understand. Compare. Navigate.
          </h1>
          <p className="text-slate-300 text-sm mt-4 leading-relaxed max-w-md">
            Join corporate legal teams, independent attorneys, and executives reviewing complex contracts with forensic clause traceability.
          </p>

          <div className="mt-8 space-y-3">
            {[
              'Unlimited document clause segmentation',
              'Diff comparison with redline scoring',
              'Attorney preparation & executive briefing generator',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-xs text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-lexi-gold shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 pt-6 border-t border-lexi-gold/15 text-[11px] text-slate-400 font-mono flex items-center justify-between">
          <span>ZERO RETENTION AI POLICY</span>
          <span className="text-lexi-gold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-lexi-gold animate-pulse" />
            Air-Gapped Processing Available
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
              Create Your Account
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Start analyzing contracts with grounded source-linking in seconds.
            </p>
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
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-sans">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Elena Rostova, Esq."
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 focus:border-lexi-gold/70 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-sans">Corporate Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="elena@legal.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 focus:border-lexi-gold/70 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-sans">Secure Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  minLength={6}
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
              <span>{loading ? 'Configuring Security Vault...' : 'Create Account & Start Review'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="text-lexi-gold hover:underline font-semibold ml-1"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
