import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-12 rounded-2xl bg-brand-midnight-card/80 border border-brand-gold/20 space-y-4 max-w-md mx-auto ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 border border-brand-gold/30 text-brand-gold flex items-center justify-center shadow-lg shadow-brand-gold/5">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="font-headline text-2xl text-brand-warmwhite font-light">{title}</h3>
        <p className="text-xs text-brand-sand/80 leading-relaxed">{description}</p>
      </div>
      {actionText && onAction && (
        <div className="pt-2">
          <Button onClick={onAction} variant="primary-gold" size="md">
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};
