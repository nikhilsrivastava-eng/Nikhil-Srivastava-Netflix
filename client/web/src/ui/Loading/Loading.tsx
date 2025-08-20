import React from 'react';
import { cn } from '../utils/cn';

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
  text?: string;
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ className, size = 'md', variant = 'spinner', text, ...props }, ref) => {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-8 h-8',
      lg: 'w-12 h-12'
    };

    const renderSpinner = () => (
      <svg
        className={cn('animate-spin text-[#e50914]', sizes[size])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    );

    const renderDots = () => (
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              'bg-[#e50914] rounded-full animate-pulse',
              size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'
            )}
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1.4s'
            }}
          ></div>
        ))}
      </div>
    );

    const renderPulse = () => (
      <div
        className={cn(
          'bg-[#e50914] rounded-full animate-pulse',
          sizes[size]
        )}
      ></div>
    );

    const renderVariant = () => {
      switch (variant) {
        case 'dots':
          return renderDots();
        case 'pulse':
          return renderPulse();
        default:
          return renderSpinner();
      }
    };

    return (
      <div
        className={cn('flex flex-col items-center justify-center space-y-2', className)}
        ref={ref}
        {...props}
      >
        {renderVariant()}
        {text && (
          <p className="text-sm text-[#b3b3b3] animate-pulse">{text}</p>
        )}
      </div>
    );
  }
);

Loading.displayName = 'Loading';

export default Loading;
