import React, { useState, useCallback, useMemo } from 'react';
import { Button, Card, CardBody, Badge, Tooltip, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';

interface Template {
  /** Display name of the template */
  name: string;
  /** Detailed description */
  description: string;
  /** Configuration object */
  config: Record<string, any>;
  /** Optional category for grouping */
  category?: string;
  /** Difficulty level */
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  /** Tags for filtering */
  tags?: string[];
  /** Preview image or icon */
  preview?: string;
  /** Icon identifier */
  icon?: string;
  /** Whether this is a premium template */
  isPremium?: boolean;
  /** Author information */
  author?: string;
  /** Rating (1-5 stars) */
  rating?: number;
  /** Number of downloads/uses */
  usageCount?: number;
  /** Last updated timestamp */
  lastUpdated?: string;
  /** Estimated setup time */
  setupTime?: string;
  /** Color theme for the card */
  theme?: 'purple' | 'blue' | 'green' | 'orange' | 'red' | 'pink';
}

interface TemplateCardProps {
  /** Unique identifier for the template */
  templateKey: string;
  /** Template data object */
  template: Template;
  /** Whether this template is currently selected */
  isSelected: boolean;
  /** Callback when template is selected */
  onSelect: (key: string) => void;
  /** Callback when template is favorited */
  onFavorite?: (key: string) => void;
  /** Callback when template preview is requested */
  onPreview?: (key: string) => void;
  /** Whether this template is favorited */
  isFavorited?: boolean;
  /** Layout variant */
  variant?: 'default' | 'compact' | 'detailed';
  /** Whether the card is disabled */
  disabled?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Whether to show advanced features */
  showAdvanced?: boolean;
  /** Loading state */
  isLoading?: boolean;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  templateKey,
  template,
  isSelected,
  onSelect,
  onFavorite,
  onPreview,
  isFavorited = false,
  variant = 'default',
  disabled = false,
  className = '',
  showAdvanced = true,
  isLoading = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Get theme colors
  const themeColors = useMemo(() => {
    const themes = {
      purple: {
        gradient: 'from-purple-600 to-purple-800',
        ring: 'ring-purple-400',
        hover: 'hover:border-purple-500/60',
        text: 'text-purple-300',
        bg: 'bg-purple-500/10',
      },
      blue: {
        gradient: 'from-blue-600 to-blue-800',
        ring: 'ring-blue-400',
        hover: 'hover:border-blue-500/60',
        text: 'text-blue-300',
        bg: 'bg-blue-500/10',
      },
      green: {
        gradient: 'from-green-600 to-green-800',
        ring: 'ring-green-400',
        hover: 'hover:border-green-500/60',
        text: 'text-green-300',
        bg: 'bg-green-500/10',
      },
      orange: {
        gradient: 'from-orange-600 to-orange-800',
        ring: 'ring-orange-400',
        hover: 'hover:border-orange-500/60',
        text: 'text-orange-300',
        bg: 'bg-orange-500/10',
      },
      red: {
        gradient: 'from-red-600 to-red-800',
        ring: 'ring-red-400',
        hover: 'hover:border-red-500/60',
        text: 'text-red-300',
        bg: 'bg-red-500/10',
      },
      pink: {
        gradient: 'from-pink-600 to-pink-800',
        ring: 'ring-pink-400',
        hover: 'hover:border-pink-500/60',
        text: 'text-pink-300',
        bg: 'bg-pink-500/10',
      },
    };
    return themes[template.theme || 'purple'];
  }, [template.theme]);

  // Calculate configuration complexity
  const configComplexity = useMemo(() => {
    const count = Object.keys(template.config || {}).length;
    if (count < 5) return 'Simple';
    if (count < 15) return 'Moderate';
    return 'Complex';
  }, [template.config]);

  // Handle selection
  const handleSelect = useCallback(() => {
    if (disabled || isLoading) return;
    onSelect(templateKey);
  }, [templateKey, onSelect, disabled, isLoading]);

  // Handle favorite toggle
  const handleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavorite) {
      onFavorite(templateKey);
    }
  }, [templateKey, onFavorite]);

  // Handle preview
  const handlePreview = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPreview) {
      onPreview(templateKey);
    }
  }, [templateKey, onPreview]);

  // Render star rating
  const renderRating = useCallback((rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        icon={i < rating ? "lucide:star" : "lucide:star"}
        className={`w-3 h-3 ${
          i < rating ? 'text-yellow-400' : 'text-gray-600'
        }`}
      />
    ));
  }, []);

  // Animation variants
  const cardVariants = {
    initial: { scale: 1, y: 0 },
    hover: { scale: 1.02, y: -2 },
    selected: { scale: 1.02, y: -4 },
    tap: { scale: 0.98 },
  };

  const overlayVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  if (variant === 'compact') {
    return (
      <motion.div
        variants={cardVariants}
        initial="initial"
        whileHover={!disabled ? "hover" : "initial"}
        whileTap={!disabled ? "tap" : "initial"}
        animate={isSelected ? "selected" : "initial"}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <Button
          onPress={handleSelect}
          disabled={disabled}
          isLoading={isLoading}
          className={`relative p-3 h-auto rounded-xl text-left transition-all duration-300 group ${
            isSelected
              ? `bg-gradient-to-br ${themeColors.gradient} text-white shadow-xl ring-2 ${themeColors.ring}`
              : `bg-slate-700/50 hover:bg-slate-600/60 text-gray-300 border border-slate-600/50 ${themeColors.hover}`
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
          <div className="flex items-center gap-2">
            {template.icon && (
              <Icon icon={template.icon} className="w-5 h-5 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">{template.name}</div>
              {template.category && (
                <div className="text-xs opacity-70">{template.category}</div>
              )}
            </div>
            {template.isPremium && (
              <Badge size="sm" variant="solid" color="warning">
                Pro
              </Badge>
            )}
          </div>
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover={!disabled ? "hover" : "initial"}
      whileTap={!disabled ? "tap" : "initial"}
      animate={isSelected ? "selected" : "initial"}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={className}
    >
      <Card 
        isPressable={!disabled}
        onPress={handleSelect}
        className={`relative overflow-hidden transition-all duration-300 ${
          isSelected
            ? `bg-gradient-to-br ${themeColors.gradient} shadow-2xl ring-2 ${themeColors.ring}`
            : `bg-slate-700/50 hover:bg-slate-600/60 border border-slate-600/50 ${themeColors.hover}`
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <CardBody className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {template.icon && (
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/20' : themeColors.bg}`}>
                  <Icon 
                    icon={template.icon} 
                    className={`w-6 h-6 ${isSelected ? 'text-white' : themeColors.text}`} 
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-gray-100'} truncate`}>
                  {template.name}
                </h3>
                {template.category && (
                  <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                    {template.category}
                  </p>
                )}
              </div>
            </div>

            {/* Action buttons */}
            {showAdvanced && (
              <div className="flex gap-1">
                {onFavorite && (
                  <Tooltip content={isFavorited ? "Remove from favorites" : "Add to favorites"}>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={handleFavorite}
                      className={`min-w-0 w-8 h-8 ${
                        isFavorited ? 'text-yellow-400' : isSelected ? 'text-white/60 hover:text-white' : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      <Icon icon={isFavorited ? "lucide:star" : "lucide:star"} className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                )}
                
                {onPreview && (
                  <Tooltip content="Preview template">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={handlePreview}
                      className={`min-w-0 w-8 h-8 ${
                        isSelected ? 'text-white/60 hover:text-white' : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      <Icon icon="lucide:eye" className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-3">
            <p className={`text-sm leading-relaxed ${
              isSelected ? 'text-white/90' : 'text-gray-300'
            } ${showFullDescription ? '' : 'line-clamp-2'}`}>
              {template.description}
            </p>
            {template.description.length > 100 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullDescription(!showFullDescription);
                }}
                className={`text-xs mt-1 ${
                  isSelected ? 'text-white/80 hover:text-white' : 'text-gray-400 hover:text-gray-200'
                } transition-colors`}
              >
                {showFullDescription ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>

          {/* Tags */}
          {template.tags && template.tags.length > 0 && (
            <div className="flex gap-1 mb-3 flex-wrap">
              {template.tags.slice(0, 3).map((tag, index) => (
                <Chip
                  key={index}
                  size="sm"
                  variant="flat"
                  className={`text-xs ${
                    isSelected 
                      ? 'bg-white/20 text-white' 
                      : 'bg-slate-600/50 text-gray-300'
                  }`}
                >
                  {tag}
                </Chip>
              ))}
              {template.tags.length > 3 && (
                <Chip
                  size="sm"
                  variant="flat"
                  className={`text-xs ${
                    isSelected 
                      ? 'bg-white/20 text-white/80' 
                      : 'bg-slate-600/50 text-gray-400'
                  }`}
                >
                  +{template.tags.length - 3}
                </Chip>
              )}
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              {template.difficulty && (
                <div className="flex items-center gap-1">
                  <Icon icon="lucide:trending-up" className="w-3 h-3" />
                  <span className={isSelected ? 'text-white/80' : 'text-gray-400'}>
                    {template.difficulty}
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Icon icon="lucide:settings" className="w-3 h-3" />
                <span className={isSelected ? 'text-white/80' : 'text-gray-400'}>
                  {configComplexity}
                </span>
              </div>

              {template.setupTime && (
                <div className="flex items-center gap-1">
                  <Icon icon="lucide:clock" className="w-3 h-3" />
                  <span className={isSelected ? 'text-white/80' : 'text-gray-400'}>
                    {template.setupTime}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {template.rating && (
                <div className="flex items-center gap-1">
                  {renderRating(Math.round(template.rating))}
                </div>
              )}

              {template.usageCount && (
                <span className={`text-xs ${isSelected ? 'text-white/60' : 'text-gray-500'}`}>
                  {template.usageCount > 1000 
                    ? `${Math.round(template.usageCount / 1000)}k uses`
                    : `${template.usageCount} uses`
                  }
                </span>
              )}
            </div>
          </div>

          {/* Premium badge */}
          {template.isPremium && (
            <div className="absolute top-3 right-3">
              <Badge
                content="PRO"
                size="sm"
                color="warning"
                variant="solid"
              />
            </div>
          )}

          {/* Loading overlay */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg"
              >
                <div className="flex items-center gap-2 text-white">
                  <Icon icon="lucide:loader-2" className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Loading...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hover overlay */}
          <AnimatePresence>
            {isHovered && !isSelected && !disabled && variant === 'detailed' && (
              <motion.div
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg pointer-events-none"
              >
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-white text-sm font-medium">
                    Click to select this template
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardBody>
      </Card>
    </motion.div>
  );
};

// Export types for external use
export type { Template, TemplateCardProps };