import React, { useCallback, useMemo, useRef, useReducer, useEffect } from 'react';

// Enhanced Type Definitions
export interface CardDimensions {
  width: number;
  height: number;
  aspectRatio?: 'auto' | '16:9' | '4:3' | '1:1' | 'custom';
}

export interface TextContent {
  title: string;
  subtitle: string;
  footer: string;
  titleSize?: number;
  subtitleSize?: number;
  footerSize?: number;
  textColor?: string;
  textAlign?: 'left' | 'center' | 'right';
}

export interface GradientConfig {
  type: 'linear' | 'radial' | 'conic';
  angle: number;
  stops: Array<{ color: string; position: number }>;
  centerX?: number;
  centerY?: number;
}

export interface ShadowConfig {
  intensity: number;
  color: string;
  blur: number;
  spread: number;
  offsetX: number;
  offsetY: number;
  inset: boolean;
}

export interface BorderConfig {
  width: number;
  color: string;
  opacity: number;
  style: 'solid' | 'dashed' | 'dotted' | 'double';
  radius: number | [number, number, number, number];
}

export interface AnimationConfig {
  enabled: boolean;
  type: 'float' | 'pulse' | 'glow' | 'rotate' | 'bounce' | 'shake';
  duration: number;
  delay: number;
  iterationCount: number | 'infinite';
  timingFunction: 'ease' | 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'cubic-bezier';
  customCurve?: [number, number, number, number];
}

export interface EffectsConfig {
  glassEffect: boolean;
  blurIntensity: number;
  backdropSaturate: number;
  transform: {
    scale: number;
    rotate: number;
    skewX: number;
    skewY: number;
    translateX: number;
    translateY: number;
  };
  filter: {
    brightness: number;
    contrast: number;
    saturate: number;
    hue: number;
  };
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'minimal' | 'corporate' | 'creative' | 'dark';
  config: Partial<CardStyleState>;
  preview?: string;
}

export interface ColorPalette {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  category: 'vibrant' | 'muted' | 'monochrome' | 'pastel' | 'dark';
}

export interface SavedStyle {
  id: string;
  name: string;
  description?: string;
  timestamp: string;
  config: CardStyleState;
  tags?: string[];
  isPublic?: boolean;
  likes?: number;
}

export interface ExportOptions {
  format: 'css' | 'scss' | 'tailwind' | 'json' | 'jsx' | 'vue' | 'styled-components';
  minify: boolean;
  includeHover: boolean;
  includeResponsive: boolean;
  includeAnimations: boolean;
  prefix?: string;
}

// Main State Interface
export interface CardStyleState {
  // Core Properties
  dimensions: CardDimensions;
  backgroundColor: string;
  secondaryColor: string;
  opacity: number;
  
  // Visual Effects
  template: string;
  gradient: GradientConfig;
  shadow: ShadowConfig;
  border: BorderConfig;
  effects: EffectsConfig;
  animation: AnimationConfig;
  
  // Content & Layout
  content: TextContent;
  layout: 'default' | 'centered' | 'split' | 'overlay' | 'minimal';
  iconStyle: 'none' | 'gradient' | 'outline' | 'filled' | 'custom';
  
  // Preview & Export
  preview: {
    mode: boolean;
    scale: number;
    background: 'transparent' | 'light' | 'dark' | 'custom';
    device: 'desktop' | 'tablet' | 'mobile';
    showGrid: boolean;
    showRuler: boolean;
  };
  
  // State Management
  history: {
    canUndo: boolean;
    canRedo: boolean;
    currentIndex: number;
  };
}

// Action Types for Reducer
type CardStyleAction =
  | { type: 'SET_DIMENSIONS'; payload: Partial<CardDimensions> }
  | { type: 'SET_COLORS'; payload: { primary?: string; secondary?: string } }
  | { type: 'SET_GRADIENT'; payload: Partial<GradientConfig> }
  | { type: 'SET_SHADOW'; payload: Partial<ShadowConfig> }
  | { type: 'SET_BORDER'; payload: Partial<BorderConfig> }
  | { type: 'SET_EFFECTS'; payload: Partial<EffectsConfig> }
  | { type: 'SET_ANIMATION'; payload: Partial<AnimationConfig> }
  | { type: 'SET_CONTENT'; payload: Partial<TextContent> }
  | { type: 'APPLY_TEMPLATE'; payload: Template }
  | { type: 'RESET_TO_DEFAULT' }
  | { type: 'LOAD_CONFIG'; payload: Partial<CardStyleState> }
  | { type: 'UNDO' }
  | { type: 'REDO' };

// Default State
const defaultState: CardStyleState = {
  dimensions: { width: 400, height: 240, aspectRatio: 'auto' },
  backgroundColor: '#8B5CF6',
  secondaryColor: '#EC4899',
  opacity: 95,
  template: 'glassmorphism',
  gradient: {
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#8B5CF6', position: 0 },
      { color: '#EC4899', position: 100 }
    ]
  },
  shadow: {
    intensity: 20,
    color: '#000000',
    blur: 20,
    spread: 0,
    offsetX: 0,
    offsetY: 8,
    inset: false
  },
  border: {
    width: 1,
    color: '#FFFFFF',
    opacity: 20,
    style: 'solid',
    radius: 16
  },
  effects: {
    glassEffect: true,
    blurIntensity: 16,
    backdropSaturate: 120,
    transform: {
      scale: 1,
      rotate: 0,
      skewX: 0,
      skewY: 0,
      translateX: 0,
      translateY: 0
    },
    filter: {
      brightness: 100,
      contrast: 100,
      saturate: 100,
      hue: 0
    }
  },
  animation: {
    enabled: true,
    type: 'float',
    duration: 3000,
    delay: 0,
    iterationCount: 'infinite',
    timingFunction: 'ease-in-out'
  },
  content: {
    title: 'Premium Card Design',
    subtitle: 'Create stunning, modern cards with advanced styling options. Perfect for dashboards, portfolios, and modern web applications.',
    footer: 'Card Editor Pro v4.0',
    titleSize: 24,
    subtitleSize: 14,
    footerSize: 12,
    textColor: '#FFFFFF',
    textAlign: 'center'
  },
  layout: 'default',
  iconStyle: 'gradient',
  preview: {
    mode: false,
    scale: 1,
    background: 'dark',
    device: 'desktop',
    showGrid: false,
    showRuler: false
  },
  history: {
    canUndo: false,
    canRedo: false,
    currentIndex: 0
  }
};

// Enhanced Templates
const professionalTemplates: Record<string, Template> = {
  glassmorphism: {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    description: 'Modern glass effect with blur and transparency',
    category: 'modern',
    config: {
      effects: { glassEffect: true, blurIntensity: 16 },
      opacity: 80,
      border: { width: 1, opacity: 20 },
      shadow: { intensity: 20, blur: 20 }
    }
  },
  neuomorphism: {
    id: 'neuomorphism',
    name: 'Neuomorphism',
    description: 'Soft UI design with subtle shadows',
    category: 'modern',
    config: {
      backgroundColor: '#E5E7EB',
      shadow: { 
        intensity: 15, 
        blur: 30, 
        offsetX: -8, 
        offsetY: -8,
        color: '#FFFFFF'
      },
      border: { width: 0 },
      effects: { glassEffect: false }
    }
  },
  neonGlow: {
    id: 'neonGlow',
    name: 'Neon Glow',
    description: 'Vibrant glowing effects with neon colors',
    category: 'creative',
    config: {
      backgroundColor: '#0F172A',
      border: { color: '#00F5FF', width: 2, opacity: 100 },
      shadow: { color: '#00F5FF', intensity: 30, blur: 40 },
      animation: { type: 'glow' }
    }
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Clean and simple design approach',
    category: 'minimal',
    config: {
      backgroundColor: '#FFFFFF',
      border: { width: 1, color: '#E5E7EB', opacity: 100 },
      shadow: { intensity: 8, blur: 16, color: '#00000010' },
      effects: { glassEffect: false },
      animation: { enabled: false }
    }
  },
  corporate: {
    id: 'corporate',
    name: 'Corporate Professional',
    description: 'Professional business-style design',
    category: 'corporate',
    config: {
      backgroundColor: '#1E40AF',
      border: { width: 1, radius: 8 },
      shadow: { intensity: 12, blur: 24 },
      animation: { enabled: false },
      content: { textAlign: 'left' }
    }
  }
};

// Color Palettes
const colorPalettes: ColorPalette[] = [
  {
    id: 'sunset',
    name: 'Sunset Vibes',
    category: 'vibrant',
    colors: {
      primary: '#FF6B6B',
      secondary: '#FFE66D',
      accent: '#FF8E53',
      text: '#FFFFFF',
      background: '#4ECDC4'
    }
  },
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    category: 'muted',
    colors: {
      primary: '#0077BE',
      secondary: '#00A8CC',
      accent: '#7FB3D3',
      text: '#FFFFFF',
      background: '#C7CEEA'
    }
  },
  // Add more palettes...
];

// Reducer Function
function cardStyleReducer(state: CardStyleState, action: CardStyleAction): CardStyleState {
  switch (action.type) {
    case 'SET_DIMENSIONS':
      return {
        ...state,
        dimensions: { ...state.dimensions, ...action.payload }
      };
    
    case 'SET_COLORS':
      return {
        ...state,
        backgroundColor: action.payload.primary || state.backgroundColor,
        secondaryColor: action.payload.secondary || state.secondaryColor
      };
    
    case 'SET_GRADIENT':
      return {
        ...state,
        gradient: { ...state.gradient, ...action.payload }
      };
    
    case 'SET_SHADOW':
      return {
        ...state,
        shadow: { ...state.shadow, ...action.payload }
      };
    
    case 'SET_BORDER':
      return {
        ...state,
        border: { ...state.border, ...action.payload }
      };
    
    case 'SET_EFFECTS':
      return {
        ...state,
        effects: { ...state.effects, ...action.payload }
      };
    
    case 'SET_ANIMATION':
      return {
        ...state,
        animation: { ...state.animation, ...action.payload }
      };
    
    case 'SET_CONTENT':
      return {
        ...state,
        content: { ...state.content, ...action.payload }
      };
    
    case 'APPLY_TEMPLATE':
      return {
        ...state,
        ...action.payload.config,
        template: action.payload.id
      };
    
    case 'RESET_TO_DEFAULT':
      return defaultState;
    
    case 'LOAD_CONFIG':
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
}

// Main Hook
export const useCardStyleEditor = () => {
  // State Management
  const [state, dispatch] = useReducer(cardStyleReducer, defaultState);
  const [savedStyles, setSavedStyles] = React.useState<SavedStyle[]>([]);
  const [currentStyleName, setCurrentStyleName] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const historyRef = useRef<CardStyleState[]>([defaultState]);
  const historyIndexRef = useRef(0);

  // Computed Styles
  const computedCardStyle = useMemo(() => {
    const { dimensions, backgroundColor, secondaryColor, opacity, gradient, shadow, border, effects, animation } = state;
    
    // Build background
    let background = backgroundColor;
    if (gradient.stops.length > 1) {
      const stops = gradient.stops
        .map(stop => `${stop.color} ${stop.position}%`)
        .join(', ');
      
      switch (gradient.type) {
        case 'linear':
          background = `linear-gradient(${gradient.angle}deg, ${stops})`;
          break;
        case 'radial':
          background = `radial-gradient(circle at ${gradient.centerX || 50}% ${gradient.centerY || 50}%, ${stops})`;
          break;
        case 'conic':
          background = `conic-gradient(from ${gradient.angle}deg at ${gradient.centerX || 50}% ${gradient.centerY || 50}%, ${stops})`;
          break;
      }
    }
    
    // Build box shadow
    const shadowParts = [];
    if (!shadow.inset) {
      shadowParts.push(
        `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}${Math.round(shadow.intensity * 2.55).toString(16).padStart(2, '0')}`
      );
    }
    if (shadow.inset) {
      shadowParts.push(
        `inset ${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}${Math.round(shadow.intensity * 2.55).toString(16).padStart(2, '0')}`
      );
    }
    
    // Build border
    const borderColor = `${border.color}${Math.round((border.opacity / 100) * 255).toString(16).padStart(2, '0')}`;
    const borderValue = border.width > 0 ? `${border.width}px ${border.style} ${borderColor}` : 'none';
    
    // Build transform
    const { transform } = effects;
    const transformValue = [
      `scale(${transform.scale})`,
      `rotate(${transform.rotate}deg)`,
      `skewX(${transform.skewX}deg)`,
      `skewY(${transform.skewY}deg)`,
      `translateX(${transform.translateX}px)`,
      `translateY(${transform.translateY}px)`
    ].join(' ');
    
    // Build filter
    const { filter } = effects;
    const filterValue = [
      `brightness(${filter.brightness}%)`,
      `contrast(${filter.contrast}%)`,
      `saturate(${filter.saturate}%)`,
      `hue-rotate(${filter.hue}deg)`
    ].join(' ');
    
    // Build backdrop filter
    const backdropFilter = effects.glassEffect 
      ? `blur(${effects.blurIntensity}px) saturate(${effects.backdropSaturate}%)`
      : 'none';
    
    // Build animation
    const animationValue = animation.enabled 
      ? `${animation.type} ${animation.duration}ms ${animation.timingFunction} ${animation.delay}ms ${animation.iterationCount}`
      : 'none';

    return {
      width: `${dimensions.width}px`,
      height: `${dimensions.height}px`,
      background,
      opacity: opacity / 100,
      borderRadius: typeof border.radius === 'number' 
        ? `${border.radius}px` 
        : border.radius.map(r => `${r}px`).join(' '),
      border: borderValue,
      boxShadow: shadowParts.join(', '),
      transform: transformValue,
      filter: filterValue,
      backdropFilter,
      animation: animationValue,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative' as const,
      overflow: 'hidden' as const
    };
  }, [state]);

  // Actions
  const updateDimensions = useCallback((dimensions: Partial<CardDimensions>) => {
    dispatch({ type: 'SET_DIMENSIONS', payload: dimensions });
  }, []);

  const updateColors = useCallback((colors: { primary?: string; secondary?: string }) => {
    dispatch({ type: 'SET_COLORS', payload: colors });
  }, []);

  const updateGradient = useCallback((gradient: Partial<GradientConfig>) => {
    dispatch({ type: 'SET_GRADIENT', payload: gradient });
  }, []);

  const updateShadow = useCallback((shadow: Partial<ShadowConfig>) => {
    dispatch({ type: 'SET_SHADOW', payload: shadow });
  }, []);

  const updateBorder = useCallback((border: Partial<BorderConfig>) => {
    dispatch({ type: 'SET_BORDER', payload: border });
  }, []);

  const updateEffects = useCallback((effects: Partial<EffectsConfig>) => {
    dispatch({ type: 'SET_EFFECTS', payload: effects });
  }, []);

  const updateAnimation = useCallback((animation: Partial<AnimationConfig>) => {
    dispatch({ type: 'SET_ANIMATION', payload: animation });
  }, []);

  const updateContent = useCallback((content: Partial<TextContent>) => {
    dispatch({ type: 'SET_CONTENT', payload: content });
  }, []);

  const applyTemplate = useCallback((templateId: string) => {
    const template = professionalTemplates[templateId];
    if (template) {
      dispatch({ type: 'APPLY_TEMPLATE', payload: template });
    }
  }, []);

  const applyColorPalette = useCallback((paletteId: string) => {
    const palette = colorPalettes.find(p => p.id === paletteId);
    if (palette) {
      updateColors({ 
        primary: palette.colors.primary, 
        secondary: palette.colors.secondary 
      });
      updateContent({ textColor: palette.colors.text });
    }
  }, [updateColors, updateContent]);

  // Export Functions
  const exportCSS = useCallback((options: Partial<ExportOptions> = {}) => {
    const opts: ExportOptions = {
      format: 'css',
      minify: false,
      includeHover: true,
      includeResponsive: false,
      includeAnimations: true,
      ...options
    };

    const style = computedCardStyle;
    const cssRules = Object.entries(style)
      .map(([key, value]) => {
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `  ${cssKey}: ${value};`;
      })
      .join(opts.minify ? '' : '\n');

    let css = `.card {\n${cssRules}\n}`;

    if (opts.includeAnimations && state.animation.enabled) {
      css += `\n\n@keyframes ${state.animation.type} {\n  /* Animation keyframes */\n}`;
    }

    if (opts.includeHover) {
      css += `\n\n.card:hover {\n  transform: scale(1.02);\n}`;
    }

    if (opts.includeResponsive) {
      css += `\n\n@media (max-width: 768px) {\n  .card {\n    width: 100%;\n    max-width: 400px;\n  }\n}`;
    }

    return css;
  }, [computedCardStyle, state.animation]);

  const exportJSON = useCallback(() => {
    return JSON.stringify(state, null, 2);
  }, [state]);

  const exportTailwind = useCallback(() => {
    // Convert styles to Tailwind classes
    const classes = [];
    
    // Background
    if (state.gradient.stops.length > 1) {
      classes.push(`bg-gradient-to-br from-[${state.backgroundColor}] to-[${state.secondaryColor}]`);
    } else {
      classes.push(`bg-[${state.backgroundColor}]`);
    }
    
    // Border radius
    const radiusMap: Record<number, string> = {
      0: 'rounded-none',
      4: 'rounded',
      8: 'rounded-lg',
      12: 'rounded-xl',
      16: 'rounded-2xl',
      20: 'rounded-3xl'
    };
    classes.push(radiusMap[state.border.radius as number] || `rounded-[${state.border.radius}px]`);
    
    // Shadow
    if (state.shadow.intensity > 10) {
      classes.push('shadow-xl');
    } else if (state.shadow.intensity > 5) {
      classes.push('shadow-lg');
    } else {
      classes.push('shadow-md');
    }
    
    // Effects
    if (state.effects.glassEffect) {
      classes.push(`backdrop-blur-[${state.effects.blurIntensity}px]`);
    }
    
    // Border
    if (state.border.width > 0) {
      classes.push(`border-[${state.border.width}px]`, `border-[${state.border.color}]`);
    }
    
    return classes.join(' ');
  }, [state]);

  // Canvas Export
  const exportToCanvas = useCallback((format: 'png' | 'jpeg' | 'webp' = 'png', quality = 0.95) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = state.dimensions;
    const scaleFactor = 2; // For high DPI
    
    canvas.width = width * scaleFactor;
    canvas.height = height * scaleFactor;
    
    ctx.scale(scaleFactor, scaleFactor);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Render card background
    if (state.gradient.stops.length > 1) {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      state.gradient.stops.forEach(stop => {
        gradient.addColorStop(stop.position / 100, stop.color);
      });
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = state.backgroundColor;
    }
    
    // Draw rounded rectangle
    ctx.beginPath();
    ctx.roundRect(0, 0, width, height, state.border.radius as number);
    ctx.fill();
    
    // Render text content
    const { content } = state;
    ctx.fillStyle = content.textColor || '#FFFFFF';
    ctx.textAlign = content.textAlign === 'left' ? 'start' : content.textAlign === 'right' ? 'end' : 'center';
    
    // Title
    ctx.font = `bold ${content.titleSize || 24}px system-ui, sans-serif`;
    const titleX = content.textAlign === 'center' ? width / 2 : content.textAlign === 'right' ? width - 20 : 20;
    ctx.fillText(content.title, titleX, height / 3);
    
    // Subtitle (with word wrapping)
    ctx.font = `${content.subtitleSize || 14}px system-ui, sans-serif`;
    const words = content.subtitle.split(' ');
    const maxWidth = width * 0.8;
    let line = '';
    let y = height / 2;
    
    for (const word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && line !== '') {
        ctx.fillText(line, titleX, y);
        line = word + ' ';
        y += (content.subtitleSize || 14) + 4;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, titleX, y);
    
    // Footer
    ctx.font = `${content.footerSize || 12}px system-ui, sans-serif`;
    ctx.fillText(content.footer, titleX, height - 20);
    
    // Export
    const dataURL = canvas.toDataURL(`image/${format}`, quality);
    const link = document.createElement('a');
    link.download = `card-design-${Date.now()}.${format}`;
    link.href = dataURL;
    link.click();
  }, [state]);

  // Utility Functions
  const copyToClipboard = useCallback(async (content: string, successMessage = 'Copied to clipboard!') => {
    try {
      await navigator.clipboard.writeText(content);
      // Trigger success notification
      console.log(successMessage);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Trigger error notification
    }
  }, []);

  const resetToDefaults = useCallback(() => {
    dispatch({ type: 'RESET_TO_DEFAULT' });
  }, []);

  const saveCurrentStyle = useCallback((name: string, description?: string, tags?: string[]) => {
    if (!name.trim()) return;
    
    const newStyle: SavedStyle = {
      id: `style_${Date.now()}`,
      name: name.trim(),
      description,
      timestamp: new Date().toISOString(),
      config: state,
      tags,
      isPublic: false,
      likes: 0
    };
    
    setSavedStyles(prev => [...prev, newStyle]);
    setCurrentStyleName('');
  }, [state]);

  const loadStyle = useCallback((style: SavedStyle) => {
    dispatch({ type: 'LOAD_CONFIG', payload: style.config });
  }, []);

  const deleteStyle = useCallback((styleId: string) => {
    setSavedStyles(prev => prev.filter(s => s.id !== styleId));
  }, []);

  // Effects for persistence
  useEffect(() => {
    const stored = sessionStorage.getItem('cardEditorSavedStyles');
    if (stored) {
      try {
        setSavedStyles(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing saved styles:', e);
      }
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('cardEditorSavedStyles', JSON.stringify(savedStyles));
  }, [savedStyles]);

  return {
    // State
    state,
    savedStyles,
    currentStyleName,
    setCurrentStyleName,
    isLoading,
    error,
    
    // Computed
    computedCardStyle,
    templates: professionalTemplates,
    colorPalettes,
    
    // Actions
    updateDimensions,
    updateColors,
    updateGradient,
    updateShadow,
    updateBorder,
    updateEffects,
    updateAnimation,
    updateContent,
    applyTemplate,
    applyColorPalette,
    
    // Export & Utilities
    exportCSS,
    exportJSON,
    exportTailwind,
    exportToCanvas,
    copyToClipboard,
    resetToDefaults,
    saveCurrentStyle,
    loadStyle,
    deleteStyle,
    
    // Refs
    canvasRef
  };
};