import React, { useState, useCallback, useMemo } from 'react';
import { Button, Tooltip, Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';

interface SavedStyle {
  id: number;
  name: string;
  timestamp: string;
  config: Record<string, any>;
  /** Optional description of the style */
  description?: string;
  /** Tags for categorization */
  tags?: string[];
  /** Preview data or thumbnail */
  preview?: string;
  /** Whether this style is marked as favorite */
  isFavorite?: boolean;
  /** Last modified timestamp */
  lastModified?: string;
  /** Version number */
  version?: number;
}

interface SavedStyleItemProps {
  /** Style object to display */
  style: SavedStyle;
  /** Callback when style is loaded */
  onLoad: (style: SavedStyle) => void;
  /** Callback when style is deleted */
  onDelete: (id: number) => void;
  /** Callback when style is duplicated */
  onDuplicate?: (style: SavedStyle) => void;
  /** Callback when style is renamed */
  onRename?: (id: number, newName: string) => void;
  /** Callback when favorite status changes */
  onToggleFavorite?: (id: number, isFavorite: boolean) => void;
  /** Whether the item is currently selected/active */
  isActive?: boolean;
  /** Whether the component is in compact mode */
  compact?: boolean;
  /** Whether to show advanced actions */
  showAdvancedActions?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Whether the item is being loaded */
  isLoading?: boolean;
}

export const SavedStyleItem: React.FC<SavedStyleItemProps> = ({
  style,
  onLoad,
  onDelete,
  onDuplicate,
  onRename,
  onToggleFavorite,
  isActive = false,
  compact = false,
  showAdvancedActions = true,
  className = '',
  isLoading = false,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(style.name);

  // Format timestamp for display
  const formattedTimestamp = useMemo(() => {
    try {
      const date = new Date(style.timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else {
        return date.toLocaleDateString();
      }
    } catch {
      return style.timestamp;
    }
  }, [style.timestamp]);

  // Count of configuration properties
  const configCount = useMemo(() => {
    return Object.keys(style.config || {}).length;
  }, [style.config]);

  // Handle load with loading state
  const handleLoad = useCallback(async () => {
    if (isLoading) return;
    onLoad(style);
  }, [style, onLoad, isLoading]);

  // Handle delete with confirmation
  const handleDelete = useCallback(async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Brief delay for UX
      onDelete(style.id);
    } finally {
      setIsDeleting(false);
    }
  }, [style.id, onDelete, isDeleting]);

  // Handle duplicate
  const handleDuplicate = useCallback(() => {
    if (onDuplicate) {
      onDuplicate(style);
    }
  }, [style, onDuplicate]);

  // Handle rename
  const handleRename = useCallback(() => {
    if (onRename && editName.trim() && editName.trim() !== style.name) {
      onRename(style.id, editName.trim());
    }
    setIsEditing(false);
  }, [style.id, style.name, editName, onRename]);

  // Handle favorite toggle
  const handleToggleFavorite = useCallback(() => {
    if (onToggleFavorite) {
      onToggleFavorite(style.id, !style.isFavorite);
    }
  }, [style.id, style.isFavorite, onToggleFavorite]);

  // Handle key events for editing
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setEditName(style.name);
      setIsEditing(false);
    }
  }, [handleRename, style.name]);

  if (compact) {
    return (
      <div className={`flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-purple-500/20 border border-purple-400/50' 
          : 'bg-slate-700/40 border border-slate-600/40 hover:bg-slate-600/50'
      } ${className}`}>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {style.isFavorite && (
            <Icon icon="lucide:star" className="w-3 h-3 text-yellow-400 flex-shrink-0" />
          )}
          <span className="text-sm font-medium truncate">{style.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip content="Load Style">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={handleLoad}
              isLoading={isLoading}
              className="text-blue-400 hover:text-blue-300 min-w-0 w-7 h-7"
            >
              <Icon icon="lucide:upload" className="w-3.5 h-3.5" />
            </Button>
          </Tooltip>
          <Tooltip content="Delete Style">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={handleDelete}
              isLoading={isDeleting}
              className="text-red-400 hover:text-red-300 min-w-0 w-7 h-7"
            >
              <Icon icon="lucide:trash-2" className="w-3.5 h-3.5" />
            </Button>
          </Tooltip>
        </div>
      </div>
    );
  }

  return (
    <Card 
      className={`${
        isActive 
          ? 'bg-purple-500/10 border-purple-400/50' 
          : 'bg-slate-700/40 border-slate-600/40'
      } transition-all duration-200 hover:bg-slate-600/50 ${className}`}
    >
      <CardBody className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {style.isFavorite && onToggleFavorite && (
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={handleToggleFavorite}
                  className="text-yellow-400 hover:text-yellow-300 min-w-0 w-6 h-6 -ml-1"
                >
                  <Icon icon="lucide:star" className="w-4 h-4" />
                </Button>
              )}
              
              {/* Name (editable) */}
              {isEditing ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={handleRename}
                  onKeyDown={handleKeyDown}
                  className="bg-slate-600 text-white px-2 py-1 rounded text-sm font-medium flex-1 min-w-0"
                  autoFocus
                />
              ) : (
                <h3 
                  className="font-semibold text-white truncate cursor-pointer hover:text-gray-200"
                  onClick={() => onRename && setIsEditing(true)}
                  title={style.name}
                >
                  {style.name}
                </h3>
              )}
              
              {style.version && (
                <span className="text-xs bg-slate-600 text-gray-300 px-1.5 py-0.5 rounded">
                  v{style.version}
                </span>
              )}
            </div>

            {/* Description */}
            {style.description && (
              <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                {style.description}
              </p>
            )}

            {/* Metadata */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span title={`Saved: ${style.timestamp}`}>
                <Icon icon="lucide:clock" className="w-3 h-3 inline mr-1" />
                {formattedTimestamp}
              </span>
              
              {configCount > 0 && (
                <span title={`${configCount} configuration properties`}>
                  <Icon icon="lucide:settings" className="w-3 h-3 inline mr-1" />
                  {configCount} props
                </span>
              )}
              
              {style.lastModified && style.lastModified !== style.timestamp && (
                <span title={`Modified: ${style.lastModified}`}>
                  <Icon icon="lucide:edit" className="w-3 h-3 inline mr-1" />
                  Modified
                </span>
              )}
            </div>

            {/* Tags */}
            {style.tags && style.tags.length > 0 && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {style.tags.slice(0, 3).map((tag, index) => (
                  <span 
                    key={index} 
                    className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {style.tags.length > 3 && (
                  <span className="text-xs text-gray-400">
                    +{style.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-1">
            <Tooltip content="Load Style">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={handleLoad}
                isLoading={isLoading}
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 min-w-0 w-8 h-8"
              >
                <Icon icon="lucide:upload" className="w-4 h-4" />
              </Button>
            </Tooltip>

            {showAdvancedActions && (
              <>
                {onDuplicate && (
                  <Tooltip content="Duplicate Style">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={handleDuplicate}
                      className="text-green-400 hover:text-green-300 hover:bg-green-500/20 min-w-0 w-8 h-8"
                    >
                      <Icon icon="lucide:copy" className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                )}

                {onRename && !isEditing && (
                  <Tooltip content="Rename Style">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => setIsEditing(true)}
                      className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/20 min-w-0 w-8 h-8"
                    >
                      <Icon icon="lucide:edit" className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                )}

                {onToggleFavorite && !style.isFavorite && (
                  <Tooltip content="Add to Favorites">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={handleToggleFavorite}
                      className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20 min-w-0 w-8 h-8"
                    >
                      <Icon icon="lucide:star" className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                )}
              </>
            )}

            <Tooltip content="Delete Style">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={handleDelete}
                isLoading={isDeleting}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/20 min-w-0 w-8 h-8"
              >
                <Icon icon="lucide:trash-2" className="w-4 h-4" />
              </Button>
            </Tooltip>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

// Export types for external use
export type { SavedStyle, SavedStyleItemProps };