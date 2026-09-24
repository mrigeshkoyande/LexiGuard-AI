import React from 'react';

interface EditorialCardProps {
  children: React.ReactNode;
  variant?: 'midnight' | 'navy' | 'cream';
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const EditorialCard: React.FC<EditorialCardProps> = ({
  children,
  variant = 'midnight',
  className = '',
  onClick,
  hoverable = false
}) => {
  const variantStyles = {
    midnight: 'bg-brand-midnight-card/85 text-brand-warmwhite border border-brand-gold/20 shadow-navy-deep backdrop-blur-md',
    navy: 'bg-brand-navy-light/80 text-brand-warmwhite border border-brand-gold/30 shadow-lg backdrop-blur-md',
    cream: 'bg-brand-cream text-brand-midnight border border-brand-gold/30 shadow-md'
  };

  const hoverStyles = hoverable
    ? 'hover:border-brand-gold/60 hover:shadow-gold-subtle transition-all duration-300 cursor-pointer hover:-translate-y-0.5'
    : '';

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`rounded-xl p-6 relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold ${variantStyles[variant]} ${hoverStyles} ${className}`}
    >
      {children}
    </div>
  );
};
