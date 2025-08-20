import React from 'react';
import { cn } from '../utils/cn';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

const Radio: React.FC<RadioProps> = ({
  name,
  options,
  value,
  onChange,
  label,
  error,
  direction = 'vertical',
  className
}) => {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-white mb-3">
          {label}
        </label>
      )}
      
      <div className={cn(
        'space-y-3',
        direction === 'horizontal' && 'flex space-x-6 space-y-0'
      )}>
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-3">
            <div className="relative flex items-center">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => !option.disabled && onChange(option.value)}
                disabled={option.disabled}
                className={cn(
                  'w-5 h-5 bg-[#2d2d2d] border-2 border-[#565656] rounded-full',
                  'focus:outline-none focus:ring-2 focus:ring-[#e50914] focus:ring-offset-0',
                  'checked:bg-[#e50914] checked:border-[#e50914]',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'transition-all duration-200',
                  error && 'border-red-500 focus:ring-red-500'
                )}
              />
              {value === option.value && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
            
            <label
              className={cn(
                'text-sm text-white cursor-pointer',
                option.disabled && 'opacity-50 cursor-not-allowed'
              )}
              onClick={() => !option.disabled && onChange(option.value)}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Radio;
