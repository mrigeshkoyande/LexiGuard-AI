import React from 'react';
import { Briefcase, Building, Scale, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface SolutionsPageProps {
  onNavigate: (view: string) => void;
}

export const SolutionsPage: React.FC<SolutionsPageProps> = ({ onNavigate }) => {
  const solutions = [
    {
      title: 'In-House Legal Teams & General Counsel',
      desc: 'Accelerate high-volume contract triage by 80%. Triage inbound vendor MSAs, DPAs, and customer redlines with grounded clause risk classification.',
      benefits: [
        'Standardized playbook compliance checks',
        'Automatic deviation detection vs standard terms',
        'Automated counsel briefing memorandums',
      ],
      icon: Briefcase,
    },
    {
      title: 'Venture Capital, M&A & Private Equity',
      desc: 'Perform high-velocity due diligence across hundreds of portfolio contracts without missing hidden change-of-control or uncapped liability provisions.',
      benefits: [
        'Multi-document cross-term synthesis',
        'Redline delta analysis across investment drafts',
        'Instant milestone & expiration agenda extraction',
      ],
      icon: Building,
    },
    {
      title: 'Law Firms & Independent Attorneys',
      desc: 'Deliver higher value counsel faster. Offload first-pass contract indexing and cross-referencing so partners can focus on high-stakes strategic negotiations.',
      benefits: [
        '100% auditable clause citations for client deliverables',
        'Automated question sheet generation for counsel prep',
        'Air-gapped and zero-retention security compliance',
      ],
      icon: Scale,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lexi-gold/10 border border-lexi-gold/30 text-lexi-gold text-xs font-serif italic">
            <Sparkles className="w-3.5 h-3.5" />
            Tailored Industry Solutions
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            Built for High-Stakes Legal Workflows
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Whether managing Fortune 500 vendor pipelines, executing M&A diligence, or advising fast-growing startups, LexiGuard AI scales your legal precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {solutions.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="bg-slate-900/60 border border-slate-800 hover:border-lexi-gold/50 rounded-2xl p-8 flex flex-col justify-between transition-all hover:shadow-2xl group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-lexi-gold/10 border border-lexi-gold/30 text-lexi-gold flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white mb-3 group-hover:text-amber-200 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {s.desc}
                  </p>
                  <div className="space-y-2.5 border-t border-slate-800 pt-4">
                    {s.benefits.map((b, bi) => (
                      <div key={bi} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-lexi-gold shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8">
                  <Button variant="outline-gold" size="sm" className="w-full" onClick={() => onNavigate('register')}>
                    Start Solution Trial
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-lexi-navy to-slate-900 border border-lexi-gold/30 rounded-3xl p-10 text-center space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Custom Enterprise Deployments
          </h2>
          <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
            Need custom contract taxonomies, single-tenant private cloud isolation, or integration with your existing DMS?
          </p>
          <Button variant="primary-gold" size="md" onClick={() => onNavigate('dashboard')} icon={<ArrowRight className="w-4 h-4" />}>
            Explore the Enterprise Platform
          </Button>
        </div>
      </div>
    </div>
  );
};
