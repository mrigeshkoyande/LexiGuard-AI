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
import { AnalysisResult, FindingItem } from '@lexiguard/shared';
import { Badge } from './ui/Badge';

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
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-brand-midnight-card border border-brand-gold/20 rounded-2xl">
        <Sparkles className="w-8 h-8 text-brand-gold mb-3 animate-pulse" />
        <p className="text-sm font-medium text-brand-sand">Awaiting document analysis...</p>
      </div>
    );
  }

  const tabs: { key: TabKey; label: string; icon: React.FC<{ className?: string }>; count?: number }[] = [
    { key: 'overview', label: 'Overview', icon: FileCheck2 },
    { key: 'importantClauses', label: 'Important', icon: Sparkles, count: analysis.importantClauses?.length || 0 },
    { key: 'obligations', label: 'Obligations', icon: CheckCircle2, count: analysis.obligations?.length || 0 },
    { key: 'deadlines', label: 'Dates', icon: Clock, count: analysis.deadlines?.length || 0 },
    { key: 'potentialConcerns', label: 'Review Areas', icon: ShieldAlert, count: analysis.potentialConcerns?.length || 0 },
    { key: 'monetaryTerms', label: 'Financial', icon: DollarSign, count: analysis.monetaryTerms?.length || 0 },
    { key: 'terminationTerms', label: 'Termination', icon: AlertTriangle, count: analysis.terminationTerms?.length || 0 },
    { key: 'renewalTerms', label: 'Renewal', icon: RefreshCw, count: analysis.renewalTerms?.length || 0 }
  ];

  const getFindingsForTab = (): FindingItem[] => {
    switch (activeTab) {
      case 'importantClauses':
        return analysis.importantClauses || [];
      case 'obligations':
        return analysis.obligations || [];
      case 'deadlines':
        return analysis.deadlines || [];
      case 'potentialConcerns':
        return analysis.potentialConcerns || [];
      case 'monetaryTerms':
        return analysis.monetaryTerms || [];
      case 'terminationTerms':
        return analysis.terminationTerms || [];
      case 'renewalTerms':
        return analysis.renewalTerms || [];
      default:
        return [];
    }
  };

  const findings = getFindingsForTab();

  return (
    <div className="flex flex-col h-full bg-brand-midnight-card/90 border border-brand-gold/25 rounded-2xl overflow-hidden shadow-navy-deep backdrop-blur-md">
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 p-2 bg-brand-navy-dark border-b border-brand-gold/20 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-gold text-brand-midnight font-bold shadow-sm'
                  : 'text-brand-sand hover:text-white hover:bg-brand-navy/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-midnight' : 'text-brand-gold'}`} />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && tab.count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive ? 'bg-brand-midnight/20 text-brand-midnight' : 'bg-brand-midnight text-brand-gold'
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
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-brand-midnight/30">
        {activeTab === 'overview' ? (
          <div className="space-y-6">
            {/* Document Type Header Card */}
            <div className="p-5 rounded-xl bg-brand-navy-dark/90 border border-brand-gold/30 relative overflow-hidden shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="gold">
                  Detected Agreement
                </Badge>
              </div>
              <h3 className="font-headline text-2xl text-brand-warmwhite font-light">
                {analysis.documentType}
              </h3>
              <p className="text-xs text-brand-sand/90 mt-2 leading-relaxed font-sans">
                {analysis.summary}
              </p>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div
                onClick={() => setActiveTab('potentialConcerns')}
                className="p-3 rounded-xl bg-brand-midnight-card border border-brand-gold/20 hover:border-brand-gold cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-rose-400 mb-1">
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold">
                    {analysis.potentialConcerns?.length || 0}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-brand-warmwhite">Review Areas</p>
              </div>

              <div
                onClick={() => setActiveTab('obligations')}
                className="p-3 rounded-xl bg-brand-midnight-card border border-brand-gold/20 hover:border-brand-gold cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-cyan-400 mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold">{analysis.obligations?.length || 0}</span>
                </div>
                <p className="text-[11px] font-medium text-brand-warmwhite">Obligations</p>
              </div>

              <div
                onClick={() => setActiveTab('deadlines')}
                className="p-3 rounded-xl bg-brand-midnight-card border border-brand-gold/20 hover:border-brand-gold cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-amber-400 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold">{analysis.deadlines?.length || 0}</span>
                </div>
                <p className="text-[11px] font-medium text-brand-warmwhite">Dates</p>
              </div>

              <div
                onClick={() => setActiveTab('monetaryTerms')}
                className="p-3 rounded-xl bg-brand-midnight-card border border-brand-gold/20 hover:border-brand-gold cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-emerald-400 mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold">
                    {analysis.monetaryTerms?.length || 0}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-brand-warmwhite">Financial</p>
              </div>
            </div>

            {/* Missing Information Callout */}
            {analysis.missingInformation && analysis.missingInformation.length > 0 && (
              <div className="p-4 rounded-xl bg-brand-midnight-card border border-brand-gold/20 space-y-2">
                <div className="flex items-center gap-2 text-brand-warmwhite">
                  <Info className="w-4 h-4 text-brand-gold shrink-0" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-gold">
                    Areas to Clarify or Missing Terms
                  </h4>
                </div>
                <ul className="space-y-1.5 pl-6 list-disc text-xs text-brand-sand/80">
                  {analysis.missingInformation.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          /* Findings Cards List */
          <div className="space-y-3">
            {findings.length === 0 ? (
              <div className="p-8 text-center text-xs text-brand-sand/70 bg-brand-midnight-card rounded-xl border border-brand-gold/20">
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
                        ? 'bg-brand-navy-dark border-brand-gold shadow-gold-glow ring-1 ring-brand-gold'
                        : 'bg-brand-midnight-card border-brand-gold/15 hover:border-brand-gold/40 hover:bg-brand-navy-dark/60'
                    }`}
                  >
                    {/* Header: Severity + Jump to Source button */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="severity" severity={item.severity}>
                          {item.severity}
                        </Badge>
                        <h4 className="text-xs font-semibold text-brand-warmwhite truncate max-w-[200px]">
                          {item.title}
                        </h4>
                      </div>

                      {/* Source-linking jump button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectClauseId(item.sourceClauseId);
                        }}
                        className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-brand-gold/15 hover:bg-brand-gold/25 text-brand-gold-light border border-brand-gold/30 transition-colors shrink-0"
                      >
                        <span>View Source</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Explanation */}
                    <p className="text-xs text-brand-sand/90 leading-relaxed font-sans mb-3">
                      {item.explanation}
                    </p>

                    {/* Why It Matters Callout */}
                    <div className="p-2.5 rounded-lg bg-brand-midnight border border-brand-gold/20 text-[11px] text-brand-sand flex items-start gap-2">
                      <span className="text-brand-gold font-bold shrink-0">Why it matters:</span>
                      <span className="text-brand-sand/90 leading-normal">{item.whyItMatters}</span>
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
