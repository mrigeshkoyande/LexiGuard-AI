import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Shield,
  CheckCircle2,
  FileText,
  Search,
  CheckSquare,
  Scale,
  ExternalLink,
  Zap,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { LegalCore } from '../components/3d/LegalCore';

interface LandingPageProps {
  onNavigate: (view: string, docId?: string) => void;
  onOpenUpload: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenUpload }) => {
  const { user, demoLogin } = useAuth();
  const [activeTab, setActiveTab] = useState<'msa' | 'dpa' | 'term-sheet'>('msa');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const handleDemoClick = async () => {
    try {
      if (!user) {
        await demoLogin();
      }
      onNavigate('dashboard');
    } catch {
      onNavigate('login');
    }
  };

  const sampleContracts = {
    msa: {
      name: 'Master_Services_Agreement_v4.2.pdf',
      clause: '4.1 Initial Term & Auto-Renewal Notice Window',
      text: 'The initial term shall commence on the Effective Date and shall continue for 36 months. Thereafter, this Agreement shall automatically renew for successive 12-month periods unless either party provides written notice of non-renewal at least ninety (90) days prior to the expiration of the then-current term.',
      page: 'Page 12, Section 4.1',
      finding: 'Auto-Renewal Risk: Strict 90-day written notice cutoff required before October 14 to avoid automatic $180,000 annual commitment.',
      severity: 'Critical Action Required',
      confidence: '99.8%'
    },
    dpa: {
      name: 'Global_Data_Processing_Addendum_2026.pdf',
      clause: '7.3 Sub-processor Authorization & 30-Day Objection',
      text: 'Data Importer shall provide at least thirty (30) days prior written notice before engaging any new Sub-processor. If Controller reasonably objects on data protection grounds within fourteen (14) days, Importer shall not transfer data to such Sub-processor.',
      page: 'Page 6, Section 7.3',
      finding: 'Sub-processor Veto Right: 14-day objection window requires monitoring of vendor notifications to preserve GDPR compliance.',
      severity: 'Medium Severity',
      confidence: '99.4%'
    },
    'term-sheet': {
      name: 'Series_A_Preferred_Investment_Terms.pdf',
      clause: '9.2 Non-Participating 1X Liquidation Preference',
      text: 'In the event of any Liquidation Event, the holders of Series A Preferred Stock shall be entitled to receive prior to and in preference to Common Stock an amount per share equal to 1.0X the Original Purchase Price plus declared but unpaid dividends.',
      page: 'Page 3, Section 9.2',
      finding: 'Clean 1X Non-Participating Structure: Favorable founder terms with standard downside protection for lead institutional investors.',
      severity: 'Standard Market Term',
      confidence: '99.9%'
    }
  };

  const activeDoc = sampleContracts[activeTab];

  const faqs = [
    {
      q: 'What is 100% Clause-Level Source Traceability?',
      a: 'Unlike generic AI chatbots that provide ungrounded summaries, LexiGuard AI anchors every finding, risk flag, and comparison redline to the exact clause character range, section, and original page number. Clicking "Jump to Source" scrolls the document viewer and highlights the exact clause in pulsing gold.'
    },
    {
      q: 'Are our confidential contracts used to train public AI models?',
      a: 'Never. LexiGuard operates under a strict Zero-Retention confidentiality standard. All inferences are executed via isolated, stateless memory pipelines with AES-256 vault encryption. Your documents are never logged or used for model training.'
    },
    {
      q: 'Can LexiGuard compare two versions of a contract and generate redlines?',
      a: 'Yes. The Compare Engine computes structured side-by-side diffs, isolating Added, Removed, and Modified provisions while categorizing each alteration by risk severity (High, Medium, Neutral).'
    },
    {
      q: 'How does the Lawyer Prep feature assist outside counsel consultations?',
      a: 'Lawyer Prep automatically synthesizes identified ambiguities, uncapped liabilities, and non-standard covenants into a printable executive dossier featuring pointed questions with exact clause citations to minimize billable attorney hours.'
    },
    {
      q: 'What document formats are supported?',
      a: 'LexiGuard supports high-resolution PDFs, Microsoft Word (.docx), Plain Text (.txt), and Markdown (.md), handling tables, multi-column layouts, and numbered clause hierarchies.'
    }
  ];

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-brand-gold/30 selection:text-brand-gold-dark dark:selection:text-amber-200 font-sans transition-colors duration-200">
      {/* 1. Cinematic Hero Section */}
      <section className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle 3D LegalCore Background Element */}
        <div className="absolute -top-12 -right-12 w-[600px] h-[600px] opacity-25 dark:opacity-30 pointer-events-none hidden lg:block">
          <LegalCore />
        </div>

        {/* Ambient background glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-brand-gold/15 via-brand-navy/10 to-amber-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Hero Column */}
          <div className="lg:col-span-6 flex flex-col items-start gap-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-serif italic shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Grounded AI Legal Intelligence & Workspace</span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl xl:text-7xl font-bold text-slate-950 dark:text-white tracking-tight leading-[1.08]">
              Understand.
              <span className="italic font-serif text-brand-gold block sm:inline"> Compare. </span>
              Navigate.
            </h1>

            <p className="font-serif text-xl sm:text-2xl text-slate-700 dark:text-brand-sand/90 max-w-xl font-normal leading-snug">
              Your <span className="text-brand-gold underline decoration-brand-gold/40 underline-offset-8 font-medium">legal agreements</span> shouldn’t require a law degree or hours of billable time to decipher.
            </p>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
              LexiGuard AI transforms complex legal contracts into clear explanations, traceable insights, grounded answers, and board-ready counsel briefs with 100% clause source verification.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                onClick={() => (user ? onOpenUpload() : onNavigate('register'))}
                variant="primary-gold"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Analyze Your Agreement
              </Button>

              <Button
                onClick={handleDemoClick}
                variant="outline-gold"
                size="lg"
                icon={<Sparkles className="w-4 h-4 text-brand-gold" />}
              >
                Explore Interactive Demo
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Clause Traceability
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-gold" /> Zero-Retention Policy
              </span>
            </div>
          </div>

          {/* Right Hero Column: Interactive Live Contract Intelligence Showcase */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <div className="w-full max-w-[560px] bg-white dark:bg-brand-midnight-card rounded-2xl border border-slate-200 dark:border-brand-gold/30 p-6 flex flex-col justify-between shadow-2xl overflow-hidden relative backdrop-blur-xl">
              {/* Interactive Document Selector Tabs */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-brand-gold/20 pb-4">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {(['msa', 'dpa', 'term-sheet'] as const).map((key) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        activeTab === key
                          ? 'bg-brand-gold text-white dark:text-brand-midnight shadow-sm'
                          : 'text-slate-600 dark:text-brand-sand/70 hover:bg-slate-100 dark:hover:bg-brand-navy/60'
                      }`}
                    >
                      {key === 'msa' ? 'MSA Agreement' : key === 'dpa' ? 'GDPR DPA' : 'Term Sheet'}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] font-bold uppercase bg-brand-gold/15 text-brand-gold px-2 py-0.5 rounded border border-brand-gold/30 font-mono">
                  Verified Ground Truth
                </span>
              </div>

              {/* Simulated Contract Body with Pulsing Gold Highlight */}
              <div className="space-y-3.5 my-5 relative">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-brand-sand/70">
                  <span>{activeDoc.name}</span>
                  <span className="text-brand-gold font-bold">{activeDoc.page}</span>
                </div>

                <div className="p-4 rounded-xl bg-brand-gold/10 dark:bg-brand-gold/15 border-2 border-brand-gold/60 text-xs text-slate-900 dark:text-brand-warmwhite relative space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-brand-gold-dark dark:text-brand-gold-light tracking-wider font-mono">
                      § {activeDoc.clause}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {activeDoc.confidence} Confidence
                    </span>
                  </div>
                  <p className="font-serif italic text-slate-800 dark:text-slate-100 leading-relaxed text-xs sm:text-sm">
                    &quot;{activeDoc.text}&quot;
                  </p>
                </div>
              </div>

              {/* Connected AI Finding Card Overlay */}
              <div className="bg-slate-50 dark:bg-brand-midnight p-4 rounded-xl border border-brand-gold/30 shadow-xl flex flex-col gap-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-gold flex items-center gap-1.5 uppercase tracking-wider font-mono">
                    <Zap className="w-3.5 h-3.5" /> AI FINDING & ACTION
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
                    {activeDoc.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-brand-sand/90 leading-relaxed font-sans">
                  {activeDoc.finding}
                </p>
                <div className="pt-2 border-t border-slate-200 dark:border-brand-gold/15 flex items-center justify-between text-[11px] text-slate-500 dark:text-brand-sand/60">
                  <span>DOM Highlight: Active</span>
                  <button
                    onClick={handleDemoClick}
                    className="text-brand-gold hover:underline font-semibold flex items-center gap-1"
                  >
                    Open in Full Workspace <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Institutional Metrics Ribbon */}
      <section className="bg-white/80 dark:bg-brand-navy-dark/90 py-10 px-4 sm:px-6 lg:px-8 border-y border-slate-200 dark:border-brand-gold/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-brand-gold">100%</div>
            <div className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Source Traceability</div>
            <p className="text-[11px] text-slate-500 dark:text-brand-sand/60">Every finding linked to exact clause IDs</p>
          </div>

          <div className="space-y-1">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-brand-gold">0-Retention</div>
            <div className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">AI Confidentiality</div>
            <p className="text-[11px] text-slate-500 dark:text-brand-sand/60">Never used for training foundational models</p>
          </div>

          <div className="space-y-1">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-brand-gold">&lt; 10 Sec</div>
            <div className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Contract Ingestion</div>
            <p className="text-[11px] text-slate-500 dark:text-brand-sand/60">Automated segmentation & risk heatmaps</p>
          </div>

          <div className="space-y-1">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-brand-gold">SOC-2 Type II</div>
            <div className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Security Certified</div>
            <p className="text-[11px] text-slate-500 dark:text-brand-sand/60">AES-256 vault encryption at rest & transit</p>
          </div>
        </div>
      </section>

      {/* 3. Product Capabilities Matrix (01 to 05) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-brand-gold uppercase tracking-widest font-mono">Core Capabilities</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-950 dark:text-white mt-2">
            Legal clarity, without the complexity.
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
            A comprehensive suite of intelligence tools designed specifically for institutional review velocity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              num: '01',
              title: 'SIMPLIFY',
              desc: 'Distill dense legalese into plain, crystal-clear executive English instantly.',
              icon: FileText
            },
            {
              num: '02',
              title: 'UNDERSTAND',
              desc: 'Uncover hidden obligations, uncapped liabilities, and non-standard indemnities.',
              icon: Shield
            },
            {
              num: '03',
              title: 'COMPARE',
              desc: 'Side-by-side contract diffing highlights every altered clause with severity ratings.',
              icon: Scale
            },
            {
              num: '04',
              title: 'ASK',
              desc: 'Interrogate your contracts conversationally with direct, source-backed answers.',
              icon: Search
            },
            {
              num: '05',
              title: 'ACT',
              desc: 'Execute notice windows, auto-renewals, and counsel preparation briefs in 1 click.',
              icon: CheckSquare
            }
          ].map((cap, i) => {
            const Icon = cap.icon;
            return (
              <div
                key={i}
                className="bg-white dark:bg-brand-midnight-card p-6 rounded-2xl border border-slate-200 dark:border-brand-gold/20 hover:border-brand-gold/60 transition-all hover:shadow-xl group flex flex-col justify-between"
              >
                <div className="flex justify-between items-start mb-8">
                  <span className="font-serif text-3xl font-bold text-brand-gold">{cap.num}</span>
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-brand-midnight text-slate-500 dark:text-brand-sand group-hover:text-brand-gold transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                    {cap.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-brand-sand/80 leading-relaxed">
                    {cap.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Traceability Centerpiece (Editorial Alternating Section) */}
      <section className="bg-slate-100 dark:bg-brand-navy py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-200 dark:border-brand-gold/20">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold text-brand-gold uppercase tracking-widest font-mono">Traceability Engine</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-slate-950 dark:text-white mt-2">
              Every answer has an origin.
            </h2>
            <p className="text-base text-slate-600 dark:text-brand-sand/80 mt-3 font-serif italic">
              LexiGuard links every AI summary point, risk severity flag, and question answer to the exact clause character span and original page number.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-brand-midnight-card p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-brand-gold/30">
            {/* Left: Source Document Snippet */}
            <div className="lg:col-span-6 bg-slate-50 dark:bg-brand-midnight p-6 rounded-2xl border border-slate-200 dark:border-brand-gold/20 relative space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-brand-gold/15 text-xs font-mono text-slate-500 dark:text-brand-sand/70">
                <span>MASTER_SERVICES_AGREEMENT.PDF</span>
                <span className="text-brand-gold font-bold">PAGE 12 / CLAUSE 4.1</span>
              </div>
              <div className="space-y-3 font-mono text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <p className="text-slate-400">4.0 Term and Termination.</p>
                <div className="bg-brand-gold/15 p-4 rounded-xl border-l-4 border-brand-gold text-slate-900 dark:text-white font-serif italic text-xs sm:text-sm">
                  4.1 The initial term shall commence on the Effective Date and shall continue for 36 months. Thereafter, this Agreement shall automatically renew for successive 12-month periods unless either party provides written notice of non-renewal at least ninety (90) days prior to expiration.
                </div>
                <p className="text-slate-400">4.2 Termination for Cause. Either party may terminate immediately...</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-mono pt-1">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Source character offset verified [3280 : 3614]</span>
              </div>
            </div>

            {/* Right: AI Insight Card */}
            <div className="lg:col-span-6 bg-slate-50 dark:bg-brand-midnight text-slate-900 dark:text-white p-6 rounded-2xl border border-brand-gold/30 relative flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-brand-gold/15">
                  <span className="text-xs font-bold text-brand-gold flex items-center gap-1.5 uppercase tracking-wider font-mono">
                    <Zap className="w-4 h-4" /> LEXIGUARD INSIGHT
                  </span>
                  <span className="text-xs bg-amber-500/15 text-amber-600 dark:text-amber-300 px-3 py-1 rounded-full border border-amber-500/30 font-mono font-bold">
                    90-Day Notice Cutoff
                  </span>
                </div>
                <div className="my-6 space-y-3">
                  <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
                    Automatic Renewal Commitment Flagged
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-brand-sand/90 leading-relaxed">
                    This agreement will automatically extend for 12 months unless formal written non-renewal notice is delivered 90 days before expiration. The critical action window opens on <strong className="text-brand-gold">October 14, 2026</strong>.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-brand-gold/15 flex justify-between items-center text-xs text-slate-500 dark:text-brand-sand/70 font-mono">
                <span>Confidence: 99.8%</span>
                <button
                  onClick={handleDemoClick}
                  className="text-brand-gold hover:underline font-bold flex items-center gap-1"
                >
                  Interactive Workspace Demo <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Interactive Contract Version Diffing Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-brand-gold uppercase tracking-widest font-mono">Compare Engine</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-950 dark:text-white mt-2">
            Forensic Contract Redline Diffing
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
            Compare vendor drafts or previous version iterations in side-by-side split view with automated severity scoring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-brand-midnight-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-brand-gold/30 shadow-xl">
          {/* Version A */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-brand-midnight border border-slate-200 dark:border-brand-gold/20 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-slate-700 dark:text-slate-300">Draft v1.0 (Our Standard Playbook)</span>
              <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">Baseline</span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-serif leading-relaxed text-slate-700 dark:text-slate-300">
              &quot;Total cumulative liability under this Agreement shall in no event exceed the total fees actually paid by Client in the preceding twelve (12) month period.&quot;
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">
              ✓ Standard 12-Month Cap
            </div>
          </div>

          {/* Version B Counterparty Redline */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-brand-midnight border border-rose-500/30 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-rose-500">Draft v2.0 (Counterparty Markup)</span>
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-500 border border-rose-500/30 font-bold">High Risk Shift</span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-rose-500/30 text-xs font-serif leading-relaxed text-slate-700 dark:text-slate-300">
              &quot;Total cumulative liability shall not exceed <span className="line-through text-rose-400 bg-rose-500/10 px-1">twelve (12) months fees</span> <span className="text-emerald-400 bg-emerald-500/10 px-1 font-bold">ten million dollars ($10,000,000)</span>, excluding claims arising under Section 8 (Indemnification).&quot;
            </div>
            <div className="text-[11px] text-rose-500 font-mono font-bold">
              ⚠️ Liability cap increased from $150k to $10M + indemnity carve-out
            </div>
          </div>
        </div>
      </section>

      {/* 6. Frequently Answered Inquiries */}
      <section className="bg-slate-100 dark:bg-brand-navy/60 py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-brand-gold/20">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-brand-gold uppercase tracking-widest font-mono">Questions & Clarity</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-950 dark:text-white">
              Frequently Asked Legal Inquiries
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-brand-midnight-card border border-slate-200 dark:border-brand-gold/20 rounded-2xl overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                    id={`faq-button-${idx}`}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-brand-navy/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                  >
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-serif">{faq.q}</span>
                    {isOpen ? (
                      <ChevronDown className="w-5 h-5 text-brand-gold shrink-0" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div 
                      id={`faq-answer-${idx}`} 
                      role="region" 
                      aria-labelledby={`faq-button-${idx}`} 
                      className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-brand-sand/85 leading-relaxed border-t border-slate-100 dark:border-brand-gold/15"
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Cinematic Final CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden bg-brand-navy text-white">
        <div className="max-w-4xl mx-auto relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/20 border border-brand-gold/40 text-brand-gold-light text-xs font-serif italic">
            <Shield className="w-3.5 h-3.5" />
            Zero-Retention Enterprise Review
          </div>

          <h2 className="font-serif text-5xl sm:text-6xl text-white whitespace-pre-line font-bold leading-tight">
            Legal documents.{"\n"}
            <span className="italic text-brand-gold">Finally understandable.</span>
          </h2>

          <p className="text-base text-brand-sand/80 max-w-xl mx-auto leading-relaxed">
            Transform how you review, compare, and navigate complex contracts before you sign.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Button
              onClick={() => (user ? onOpenUpload() : onNavigate('register'))}
              variant="primary-gold"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Start Free Contract Review
            </Button>
            <Button
              onClick={handleDemoClick}
              variant="outline-gold"
              size="lg"
              icon={<Sparkles className="w-4 h-4 text-brand-gold" />}
            >
              Explore Interactive Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
