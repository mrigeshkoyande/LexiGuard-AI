import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { LEGAL_DISCLAIMER } from '@lexiguard/shared';

interface DisclaimerBannerProps {
  compact?: boolean;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="bg-amber-950/40 border-b border-amber-500/20 px-4 py-1.5 flex items-center justify-center gap-2 text-xs text-amber-200/90 font-medium">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>
          <strong>Informational Only:</strong> {LEGAL_DISCLAIMER}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-4 my-4 shadow-lg backdrop-blur-sm flex items-start gap-3.5">
      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5 border border-amber-500/20">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-amber-300">Important Legal Disclaimer</h4>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Non-Lawyer Informational Tool
          </span>
        </div>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          {LEGAL_DISCLAIMER} Every insight is traceable to specific document clauses, but should not be relied upon as binding legal counsel. Always consult a qualified attorney for situation-specific contract negotiation.
        </p>
      </div>
    </div>
  );
};
