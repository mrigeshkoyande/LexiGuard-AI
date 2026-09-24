import React from 'react';
import { Scale, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface AboutPageProps {
  onNavigate: (view: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lexi-gold/10 border border-lexi-gold/30 text-lexi-gold text-xs font-serif italic">
            <Scale className="w-3.5 h-3.5" />
            Our Mission & Principles
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            Legal Clarity, Without the Complexity.
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            LexiGuard AI was founded on a singular conviction: legal technology should empower human judgment with unwavering precision, not replace it with ungrounded black-box models.
          </p>
        </div>

        {/* The Manifesto */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white border-b border-slate-800 pb-4">
            The LexiGuard Zero-Hallucination Manifesto
          </h2>

          <div className="space-y-6 text-sm text-slate-300 leading-relaxed font-sans">
            <div>
              <h3 className="text-base font-bold text-lexi-gold mb-1">1. Every AI Finding Must Point to Ground Truth</h3>
              <p className="text-xs text-slate-400">
                In legal review, approximate answers are dangerous. LexiGuard anchors every risk score, summary point, and comparison redline to the exact clause character range and page number.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-lexi-gold mb-1">2. Absolute Data Confidentiality is Non-Negotiable</h3>
              <p className="text-xs text-slate-400">
                Legal contracts represent our users&apos; most sensitive intellectual property and liabilities. We maintain a strict Zero-Retention policy with AES-256 vault encryption.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-lexi-gold mb-1">3. Editorial Elegance & Uncompromised Utility</h3>
              <p className="text-xs text-slate-400">
                We reject clunky legacy enterprise software. LexiGuard pairs editorial visual hierarchy with instant keystroke navigation for an effortless review experience.
              </p>
            </div>
          </div>
        </div>

        {/* Pillars / Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
            <div className="font-serif text-3xl font-bold text-lexi-gold mb-1">100%</div>
            <div className="text-xs font-semibold text-white">Source Verification</div>
            <div className="text-[11px] text-slate-400 mt-1">Bidirectional clause traceability</div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
            <div className="font-serif text-3xl font-bold text-lexi-gold mb-1">0%</div>
            <div className="text-xs font-semibold text-white">Model Retention</div>
            <div className="text-[11px] text-slate-400 mt-1">Air-gapped zero training policy</div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
            <div className="font-serif text-3xl font-bold text-lexi-gold mb-1">10x</div>
            <div className="text-xs font-semibold text-white">Review Velocity</div>
            <div className="text-[11px] text-slate-400 mt-1">Minutes from upload to brief</div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-6">
          <Button variant="primary-gold" size="lg" onClick={() => onNavigate('dashboard')} icon={<ArrowRight className="w-4 h-4" />}>
            Enter the LexiGuard Workspace
          </Button>
        </div>
      </div>
    </div>
  );
};
