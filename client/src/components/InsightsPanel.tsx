import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  Clock,
  DollarSign,
  ShieldAlert,
  FileCheck2,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Info
} from 'lucide-react';
import { AnalysisResult, FindingItem, Severity } from '@lexiguard/shared';

interface InsightsPanelProps {
  analysis: AnalysisResult | null;
  onSelectClauseId: (clauseId: string) => void;
  activeClauseId?: string | null;
}

type TabKey =
  | 'overview'
  | 'importantClauses'
  | 'obligations'
  | 'deadlines'
  | 'potentialConcerns'
  | 'monetaryTerms'
  | 'terminationTerms'
  | 'renewalTerms';

export const InsightsPanel: React.FC<InsightsPanelProps> = ({
  analysis,
  onSelectClauseId,
  activeClauseId
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-900/60 border border-slate-800 rounded-2xl">
        <Sparkles className="w-8 h-8 text-cyan-400 mb-3 animate-pulse" />
        <p className="text-sm font-medium text-slate-300">Awaiting document analysis...</p>
      </div>
    );
  }

  const tabs: { key: TabKey; label: string; icon: React.FC<{ className?: string }>; count?: number }[] = [
    { key: 'overview', label: 'Overview', icon: FileCheck2 },
    { key: 'importantClauses', label: 'Important', icon: Sparkles, count: analysis.importantClauses.length },
    { key: 'obligations', label: 'Obligations', icon: CheckCircle2, count: analysis.obligations.length },
    { key: 'deadlines', label: 'Deadlines', icon: Clock, count: analysis.deadlines.length },
    { key: 'potentialConcerns', label: 'Risks & Concerns', icon: ShieldAlert, count: analysis.potentialConcerns.length },
    { key: 'monetaryTerms', label: 'Financials', icon: DollarSign, count: analysis.monetaryTerms.length },
    { key: 'terminationTerms', label: 'Termination', icon: AlertTriangle, count: analysis.terminationTerms.length },
    { key: 'renewalTerms', label: 'Renewal', icon: RefreshCw, count: analysis.renewalTerms.length }
  ];

  const getFindingsForTab = (): FindingItem[] => {
    switch (activeTab) {
      case 'importantClauses':
        return analysis.importantClauses;
      case 'obligations':
        return analysis.obligations;
      case 'deadlines':
        return analysis.deadlines;
      case 'potentialConcerns':
        return analysis.potentialConcerns;
      case 'monetaryTerms':
        return analysis.monetaryTerms;
      case 'terminationTerms':
        return analysis.terminationTerms;
      case 'renewalTerms':
        return analysis.renewalTerms;
      default:
        return [];
    }
  };

  const findings = getFindingsForTab();

  const getSeverityBadge = (sev: Severity) => {
    switch (sev) {
      case 'Important':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30">
            Important
          </span>
        );
      case 'Review':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
            Review
          </span>
        );
      case 'Informational':
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            Informational
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 p-2 bg-slate-950/80 border-b border-slate-800 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-750'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && tab.count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {activeTab === 'overview' ? (
          <div className="space-y-6">
            {/* Document Type Header Card */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-850 border border-slate-800 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Detected Agreement Type
                </span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {analysis.documentType}
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed font-sans">
                {analysis.summary}
              </p>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div
                onClick={() => setActiveTab('potentialConcerns')}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-rose-400 mb-1">
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold">
                    {analysis.potentialConcerns.length}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-300">Risks / Concerns</p>
              </div>

              <div
                onClick={() => setActiveTab('obligations')}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-blue-400 mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold">{analysis.obligations.length}</span>
                </div>
                <p className="text-[11px] font-medium text-slate-300">Obligations</p>
              </div>

              <div
                onClick={() => setActiveTab('deadlines')}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-amber-400 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold">{analysis.deadlines.length}</span>
                </div>
                <p className="text-[11px] font-medium text-slate-300">Deadlines</p>
              </div>

              <div
                onClick={() => setActiveTab('monetaryTerms')}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-emerald-400 mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold">
                    {analysis.monetaryTerms.length}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-300">Financials</p>
              </div>
            </div>

            {/* Missing Information / Omissions Alert */}
            {analysis.missingInformation && analysis.missingInformation.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-slate-300">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    Information to Clarify or Missing Provisions
                  </h4>
                </div>
                <ul className="space-y-1.5 pl-6 list-disc text-xs text-slate-400">
                  {analysis.missingInformation.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          /* Findings List */
          <div className="space-y-3">
            {findings.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No specific findings recorded in this category.
              </div>
            ) : (
              findings.map((item) => {
                const isSelected = activeClauseId === item.sourceClauseId;

                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectClauseId(item.sourceClauseId)}
                    className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-850 border-cyan-400/80 shadow-md ring-1 ring-cyan-500/30'
                        : 'bg-slate-950/50 border-slate-850 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    {/* Header: Severity + Source Button */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {getSeverityBadge(item.severity)}
                        <h4 className="text-xs font-semibold text-white truncate max-w-[240px]">
                          {item.title}
                        </h4>
                      </div>

                      {/* Source-linking jump tag */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectClauseId(item.sourceClauseId);
                        }}
                        className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
                      >
                        <span>View Source Clause</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Explanation */}
                    <p className="text-xs text-slate-300 leading-relaxed font-sans mb-3">
                      {item.explanation}
                    </p>

                    {/* Why It Matters Callout */}
                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
                      <span className="text-cyan-400 font-bold shrink-0">Why it matters:</span>
                      <span className="text-slate-300 leading-normal">{item.whyItMatters}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
