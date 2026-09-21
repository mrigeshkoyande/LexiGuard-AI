import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Printer,
  FileCheck2,
  Filter,
  CheckCircle2,
  Circle,
  Loader2
} from 'lucide-react';
import { ActionBrief, ActionItemRecord } from '@lexiguard/shared';
import { api } from '../services/api';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

interface ActionBriefPageProps {
  documentId: string;
  onNavigate: (view: string, docId?: string) => void;
}

export const ActionBriefPage: React.FC<ActionBriefPageProps> = ({ documentId, onNavigate }) => {
  const [brief, setBrief] = useState<ActionBrief | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');

  useEffect(() => {
    async function loadBrief() {
      try {
        setLoading(true);
        const data = await api.getActionBrief(documentId);
        setBrief(data);
      } catch (err) {
        console.error('Failed to load action brief', err);
      } finally {
        setLoading(false);
      }
    }
    loadBrief();
  }, [documentId]);

  const handleToggle = async (item: ActionItemRecord) => {
    const nextState = !item.isCompleted;

    // Optimistic UI update
    setBrief((prev) => {
      if (!prev) return prev;
      const updated = prev.items.map((i) => (i.id === item.id ? { ...i, isCompleted: nextState } : i));
      const completedCount = updated.filter((i) => i.isCompleted).length;
      return {
        ...prev,
        items: updated,
        summary: `${completedCount} of ${updated.length} pre-signing action items completed.`
      };
    });

    try {
      await api.toggleActionItem(documentId, item.id, nextState);
    } catch (err: any) {
      console.error('Failed to update action item state', err);
      // Revert if error
      setBrief((prev) => {
        if (!prev) return prev;
        const reverted = prev.items.map((i) => (i.id === item.id ? { ...i, isCompleted: item.isCompleted } : i));
        return { ...prev, items: reverted };
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center text-xs text-slate-400 space-y-3">
          <Loader2 className="w-7 h-7 animate-spin mx-auto text-cyan-400" />
          <p>Generating Action Brief checklist...</p>
        </div>
      </div>
    );
  }

  if (!brief) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 space-y-3">
        <p>Action brief could not be loaded.</p>
        <button
          onClick={() => onNavigate('dashboard')}
          className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const completedCount = brief.items.filter((i) => i.isCompleted).length;
  const progressPercent = brief.items.length > 0 ? Math.round((completedCount / brief.items.length) * 100) : 0;

  const categories = [
    'Document Overview',
    'Important Obligations',
    'Important Dates',
    'Financial Terms',
    'Review Areas',
    'Questions to Consider',
    'Questions for a Lawyer'
  ];

  const filteredItems = brief.items.filter((item) => {
    if (selectedPriority === 'ALL') return true;
    return item.priority === selectedPriority;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('workspace', documentId)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">Pre-Signing Action Brief</h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold uppercase tracking-wider border border-cyan-500/30">
                Interactive Checklist
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{brief.documentTitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 text-xs font-semibold border border-slate-750 flex items-center gap-2 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>Print Checklist</span>
          </button>
        </div>
      </div>

      {/* Progress & Summary Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 print-card">
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Readiness Progress
          </span>
          <h2 className="text-lg font-bold text-white tracking-tight">{brief.summary}</h2>
          <p className="text-xs text-slate-400 max-w-md">
            Check off items as you verify operational terms, confirm notice windows, and align with your legal advisor.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="sm:w-56 space-y-2 shrink-0">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Completion</span>
            <span className="font-bold text-cyan-300">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Filter Tabs (no print) */}
      <div className="flex items-center gap-2 no-print">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Priority Filter:</span>
        </span>
        {['ALL', 'High', 'Medium', 'Low'].map((p) => (
          <button
            key={p}
            onClick={() => setSelectedPriority(p)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedPriority === p
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Categorized Checklist */}
      <div className="space-y-8">
        {categories.map((cat) => {
          const categoryItems = filteredItems.filter((i) => i.category === cat);
          if (categoryItems.length === 0) return null;

          return (
            <div key={cat} className="space-y-3 print-card">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-slate-800 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-cyan-400" />
                <span>{cat}</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  ({categoryItems.filter((i) => i.isCompleted).length}/{categoryItems.length})
                </span>
              </h3>

              <div className="space-y-2.5">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggle(item)}
                    className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3.5 select-none ${
                      item.isCompleted
                        ? 'bg-slate-950/40 border-slate-850 opacity-60'
                        : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 hover:border-slate-700 shadow-md'
                    }`}
                  >
                    <div className="pt-0.5 text-cyan-400 shrink-0">
                      {item.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500 hover:text-cyan-400 transition-colors" />
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4
                          className={`text-xs font-semibold ${
                            item.isCompleted ? 'line-through text-slate-400' : 'text-white'
                          }`}
                        >
                          {item.title}
                        </h4>

                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                            item.priority === 'High'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              : item.priority === 'Medium'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {item.priority} Priority
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-sans font-normal">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
