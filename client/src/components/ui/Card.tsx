import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  glow = false,
  onClick,
}) => {
  return (
    <div
      className={`
        glass-card p-6
        ${hover ? 'hover:border-border-hover hover:shadow-glow-sm hover:-translate-y-0.5' : ''}
        ${glow ? 'animate-pulse-glow' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
