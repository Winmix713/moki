import React from 'react';
import { Icon } from '@iconify/react';

interface ControlWrapperProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  variant?: 'default' | 'compact' | 'elevated';
  disabled?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export const ControlWrapper: React.FC<ControlWrapperProps> = ({
  title,
  icon,
  children,
  className = '',
  headerClassName = '',
  contentClassName = '',
  variant = 'default',
  disabled = false,
  collapsible = false,
  defaultCollapsed = false,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  const variantStyles = {
    default: {
      container: 'bg-slate-800/40 border-slate-700/60',
      header: 'text-white',
      icon: 'text-purple-400',
    },
    compact: {
      container: 'bg-slate-800/60 border-slate-600/40',
      header: 'text-slate-100',
      icon: 'text-blue-400',
    },
    elevated: {
      container: 'bg-gradient-to-br from-slate-800/60 to-slate-900/40 border-slate-600/30 shadow-lg',
      header: 'text-white',
      icon: 'text-cyan-400',
    },
  };

  const currentVariant = variantStyles[variant];
  const spacing = variant === 'compact' ? 'p-3 space-y-2' : 'p-4 space-y-3';

  const handleToggle = () => {
    if (collapsible && !disabled) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div 
      className={`
        transition-all duration-200 ease-in-out
        ${disabled ? 'opacity-50 pointer-events-none' : ''}
        ${className}
      `}
    >
      {/* Header */}
      <div
        className={`
          flex items-center justify-between mb-3 group
          ${collapsible ? 'cursor-pointer select-none' : ''}
          ${headerClassName}
        `}
        onClick={handleToggle}
        role={collapsible ? 'button' : undefined}
        tabIndex={collapsible ? 0 : undefined}
        onKeyDown={(e) => {
          if (collapsible && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        <h3 className={`
          text-lg font-semibold flex items-center transition-colors duration-150
          ${currentVariant.header}
          ${collapsible ? 'group-hover:text-purple-300' : ''}
        `}>
          <Icon 
            icon={icon} 
            className={`
              w-5 h-5 mr-2 transition-colors duration-150
              ${currentVariant.icon}
              ${collapsible ? 'group-hover:text-purple-300' : ''}
            `} 
          />
          {title}
        </h3>
        
        {collapsible && (
          <Icon
            icon={isCollapsed ? 'mdi:chevron-right' : 'mdi:chevron-down'}
            className={`
              w-5 h-5 transition-all duration-200
              ${currentVariant.icon}
              group-hover:text-purple-300
            `}
          />
        )}
      </div>

      {/* Content */}
      <div
        className={`
          transition-all duration-300 ease-in-out overflow-hidden
          ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'}
        `}
      >
        <div
          className={`
            ${spacing} rounded-xl border backdrop-blur-sm
            transition-all duration-200 ease-in-out
            ${currentVariant.container}
            ${variant === 'elevated' ? 'shadow-xl' : 'shadow-sm'}
            ${contentClassName}
          `}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

// Convenience wrapper components for common use cases
export const CompactControlWrapper: React.FC<Omit<ControlWrapperProps, 'variant'>> = (props) => (
  <ControlWrapper {...props} variant="compact" />
);

export const ElevatedControlWrapper: React.FC<Omit<ControlWrapperProps, 'variant'>> = (props) => (
  <ControlWrapper {...props} variant="elevated" />
);

export const CollapsibleControlWrapper: React.FC<Omit<ControlWrapperProps, 'collapsible'>> = (props) => (
  <ControlWrapper {...props} collapsible={true} />
);