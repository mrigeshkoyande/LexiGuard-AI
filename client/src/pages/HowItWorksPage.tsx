import React from 'react';
import { Upload, Cpu, Eye, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface HowItWorksPageProps {
  onNavigate: (view: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  const steps = [
    {
      step: '01',
      title: 'Upload Contract or Document',
      desc: 'Drag & drop your PDF, DOCX, or TXT agreements. LexiGuard instantly parses document geometry, structured sections, and individual numbered clauses with zero retention.',
      icon: Upload,
    },
    {
      step: '02',
      title: 'Neural Clause Segmentation & Risk Extraction',
      desc: 'Our specialized legal language models identify indemnities, liabilities, non-competes, and termination conditions, assigning deterministic severity scores.',
      icon: Cpu,
    },
    {
      step: '03',
      title: 'Bidirectional Source Verification & Highlight',
      desc: 'Every finding, ambiguity, or action point is linked to exact character spans in the contract text. Click any finding to illuminate the source clause instantly.',
      icon: Eye,
    },
    {
      step: '04',
      title: 'Export Counsel Briefs & Negotiation Redlines',
      desc: 'Generate executive briefs, outside-counsel question sheets, and side-by-side contract diff comparisons ready for boardroom distribution.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lexi-gold/10 border border-lexi-gold/30 text-lexi-gold text-xs font-serif italic">
            <Sparkles className="w-3.5 h-3.5" />
            Deterministic Workflow
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            How LexiGuard AI Works
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            From raw legal text to verified executive decisions in 4 auditable steps.
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="space-y-8 relative">
          <div className="hidden lg:block absolute left-1/2 top-8 bottom-8 w-px bg-slate-800 -translate-x-1/2" />

          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isEven = idx % 2 === 1;
            return (
              <div
                key={idx}
                className={`flex flex-col lg:flex-row items-center gap-8 ${
                  isEven ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={`w-full lg:w-1/2 ${isEven ? 'lg:text-left' : 'lg:text-right'}`}>
                  <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-2xl hover:border-lexi-gold/40 transition-all hover:shadow-xl">
                    <span className="font-mono text-3xl font-bold text-lexi-gold/40 block mb-2">
                      {s.step}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-white mb-2">{s.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                  </div>
                </div>

                {/* Center Node */}
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border-2 border-lexi-gold flex items-center justify-center text-lexi-gold shrink-0 z-10 shadow-lg shadow-lexi-gold/20">
                  <Icon className="w-5 h-5" />
                </div>

                <div className="w-full lg:w-1/2 hidden lg:block" />
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Button variant="primary-gold" size="lg" onClick={() => onNavigate('dashboard')} icon={<ArrowRight className="w-4 h-4" />}>
            Try It Now with Sample Contract
          </Button>
        </div>
      </div>
    </div>
  );
};
