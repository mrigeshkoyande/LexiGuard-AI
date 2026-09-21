import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  ArrowLeft,
  PlusCircle,
  MinusCircle,
  Edit3,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { ComparisonResult, DocumentSummary } from '@lexiguard/shared';
import { api } from '../services/api';

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
      setError('Please select two documents to compare.');
      return;
    }
    if (docAId === docBId) {
      setError('Please select two different documents to compare.');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      const res = await api.compareDocuments(docAId, docBId);
      setComparison(res);
    } catch (err: any) {
      setError(err.message || 'Comparison failed.');
    } finally {
      setLoading(false);
    }
  };

  const getDiffBadge = (type: string) => {
    switch (type) {
      case 'added':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <PlusCircle className="w-3 h-3" />
            <span>Added</span>
          </span>
        );
      case 'removed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <MinusCircle className="w-3 h-3" />
            <span>Removed</span>
          </span>
        );
      case 'modified':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Edit3 className="w-3 h-3" />
            <span>Modified</span>
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
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Contract Comparison</h1>
            <p className="text-xs text-slate-400">
              Side-by-side clause diffing to identify added, removed, or modified terms
            </p>
          </div>
        </div>
      </div>

      {/* Document Selectors Box */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Doc A */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Base Contract (Document A)
            </label>
            <select
              value={docAId}
              onChange={(e) => setDocAId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="">Select Document A...</option>
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title} ({d.originalFilename})
                </option>
              ))}
            </select>
          </div>

          {/* Doc B */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Revised Contract (Document B)
            </label>
            <select
              value={docBId}
              onChange={(e) => setDocBId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="">Select Document B...</option>
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
          <button
            onClick={handleRunCompare}
            disabled={!docAId || !docBId || loading}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              docAId && docBId && !loading
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <GitCompare className="w-4 h-4" />}
            <span>{loading ? 'Analyzing Differences...' : 'Run Clause Diff'}</span>
          </button>
        </div>
      </div>

      {/* Comparison Results */}
      {comparison && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Summary Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-850 border border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Diff Overview
              </span>
            </div>
            <h3 className="text-base font-bold text-white">{comparison.summary}</h3>
            <p className="text-xs text-slate-400 mt-1">
              Comparing: <strong>{comparison.docATitle}</strong> vs <strong>{comparison.docBTitle}</strong>
            </p>
          </div>

          {/* Diff Records Cards */}
          <div className="space-y-4">
            {comparison.records.map((rec, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-3"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {getDiffBadge(rec.type)}
                    <h4 className="text-sm font-bold text-white">{rec.category}</h4>
                  </div>
                  <span className="text-xs text-slate-400 font-sans italic">{rec.summary}</span>
                </div>

                {/* Side-by-Side Clauses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Before (Doc A) */}
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Document A (Original)
                    </span>
                    <p className="text-xs font-serif text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {rec.before || <span className="text-slate-500 italic">No corresponding clause in Document A</span>}
                    </p>
                  </div>

                  {/* After (Doc B) */}
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Document B (Revision)
                    </span>
                    <p className="text-xs font-serif text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {rec.after || <span className="text-slate-500 italic">Clause deleted in Document B</span>}
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
