import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Lock,
  CheckCircle2,
  FileText,
  Search,
  CheckSquare,
  Scale,
  ExternalLink,
  Zap
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Disclaimer Top Notification */}
      <div className="bg-slate-900/90 border-b border-slate-800 py-2 px-4 text-center text-xs text-slate-400">
        <DisclaimerBanner />
      </div>

      {/* 1. Cinematic Hero Section */}
      <section className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-amber-500/15 via-indigo-600/10 to-cyan-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column Content */}
          <div className="lg:col-span-6 flex flex-col items-start gap-6">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 inline-flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Legal Assistance
            </span>

            <h1 className="font-headline text-5xl sm:text-7xl font-light text-white tracking-tight leading-tight whitespace-pre-line">
              Understand.
              <span className="italic font-serif text-amber-300"> Compare.</span>
              {"\n"}Navigate.
            </h1>

            <p className="font-headline text-xl sm:text-2xl text-slate-300 max-w-xl font-light">
              Your <span className="text-amber-300 underline decoration-amber-400/40 underline-offset-8">legal</span> documents shouldn't require a law degree to understand.
            </p>

            <p className="text-base text-slate-400 max-w-lg leading-relaxed">
              LexiGuard AI transforms complex legal documents into clear explanations, traceable insights, grounded answers, and actionable next steps.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => (user ? onOpenUpload() : onNavigate('register'))}
                className="bg-amber-400 text-slate-950 hover:bg-amber-300 px-8 py-4 rounded-xl font-semibold text-xs uppercase tracking-widest transition-all shadow-xl shadow-amber-400/10 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Analyze a Document</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleDemoClick}
                className="border border-amber-400/30 text-slate-200 hover:text-white px-8 py-4 rounded-xl font-semibold text-xs uppercase tracking-widest hover:bg-slate-900/60 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Explore Pre-Analyzed Demo</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Preview Composition */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <div className="w-full max-w-[540px] bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 flex flex-col justify-between shadow-2xl overflow-hidden relative">
              {/* Background Glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

              {/* Header of simulated doc viewer */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                  <span className="text-xs font-mono text-slate-400 ml-2">Master_Services_Agreement_v4.2.pdf</span>
                </div>
                <span className="text-[10px] font-bold uppercase bg-amber-400/10 text-amber-300 px-2 py-0.5 rounded border border-amber-400/20">
                  Source Verified
                </span>
              </div>

              {/* Document Body Simulation */}
              <div className="space-y-4 my-6 relative">
                <div className="h-3.5 bg-slate-800/60 rounded w-3/4" />
                <div className="h-3.5 bg-slate-800/40 rounded w-full" />
                <div className="p-3.5 bg-amber-400/10 border-l-2 border-amber-400 rounded-r text-xs text-slate-200 relative space-y-1">
                  <span className="absolute -top-3 right-2 text-[10px] font-bold text-amber-300 bg-slate-900 px-1.5 py-0.5 rounded border border-amber-400/30 uppercase tracking-wide">
                    IMPORTANT TERM
                  </span>
                  <p className="font-serif italic text-slate-100">
                    "The Provider shall maintain liability insurance of not less than $10,000,000 per occurrence, effective immediately upon execution..."
                  </p>
                </div>
                <div className="h-3.5 bg-slate-800/40 rounded w-5/6" />
              </div>

              {/* Floating AI Card Overlay */}
              <div className="bg-slate-850/95 backdrop-blur-md p-4 rounded-xl border border-amber-400/30 shadow-2xl flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                    <Zap className="w-3.5 h-3.5" /> ASK LEXI SUMMARY
                  </span>
                  <span className="text-[11px] text-slate-400">Page 14, Clause 8.2</span>
                </div>
                <p className="text-xs text-slate-300">
                  Financial exposure is capped at annual contract value. Indemnification applies strictly to IP infringement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Product Capabilities Bar */}
      <section className="bg-slate-900/60 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">Capabilities</span>
            <h2 className="font-headline text-3xl sm:text-4xl text-white mt-2">Legal clarity, without the complexity.</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Cap 1 */}
            <div className="bg-slate-950/80 p-6 rounded-xl border border-slate-800 hover:border-amber-400/40 transition-all group flex flex-col justify-between">
              <div className="flex justify-between items-start mb-8">
                <span className="font-headline text-2xl text-amber-400">01</span>
                <FileText className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">SIMPLIFY</h3>
                <p className="text-xs text-slate-400">Distill dense legalese into plain, crystal-clear English instantly.</p>
              </div>
            </div>

            {/* Cap 2 */}
            <div className="bg-slate-950/80 p-6 rounded-xl border border-slate-800 hover:border-amber-400/40 transition-all group flex flex-col justify-between">
              <div className="flex justify-between items-start mb-8">
                <span className="font-headline text-2xl text-amber-400">02</span>
                <Shield className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">UNDERSTAND</h3>
                <p className="text-xs text-slate-400">Uncover hidden obligations, liabilities, and unusual termination clauses.</p>
              </div>
            </div>

            {/* Cap 3 */}
            <div className="bg-slate-950/80 p-6 rounded-xl border border-slate-800 hover:border-amber-400/40 transition-all group flex flex-col justify-between">
              <div className="flex justify-between items-start mb-8">
                <span className="font-headline text-2xl text-amber-400">03</span>
                <Scale className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">COMPARE</h3>
                <p className="text-xs text-slate-400">Side-by-side version diffing highlights every altered condition and risk.</p>
              </div>
            </div>

            {/* Cap 4 */}
            <div className="bg-slate-950/80 p-6 rounded-xl border border-slate-800 hover:border-amber-400/40 transition-all group flex flex-col justify-between">
              <div className="flex justify-between items-start mb-8">
                <span className="font-headline text-2xl text-amber-400">04</span>
                <Search className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">ASK</h3>
                <p className="text-xs text-slate-400">Interrogate your contracts with conversational queries and direct answers.</p>
              </div>
            </div>

            {/* Cap 5 */}
            <div className="bg-slate-950/80 p-6 rounded-xl border border-slate-800 hover:border-amber-400/40 transition-all group flex flex-col justify-between">
              <div className="flex justify-between items-start mb-8">
                <span className="font-headline text-2xl text-amber-400">05</span>
                <CheckSquare className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">ACT</h3>
                <p className="text-xs text-slate-400">Execute deadlines and review items with a structured action brief.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Traceability Centerpiece (Cream / Warm Editorial Accent Section) */}
      <section className="bg-[#F7F3EC] text-[#121414] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold text-[#A67A53] uppercase tracking-widest">Traceability Engine</span>
            <h2 className="font-headline text-4xl sm:text-5xl text-[#121414] mt-2 font-normal">Every answer has an origin.</h2>
            <p className="font-headline text-lg text-[#121414]/70 mt-3 font-light">
              LexiGuard connects every AI insight to the exact clause and page it came from, eliminating hallucinations and ensuring complete auditability.
            </p>
          </div>

          {/* Split View Traceability Mock */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-[#A67A53]/20">
            {/* Left: Source Document Snippet */}
            <div className="lg:col-span-6 bg-[#F9F9F9] p-6 rounded-xl border border-gray-200 relative space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 text-xs font-mono text-gray-500">
                <span>DOCUMENT_SOURCE.PDF</span>
                <span className="text-[#A67A53] font-bold">PAGE 12 / CLAUSE 4.1</span>
              </div>
              <div className="space-y-3 font-mono text-xs text-gray-700 leading-relaxed">
                <p className="text-gray-400">4.0 Term and Termination.</p>
                <div className="bg-[#A67A53]/15 p-3.5 rounded border-l-4 border-[#A67A53] text-gray-900 font-semibold">
                  4.1 The initial term shall commence on the Effective Date and shall continue for a period of thirty-six (36) months. Thereafter, this Agreement shall automatically renew for successive twelve (12) month periods unless either party provides written notice of non-renewal at least ninety (90) days prior to the expiration of the then-current term.
                </div>
                <p className="text-gray-400">4.2 Termination for Cause. Either party may terminate...</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#A67A53] font-medium pt-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Source cryptographic hash verified & securely indexed</span>
              </div>
            </div>

            {/* Right: AI Insight Card */}
            <div className="lg:col-span-6 bg-[#011826] text-white p-6 rounded-xl border border-[#A67A53]/30 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Zap className="w-4 h-4" /> LEXIGUARD INSIGHT
                  </span>
                  <span className="text-xs bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                    90-Day Notice Window
                  </span>
                </div>
                <div className="my-6 space-y-3">
                  <h3 className="font-headline text-2xl text-white">Automatic Renewal Risk Identified</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    This agreement auto-renews for 12 months unless notice is given 90 days before expiration. The next critical action window opens on <strong className="text-amber-300">October 14, 2026</strong>.
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                <span>Confidence Score: 99.8%</span>
                <span className="text-amber-300 font-medium flex items-center gap-1">
                  Jump to source snippet <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Conversational Q&A Showcase ("Ask the Document") */}
      <section className="bg-slate-900 py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">Conversational AI</span>
            <h2 className="font-headline text-4xl text-white mt-2">Ask the document.</h2>
            <p className="text-sm text-slate-400 mt-2">Query your agreement in plain language and receive precise, source-backed answers instantly.</p>
          </div>

          <div className="max-w-4xl mx-auto bg-slate-950 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Question */}
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-slate-300" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">You</span>
                <p className="text-base text-white font-medium mt-1">What are the exact conditions under which we can terminate without penalty?</p>
              </div>
            </div>

            {/* Answer */}
            <div className="flex items-start gap-4 bg-slate-900/90 p-6 rounded-xl border border-amber-400/30">
              <div className="w-9 h-9 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 font-bold">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <div className="space-y-4 w-full">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-amber-400">LexiGuard AI Assistant</span>
                  <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded">Source: Page 14, Section 8.4</span>
                </div>
                <p className="text-sm text-slate-200">
                  You may terminate the agreement without penalty under two specific conditions:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-xs text-slate-300">
                  <li><strong>Material Breach:</strong> If the provider fails to remedy a documented breach within 30 days of written notice.</li>
                  <li><strong>Force Majeure:</strong> If an unforeseen event suspends services for longer than 45 consecutive days.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Enterprise Trust & Principles (Cream Section) */}
      <section className="bg-[#F7F3EC] text-[#121414] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold text-[#A67A53] uppercase tracking-widest">Enterprise Trust</span>
            <h2 className="font-headline text-4xl text-[#121414] mt-2 whitespace-pre-line font-normal">
              Built around clarity.{"\n"}Designed around control.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#A67A53]/20 flex flex-col justify-between space-y-4">
              <div className="w-12 h-12 bg-[#F7F3EC] rounded-xl flex items-center justify-center text-[#A67A53]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-headline text-2xl text-[#121414]">TRACEABLE</h3>
              <p className="text-xs text-gray-700 leading-relaxed">
                Every insight, claim, and summary links directly to its source paragraph and page number. Zero hallucinations, complete verification.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#A67A53]/20 flex flex-col justify-between space-y-4">
              <div className="w-12 h-12 bg-[#F7F3EC] rounded-xl flex items-center justify-center text-[#A67A53]">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-headline text-2xl text-[#121414]">PRIVATE</h3>
              <p className="text-xs text-gray-700 leading-relaxed">
                Bank-grade encryption in transit and at rest. Your sensitive legal documents are stored securely and never public.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#A67A53]/20 flex flex-col justify-between space-y-4">
              <div className="w-12 h-12 bg-[#F7F3EC] rounded-xl flex items-center justify-center text-[#A67A53]">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-headline text-2xl text-[#121414]">RESPONSIBLE</h3>
              <p className="text-xs text-gray-700 leading-relaxed">
                Designed to empower users with robust guardrails, legal advice safety hedging, and explicit informational disclaimers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Cinematic Final CTA */}
      <section className="bg-slate-950 py-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden border-t border-slate-850">
        <div className="max-w-4xl mx-auto relative z-10 space-y-8">
          <h2 className="font-headline text-5xl sm:text-6xl text-white whitespace-pre-line font-light">
            Legal documents.{"\n"}
            <span className="italic font-serif text-amber-300">Finally understandable.</span>
          </h2>
          <p className="text-base text-slate-400 max-w-xl mx-auto">
            Transform how you review, compare, and navigate agreements before you sign.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => (user ? onOpenUpload() : onNavigate('register'))}
              className="bg-amber-400 text-slate-950 hover:bg-amber-300 px-8 py-4 rounded-xl font-semibold text-xs uppercase tracking-widest transition-all shadow-xl shadow-amber-400/10 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Upload Your Agreement</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleDemoClick}
              className="border border-amber-400/30 text-slate-200 hover:text-white px-8 py-4 rounded-xl font-semibold text-xs uppercase tracking-widest hover:bg-slate-900 transition-all"
            >
              Explore Interactive Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-3">
          <p>© {new Date().getFullYear()} LexiGuard AI. All rights reserved.</p>
          <p className="text-[11px] text-slate-600 max-w-2xl mx-auto">{LEGAL_DISCLAIMER}</p>
        </div>
      </footer>
    </div>
  );
};
