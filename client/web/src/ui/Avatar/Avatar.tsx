import React from 'react';
import { cn } from '../utils/cn';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  online?: boolean;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, size = 'md', fallback, online, ...props }, ref) => {
    const sizes = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
      xl: 'w-16 h-16 text-lg'
    };

    const getInitials = (name?: string) => {
      if (!name) return '?';
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    return (
      <div
        className={cn(
          'relative inline-flex items-center justify-center rounded-full bg-[#2d2d2d] text-white font-medium overflow-hidden',
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || 'Avatar'}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : (
          <span className="select-none">
            {getInitials(fallback)}
          </span>
        )}
        
        {online && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#46d369] border-2 border-black rounded-full"></div>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export default Avatar;
