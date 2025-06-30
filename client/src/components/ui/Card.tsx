import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  blurred?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  padding = 'md',
  blurred = false,
  ...props
}) => {
  const baseClasses =
    'bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 relative';
  const hoverClasses = hover
    ? 'hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer'
    : '';
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(baseClasses, hoverClasses, paddings[padding], className, blurred && 'overflow-hidden')}
      {...props}
    >
      <div className={blurred ? 'blur-sm pointer-events-none select-none' : ''}>
        {children}
      </div>
      {blurred && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-neutral-900/70 z-10">
          <span className="text-lg font-semibold text-neutral-500 dark:text-neutral-400">Feature not available</span>
        </div>
      )}
    </div>
  );
};

export default Card;