import React from 'react';
import {
  Sparkles,
  Search,
  CheckSquare,
  FileText,
  ArrowRight,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LEGAL_DISCLAIMER } from '@lexiguard/shared';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

interface LandingPageProps {
  onNavigate: (view: string, docId?: string) => void;
  onOpenUpload: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenUpload }) => {
  const { user, demoLogin } = useAuth();

  const handleDemoClick = async () => {
    try {
      if (!user) {
        await demoLogin();
      }
      onNavigate('dashboard');
    } catch (err) {
      onNavigate('login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/20 via-blue-600/15 to-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="text-center relative z-10 max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-lg backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Grounded Legal Intelligence • Source-Linked Findings</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Understand your legal documents{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
              before you sign.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            LexiGuard AI transforms dense contracts, NDAs, and employment agreements into plain-English insights, actionable checklists, and grounded answers—with zero hallucination and 100% clause traceability.
          </p>

          {/* Legal Disclaimer Box */}
          <div className="max-w-2xl mx-auto text-left">
            <DisclaimerBanner />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={handleDemoClick}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Pre-Analyzed Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => (user ? onOpenUpload() : onNavigate('register'))}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 text-slate-200 hover:text-white font-semibold text-sm border border-slate-750 flex items-center justify-center gap-2 transition-colors"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Analyze Your Agreement</span>
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 relative z-10">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">100% Clause Traceability</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every finding, risk alert, and monetary summary links directly back to its exact clause in the original agreement. Click any insight to jump straight to the source.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Grounded Q&A ("Ask Lexi")</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ask specific questions about terms, notice periods, or compensation. Lexi only answers from verified document context and safely declines speculative advice.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Interactive Action Brief</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Turn dense legal jargon into an organized checklist: obligations to confirm, deadlines to calendar, financial milestones, and tailored questions for legal counsel.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-850 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-2">
          <p>© {new Date().getFullYear()} LexiGuard AI. Built for transparent, accessible legal document comprehension.</p>
          <p className="text-[11px] text-slate-600 max-w-xl mx-auto">{LEGAL_DISCLAIMER}</p>
        </div>
      </footer>
    </div>
  );
};
