import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  hover?: boolean;
}

export function Card({ children, className = '', gradient, hover = true }: CardProps) {
  const baseClasses = `rounded-2xl p-6 transition-all duration-200 w-full min-w-0 flex flex-col items-center ${
    hover ? 'hover:shadow-lg hover:scale-[1.02]' : ''
  }`;

  const backgroundClasses = gradient
    ? `bg-gradient-to-br ${gradient}`
    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700';

  return (
    <div className={`${baseClasses} ${backgroundClasses} ${className}`}>
      {children}
    </div>
  );
}
