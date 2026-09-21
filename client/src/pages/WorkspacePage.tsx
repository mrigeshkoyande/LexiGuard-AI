import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckSquare,
  RefreshCw,
  Clock,
  Briefcase
} from 'lucide-react';
import { AnalysisResult, DocumentClause } from '@lexiguard/shared';
import { api } from '../services/api';
import { DocumentViewer } from '../components/DocumentViewer';
import { InsightsPanel } from '../components/InsightsPanel';
import { AskLexiDock } from '../components/AskLexiDock';
import { ClauseDetailDrawer } from '../components/ClauseDetailDrawer';
import { Button } from '../components/ui/Button';

interface WorkspacePageProps {
  documentId: string;
  onNavigate: (view: string, docId?: string) => void;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({ documentId, onNavigate }) => {
  const [documentData, setDocumentData] = useState<any>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [highlightedClauseId, setHighlightedClauseId] = useState<string | null>(null);
  const [selectedDrawerClause, setSelectedDrawerClause] = useState<DocumentClause | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reanalyzing, setReanalyzing] = useState(false);

  useEffect(() => {
    async function loadDocument() {
      try {
        setLoading(true);
        const res = await api.getDocument(documentId);
        setDocumentData(res.document);

        if (res.document.analysis) {
          const dbFindings = res.document.analysis.findings || [];
          const missingInfo = JSON.parse(res.document.analysis.missingInfoJson || '[]');

          const structuredAnalysis: AnalysisResult = {
            summary: res.document.analysis.summary,
            documentType: res.document.analysis.documentType,
            importantClauses: dbFindings.filter((f: any) => f.category === 'importantClauses'),
            obligations: dbFindings.filter((f: any) => f.category === 'obligations'),
            deadlines: dbFindings.filter((f: any) => f.category === 'deadlines'),
            monetaryTerms: dbFindings.filter((f: any) => f.category === 'monetaryTerms'),
            terminationTerms: dbFindings.filter((f: any) => f.category === 'terminationTerms'),
            renewalTerms: dbFindings.filter((f: any) => f.category === 'renewalTerms'),
            potentialConcerns: dbFindings.filter((f: any) => f.category === 'potentialConcerns'),
            missingInformation: missingInfo
          };
          setAnalysis(structuredAnalysis);
        }
      } catch (err) {
        console.error('Failed to load document in workspace', err);
      } finally {
        setLoading(false);
      }
    }
    loadDocument();
  }, [documentId]);

  const handleReanalyze = async () => {
    try {
      setReanalyzing(true);
      const res = await api.reanalyzeDocument(documentId);
      setAnalysis(res.analysis);
    } catch (err: any) {
      alert(`Reanalysis failed: ${err.message}`);
    } finally {
      setReanalyzing(false);
    }
  };

  const handleSelectClause = (clause: DocumentClause) => {
    setHighlightedClauseId(clause.id);
  };

  const handleSelectClauseId = (clauseId: string) => {
    setHighlightedClauseId(clauseId);
  };

  const handleOpenClauseDrawer = (clause: DocumentClause) => {
    setSelectedDrawerClause(clause);
    setIsDrawerOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center text-xs text-brand-sand space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-brand-gold" />
          <p className="font-headline text-lg text-brand-warmwhite font-light">Loading document & grounding analysis...</p>
        </div>
      </div>
    );
  }

  if (!documentData) {
    return (
      <div className="p-12 text-center text-xs text-brand-sand space-y-3 max-w-md mx-auto">
        <p>Document not found or inaccessible.</p>
        <Button onClick={() => onNavigate('dashboard')} variant="primary-gold" size="sm">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-brand-midnight">
      {/* Workspace Top Toolbar */}
      <div className="px-4 py-2.5 bg-brand-midnight-card border-b border-brand-gold/20 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-1.5 rounded-lg text-brand-sand hover:text-white hover:bg-brand-navy-dark transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h1 className="font-headline text-lg font-light text-brand-warmwhite truncate max-w-md">
              {documentData.title}
            </h1>
            <p className="text-[11px] text-brand-sand/70 font-mono">
              {documentData.documentType || 'Legal Agreement'} • {documentData.sections?.length || 0} Sections • 100% Traceable
            </p>
          </div>
        </div>

        {/* Specialized Legal Workflow Action Links */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onNavigate('timeline', documentId)}
            variant="navy"
            size="sm"
            icon={<Clock className="w-3.5 h-3.5 text-brand-gold" />}
            title="View Chronological Document Timeline"
          >
            <span className="hidden sm:inline">Timeline</span>
          </Button>

          <Button
            onClick={() => onNavigate('lawyer-prep', documentId)}
            variant="navy"
            size="sm"
            icon={<Briefcase className="w-3.5 h-3.5 text-brand-gold" />}
            title="Generate Consultation Brief for Lawyer"
          >
            <span className="hidden sm:inline">Lawyer Prep</span>
          </Button>

          <Button
            onClick={() => onNavigate('action-brief', documentId)}
            variant="primary-gold"
            size="sm"
            icon={<CheckSquare className="w-3.5 h-3.5" />}
          >
            <span>Action Brief</span>
          </Button>

          <button
            onClick={handleReanalyze}
            disabled={reanalyzing}
            className="p-2 rounded-lg bg-brand-navy-dark hover:bg-brand-navy border border-brand-gold/20 text-brand-sand hover:text-brand-gold transition-colors"
            title="Re-run AI Analysis"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${reanalyzing ? 'animate-spin text-brand-gold' : ''}`} />
          </button>
        </div>
      </div>

      {/* Split-Screen Analysis Workspace (60% doc / 40% insights on desktop) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 min-h-0 overflow-hidden bg-brand-midnight/60">
        {/* Left: Document Clauses Viewer (7 cols = ~58%) */}
        <div className="lg:col-span-7 h-full min-h-0">
          <DocumentViewer
            title={documentData.title}
            sections={documentData.sections || []}
            highlightedClauseId={highlightedClauseId}
            onSelectClause={handleSelectClause}
            onOpenClauseDrawer={handleOpenClauseDrawer}
          />
        </div>

        {/* Right: Tabbed Insights Panel (5 cols = ~42%) */}
        <div className="lg:col-span-5 h-full min-h-0">
          <InsightsPanel
            analysis={analysis}
            onSelectClauseId={handleSelectClauseId}
            activeClauseId={highlightedClauseId}
          />
        </div>
      </div>

      {/* Detailed Clause Inspection Drawer */}
      <ClauseDetailDrawer
        clause={selectedDrawerClause}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onAskLexi={(_query) => {
          onNavigate('ask');
        }}
      />

      {/* Docked Grounded Q&A ("Ask Lexi") */}
      <AskLexiDock documentId={documentId} onSelectClauseId={handleSelectClauseId} />
    </div>
  );
};
