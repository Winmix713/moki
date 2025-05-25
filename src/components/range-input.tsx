import React, { useCallback, useMemo } from 'react';
import { Slider } from '@heroui/react';

interface RangeInputProps {
  /** Label text displayed above the slider */
  label: string;
  /** Current value of the slider */
  value: number;
  /** Callback function called when value changes */
  onChange: (value: number) => void;
  /** Minimum allowed value */
  min: number;
  /** Maximum allowed value */
  max: number;
  /** Step increment for the slider */
  step?: number;
  /** Unit symbol/text to display after the value */
  unit?: string;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show min/max labels */
  showMinMax?: boolean;
  /** Custom formatter for the value display */
  formatValue?: (value: number) => string;
  /** Color theme of the slider */
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  /** Size of the slider */
  size?: 'sm' | 'md' | 'lg';
  /** Description text shown below the slider */
  description?: string;
  /** Error message to display */
  error?: string;
  /** Whether the field is required */
  required?: boolean;
}

export const RangeInput: React.FC<RangeInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = '',
  disabled = false,
  className = '',
  showMinMax = false,
  formatValue,
  color = 'secondary',
  size = 'sm',
  description,
  error,
  required = false,
}) => {
  // Memoized value formatting
  const formattedValue = useMemo(() => {
    if (formatValue) {
      return formatValue(value);
    }
    return `${value}${unit}`;
  }, [value, unit, formatValue]);

  // Optimized onChange handler
  const handleChange = useCallback((newValue: number | number[]) => {
    const numericValue = Array.isArray(newValue) ? newValue[0] : newValue;
    onChange(numericValue);
  }, [onChange]);

  // Validate value is within bounds
  const isValidValue = useMemo(() => {
    return value >= min && value <= max;
  }, [value, min, max]);

  // Calculate percentage for visual feedback
  const percentage = useMemo(() => {
    return ((value - min) / (max - min)) * 100;
  }, [value, min, max]);

  return (
    <div className={`w-full ${className}`}>
      {/* Header with label and value */}
      <div className="flex justify-between items-center mb-2">
        <label className={`text-sm font-medium ${
          error ? 'text-red-400' : disabled ? 'text-gray-500' : 'text-gray-300'
        }`}>
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold px-2 py-1 rounded-md ${
            error 
              ? 'text-red-300 bg-red-900/20' 
              : disabled 
                ? 'text-gray-400 bg-gray-800/50'
                : 'text-purple-300 bg-purple-900/20'
          }`}>
            {formattedValue}
          </span>
          {!isValidValue && (
            <span className="text-xs text-red-400">!</span>
          )}
        </div>
      </div>

      {/* Progress indicator */}
      {!disabled && (
        <div className="mb-1">
          <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-200 ${
                error ? 'bg-red-500' : 'bg-purple-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Slider component */}
      <div className="relative">
        <Slider
          aria-label={label}
          value={value}
          onChange={handleChange}
          step={step}
          minValue={min}
          maxValue={max}
          color={error ? 'danger' : color}
          size={size}
          disabled={disabled}
          className="max-w-full"
          classNames={{
            base: "max-w-full",
            track: error ? "border-red-500/20" : undefined,
            thumb: error ? "border-red-500" : undefined,
          }}
        />
      </div>

      {/* Min/Max labels */}
      {showMinMax && (
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">{min}{unit}</span>
          <span className="text-xs text-gray-500">{max}{unit}</span>
        </div>
      )}

      {/* Description text */}
      {description && !error && (
        <p className="text-xs text-gray-400 mt-1">{description}</p>
      )}

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
          <span>⚠</span>
          {error}
        </p>
      )}

      {/* Accessibility info */}
      <div className="sr-only">
        Range slider for {label}, current value {formattedValue}, 
        minimum {min}{unit}, maximum {max}{unit}, step {step}
      </div>
    </div>
  );
};

// Export types for external use
export type { RangeInputProps };