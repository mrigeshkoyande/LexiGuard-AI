import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { LEGAL_DISCLAIMER } from '@lexiguard/shared';

interface DisclaimerBannerProps {
  compact?: boolean;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="bg-brand-navy-dark/95 border-b border-brand-gold/25 px-4 py-1.5 flex items-center justify-center gap-2 text-xs text-brand-gold-light font-medium">
        <AlertTriangle className="w-3.5 h-3.5 text-brand-gold shrink-0" />
        <span>
          <strong className="text-brand-warmwhite">Informational Only:</strong> {LEGAL_DISCLAIMER}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-brand-midnight-card/95 border border-brand-gold/40 rounded-xl p-4 my-4 shadow-lg backdrop-blur-md flex items-start gap-3.5">
      <div className="p-2 rounded-lg bg-brand-gold/15 text-brand-gold shrink-0 mt-0.5 border border-brand-gold/30">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-brand-gold-light">Important Legal Disclaimer</h4>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-gold/20 text-brand-gold border border-brand-gold/30">
            Informational Analysis
          </span>
        </div>
        <p className="text-xs text-brand-sand/90 mt-1 leading-relaxed">
          {LEGAL_DISCLAIMER} Every insight is traceable to specific document clauses, but should not be relied upon as binding legal counsel. Always consult a qualified attorney for legal guidance.
        </p>
      </div>
    </div>
  );
};
