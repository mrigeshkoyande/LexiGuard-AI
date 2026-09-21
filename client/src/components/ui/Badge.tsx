import React from 'react';

export type SeverityType = 'Informational' | 'Review' | 'Important';
export type StatusType = 'PENDING' | 'PROCESSING' | 'ANALYZED' | 'ERROR' | 'NEEDS_REVIEW' | 'COMPLETED';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'severity' | 'status' | 'gold' | 'neutral';
  severity?: SeverityType;
  status?: StatusType;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  severity,
  status,
  className = '',
  size = 'sm'
}) => {
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  let colorClasses = 'bg-brand-navy-light text-brand-sand border border-brand-gold/20';

  if (variant === 'severity' && severity) {
    if (severity === 'Important') {
      colorClasses = 'bg-rose-500/10 text-rose-300 border border-rose-500/30';
    } else if (severity === 'Review') {
      colorClasses = 'bg-amber-500/15 text-amber-300 border border-amber-500/35';
    } else {
      colorClasses = 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30';
    }
  } else if (variant === 'status' && status) {
    if (status === 'ANALYZED' || status === 'COMPLETED') {
      colorClasses = 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30';
    } else if (status === 'PROCESSING' || status === 'PENDING') {
      colorClasses = 'bg-amber-500/10 text-amber-300 border border-amber-500/30';
    } else if (status === 'ERROR') {
      colorClasses = 'bg-rose-500/10 text-rose-300 border border-rose-500/30';
    } else {
      colorClasses = 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30';
    }
  } else if (variant === 'gold') {
    colorClasses = 'bg-brand-gold/15 text-brand-gold-light border border-brand-gold/30';
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold uppercase tracking-wider rounded ${sizeClasses} ${colorClasses} ${className}`}
    >
      {children}
    </span>
  );
};
