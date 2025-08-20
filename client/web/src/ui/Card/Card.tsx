import React from 'react';
import { cn } from '../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'movie';
  hover?: boolean;
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, children, ...props }, ref) => {
    const baseClasses = 'rounded-lg overflow-hidden transition-all duration-300';
    
    const variants = {
      default: 'bg-[#141414] border border-[#2d2d2d]',
      elevated: 'bg-[#1a1a1a] shadow-lg',
      movie: 'bg-transparent group cursor-pointer'
    };

    const hoverEffects = hover ? 'hover:scale-105 hover:shadow-2xl hover:shadow-black/50' : '';

    return (
      <div
        className={cn(
          baseClasses,
          variants[variant],
          hover && hoverEffects,
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
