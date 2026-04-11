import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-text-secondary mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            w-full bg-bg-tertiary border border-border-default rounded-xl
            px-4 py-2.5 text-text-primary placeholder-text-muted
            focus:outline-none focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo/30
            transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-accent-rose focus:border-accent-rose focus:ring-accent-rose/30' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-accent-rose">{error}</p>
      )}
    </div>
  );
};

export default Input;
