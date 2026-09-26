import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Plus,
  Trash2,
  GitCompare,
  CheckSquare,
  ArrowRight,
  RefreshCw,
  Clock,
  AlertTriangle,
  MessageSquare,
  Shield,
  ChevronRight
} from 'lucide-react';
import { DocumentSummary } from '@lexiguard/shared';
import { api } from '../services/api';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { ProgressRing } from '../components/ui/ProgressRing';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DocumentStack } from '../components/3d/DocumentStack';

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    } catch (err: unknown) {
      alert(`Delete failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setDeletingId(null);
    }
  };

  // Real backend calculated metrics
  const totalDocs = documents.length;
  const analyzedDocs = documents.filter((d) => d.status === 'ANALYZED').length;
  const totalFindings = documents.reduce((acc, d) => acc + (d.findingCount || 0), 0);
  const totalPages = documents.reduce((acc, d) => acc + (d.pageCount || 1), 0);
  const masteryScore = totalDocs > 0 ? Math.min(100, Math.round((analyzedDocs / totalDocs) * 70 + Math.min(30, totalFindings * 2))) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Command Center Header & Legal Mastery Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold-light text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 text-brand-gold" />
            <span>Legal Intelligence Command Center</span>
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl text-brand-warmwhite font-light">
            Your Legal Workspace
          </h1>
          <p className="text-xs sm:text-sm text-brand-sand/80 max-w-2xl leading-relaxed">
            Everything you need to review, understand, compare, and navigate your contracts with 100% clause traceability.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <Button
              onClick={onOpenUpload}
              variant="primary-gold"
              size="md"
              icon={<Plus className="w-4 h-4" />}
            >
              Analyze Document
            </Button>
            <Button
              onClick={() => onNavigate('compare')}
              variant="navy"
              size="md"
              icon={<GitCompare className="w-4 h-4 text-brand-gold" />}
            >
              Compare Versions
            </Button>
            <Button
              onClick={() => onNavigate('ask')}
              variant="outline-gold"
              size="md"
              icon={<MessageSquare className="w-4 h-4 text-brand-gold" />}
            >
              Ask Lexi
            </Button>
          </div>
        </div>

        {/* Legal Mastery Card with 3D Document Stack & Real Progress Ring */}
        <div className="lg:col-span-4 bg-brand-midnight-card/90 border border-brand-gold/30 rounded-2xl p-6 shadow-navy-deep flex items-center justify-between relative overflow-hidden backdrop-blur-md">
          <div className="space-y-3 z-10">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold block">
                Document Mastery
              </span>
              <h3 className="text-sm font-semibold text-brand-warmwhite">
                {masteryScore >= 80 ? 'Master Reviewer' : masteryScore >= 40 ? 'Active Verifier' : 'Workspace Ready'}
              </h3>
            </div>
            <div className="space-y-1 font-mono text-[11px] text-brand-sand/80">
              <p>• {totalDocs} Documents Ingested</p>
              <p>• {totalFindings} Traceable Findings</p>
              <p>• {totalPages} Pages Indexed</p>
            </div>
          </div>

          <div className="z-10 shrink-0">
            <ProgressRing
              progress={masteryScore}
              size={88}
              strokeWidth={8}
              label={`${masteryScore}%`}
              sublabel="Mastery"
            />
          </div>

          <div className="absolute -right-4 -bottom-4 w-32 h-32 opacity-25 pointer-events-none">
            <DocumentStack />
          </div>
        </div>
      </div>

      {/* Persistent Legal Disclaimer */}
      <DisclaimerBanner />

      {/* 2. Main Workspace Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Recent Analyzed Documents */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-sand/70 flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-gold" />
              <span>Analyzed Contracts ({documents.length})</span>
            </h2>
            <button
              onClick={fetchDocuments}
              aria-label="Refresh documents list"
              className="text-xs text-brand-sand hover:text-white flex items-center gap-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded-sm px-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-brand-sand text-xs bg-brand-midnight-card rounded-xl border border-brand-gold/20">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-gold" />
              <span>Loading workspace folios...</span>
            </div>
          ) : documents.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-brand-midnight-card/80 border border-brand-gold/20 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-navy text-brand-gold flex items-center justify-center mx-auto border border-brand-gold/20">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-headline text-xl text-brand-warmwhite font-light">No documents uploaded yet</h3>
                <p className="text-xs text-brand-sand/80 mt-1 max-w-sm mx-auto">
                  Upload your first employment contract, NDA, or service agreement to begin building your legal workspace.
                </p>
              </div>
              <Button onClick={onOpenUpload} variant="primary-gold" size="md">
                Analyze Document
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc) => {
                const isDemoDoc = doc.title.includes('Employment Agreement — Example');

                return (
                  <div
                    key={doc.id}
                    onClick={() => onNavigate('workspace', doc.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onNavigate('workspace', doc.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Open workspace for ${doc.title}`}
                    className="p-5 rounded-xl bg-brand-midnight-card/90 hover:bg-brand-navy-light/60 border border-brand-gold/25 hover:border-brand-gold shadow-lg hover:shadow-gold-subtle transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                  >
                    {isDemoDoc && (
                      <div className="mb-2 px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 self-start" aria-hidden="true">
                        <span>★ Fictional Demo Document</span>
                      </div>
                    )}

                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="p-2.5 rounded-lg bg-brand-navy text-brand-gold border border-brand-gold/30">
                          <FileText className="w-5 h-5" />
                        </div>

                        <div className="flex items-center gap-1">
                          <Badge variant="status" status={(doc.status === 'ERROR' || doc.status === 'ANALYZED' || doc.status === 'PENDING') ? doc.status : 'PENDING'}>
                            {doc.status}
                          </Badge>
                          <button
                            onClick={(e) => handleDelete(e, doc.id)}
                            disabled={deletingId === doc.id}
                            title="Delete Document"
                            aria-label={`Delete document ${doc.title}`}
                            className="p-1.5 rounded-lg text-brand-sand hover:text-rose-400 hover:bg-brand-midnight transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Title & Type */}
                      <h3 className="text-sm font-semibold text-brand-warmwhite group-hover:text-brand-gold-light transition-colors line-clamp-1">
                        {doc.title}
                      </h3>
                      <p className="text-[11px] text-brand-sand/70 mt-0.5">
                        {doc.documentType || 'Legal Agreement'} • {doc.pageCount} Page(s)
                      </p>

                      {/* Summary */}
                      <p className="text-xs text-brand-sand/90 mt-2.5 line-clamp-2 leading-relaxed">
                        {doc.analysisSummary || 'Structured analysis ready for review.'}
                      </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-4 pt-3 border-t border-brand-gold/15 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-brand-gold font-mono text-[11px]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{doc.findingCount || 0} Findings</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate('action-brief', doc.id);
                          }}
                          aria-label={`Open action brief for ${doc.title}`}
                          className="px-2.5 py-1 rounded bg-brand-navy border border-brand-gold/20 hover:border-brand-gold text-brand-warmwhite text-[11px] font-medium flex items-center gap-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                        >
                          <CheckSquare className="w-3 h-3 text-brand-gold" />
                          <span>Action Brief</span>
                        </button>
                        <span className="text-brand-gold group-hover:translate-x-1 transition-transform">
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

        {/* Right Column (4 cols): Review Areas & Deadlines Agenda */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Review Areas Widget */}
          <div className="p-5 rounded-2xl bg-brand-midnight-card/90 border border-brand-gold/25 shadow-navy-deep space-y-4">
            <div className="flex items-center justify-between border-b border-brand-gold/15 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-warmwhite flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Critical Review Areas</span>
              </h3>
              <button 
                onClick={() => onNavigate('deadlines')} 
                className="text-[10px] text-brand-gold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded-sm px-1"
                aria-label="View all critical review areas"
              >
                View All
              </button>
            </div>

            <div className="space-y-2.5">
              <div
                onClick={() => documents[0] && onNavigate('workspace', documents[0].id)}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && documents[0]) {
                    e.preventDefault();
                    onNavigate('workspace', documents[0].id);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label="Review Automatic Renewal Notice"
                className="p-3 rounded-xl bg-brand-navy-dark border border-brand-gold/20 hover:border-brand-gold/50 cursor-pointer transition-colors flex items-start gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              >
                <div className="w-2 h-2 rounded-full bg-rose-400 shrink-0 mt-1.5" aria-hidden="true"></div>
                <div className="flex-1 text-xs">
                  <h5 className="font-semibold text-brand-warmwhite">Automatic Renewal Notice</h5>
                  <p className="text-brand-sand/70 text-[11px] mt-0.5">Requires 90-day non-renewal notice before expiration</p>
                </div>
                <ChevronRight className="w-4 h-4 text-brand-sand/50 shrink-0" aria-hidden="true" />
              </div>

              <div
                onClick={() => documents[0] && onNavigate('workspace', documents[0].id)}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && documents[0]) {
                    e.preventDefault();
                    onNavigate('workspace', documents[0].id);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label="Review Broad Indemnification Scope"
                className="p-3 rounded-xl bg-brand-navy-dark border border-brand-gold/20 hover:border-brand-gold/50 cursor-pointer transition-colors flex items-start gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              >
                <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1.5" aria-hidden="true"></div>
                <div className="flex-1 text-xs">
                  <h5 className="font-semibold text-brand-warmwhite">Broad Indemnification Scope</h5>
                  <p className="text-brand-sand/70 text-[11px] mt-0.5">Review liability caps and third-party claims exposure</p>
                </div>
                <ChevronRight className="w-4 h-4 text-brand-sand/50 shrink-0" aria-hidden="true" />
              </div>

              <div
                onClick={() => documents[0] && onNavigate('workspace', documents[0].id)}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && documents[0]) {
                    e.preventDefault();
                    onNavigate('workspace', documents[0].id);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label="Review IP and Invention Assignment"
                className="p-3 rounded-xl bg-brand-navy-dark border border-brand-gold/20 hover:border-brand-gold/50 cursor-pointer transition-colors flex items-start gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-1.5" aria-hidden="true"></div>
                <div className="flex-1 text-xs">
                  <h5 className="font-semibold text-brand-warmwhite">IP & Invention Assignment</h5>
                  <p className="text-brand-sand/70 text-[11px] mt-0.5">Confirms intellectual property allocation to client</p>
                </div>
                <ChevronRight className="w-4 h-4 text-brand-sand/50 shrink-0" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Activity Timeline Mini-Widget */}
          <div className="p-5 rounded-2xl bg-brand-midnight-card/90 border border-brand-gold/25 shadow-navy-deep space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-warmwhite flex items-center gap-2 border-b border-brand-gold/15 pb-3">
              <Clock className="w-4 h-4 text-brand-gold" />
              <span>Workspace Activity</span>
            </h3>

            <div className="space-y-3 font-sans text-xs">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
                  <Sparkles className="w-3 h-3" />
                </div>
                <div>
                  <p className="text-brand-warmwhite font-medium">Analysis Completed</p>
                  <p className="text-[11px] text-brand-sand/60">Automated clause extraction & grounding</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center shrink-0 text-brand-gold">
                  <Shield className="w-3 h-3" />
                </div>
                <div>
                  <p className="text-brand-warmwhite font-medium">Source Verification Active</p>
                  <p className="text-[11px] text-brand-sand/60">100% clause mapping indexed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
