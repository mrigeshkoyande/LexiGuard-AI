import React from 'react';
import { Eye, SplitSquareVertical, MessageSquare, Scale, Lock, Layers, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface FeaturesPageProps {
  onNavigate: (view: string) => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onNavigate }) => {
  const features = [
    {
      icon: Eye,
      title: '100% Clause-Level Source Traceability',
      desc: 'Never guess why an AI flag was triggered. Every finding links bidirectionally to exact character ranges, clauses, and original page numbers with pulsing gold DOM illumination.',
      tag: 'Core Differentiator',
    },
    {
      icon: SplitSquareVertical,
      title: 'Contract Diff & Comparison Engine',
      desc: 'Select two drafts or competing counterparty agreements. LexiGuard computes structured diffs, isolating critical clause shifts with severity ratings.',
      tag: 'Diff Intelligence',
    },
    {
      icon: MessageSquare,
      title: 'Ask Lexi AI Legal Dock',
      desc: 'Query your contracts naturally with zero hallucination. Ask about indemnities, termination timelines, and cure periods with grounded source chips.',
      tag: 'Interactive AI',
    },
    {
      icon: Scale,
      title: 'Counsel Prep & Question Generator',
      desc: 'Automatically prepare for meetings with outside counsel. Generate pointed, strategic questions paired with risk citations to minimize billable attorney hours.',
      tag: 'Counsel Alignment',
    },
    {
      icon: Lock,
      title: 'Zero-Retention Security Vault',
      desc: 'No contract data is ever used to train AI models. Encrypted client-side with AES-256 and processed via stateless SOC-2 compliant inference pipelines.',
      tag: 'Enterprise Security',
    },
    {
      icon: Layers,
      title: 'Executive Action Briefs & Redline Exporters',
      desc: 'Generate 1-click synthesized executive summaries, negotiation talking points, and board-ready memos ready to export or print.',
      tag: 'Executive Ready',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lexi-gold/10 border border-lexi-gold/30 text-lexi-gold text-xs font-serif italic">
            <Sparkles className="w-3.5 h-3.5" />
            Capabilities & Architecture
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            Engineered for Precision Legal Intelligence
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            LexiGuard AI combines modern neural language understanding with strict legal auditability—giving counsel, founders, and legal ops total confidence in every reviewed agreement.
          </p>
          <div className="pt-4 flex items-center justify-center gap-4">
            <Button variant="primary-gold" size="lg" onClick={() => onNavigate('register')} icon={<ArrowRight className="w-4 h-4" />}>
              Start Free Contract Review
            </Button>
            <Button variant="outline-gold" size="lg" onClick={() => onNavigate('dashboard')}>
              Explore Demo Workspace
            </Button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="bg-slate-900/60 border border-slate-800 hover:border-lexi-gold/50 rounded-2xl p-8 space-y-4 transition-all hover:shadow-2xl group relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-lexi-gold/10 border border-lexi-gold/30 text-lexi-gold flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-400">
                    {f.tag}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-200 transition-colors">
                  {f.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="bg-gradient-to-r from-lexi-navy via-slate-900 to-lexi-navy border border-lexi-gold/30 rounded-3xl p-10 text-center space-y-6">
          <h2 className="font-serif text-3xl font-bold text-white">
            Experience Grounded Legal Clarity
          </h2>
          <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
            Upload your first contract to see automatic clause segmentation, risk heatmaps, and counsel preparation briefs in under 10 seconds.
          </p>
          <Button variant="primary-gold" size="lg" onClick={() => onNavigate('dashboard')} icon={<ArrowRight className="w-4 h-4" />}>
            Open Instant Interactive Demo
          </Button>
        </div>
      </div>
    </div>
  );
};
