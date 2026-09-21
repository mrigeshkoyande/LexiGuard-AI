import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckSquare,
  RefreshCw
} from 'lucide-react';
import { AnalysisResult, DocumentClause } from '@lexiguard/shared';
import { api } from '../services/api';
import { DocumentViewer } from '../components/DocumentViewer';
import { InsightsPanel } from '../components/InsightsPanel';
import { AskLexiDock } from '../components/AskLexiDock';

interface WorkspacePageProps {
  documentId: string;
  onNavigate: (view: string, docId?: string) => void;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({ documentId, onNavigate }) => {
  const [documentData, setDocumentData] = useState<any>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [highlightedClauseId, setHighlightedClauseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reanalyzing, setReanalyzing] = useState(false);

  useEffect(() => {
    async function loadDocument() {
      try {
        setLoading(true);
        const res = await api.getDocument(documentId);
        setDocumentData(res.document);

        if (res.document.analysis) {
          // Parse findings into structured AnalysisResult shape
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center text-xs text-slate-400 space-y-3">
          <RefreshCw className="w-7 h-7 animate-spin mx-auto text-cyan-400" />
          <p>Loading document and grounding analysis...</p>
        </div>
      </div>
    );
  }

  if (!documentData) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 space-y-3">
        <p>Document not found or inaccessible.</p>
        <button
          onClick={() => onNavigate('dashboard')}
          className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      {/* Workspace Top Toolbar */}
      <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-white truncate max-w-md">
              {documentData.title}
            </h1>
            <p className="text-[11px] text-slate-400">
              {documentData.originalFilename} • {documentData.sections?.length || 0} Sections
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReanalyze}
            disabled={reanalyzing}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 text-xs font-medium border border-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${reanalyzing ? 'animate-spin text-cyan-400' : ''}`} />
            <span className="hidden sm:inline">Re-analyze</span>
          </button>

          <button
            onClick={() => onNavigate('action-brief', documentId)}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/30 flex items-center gap-1.5 transition-all"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Action Brief</span>
          </button>
        </div>
      </div>

      {/* Split-Screen Analysis Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 min-h-0 overflow-hidden bg-slate-950/40">
        {/* Left: Document Clauses Viewer */}
        <div className="h-full min-h-0">
          <DocumentViewer
            title={documentData.title}
            sections={documentData.sections || []}
            highlightedClauseId={highlightedClauseId}
            onSelectClause={handleSelectClause}
          />
        </div>

        {/* Right: Tabbed Insights Panel */}
        <div className="h-full min-h-0">
          <InsightsPanel
            analysis={analysis}
            onSelectClauseId={handleSelectClauseId}
            activeClauseId={highlightedClauseId}
          />
        </div>
      </div>

      {/* Docked Grounded Q&A ("Ask Lexi") */}
      <AskLexiDock documentId={documentId} onSelectClauseId={handleSelectClauseId} />
    </div>
  );
};
