import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'indigo' | 'violet' | 'cyan' | 'emerald' | 'amber' | 'rose';
  size?: 'sm' | 'md';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}) => {
  const variants: Record<string, string> = {
    default: 'bg-bg-tertiary text-text-secondary border-border-default',
    indigo: 'bg-accent-indigo/15 text-accent-indigo border-accent-indigo/30',
    violet: 'bg-accent-violet/15 text-accent-violet border-accent-violet/30',
    cyan: 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan/30',
    emerald: 'bg-accent-emerald/15 text-accent-emerald border-accent-emerald/30',
    amber: 'bg-accent-amber/15 text-accent-amber border-accent-amber/30',
    rose: 'bg-accent-rose/15 text-accent-rose border-accent-rose/30',
  };

  const sizes: Record<string, string> = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full border
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
