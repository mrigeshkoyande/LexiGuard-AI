import React from 'react';
import { X, MessageSquare, Sparkles, ShieldCheck, Clock } from 'lucide-react';
import { DocumentClause } from '@lexiguard/shared';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface ClauseDetailDrawerProps {
  clause: DocumentClause | null;
  isOpen: boolean;
  onClose: () => void;
  onAskLexi: (query: string) => void;
}

export const ClauseDetailDrawer: React.FC<ClauseDetailDrawerProps> = ({
  clause,
  isOpen,
  onClose,
  onAskLexi
}) => {
  if (!isOpen || !clause) return null;

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="clause-drawer-title"
      className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-brand-midnight-card border-l border-brand-gold/30 shadow-2xl backdrop-blur-2xl flex flex-col animate-in slide-in-from-right duration-300"
    >
      {/* Drawer Header */}
      <div className="p-5 border-b border-brand-gold/20 bg-brand-navy-dark flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="gold">Clause § {clause.number}</Badge>
          <span className="text-xs text-brand-sand font-mono">Page {clause.page || 1}</span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close clause details"
          className="p-1.5 rounded-lg text-brand-sand hover:text-white hover:bg-brand-midnight transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-brand-sand">
        {/* Title */}
        <div>
          <span className="text-[10px] uppercase font-bold text-brand-gold tracking-widest block mb-1">Provision Title</span>
          <h3 id="clause-drawer-title" className="font-headline text-2xl text-brand-warmwhite font-light">{clause.title}</h3>
        </div>

        {/* Original Legal Clause Text */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold text-brand-sand/60 tracking-wider block">Verbatim Contract Clause</span>
          <div className="p-4 rounded-xl bg-brand-midnight border border-brand-gold/20 font-serif text-brand-warmwhite/90 leading-relaxed whitespace-pre-wrap">
            {clause.text}
          </div>
        </div>

        {/* Key Dimensions Analysis Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-brand-navy-dark border border-brand-gold/20 space-y-1">
            <span className="text-[10px] uppercase font-bold text-brand-gold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Enforceability
            </span>
            <p className="text-[11px] text-brand-warmwhite">Subject to governing jurisdiction terms</p>
          </div>

          <div className="p-3.5 rounded-xl bg-brand-navy-dark border border-brand-gold/20 space-y-1">
            <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Time Criticality
            </span>
            <p className="text-[11px] text-brand-warmwhite">Notice milestone requirements apply</p>
          </div>
        </div>

        {/* Questions to Consider */}
        <div className="space-y-2 p-4 rounded-xl bg-brand-midnight border border-brand-gold/20">
          <span className="text-[10px] uppercase font-bold text-brand-gold tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Strategic Questions to Consider
          </span>
          <ul className="space-y-1.5 pl-4 list-disc text-brand-sand/80 text-[11px]">
            <li>Does this provision align with your commercial agreement expectations?</li>
            <li>Are notice delivery requirements clearly specified with timelines?</li>
            <li>Should this clause be flagged for lawyer consultation before signing?</li>
          </ul>
        </div>
      </div>

      {/* Drawer Action Footer */}
      <div className="p-4 border-t border-brand-gold/20 bg-brand-navy-dark flex items-center justify-between gap-3">
        <Button
          onClick={() => {
            onAskLexi(`Explain Clause ${clause.number} (${clause.title}) and what obligations it imposes.`);
            onClose();
          }}
          variant="primary-gold"
          size="sm"
          icon={<MessageSquare className="w-3.5 h-3.5" />}
          className="flex-1"
        >
          Ask Lexi About Clause
        </Button>
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
        >
          Close
        </Button>
      </div>
    </div>
  );
};
