import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Plus,
  Trash2,
  GitCompare,
  CheckSquare,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { DocumentSummary } from '@lexiguard/shared';
import { api } from '../services/api';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

interface DashboardPageProps {
  onNavigate: (view: string, docId?: string) => void;
  onOpenUpload: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onOpenUpload }) => {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await api.listDocuments();
      setDocuments(res.documents);
    } catch (err) {
      console.error('Failed to load documents', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (e: React.MouseEvent, docId: string) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this document and all its analysis findings?')) {
      return;
    }

    try {
      setDeletingId(docId);
      await api.deleteDocument(docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Contract Workspace</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review, source-link, and verify your legal agreements before signing
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('compare')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white text-xs font-semibold border border-slate-750 flex items-center gap-2 transition-colors"
          >
            <GitCompare className="w-4 h-4 text-cyan-400" />
            <span>Compare Documents</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/25 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Persistent Legal Disclaimer */}
      <DisclaimerBanner />

      {/* Documents Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Analyzed Contracts ({documents.length})
          </h2>
          <button
            onClick={fetchDocuments}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
            <span>Loading documents...</span>
          </div>
        ) : documents.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">No documents uploaded yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Upload your first employment contract, NDA, or service agreement to get grounded AI analysis.
              </p>
            </div>
            <button
              onClick={onOpenUpload}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/30"
            >
              Upload Document
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {documents.map((doc) => {
              const isDemoDoc = doc.title.includes('Employment Agreement — Example');

              return (
                <div
                  key={doc.id}
                  onClick={() => onNavigate('workspace', doc.id)}
                  className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-850/90 border border-slate-800 hover:border-cyan-500/50 shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Fictional demo badge */}
                  {isDemoDoc && (
                    <div className="mb-3 px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 self-start">
                      <span>★ Fictional Demo Document</span>
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        <FileText className="w-5 h-5" />
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {doc.status}
                        </span>
                        <button
                          onClick={(e) => handleDelete(e, doc.id)}
                          disabled={deletingId === doc.id}
                          title="Delete Document"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {doc.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {doc.documentType || 'Legal Agreement'} • {doc.pageCount} Page(s)
                    </p>

                    {/* Summary Snippet */}
                    <p className="text-xs text-slate-300 font-sans mt-3 line-clamp-2 leading-relaxed">
                      {doc.analysisSummary || 'Structured analysis ready for review.'}
                    </p>
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{doc.findingCount || 0} Findings</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('action-brief', doc.id);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-[11px] font-medium flex items-center gap-1 transition-colors"
                      >
                        <CheckSquare className="w-3 h-3 text-cyan-400" />
                        <span>Action Brief</span>
                      </button>

                      <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
