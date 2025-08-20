import React from 'react';
import { cn } from '../utils/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, resize = 'vertical', id, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize'
    };

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-white mb-2">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            'w-full px-4 py-3 bg-[#2d2d2d] border border-[#565656] text-white placeholder-[#808080] rounded-md',
            'focus:outline-none focus:ring-2 focus:ring-[#e50914] focus:border-[#e50914] focus:bg-[#404040]',
            'transition-all duration-200 min-h-[100px]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            resizeClasses[resize],
            error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-[#b3b3b3]">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
