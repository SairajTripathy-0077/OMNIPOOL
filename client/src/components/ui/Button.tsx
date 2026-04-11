import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center font-medium rounded-xl
    transition-all duration-300 ease-out cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary
  `;

  const variants: Record<string, string> = {
    primary: `
      bg-gradient-to-r from-accent-indigo to-accent-violet text-white
      hover:shadow-glow-md hover:scale-[1.02] active:scale-[0.98]
      focus:ring-accent-indigo
    `,
    secondary: `
      bg-bg-tertiary text-text-primary border border-border-default
      hover:border-border-hover hover:bg-bg-card
      focus:ring-accent-violet
    `,
    ghost: `
      bg-transparent text-text-secondary
      hover:text-text-primary hover:bg-bg-glass
      focus:ring-accent-cyan
    `,
    danger: `
      bg-accent-rose/10 text-accent-rose border border-accent-rose/30
      hover:bg-accent-rose/20 hover:border-accent-rose/50
      focus:ring-accent-rose
    `,
  };

  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
