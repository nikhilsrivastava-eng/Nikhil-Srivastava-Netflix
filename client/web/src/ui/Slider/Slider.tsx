import React from 'react';
import { cn } from '../utils/cn';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (value: number) => void;
  showValue?: boolean;
  error?: string;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, min = 0, max = 100, step = 1, value = 0, onChange, showValue = false, error, id, ...props }, ref) => {
    const sliderId = id || `slider-${Math.random().toString(36).substr(2, 9)}`;
    const percentage = ((value - min) / (max - min)) * 100;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value);
      onChange?.(newValue);
    };

    return (
      <div className={cn('w-full', className)}>
        {label && (
          <div className="flex justify-between items-center mb-2">
            <label htmlFor={sliderId} className="text-sm font-medium text-white">
              {label}
            </label>
            {showValue && (
              <span className="text-sm text-[#b3b3b3]">{value}</span>
            )}
          </div>
        )}
        
        <div className="relative">
          <input
            id={sliderId}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleChange}
            ref={ref}
            className={cn(
              'w-full h-2 bg-[#2d2d2d] rounded-lg appearance-none cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-[#e50914] focus:ring-offset-2 focus:ring-offset-black',
              'slider-thumb:appearance-none slider-thumb:w-5 slider-thumb:h-5 slider-thumb:rounded-full',
              'slider-thumb:bg-[#e50914] slider-thumb:cursor-pointer slider-thumb:border-2 slider-thumb:border-white',
              'slider-thumb:shadow-lg slider-thumb:transition-all slider-thumb:duration-200',
              'slider-thumb:hover:scale-110',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'focus:ring-red-500'
            )}
            style={{
              background: `linear-gradient(to right, #e50914 0%, #e50914 ${percentage}%, #2d2d2d ${percentage}%, #2d2d2d 100%)`
            }}
            {...props}
          />
        </div>
        
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Slider.displayName = 'Slider';

export default Slider;
