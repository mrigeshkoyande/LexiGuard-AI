import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary-gold' | 'outline-gold' | 'navy' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary-gold',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed select-none focus:outline-none focus:ring-2 focus:ring-brand-gold/50';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-xs uppercase tracking-wider font-semibold px-5 py-2.5 gap-2',
    lg: 'text-sm uppercase tracking-widest font-bold px-7 py-3.5 gap-2.5'
  };

  const variantStyles = {
    'primary-gold': 'bg-brand-gold text-brand-midnight hover:bg-brand-gold-light active:bg-brand-gold-dark shadow-md shadow-brand-gold/15',
    'outline-gold': 'border border-brand-gold/40 text-brand-warmwhite hover:bg-brand-gold/10 hover:border-brand-gold active:bg-brand-gold/20',
    'navy': 'bg-brand-navy-light text-brand-warmwhite hover:bg-brand-navy active:bg-brand-midnight border border-brand-gold/20',
    'ghost': 'text-brand-sand hover:text-brand-warmwhite hover:bg-brand-navy-light/40',
    'danger': 'bg-rose-900/40 border border-rose-500/40 text-rose-300 hover:bg-rose-900/60'
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
    </button>
  );
};
