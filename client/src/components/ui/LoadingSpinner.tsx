import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', text }) => {
  const sizes: Record<string, string> = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        <div className={`${sizes[size]} rounded-full border-2 border-bg-tertiary`} />
        <div
          className={`${sizes[size]} rounded-full border-2 border-transparent border-t-accent-indigo border-r-accent-violet animate-spin absolute top-0 left-0`}
        />
      </div>
      {text && (
        <p className="text-sm text-text-secondary animate-pulse">{text}</p>
      )}
    </div>
  );
};

// Skeleton loader for content placeholders
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-shimmer rounded-lg ${className}`} />
);

export const SkeletonCard: React.FC = () => (
  <div className="glass-card p-6 space-y-4">
    <Skeleton className="h-5 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <div className="flex gap-2 pt-2">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-6 w-14 rounded-full" />
    </div>
  </div>
);

export default LoadingSpinner;
