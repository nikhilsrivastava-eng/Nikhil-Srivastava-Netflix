import React from 'react';
import { cn } from '../utils/cn';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, indeterminate = false, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex items-start space-x-3">
        <div className="relative flex items-center">
          <input
            id={checkboxId}
            type="checkbox"
            ref={ref}
            className={cn(
              'w-5 h-5 bg-[#2d2d2d] border-2 border-[#565656] rounded',
              'focus:outline-none focus:ring-2 focus:ring-[#e50914] focus:ring-offset-0',
              'checked:bg-[#e50914] checked:border-[#e50914]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-all duration-200',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
          {(props.checked || indeterminate) && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {indeterminate ? (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 10a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          )}
        </div>
        
        {label && (
          <div className="flex-1">
            <label htmlFor={checkboxId} className="text-sm text-white cursor-pointer">
              {label}
            </label>
            {error && (
              <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
