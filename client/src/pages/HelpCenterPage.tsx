import React, { useState } from 'react';
import { HelpCircle, Search, Keyboard, BookOpen, MessageSquare, ChevronDown, ChevronRight, FileCode } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface HelpCenterPageProps {
  onNavigate: (view: string) => void;
}

export const HelpCenterPage: React.FC<HelpCenterPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does clause-level source traceability work?',
      a: 'Whenever LexiGuard AI generates a finding, risk alert, or comparison redline, it records the exact character offset, clause ID, and page number in the original contract. Clicking "Jump to Source" instantly highlights the exact excerpt in gold and scrolls the Document Viewer into place.',
    },
    {
      q: 'Are my uploaded legal documents used to train AI models?',
      a: 'Never. LexiGuard AI enforces a strict zero-retention policy. Inference requests are processed via isolated stateless APIs with zero data logging for training or fine-tuning.',
    },
    {
      q: 'What formats can I upload for analysis and comparison?',
      a: 'You can upload PDF documents, Microsoft Word (.docx), plain text (.txt), and Markdown (.md). LexiGuard segments structured clauses and tables automatically.',
    },
    {
      q: 'How does the Lawyer Prep generator create questions?',
      a: 'It scans all high and medium-severity findings (such as uncapped indemnities or unilateral termination rights) and drafts pointed, strategic questions with exact clause citations that you can bring directly to your counsel.',
    },
    {
      q: 'Can I compare two versions of a contract?',
      a: 'Yes. Navigate to the Compare tab to select any two agreements. LexiGuard computes a structured diff, categorizing changes into Added, Removed, and Modified with severity tags.',
    },
  ];

  const shortcuts = [
    { key: '⌘ + K / Ctrl + K', desc: 'Open Command Palette' },
    { key: 'Ctrl + /', desc: 'Toggle Ask Lexi AI dock' },
    { key: 'Alt + S', desc: 'Focus Document Search' },
    { key: 'Esc', desc: 'Close modals and drawers' },
    { key: 'Ctrl + P', desc: 'Print / Export Counsel Brief' },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lexi-gold/10 border border-lexi-gold/30 text-lexi-gold text-xs font-serif italic">
            <HelpCircle className="w-3.5 h-3.5" />
            Knowledge Base & Guidance
          </div>
          <h1 className="font-serif text-4xl font-bold text-white tracking-tight">
            How Can We Assist You?
          </h1>
          <p className="text-sm text-slate-400">
            Explore guides, keyboard shortcuts, and frequently asked questions for mastering the LexiGuard AI workspace.
          </p>

          {/* Search Bar */}
          <div className="relative pt-2">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search help articles, shortcuts, or legal analysis workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-lexi-gold transition-all shadow-lg"
            />
          </div>
        </div>

        {/* Quick Help Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => onNavigate('workspace')}
            className="bg-slate-900/60 border border-slate-800 hover:border-lexi-gold/40 p-6 rounded-2xl cursor-pointer transition-all hover:shadow-xl group"
          >
            <div className="w-10 h-10 rounded-xl bg-lexi-gold/10 border border-lexi-gold/30 text-lexi-gold flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-white text-base group-hover:text-amber-200 transition-colors">
              Workspace & Analysis Guide
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Learn how to navigate the 60/40 split screen, inspect clause confidence scores, and toggle 8 intelligence tabs.
            </p>
          </div>

          <div
            onClick={() => onNavigate('ask')}
            className="bg-slate-900/60 border border-slate-800 hover:border-lexi-gold/40 p-6 rounded-2xl cursor-pointer transition-all hover:shadow-xl group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-white text-base group-hover:text-blue-200 transition-colors">
              Ask Lexi Interactive Prompts
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Explore best practices for querying multi-clause conditions, indemnity carve-outs, and governing law disputes.
            </p>
          </div>

          <div
            onClick={() => onNavigate('privacy')}
            className="bg-slate-900/60 border border-slate-800 hover:border-lexi-gold/40 p-6 rounded-2xl cursor-pointer transition-all hover:shadow-xl group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <FileCode className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-white text-base group-hover:text-emerald-200 transition-colors">
              Security & Compliance
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Understand our Zero-Retention AI pledge, AES-256 vault architecture, and SOC-2 Type II standards.
            </p>
          </div>
        </div>

        {/* Keyboard Shortcuts Section */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-serif">Productivity Keyboard Shortcuts</h3>
              <p className="text-xs text-slate-400">Navigate contracts with professional keystroke velocity.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {shortcuts.map((sc, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800"
              >
                <span className="text-xs text-slate-300 font-medium">{sc.desc}</span>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-lexi-gold font-bold">
                  {sc.key}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold text-white">Frequently Answered Legal Inquiries</h2>
          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-900/80 transition-colors"
                  >
                    <span className="text-xs font-semibold text-white font-sans">{faq.q}</span>
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4 text-lexi-gold shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-950/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Support CTA */}
        <div className="bg-gradient-to-r from-lexi-navy to-slate-900 border border-lexi-gold/30 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-xl font-bold text-white">Need Custom Enterprise Integrations?</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Our engineering team provides dedicated VPC deployment, custom clause taxonomies, and DMS integrations (iManage, NetDocuments).
            </p>
          </div>
          <Button variant="primary-gold" size="md" onClick={() => onNavigate('dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
