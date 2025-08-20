import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../utils/cn';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  placeholder = 'Select an option',
  onChange,
  disabled = false,
  className,
  label,
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-white mb-2">
          {label}
        </label>
      )}
      
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            'w-full px-4 py-3 bg-[#2d2d2d] border border-[#565656] text-white rounded-md',
            'focus:outline-none focus:ring-2 focus:ring-[#e50914] focus:border-[#e50914]',
            'transition-all duration-200 text-left flex items-center justify-between',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
            isOpen && 'ring-2 ring-[#e50914] border-[#e50914]'
          )}
        >
          <span className={cn(
            selectedOption ? 'text-white' : 'text-[#808080]'
          )}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={cn(
              'w-5 h-5 text-[#808080] transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-[#2d2d2d] border border-[#565656] rounded-md shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => !option.disabled && handleSelect(option.value)}
                disabled={option.disabled}
                className={cn(
                  'w-full px-4 py-3 text-left hover:bg-[#404040] transition-colors duration-150',
                  'focus:outline-none focus:bg-[#404040]',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  value === option.value && 'bg-[#e50914] hover:bg-[#b20710]',
                  value === option.value ? 'text-white' : 'text-[#b3b3b3]'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Dropdown;
