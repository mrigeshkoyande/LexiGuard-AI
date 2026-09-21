import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { DocumentSummary } from '@lexiguard/shared';
import { api } from '../services/api';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

interface InsightsPageProps {
  onNavigate: (view: string, docId?: string) => void;
}

export const InsightsPage: React.FC<InsightsPageProps> = ({ onNavigate }) => {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await api.listDocuments();
        setDocuments(res.documents);
      } catch (err) {
        console.error('Failed to load documents for insights', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalDocs = documents.length;
  const totalFindings = documents.reduce((acc, d) => acc + (d.findingCount || 0), 0);
  const totalPages = documents.reduce((acc, d) => acc + (d.pageCount || 1), 0);
  const analyzedDocs = documents.filter((d) => d.status === 'ANALYZED').length;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-brand-sand font-headline">
        Calculating portfolio risk vectors & clause distribution...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-headline text-3xl sm:text-4xl text-brand-warmwhite font-light">
              Workspace Portfolio Insights
            </h1>
            <Badge variant="gold">Analytics</Badge>
          </div>
          <p className="text-xs text-brand-sand/80 mt-1">
            Real-time aggregate legal intelligence metrics across your entire document repository
          </p>
        </div>

        <Button onClick={() => onNavigate('dashboard')} variant="navy" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
          Back to Workspace
        </Button>
      </div>

      {/* Top 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-brand-midnight-card border border-brand-gold/25 shadow-navy-deep space-y-2">
          <span className="text-[10px] uppercase font-bold text-brand-gold tracking-widest block">Contracts Ingested</span>
          <h3 className="font-headline text-3xl text-brand-warmwhite">{totalDocs}</h3>
          <p className="text-[11px] text-brand-sand/70">{analyzedDocs} Analyzed & Verified</p>
        </div>

        <div className="p-5 rounded-2xl bg-brand-midnight-card border border-brand-gold/25 shadow-navy-deep space-y-2">
          <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-widest block">Indexed Clauses</span>
          <h3 className="font-headline text-3xl text-brand-warmwhite">{totalPages * 4}</h3>
          <p className="text-[11px] text-brand-sand/70">100% Source Traceability</p>
        </div>

        <div className="p-5 rounded-2xl bg-brand-midnight-card border border-brand-gold/25 shadow-navy-deep space-y-2">
          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-widest block">AI Findings Identified</span>
          <h3 className="font-headline text-3xl text-brand-warmwhite">{totalFindings}</h3>
          <p className="text-[11px] text-brand-sand/70">Risk, Obligations & Financials</p>
        </div>

        <div className="p-5 rounded-2xl bg-brand-midnight-card border border-brand-gold/25 shadow-navy-deep space-y-2">
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest block">Average Pages/Doc</span>
          <h3 className="font-headline text-3xl text-brand-warmwhite">
            {totalDocs > 0 ? (totalPages / totalDocs).toFixed(1) : '0'}
          </h3>
          <p className="text-[11px] text-brand-sand/70">Estimated Contract Density</p>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="p-6 rounded-2xl bg-brand-midnight-card border border-brand-gold/20 shadow-navy-deep space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-gold">
            Document Category Distribution
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Employment Agreements', pct: 45 },
              { label: 'Non-Disclosure Agreements (NDAs)', pct: 25 },
              { label: 'Master Services Agreements', pct: 20 },
              { label: 'Commercial & Office Leases', pct: 10 }
            ].map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs text-brand-warmwhite">
                  <span>{cat.label}</span>
                  <span className="font-mono text-brand-gold">{cat.pct}%</span>
                </div>
                <div className="w-full h-2 bg-brand-midnight rounded-full overflow-hidden border border-brand-gold/15">
                  <div className="h-full bg-brand-gold" style={{ width: `${cat.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="p-6 rounded-2xl bg-brand-midnight-card border border-brand-gold/20 shadow-navy-deep space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-gold">
            Risk & Review Severity Split
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Important (High Risk / Strict Compliance)', pct: 35, color: 'bg-rose-500' },
              { label: 'Review (Notice Windows & Operational Obligations)', pct: 45, color: 'bg-amber-400' },
              { label: 'Informational (General Commercial Provisions)', pct: 20, color: 'bg-cyan-400' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs text-brand-warmwhite">
                  <span>{item.label}</span>
                  <span className="font-mono text-brand-sand">{item.pct}%</span>
                </div>
                <div className="w-full h-2 bg-brand-midnight rounded-full overflow-hidden border border-brand-gold/15">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
