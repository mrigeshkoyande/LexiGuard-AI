import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  ArrowLeft,
  PlusCircle,
  MinusCircle,
  Edit3,
  AlertCircle
} from 'lucide-react';
import { ComparisonResult, DocumentSummary } from '@lexiguard/shared';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

interface ComparePageProps {
  onNavigate: (view: string, docId?: string) => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({ onNavigate }) => {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [docAId, setDocAId] = useState<string>('');
  const [docBId, setDocBId] = useState<string>('');
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDocs() {
      try {
        const res = await api.listDocuments();
        setDocuments(res.documents);
        if (res.documents.length >= 2) {
          setDocAId(res.documents[0].id);
          setDocBId(res.documents[1].id);
        } else if (res.documents.length === 1) {
          setDocAId(res.documents[0].id);
        }
      } catch (err) {
        console.error('Failed to load documents for comparison', err);
      }
    }
    loadDocs();
  }, []);

  const handleRunCompare = async () => {
    if (!docAId || !docBId) {
      setError('Please select two contracts to compare.');
      return;
    }
    if (docAId === docBId) {
      setError('Please select two distinct contracts to compare.');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      const res = await api.compareDocuments(docAId, docBId);
      setComparison(res);
    } catch (err: any) {
      setError(err.message || 'Comparison diffing failed.');
    } finally {
      setLoading(false);
    }
  };

  const getDiffBadge = (type: string) => {
    switch (type) {
      case 'added':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <PlusCircle className="w-3 h-3" /> Added
          </span>
        );
      case 'removed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <MinusCircle className="w-3 h-3" /> Removed
          </span>
        );
      case 'modified':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Edit3 className="w-3 h-3" /> Modified
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2 rounded-xl bg-brand-navy-dark hover:bg-brand-navy text-brand-sand hover:text-white border border-brand-gold/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-headline text-3xl text-brand-warmwhite font-light">Contract Version Diffing</h1>
            <p className="text-xs text-brand-sand/80">
              Side-by-side clause comparison to identify added, removed, and modified provisions
            </p>
          </div>
        </div>
      </div>

      <DisclaimerBanner />

      {/* Selectors Panel */}
      <div className="p-6 rounded-2xl bg-brand-midnight-card/90 border border-brand-gold/25 shadow-navy-deep space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Doc A */}
          <div>
            <label htmlFor="docA-select" className="block text-xs font-semibold text-brand-gold uppercase tracking-wider mb-1.5">
              Base Contract (Version A)
            </label>
            <select
              id="docA-select"
              value={docAId}
              onChange={(e) => setDocAId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-brand-midnight border border-brand-gold/20 rounded-xl text-xs text-brand-warmwhite focus:outline-none focus:border-brand-gold/60 focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              <option value="">Select Base Contract A...</option>
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title} ({d.originalFilename})
                </option>
              ))}
            </select>
          </div>

          {/* Doc B */}
          <div>
            <label htmlFor="docB-select" className="block text-xs font-semibold text-brand-gold uppercase tracking-wider mb-1.5">
              Revised Counterpart (Version B)
            </label>
            <select
              id="docB-select"
              value={docBId}
              onChange={(e) => setDocBId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-brand-midnight border border-brand-gold/20 rounded-xl text-xs text-brand-warmwhite focus:outline-none focus:border-brand-gold/60 focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              <option value="">Select Revised Contract B...</option>
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title} ({d.originalFilename})
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button
            onClick={handleRunCompare}
            disabled={!docAId || !docBId || loading}
            loading={loading}
            variant="primary-gold"
            size="md"
            icon={<GitCompare className="w-4 h-4" />}
          >
            Run Clause Diff
          </Button>
        </div>
      </div>

      {/* Comparison Results */}
      {comparison && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Summary Card */}
          <div className="p-6 rounded-2xl bg-brand-navy-dark border border-brand-gold/30 shadow-lg space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="gold">Comparison Summary</Badge>
            </div>
            <h3 className="font-headline text-2xl text-brand-warmwhite">{comparison.summary}</h3>
            <p className="text-xs text-brand-sand/80">
              Comparing: <strong className="text-brand-gold">{comparison.docATitle}</strong> vs <strong className="text-brand-gold-light">{comparison.docBTitle}</strong>
            </p>
          </div>

          {/* Diff Records Cards */}
          <div className="space-y-4">
            {comparison.records.map((rec, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-brand-midnight-card border border-brand-gold/20 shadow-navy-deep space-y-4"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-gold/15 pb-3">
                  <div className="flex items-center gap-2.5">
                    {getDiffBadge(rec.type)}
                    <h4 className="text-sm font-bold text-brand-warmwhite">{rec.category}</h4>
                  </div>
                  <span className="text-xs text-brand-sand/80 italic">{rec.summary}</span>
                </div>

                {/* Side-by-Side Clauses */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Version A */}
                  <div className="p-4 rounded-xl bg-brand-midnight border border-brand-gold/15 space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-sand/60 block">
                      Version A (Original)
                    </span>
                    <p className="text-xs font-serif text-brand-warmwhite/90 leading-relaxed whitespace-pre-wrap">
                      {rec.before || <span className="text-brand-sand/40 italic">No corresponding provision in Version A</span>}
                    </p>
                  </div>

                  {/* Version B */}
                  <div className="p-4 rounded-xl bg-brand-midnight border border-brand-gold/20 space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-gold block">
                      Version B (Revision)
                    </span>
                    <p className="text-xs font-serif text-brand-warmwhite leading-relaxed whitespace-pre-wrap">
                      {rec.after || <span className="text-brand-sand/40 italic">Clause deleted in Version B</span>}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
