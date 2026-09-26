import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Printer,
  FileCheck2,
  Filter,
  CheckCircle2,
  Circle,
  Loader2,
  Briefcase
} from 'lucide-react';
import { ActionBrief, ActionItemRecord } from '@lexiguard/shared';
import { api } from '../services/api';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

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
    } catch (err: unknown) {
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
        <div className="text-center text-xs text-brand-sand space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-gold" />
          <p className="font-headline text-lg text-brand-warmwhite font-light">Generating Action Brief checklist...</p>
        </div>
      </div>
    );
  }

  if (!brief) {
    return (
      <div className="p-12 text-center text-xs text-brand-sand space-y-3 max-w-md mx-auto">
        <p>Action brief could not be loaded.</p>
        <Button onClick={() => onNavigate('dashboard')} variant="primary-gold" size="sm">
          Return to Dashboard
        </Button>
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
            className="p-2 rounded-xl bg-brand-navy-dark hover:bg-brand-navy text-brand-sand hover:text-white border border-brand-gold/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline text-2xl sm:text-3xl font-light text-brand-warmwhite tracking-tight">Pre-Signing Action Brief</h1>
              <Badge variant="gold">Interactive Checklist</Badge>
            </div>
            <p className="text-xs text-brand-sand/80 mt-0.5">{brief.documentTitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => onNavigate('lawyer-prep', documentId)}
            variant="navy"
            size="sm"
            icon={<Briefcase className="w-4 h-4 text-brand-gold" />}
          >
            <span>Lawyer Prep</span>
          </Button>

          <Button
            onClick={handlePrint}
            variant="outline-gold"
            size="sm"
            icon={<Printer className="w-4 h-4" />}
          >
            <span>Print Checklist</span>
          </Button>
        </div>
      </div>

      {/* Progress & Summary Banner */}
      <div className="p-6 rounded-2xl bg-brand-navy-dark border border-brand-gold/30 shadow-navy-deep flex flex-col sm:flex-row sm:items-center justify-between gap-6 print-card">
        <div className="space-y-2">
          <Badge variant="gold">Readiness Progress</Badge>
          <h2 className="font-headline text-xl font-light text-brand-warmwhite">{brief.summary}</h2>
          <p className="text-xs text-brand-sand/80 max-w-md">
            Check off items as you verify operational terms, confirm notice windows, and align with legal counsel.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="sm:w-56 space-y-2 shrink-0">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-brand-sand/70">Completion</span>
            <span className="font-bold text-brand-gold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-brand-midnight rounded-full overflow-hidden border border-brand-gold/20">
            <div
              className="h-full bg-brand-gold transition-all duration-500 shadow-gold-glow"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <DisclaimerBanner />

      {/* Filter Tabs (no print) */}
      <div className="flex items-center gap-2 no-print">
        <span className="text-xs text-brand-sand flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-brand-gold" />
          <span>Priority Filter:</span>
        </span>
        {['ALL', 'High', 'Medium', 'Low'].map((p) => (
          <button
            key={p}
            onClick={() => setSelectedPriority(p)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedPriority === p
                ? 'bg-brand-gold text-brand-midnight font-bold shadow-sm'
                : 'bg-brand-midnight text-brand-sand hover:text-white border border-brand-gold/20'
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
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-gold pb-2 border-b border-brand-gold/20 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-brand-gold" />
                <span>{cat}</span>
                <span className="text-[10px] text-brand-sand/60 font-mono">
                  ({categoryItems.filter((i) => i.isCompleted).length}/{categoryItems.length})
                </span>
              </h3>

              <div className="space-y-2.5">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggle(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleToggle(item);
                      }
                    }}
                    className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3.5 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold ${
                      item.isCompleted
                        ? 'bg-brand-midnight/40 border-brand-gold/10 opacity-60'
                        : 'bg-brand-midnight-card border-brand-gold/20 hover:border-brand-gold hover:bg-brand-navy-dark/60 shadow-md'
                    }`}
                  >
                    <div className="pt-0.5 text-brand-gold shrink-0">
                      {item.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-brand-sand/50 hover:text-brand-gold transition-colors" />
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4
                          className={`text-xs font-semibold ${
                            item.isCompleted ? 'line-through text-brand-sand/50' : 'text-brand-warmwhite'
                          }`}
                        >
                          {item.title}
                        </h4>

                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                            item.priority === 'High'
                              ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                              : item.priority === 'Medium'
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                              : 'bg-brand-navy text-brand-sand border-brand-gold/20'
                          }`}
                        >
                          {item.priority} Priority
                        </span>
                      </div>

                      <p className="text-xs text-brand-sand/80 leading-relaxed font-sans font-normal">
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
