import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { Icon } from "@iconify/react";
import {
  Button,
  Card,
  Input,
  Textarea,
  Select,
  SelectItem,
  Switch,
  addToast,
} from "@heroui/react";

// --------- Típusdefiníciók ----------
type CardDimensions = { width: number; height: number };
type TextContent = { title: string; subtitle: string; footer: string };

type CardStyleConfig = {
  cardDimensions: CardDimensions;
  backgroundColor: string;
  secondaryColor: string;
  cornerRadius: number;
  opacity: number;
  selectedTemplate: string;
  gradientType: string;
  gradientAngle: number;
  shadowIntensity: number;
  shadowColor: string;
  borderWidth: number;
  borderColor: string;
  borderOpacity: number;
  blurIntensity: number;
  glassEffect: boolean;
  animationEnabled: boolean;
  animationType: string;
  hoverEffects: boolean;
  textContent: TextContent;
  contentLayout: string;
  iconStyle: string;
};

type SavedStyle = {
  id: number;
  name: string;
  timestamp: string;
  config: CardStyleConfig;
};

type TemplateConfig = {
  name: string;
  description: string;
  config: Partial<CardStyleConfig> & { gradient?: boolean; neonGlow?: boolean };
};

type ColorPreset = { name: string; colors: [string, string] };

// --------- Segédkomponensek ----------
const ControlWrapper: React.FC<{ title: string; icon: string; children: React.ReactNode }> = ({ title, icon, children }) => (
  <Card className="bg-slate-800/40 border-slate-700/60 shadow-sm">
    <div className="p-4">
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
        <Icon icon={icon} className="w-5 h-5 mr-2 text-purple-400" />
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  </Card>
);

const RangeInput: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}> = ({ label, value, onChange, min, max, step = 1, unit = "" }) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <label className="text-sm text-gray-300">{label}</label>
      <span className="text-sm text-purple-300 font-medium">{value}{unit}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={e => onChange(parseFloat(e.target.value))}
      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider focus:outline-none focus:ring-1 focus:ring-purple-500"
    />
  </div>
);

const ColorInput: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ label, value, onChange }) => (
  <div>
    <label className="text-sm text-gray-300 mb-1 block">{label}</label>
    <div className="flex items-center space-x-2">
      <input
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-10 h-10 p-0 border-none rounded-md cursor-pointer bg-transparent appearance-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-slate-800 focus:ring-purple-500 focus:outline-none"
      />
      <Input
        value={value}
        onValueChange={onChange}
        className="flex-1 bg-slate-700/50 border-slate-600 text-white text-sm"
        size="sm"
      />
    </div>
  </div>
);

// --------- Fő komponens ----------
export const CardStyleEditor: React.FC = () => {
  // Core card properties
  const [cardDimensions, setCardDimensions] = useState<CardDimensions>({ width: 400, height: 240 });
  const [backgroundColor, setBackgroundColor] = useState("#8B5CF6"); // Purple-500
  const [secondaryColor, setSecondaryColor] = useState("#EC4899"); // Pink-500
  const [cornerRadius, setCornerRadius] = useState(16);
  const [opacity, setOpacity] = useState(95); // Percentage 0-100
  
  // Enhanced visual effects
  const [selectedTemplate, setSelectedTemplate] = useState("glass");
  const [gradientType, setGradientType] = useState("linear");
  const [gradientAngle, setGradientAngle] = useState(135); // Degrees
  const [shadowIntensity, setShadowIntensity] = useState(20); // "Strength" not px
  const [shadowColor, setShadowColor] = useState("#000000");
  const [borderWidth, setBorderWidth] = useState(1); // px
  const [borderColor, setBorderColor] = useState("#FFFFFF");
  const [borderOpacity, setBorderOpacity] = useState(20); // Percentage 0-100
  const [blurIntensity, setBlurIntensity] = useState(16); // px for backdrop-filter
  const [glassEffect, setGlassEffect] = useState(true);
  
  // Animation and interaction
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [animationType, setAnimationType] = useState("float"); // 'float', 'pulse', 'glow'
  const [hoverEffects, setHoverEffects] = useState(true);
  
  // Content and layout
  const [textContent, setTextContent] = useState<TextContent>({
    title: "Premium Card Design",
    subtitle: "Create stunning, modern cards with advanced styling options. Perfect for dashboards, portfolios, and modern web applications.",
    footer: "Card Editor Pro v3.0"
  });
  const [contentLayout, setContentLayout] = useState("default"); // 'default', 'centered', 'image-left'
  const [iconStyle, setIconStyle] = useState("gradient"); // 'gradient', 'outline', 'filled'
  
  // Preview and export
  const [previewMode, setPreviewMode] = useState(false);
  const [previewScale, setPreviewScale] = useState(1); // Multiplier
  const [previewBackground, setPreviewBackground] = useState("dark"); // 'dark', 'light', 'transparent'
  const [previewDevice, setPreviewDevice] = useState("desktop"); // 'desktop', 'tablet', 'mobile'
  const [showGrid, setShowGrid] = useState(false);
  const [exportFormat, setExportFormat] = useState("css");
  
  // State management
  const [savedStyles, setSavedStyles] = useState<SavedStyle[]>([]);
  const [currentStyleName, setCurrentStyleName] = useState("");
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --------- Sablonok és Előbeállítások ----------
  const templates = useMemo<Record<string, TemplateConfig>>(() => ({
    minimal: {
      name: "Minimal",
      description: "Clean and simple design",
      config: {
        glassEffect: false, gradient: false, animationEnabled: false, shadowIntensity: 8,
        cornerRadius: 8, borderWidth: 1, opacity: 95, backgroundColor: "#E5E7EB", 
        secondaryColor: "#D1D5DB", borderColor: "#000000", borderOpacity: 10, shadowColor: "#000000"
      }
    },
    glass: {
      name: "Glassmorphism", description: "Modern glass effect with blur",
      config: {
        glassEffect: true, gradient: true, animationEnabled: true, shadowIntensity: 20,
        cornerRadius: 16, borderWidth: 1, opacity: 80, blurIntensity: 16,
        backgroundColor: "#8B5CF6", secondaryColor: "#EC4899",
        borderColor: "#FFFFFF", borderOpacity: 20, shadowColor: "#000000"
      }
    },
    neon: {
      name: "Neon Glow", description: "Vibrant glowing effects",
      config: {
        glassEffect: false, gradient: false, animationEnabled: true, animationType: "glow", 
        shadowIntensity: 30, cornerRadius: 12, borderWidth: 2, opacity: 90, neonGlow: true,
        backgroundColor: "#1F2937", secondaryColor: "#374151",
        borderColor: "#EC4899", borderOpacity: 70, shadowColor: "#EC4899"
      }
    },
    gradient: {
      name: "Gradient Vibrant", description: "Bold gradient backgrounds",
      config: {
        glassEffect: false, gradient: true, animationEnabled: true, shadowIntensity: 15,
        cornerRadius: 20, borderWidth: 0, opacity: 100,
        backgroundColor: "#F59E0B", secondaryColor: "#EF4444",
        borderColor: "#FFFFFF", borderOpacity: 0, shadowColor: "#000000"
      }
    },
    corporate: {
      name: "Corporate", description: "Professional business style",
      config: {
        glassEffect: false, gradient: false, animationEnabled: false, shadowIntensity: 12,
        cornerRadius: 4, borderWidth: 1, opacity: 100,
        backgroundColor: "#3B82F6", secondaryColor: "#60A5FA",
        borderColor: "#9CA3AF", borderOpacity: 50, shadowColor: "#000000"
      }
    }
  }), []);

  const colorPresets = useMemo<Record<string, ColorPreset>>(() => ({
    purplePink: { name: "Purple Haze", colors: ["#8B5CF6", "#EC4899"] },
    blueTeal: { name: "Ocean Breeze", colors: ["#3B82F6", "#14B8A6"] },
    greenLime: { name: "Forest Dew", colors: ["#10B981", "#84CC16"] },
    orangeRed: { name: "Sunset Fire", colors: ["#F59E0B", "#EF4444"] },
    indigoViolet: { name: "Twilight Sky", colors: ["#6366F1", "#A78BFA"] },
    graySlate: { name: "Mono Chrome", colors: ["#6B7280", "#4B5563"] }
  }), []);

  // --------- Segédfüggvények ----------
  const showToastMessage = useCallback((message: string, duration = 3000) => {
    addToast({ title: message, timeout: duration });
  }, []);

  const getCardStyle = useMemo((): React.CSSProperties => {
    const currentTemplateConfig = templates[selectedTemplate]?.config || templates.glass.config;
    let finalBackgroundColor: string = backgroundColor;

    if (currentTemplateConfig.gradient) {
      const gradientDirectionStr = gradientType === "linear" 
        ? `${gradientAngle}deg` 
        : gradientType === "radial" 
          ? "circle at center" 
          : `from ${gradientAngle}deg at 50% 50%`;
      
      switch (gradientType) {
        case "linear": finalBackgroundColor = `linear-gradient(${gradientDirectionStr}, ${backgroundColor}, ${secondaryColor})`; break;
        case "radial": finalBackgroundColor = `radial-gradient(${gradientDirectionStr}, ${backgroundColor}, ${secondaryColor})`; break;
        case "conic": finalBackgroundColor = `conic-gradient(${gradientDirectionStr}, ${backgroundColor}, ${secondaryColor}, ${backgroundColor})`; break;
        default: finalBackgroundColor = backgroundColor;
      }
    }

    if (currentTemplateConfig.glassEffect && glassEffect) {
      const primaryAlpha = Math.round((opacity / 100) * 0.8 * 255).toString(16).padStart(2, "0"); 
      const secondaryAlpha = Math.round((opacity / 100) * 0.5 * 255).toString(16).padStart(2, "0"); 
      const primaryGlass = `${backgroundColor}${primaryAlpha}`;
      const secondaryGlass = `${secondaryColor}${secondaryAlpha}`;
        
      if (currentTemplateConfig.gradient) {
        const gradientDirectionStr = gradientType === "linear" 
          ? `${gradientAngle}deg` 
          : gradientType === "radial" ? "circle at center" : `from ${gradientAngle}deg at 50% 50%`;
        switch (gradientType) {
          case "linear": finalBackgroundColor = `linear-gradient(${gradientDirectionStr}, ${primaryGlass}, ${secondaryGlass})`; break;
          case "radial": finalBackgroundColor = `radial-gradient(circle at center, ${primaryGlass}, ${secondaryGlass})`; break;
          case "conic": finalBackgroundColor = `conic-gradient(from ${gradientAngle}deg at 50% 50%, ${primaryGlass}, ${secondaryGlass}, ${primaryGlass})`; break;
          default: finalBackgroundColor = primaryGlass;
        }
      } else {
        finalBackgroundColor = primaryGlass;
      }
    }

    const shadowStrength = shadowIntensity / 2; 
    const shadowColorHex = shadowColor.startsWith("#") ? shadowColor : "#000000";
    const shadowOpacityHex = Math.round((shadowIntensity / 100) * 0.5 * 255).toString(16).padStart(2, "0"); 
    let finalBoxShadow = `0 ${shadowStrength}px ${shadowStrength * 2}px ${shadowColorHex}${shadowOpacityHex}`;
    
    if (currentTemplateConfig.neonGlow) {
        const neonColor = currentTemplateConfig.borderColor || backgroundColor; 
        finalBoxShadow = `0 0 ${shadowStrength / 2}px ${neonColor}, 0 0 ${shadowStrength}px ${neonColor}BF, 0 0 ${shadowStrength * 1.5}px ${neonColor}80, ${finalBoxShadow}`;
    }

    const finalBorderColorHex = borderColor.startsWith("#") ? borderColor : "#FFFFFF";
    const finalBorderOpacityHex = Math.round((borderOpacity / 100) * 255).toString(16).padStart(2, "0");
    const finalBorder = borderWidth > 0 ? `${borderWidth}px solid ${finalBorderColorHex}${finalBorderOpacityHex}` : "none";

    return {
      width: `${cardDimensions.width}px`,
      height: `${cardDimensions.height}px`,
      background: finalBackgroundColor,
      borderRadius: `${cornerRadius}px`,
      opacity: opacity / 100, 
      backdropFilter: currentTemplateConfig.glassEffect && glassEffect ? `blur(${blurIntensity}px) saturate(1.2)` : "none",
      border: finalBorder,
      boxShadow: finalBoxShadow,
      transform: `scale(${previewScale})`,
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      animation: animationEnabled && currentTemplateConfig.animationEnabled ? `${animationType} 3s ease-in-out infinite` : "none",
      position: "relative", 
      overflow: "hidden",
      '--card-scale': previewScale // For CSS animation scaling
    } as React.CSSProperties;
  }, [
    selectedTemplate, templates, cardDimensions, backgroundColor, secondaryColor, cornerRadius, 
    opacity, glassEffect, blurIntensity, borderWidth, borderColor, borderOpacity,
    shadowIntensity, shadowColor, gradientType, gradientAngle, previewScale, 
    animationEnabled, animationType
  ]);

  const exportCSS = useCallback(() => {
    const style = getCardStyle;
    const cssRules = Object.entries(style)
      .filter(([key]) => key !== '--card-scale') // Exclude CSS variable from direct rules
      .map(([key, value]) => {
        const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        return `  ${cssKey}: ${value};`;
      })
      .join("\n");

    const currentTemplateConfig = templates[selectedTemplate]?.config || templates.glass.config;
    const animations = animationEnabled && currentTemplateConfig.animationEnabled ? `
@keyframes float {
  0%, 100% { transform: translateY(0px) scale(${previewScale}); }
  50% { transform: translateY(-8px) scale(${previewScale}); }
}
@keyframes pulse {
  0%, 100% { transform: scale(${previewScale}); }
  50% { transform: scale(${previewScale * 1.03}); }
}
@keyframes glow { 
  0%, 100% { box-shadow: ${style.boxShadow}; }
  50% { box-shadow: ${style.boxShadow}, 0 0 ${shadowIntensity * 2}px ${currentTemplateConfig.neonGlow ? (currentTemplateConfig.borderColor || backgroundColor) : backgroundColor}40; }
}` : "";

    return `.card {\n${cssRules}\n}\n\n${animations}`;
  }, [getCardStyle, animationEnabled, animationType, previewScale, backgroundColor, selectedTemplate, templates, shadowIntensity]);

  const exportTailwind = useCallback(() => {
    const radiusMap: Record<number, string> = { 
      0: "rounded-none", 4: "rounded", 8: "rounded-lg", 12: "rounded-xl", 
      16: "rounded-2xl", 20: "rounded-3xl", 24: "rounded-[24px]" 
    };
    const radiusClass = radiusMap[cornerRadius] || `rounded-[${cornerRadius}px]`;
    
    let bgClass = `bg-[${backgroundColor}]`;
    if (templates[selectedTemplate]?.config?.gradient) {
        bgClass = `bg-gradient-to-br from-[${backgroundColor}] to-[${secondaryColor}]`;
    }
    const shadowClass = shadowIntensity > 10 ? `shadow-[0_${shadowIntensity/2}px_${shadowIntensity}px_${shadowColor}${Math.round((shadowIntensity/100)*0.5*255).toString(16).padStart(2, "0")}]` : "shadow-md";
    const opacityClass = opacity < 100 ? `opacity-${Math.round(opacity/10)*10}`: ""; 
    const blurClass = glassEffect && blurIntensity > 0 ? `backdrop-blur-[${blurIntensity}px]` : "";
    const borderClass = borderWidth > 0 ? `border border-[${borderWidth}px] border-[${borderColor}${Math.round(borderOpacity/100*255).toString(16).padStart(2, "0")}]` : "";

    return `${bgClass} ${radiusClass} ${shadowClass} ${opacityClass} ${blurClass} ${borderClass} p-6 transition-all duration-300`;
  }, [cornerRadius, shadowIntensity, shadowColor, opacity, glassEffect, blurIntensity, borderWidth, borderColor, borderOpacity, selectedTemplate, backgroundColor, secondaryColor, templates]);

  const exportJSON = useCallback(() => {
    return JSON.stringify({
      cardDimensions, backgroundColor, secondaryColor, cornerRadius, opacity,
      selectedTemplate, gradientType, gradientAngle, shadowIntensity, shadowColor,
      borderWidth, borderColor, borderOpacity, blurIntensity, glassEffect,
      animationEnabled, animationType, hoverEffects, textContent, contentLayout, iconStyle
    }, null, 2);
  }, [
    cardDimensions, backgroundColor, secondaryColor, cornerRadius, opacity,
    selectedTemplate, gradientType, gradientAngle, shadowIntensity, shadowColor,
    borderWidth, borderColor, borderOpacity, blurIntensity, glassEffect,
    animationEnabled, animationType, hoverEffects, textContent, contentLayout, iconStyle
  ]);

  const applyTemplate = useCallback((templateKey: string) => {
    const template = templates[templateKey];
    if (!template) return;

    setSelectedTemplate(templateKey);
    const config = template.config;
    
    if (config.glassEffect !== undefined) setGlassEffect(config.glassEffect);
    if (config.animationEnabled !== undefined) setAnimationEnabled(config.animationEnabled);
    if (config.animationType) setAnimationType(config.animationType);
    if (config.shadowIntensity !== undefined) setShadowIntensity(config.shadowIntensity);
    if (config.cornerRadius !== undefined) setCornerRadius(config.cornerRadius);
    if (config.borderWidth !== undefined) setBorderWidth(config.borderWidth);
    if (config.opacity !== undefined) setOpacity(config.opacity);
    if (config.blurIntensity !== undefined) setBlurIntensity(config.blurIntensity);
    if (config.backgroundColor) setBackgroundColor(config.backgroundColor);
    if (config.secondaryColor) setSecondaryColor(config.secondaryColor);
    if (config.borderColor) setBorderColor(config.borderColor);
    if (config.borderOpacity !== undefined) setBorderOpacity(config.borderOpacity);
    if (config.shadowColor) setShadowColor(config.shadowColor);
    
    showToastMessage(`Applied "${template.name}" template`);
  }, [templates, showToastMessage]);

  const saveCurrentStyle = useCallback(() => {
    if (!currentStyleName.trim()) {
      showToastMessage("Please enter a style name.", 2000);
      return;
    }
    const newStyle: SavedStyle = {
      id: Date.now(),
      name: currentStyleName,
      timestamp: new Date().toLocaleString(),
      config: JSON.parse(exportJSON()) 
    };
    setSavedStyles(prev => [...prev, newStyle]);
    setCurrentStyleName("");
    showToastMessage(`Style "${newStyle.name}" saved!`);
  }, [currentStyleName, exportJSON, showToastMessage]);

  const loadStyle = useCallback((styleToLoad: SavedStyle) => {
    const { config } = styleToLoad;
    setCardDimensions(config.cardDimensions);
    setBackgroundColor(config.backgroundColor);
    setSecondaryColor(config.secondaryColor);
    setCornerRadius(config.cornerRadius);
    setOpacity(config.opacity);
    setSelectedTemplate(config.selectedTemplate);
    setGradientType(config.gradientType);
    setGradientAngle(config.gradientAngle);
    setShadowIntensity(config.shadowIntensity);
    setShadowColor(config.shadowColor);
    setBorderWidth(config.borderWidth);
    setBorderColor(config.borderColor);
    setBorderOpacity(config.borderOpacity);
    setBlurIntensity(config.blurIntensity);
    setGlassEffect(config.glassEffect);
    setAnimationEnabled(config.animationEnabled);
    setAnimationType(config.animationType);
    setHoverEffects(config.hoverEffects);
    setTextContent(config.textContent);
    setContentLayout(config.contentLayout);
    setIconStyle(config.iconStyle);
    showToastMessage(`Loaded style "${styleToLoad.name}"`);
  }, [showToastMessage]);

  const deleteStyle = useCallback((styleId: number) => {
    setSavedStyles(prev => prev.filter(s => s.id !== styleId));
    showToastMessage("Style deleted.");
  }, [showToastMessage]);
  
  const copyToClipboard = useCallback(async (content: string, type = "Code") => {
    try {
      await navigator.clipboard.writeText(content);
      showToastMessage(`${type} copied to clipboard!`);
    } catch (err) {
      console.error("Failed to copy:", err);
      showToastMessage("Failed to copy.", 2000);
    }
  }, [showToastMessage]);

  const exportToCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const scaleFactor = 2; 
    canvas.width = cardDimensions.width * scaleFactor;
    canvas.height = cardDimensions.height * scaleFactor;
    
    ctx.save();
    ctx.scale(scaleFactor, scaleFactor);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const cardStyleObj = getCardStyle;

    // Background
    if (typeof cardStyleObj.background === 'string' && cardStyleObj.background.includes("gradient")) {
      let gradient: CanvasGradient | undefined;
      if (cardStyleObj.background.includes("linear-gradient")) {
        const angleRad = (gradientAngle - 90) * Math.PI / 180; // Adjust for 0deg = to right
        const x0 = cardDimensions.width / 2 * (1 - Math.cos(angleRad));
        const y0 = cardDimensions.height / 2 * (1 - Math.sin(angleRad));
        const x1 = cardDimensions.width / 2 * (1 + Math.cos(angleRad));
        const y1 = cardDimensions.height / 2 * (1 + Math.sin(angleRad));
        gradient = ctx.createLinearGradient(x0, y0, x1, y1);
      } else if (cardStyleObj.background.includes("radial-gradient")) {
        gradient = ctx.createRadialGradient(
          cardDimensions.width/2, cardDimensions.height/2, 0, 
          cardDimensions.width/2, cardDimensions.height/2, Math.max(cardDimensions.width, cardDimensions.height)/2
        );
      }
      // Conic gradient is hard to replicate perfectly on canvas, using primary for now or linear as fallback
      // For simplicity, this example only handles linear and radial for canvas.
      
      if (gradient) {
        gradient.addColorStop(0, backgroundColor);
        gradient.addColorStop(1, secondaryColor);
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = backgroundColor; 
      }
    } else {
      ctx.fillStyle = backgroundColor;
    }
    
    // Rounded rectangle
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(0, 0, cardDimensions.width, cardDimensions.height, cornerRadius);
    } else {
      // Fallback for browsers that don't support roundRect
      ctx.moveTo(cornerRadius, 0);
      ctx.lineTo(cardDimensions.width - cornerRadius, 0);
      ctx.quadraticCurveTo(cardDimensions.width, 0, cardDimensions.width, cornerRadius);
      ctx.lineTo(cardDimensions.width, cardDimensions.height - cornerRadius);
      ctx.quadraticCurveTo(cardDimensions.width, cardDimensions.height, cardDimensions.width - cornerRadius, cardDimensions.height);
      ctx.lineTo(cornerRadius, cardDimensions.height);
      ctx.quadraticCurveTo(0, cardDimensions.height, 0, cardDimensions.height - cornerRadius);
      ctx.lineTo(0, cornerRadius);
      ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
      ctx.closePath();
    }
    ctx.fill();

    // Text Content
    ctx.fillStyle = "#FFFFFF"; // Assuming text is white, adjust if needed
    ctx.font = `bold ${Math.max(16, cardDimensions.width / 20)}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(textContent.title, cardDimensions.width / 2, cardDimensions.height / 3);
    
    ctx.font = `${Math.max(12, cardDimensions.width / 30)}px system-ui, sans-serif`;
    const maxLineWidth = cardDimensions.width * 0.8;
    let lines: string[] = [];
    let currentLine = "";
    textContent.subtitle.split(" ").forEach(word => {
      if (ctx.measureText(currentLine + word).width < maxLineWidth) {
        currentLine += word + " ";
      } else {
        lines.push(currentLine.trim());
        currentLine = word + " ";
      }
    });
    lines.push(currentLine.trim());
    
    lines.forEach((line, index) => {
      ctx.fillText(line, cardDimensions.width / 2, cardDimensions.height / 2 + (index * (cardDimensions.width / 25)));
    });
    
    ctx.restore();

    const link = document.createElement("a");
    link.download = `card-design-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png", 0.95); 
    link.click();
    showToastMessage("Card exported as PNG.");
  }, [cardDimensions, getCardStyle, backgroundColor, secondaryColor, gradientAngle, cornerRadius, textContent, showToastMessage]);
  
  const getDevicePreviewStyle = useMemo((): React.CSSProperties => {
    switch (previewDevice) {
      case "mobile":
        return { width: "320px", height: "580px", border: "12px solid #222", borderRadius: "44px", 
                 boxShadow: "0 0 40px rgba(0,0,0,0.4)", background: "#111", padding: "10px", 
                 display: "flex", alignItems: "center", justifyContent: "center" };
      case "tablet":
        return { width: "600px", height: "820px", border: "14px solid #262626", borderRadius: "24px", 
                 boxShadow: "0 0 45px rgba(0,0,0,0.35)", background: "#181818", padding: "12px", 
                 display: "flex", alignItems: "center", justifyContent: "center" };
      default: // desktop
        return {};
    }
  }, [previewDevice]);

  const resetToDefaults = () => {
    setCardDimensions({ width: 400, height: 240 });
    setBackgroundColor("#8B5CF6"); setSecondaryColor("#EC4899");
    setCornerRadius(16); setOpacity(95);
    setSelectedTemplate("glass"); setGradientType("linear"); setGradientAngle(135);
    setShadowIntensity(20); setShadowColor("#000000");
    setBorderWidth(1); setBorderColor("#FFFFFF"); setBorderOpacity(20);
    setBlurIntensity(16); setGlassEffect(true);
    setAnimationEnabled(true); setAnimationType("float"); setHoverEffects(true);
    setTextContent({
      title: "Premium Card Design",
      subtitle: "Create stunning, modern cards with advanced styling options. Perfect for dashboards, portfolios, and modern web applications.",
      footer: "Card Editor Pro v3.0"
    });
    setContentLayout("default"); setIconStyle("gradient");
    setPreviewScale(1);
    showToastMessage("Reset to default values.");
  };

  // --------- Lifecycle Hooks (Effectek) ----------
  useEffect(() => {
    const storedStyles = localStorage.getItem("cardEditorSavedStylesV3");
    if (storedStyles) {
      try {
        setSavedStyles(JSON.parse(storedStyles));
      } catch (e) {
        console.error("Error parsing saved styles from localStorage", e);
        localStorage.removeItem("cardEditorSavedStylesV3");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cardEditorSavedStylesV3", JSON.stringify(savedStyles));
  }, [savedStyles]);

  // --------- Renderelés ----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white relative overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-600/5 rounded-full blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-pink-600/5 rounded-full blur-3xl animate-pulse opacity-30" style={{ animationDelay: "2s" }}></div>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />
      
      <header className="flex items-center justify-between p-5 border-b border-white/10 backdrop-blur-lg bg-slate-900/70 sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <Icon icon="lucide:sparkles" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white via-purple-300 to-pink-300 bg-clip-text text-transparent">
              Card Editor Pro
            </h1>
            <p className="text-xs text-gray-400">Advanced Design Suite v3.0</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            title="Documentation" 
            variant="flat" 
            className="bg-slate-800/80 hover:bg-slate-700 text-gray-300 hover:text-white border border-slate-600/50 transition-all duration-200 hover:scale-105"
            size="sm" isIconOnly
          >
            <Icon icon="lucide:book-open" className="w-4 h-4" />
          </Button>
          <Button 
            title="Reset All Styles" 
            onPress={resetToDefaults} 
            variant="flat" 
            className="bg-orange-600/80 hover:bg-orange-500 text-white transition-all duration-200 hover:scale-105"
            size="sm" isIconOnly
          >
            <Icon icon="lucide:refresh-cw" className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-[380px] bg-slate-900/70 backdrop-blur-lg border-r border-white/10 min-h-[calc(100vh-73px)] max-h-[calc(100vh-73px)] overflow-y-auto custom-scrollbar">
          <div className="p-5 space-y-5">
            
            <ControlWrapper title="Quick Templates" icon="lucide:layers">
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(templates).map(([key, template]) => (
                  <Button
                    key={key} onPress={() => applyTemplate(key)} title={template.description}
                    className={`p-3 rounded-lg text-left transition-all duration-200 group text-xs h-auto justify-start ${
                      selectedTemplate === key
                        ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg ring-2 ring-pink-400"
                        : "bg-slate-700/50 hover:bg-slate-600/50 text-gray-300 border border-slate-600/50 hover:border-purple-500/60"
                    }`}
                  >
                    <div className="flex flex-col items-start">
                      <div className="font-medium">{template.name}</div>
                      <div className="opacity-80 mt-0.5 line-clamp-2 text-xs">{template.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </ControlWrapper>

            <ControlWrapper title="Color Presets" icon="lucide:palette">
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(colorPresets).map(([key, preset]) => (
                  <Button
                    key={key} title={`Apply ${preset.name} color scheme`}
                    onPress={() => {
                      setBackgroundColor(preset.colors[0]);
                      setSecondaryColor(preset.colors[1]);
                      showToastMessage(`Applied ${preset.name}`);
                    }}
                    className="group aspect-square rounded-md overflow-hidden border-2 border-slate-600 hover:border-white/50 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500 p-0 min-w-0"
                    style={{ background: `linear-gradient(135deg, ${preset.colors[0]}, ${preset.colors[1]})` }}
                  />
                ))}
              </div>
            </ControlWrapper>
            
            <ControlWrapper title="Dimensions & Scale" icon="lucide:move">
              <div className="grid grid-cols-2 gap-3">
                <Input 
                  label="Width (px)" type="number" value={String(cardDimensions.width)} 
                  onValueChange={val => setCardDimensions(prev => ({...prev, width: Math.max(50, parseInt(val) || 0)}))}
                  size="sm" className="bg-slate-700/50 border-slate-600"
                />
                <Input 
                  label="Height (px)" type="number" value={String(cardDimensions.height)} 
                  onValueChange={val => setCardDimensions(prev => ({...prev, height: Math.max(50, parseInt(val) || 0)}))}
                  size="sm" className="bg-slate-700/50 border-slate-600"
                />
              </div>
              <RangeInput label="Preview Scale" value={previewScale} onChange={setPreviewScale} min={0.25} max={2} step={0.05} unit="x" />
            </ControlWrapper>

            <ControlWrapper title="Colors & Gradients" icon="lucide:palette">
              <ColorInput label="Primary Color" value={backgroundColor} onChange={setBackgroundColor} />
              <ColorInput label="Secondary Color" value={secondaryColor} onChange={setSecondaryColor} />
              <Select 
                label="Gradient Type" value={gradientType} onValueChange={(val) => setGradientType(val as string)}
                className="bg-slate-700/50 border-slate-600 text-white" size="sm"
              >
                <SelectItem key="linear" value="linear">Linear</SelectItem>
                <SelectItem key="radial" value="radial">Radial</SelectItem>
                <SelectItem key="conic" value="conic">Conic</SelectItem>
              </Select>
              {(gradientType === "linear" || gradientType === "conic") && (
                <RangeInput label="Gradient Angle" value={gradientAngle} onChange={setGradientAngle} min={0} max={360} unit="°" />
              )}
            </ControlWrapper>

            <ControlWrapper title="Appearance & Effects" icon="lucide:zap">
              <RangeInput label="Corner Radius" value={cornerRadius} onChange={setCornerRadius} min={0} max={Math.min(cardDimensions.width, cardDimensions.height)/2} unit="px" />
              <RangeInput label="Opacity" value={opacity} onChange={setOpacity} min={0} max={100} unit="%" />
              <RangeInput label="Shadow Intensity" value={shadowIntensity} onChange={setShadowIntensity} min={0} max={50} />
              <ColorInput label="Shadow Color" value={shadowColor} onChange={setShadowColor} />
              <Input 
                label="Border Width (px)" type="number" value={String(borderWidth)} 
                onValueChange={val => setBorderWidth(Math.max(0, parseInt(val) || 0))}
                size="sm" className="bg-slate-700/50 border-slate-600"
              />
              <ColorInput label="Border Color" value={borderColor} onChange={setBorderColor} />
              <RangeInput label="Border Opacity" value={borderOpacity} onChange={setBorderOpacity} min={0} max={100} unit="%" />
              <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded-md border border-slate-600/50">
                <span className="text-sm text-gray-200">Glassmorphism Effect</span>
                <Switch isSelected={glassEffect} onValueChange={setGlassEffect} size="sm" color="secondary"/>
              </div>
              {glassEffect && (
                <RangeInput label="Blur Intensity" value={blurIntensity} onChange={setBlurIntensity} min={0} max={40} unit="px" />
              )}
            </ControlWrapper>

            <ControlWrapper title="Animation & Interaction" icon="lucide:play">
              <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded-md border border-slate-600/50">
                <span className="text-sm text-gray-200">Enable Animation</span>
                <Switch isSelected={animationEnabled} onValueChange={setAnimationEnabled} size="sm" color="secondary"/>
              </div>
              {animationEnabled && (
                <Select 
                  label="Animation Type" value={animationType} onValueChange={(val) => setAnimationType(val as string)}
                  className="bg-slate-700/50 border-slate-600 text-white" size="sm"
                >
                  <SelectItem key="float" value="float">Float</SelectItem>
                  <SelectItem key="pulse" value="pulse">Pulse</SelectItem>
                  <SelectItem key="glow" value="glow">Glow</SelectItem>
                </Select>
              )}
              <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded-md border border-slate-600/50">
                <span className="text-sm text-gray-200">Enable Hover Effects</span>
                <Switch isSelected={hoverEffects} onValueChange={setHoverEffects} size="sm" color="secondary"/>
              </div>
            </ControlWrapper>

            <ControlWrapper title="Content & Layout" icon="lucide:type">
              <Input 
                label="Title" value={textContent.title} 
                onValueChange={val => setTextContent(p => ({...p, title: val}))}
                size="sm" className="bg-slate-700/50 border-slate-600"
              />
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Subtitle</label>
                <Textarea 
                  value={textContent.subtitle} 
                  onValueChange={val => setTextContent(p => ({...p, subtitle: val}))}
                  className="w-full bg-slate-700/50 border-slate-600 text-white text-sm h-20 resize-y"
                  size="sm"
                />
              </div>
              <Input 
                label="Footer" value={textContent.footer} 
                onValueChange={val => setTextContent(p => ({...p, footer: val}))}
                size="sm" className="bg-slate-700/50 border-slate-600"
              />
              <Select 
                label="Icon Style" value={iconStyle} onValueChange={(val) => setIconStyle(val as string)}
                className="bg-slate-700/50 border-slate-600 text-white" size="sm"
              >
                <SelectItem key="gradient" value="gradient">Gradient Icon</SelectItem>
                <SelectItem key="outline" value="outline">Outline Icon</SelectItem>
                <SelectItem key="filled" value="filled">Filled Icon</SelectItem>
              </Select>
              <Select 
                label="Content Layout" value={contentLayout} onValueChange={(val) => setContentLayout(val as string)}
                className="bg-slate-700/50 border-slate-600 text-white" size="sm"
              >
                <SelectItem key="default" value="default">Default</SelectItem>
                {/* Add other layout options here if needed */}
              </Select>
            </ControlWrapper>
            
            <ControlWrapper title="Save & Load Styles" icon="lucide:save">
              <Input 
                label="Style Name" value={currentStyleName} onValueChange={setCurrentStyleName} 
                placeholder="My Awesome Card" size="sm" className="bg-slate-700/50 border-slate-600"
              />
              <Button 
                onPress={saveCurrentStyle} 
                className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white"
                color="secondary"
              >
                <Icon icon="lucide:save" className="w-4 h-4" />
                <span>Save Current Style</span>
              </Button>
              {savedStyles.length > 0 && (
                <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar-small pr-1">
                  {savedStyles.map(style => (
                    <div key={style.id} className="flex items-center justify-between p-2 bg-slate-700/40 rounded-md border border-slate-600/40">
                      <div className="text-sm">
                        <span className="font-medium">{style.name}</span>
                        <span className="text-xs text-gray-400 block">Saved: {style.timestamp}</span>
                      </div>
                      <div className="flex space-x-1.5">
                        <Button 
                          onPress={() => loadStyle(style)} title="Load Style" isIconOnly size="sm"
                          variant="light" className="text-blue-400 hover:text-blue-300 min-w-0 w-8 h-8"
                        ><Icon icon="lucide:upload" className="w-4 h-4" /></Button>
                        <Button 
                          onPress={() => deleteStyle(style.id)} title="Delete Style" isIconOnly size="sm"
                          variant="light" className="text-red-400 hover:text-red-300 min-w-0 w-8 h-8"
                        ><Icon icon="lucide:trash-2" className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ControlWrapper>

            <ControlWrapper title="Export Options" icon="lucide:download">
              <Select 
                label="Export Format" value={exportFormat} onValueChange={(val) => setExportFormat(val as string)}
                className="bg-slate-700/50 border-slate-600 text-white" size="sm"
              >
                <SelectItem key="css" value="css">CSS</SelectItem>
                <SelectItem key="tailwind" value="tailwind">Tailwind (Approximation)</SelectItem>
                <SelectItem key="json" value="json">JSON Config</SelectItem>
              </Select>
              <Button 
                onPress={() => copyToClipboard(
                  exportFormat === "css" ? exportCSS() : 
                  exportFormat === "tailwind" ? exportTailwind() : exportJSON(), 
                  `${exportFormat.toUpperCase()} Code`
                )} 
                className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white"
                color="success"
              >
                <Icon icon="lucide:copy" className="w-4 h-4" />
                <span>Copy {exportFormat.toUpperCase()}</span>
              </Button>
              <Button 
                onPress={exportToCanvas} 
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
                color="primary"
              >
                <Icon icon="lucide:file-image" className="w-4 h-4" />
                <span>Export as PNG</span>
              </Button>
              <Button 
                onPress={() => copyToClipboard(JSON.stringify(getCardStyle, null, 2), "Current Style Object")} 
                className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Icon icon="lucide:code" className="w-4 h-4" />
                <span>Copy Style Object</span>
              </Button>
            </ControlWrapper>
          </div>
        </div>
        
        {/* Preview Area */}
        <div className={`flex-1 flex flex-col items-center justify-center p-5 transition-colors duration-300 ${
            previewBackground === "light" ? "bg-gray-200" : 
            previewBackground === "transparent" ? "bg-transparent bg-checkered-pattern" : 
            "bg-slate-800/50"
        }`}>
          <div className="w-full max-w-4xl mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button 
                onPress={() => setShowGrid(!showGrid)} title="Toggle Grid" 
                className={`rounded-lg transition-colors ${showGrid ? "bg-purple-600 text-white" : "bg-slate-700/50 text-gray-300 hover:bg-slate-600/50"}`}
                size="sm" isIconOnly
              ><Icon icon="lucide:grid" className="w-5 h-5" /></Button>
              <Select 
                value={previewBackground} onValueChange={(val) => setPreviewBackground(val as string)}
                className="bg-slate-700/50 border-slate-600 text-white" size="sm"
              >
                <SelectItem key="dark" value="dark">Dark BG</SelectItem>
                <SelectItem key="light" value="light">Light BG</SelectItem>
                <SelectItem key="transparent" value="transparent">Transparent BG</SelectItem>
              </Select>
              <Button 
                onPress={() => setPreviewMode(!previewMode)} title="Toggle Preview Mode" 
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${previewMode ? "bg-pink-600 text-white" : "bg-slate-700/50 text-gray-300 hover:bg-slate-600/50"}`}
                size="sm"
              >
                <Icon icon={previewMode ? "lucide:eye-off" : "lucide:eye"} className="w-5 h-5" />
                <span className="text-sm">{previewMode ? "Edit Mode" : "Preview Mode"}</span>
              </Button>
            </div>
            <div className="flex items-center space-x-1 p-1 bg-slate-700/50 rounded-lg border border-slate-600">
              {[
                { device: "desktop", icon: "lucide:monitor" },
                { device: "tablet", icon: "lucide:tablet" },
                { device: "mobile", icon: "lucide:smartphone" }
              ].map(item => (
                <Button
                  key={item.device} onPress={() => setPreviewDevice(item.device)} 
                  title={`${item.device.charAt(0).toUpperCase() + item.device.slice(1)} Preview`} 
                  className={`rounded-md transition-colors ${previewDevice === item.device ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white hover:bg-slate-600/70"}`}
                  size="sm" isIconOnly
                ><Icon icon={item.icon} className="w-5 h-5" /></Button>
              ))}
            </div>
          </div>

          <div 
            className={`flex items-center justify-center flex-1 w-full relative transition-all duration-300 ${showGrid ? "bg-grid-pattern" : ""} 
                       ${previewDevice !== "desktop" ? "overflow-auto custom-scrollbar-small" : ""}`}
            style={previewDevice !== "desktop" ? getDevicePreviewStyle : {}}
          >
            <div 
              style={previewDevice !== "desktop" ? {...getCardStyle, transform: "scale(1)"} : getCardStyle} 
              className={`p-6 flex flex-col justify-between relative shadow-2xl group 
                         ${hoverEffects && !previewMode ? "hover:scale-[var(--card-scale-hover,1.03)] hover:shadow-3xl" : ""} 
                         ${previewDevice !== "desktop" ? "m-auto" : ""}`}
            >
              {contentLayout === "default" && (
                <>
                  <div className="relative z-10">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 backdrop-blur-sm border border-white/20
                        ${iconStyle === "gradient" ? "bg-gradient-to-br from-white/30 to-white/10" : 
                         iconStyle === "outline" ? "border-2 border-white/50" : "bg-white/20"}`}>
                      <Icon icon="lucide:sparkles" className={`w-6 h-6 ${iconStyle === "gradient" ? "text-white" : "text-pink-300"}`} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 shadow-sm tracking-tight">{textContent.title}</h3>
                    <p className="text-white/80 text-sm leading-relaxed shadow-sm">{textContent.subtitle}</p>
                  </div>
                  <div className="relative z-10 flex items-center justify-between mt-4">
                    <div className="text-xs text-white/60">{textContent.footer}</div>
                    <div className="flex space-x-1">
                      {[1,2,3].map(i => (
                        <div key={i} className={`w-2 h-2 bg-white/${60 - i*10} rounded-full ${animationEnabled && animationType === "pulse" && getCardStyle.animation !== "none" ? "animate-pulse" : ""}`} style={{animationDelay: `${i*0.1}s`}}></div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {/* Add other content layouts here if implemented */}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        body { color-scheme: dark; }
        input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
        input[type="color"]::-webkit-color-swatch { border: none; border-radius: 0.375rem; /* rounded-md */ }
        input[type="color"]::-moz-color-swatch { border: none; border-radius: 0.375rem; }
        
        .slider::-webkit-slider-thumb {
          appearance: none; width: 18px; height: 18px; border-radius: 50%;
          background: linear-gradient(135deg, #a855f7, #ec4899); cursor: pointer;
          border: 2px solid #fff; box-shadow: 0 2px 8px rgba(168, 85, 247, 0.4);
          transition: all 0.15s ease-in-out; margin-top: -7px;
        }
        .slider::-webkit-slider-thumb:hover { transform: scale(1.15); }
        .slider::-moz-range-thumb {
          width: 18px; height: 18px; border-radius: 50%;
          background: linear-gradient(135deg, #a855f7, #ec4899); cursor: pointer;
          border: 2px solid #fff; box-shadow: 0 2px 8px rgba(168, 85, 247, 0.4);
        }
        .slider::-moz-range-track { background-color: #374151; border-radius: 0.5rem; height: 0.25rem; }
        .slider::-webkit-slider-runnable-track { background-color: #374151; border-radius: 0.5rem; height: 0.25rem; }

        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(30, 41, 59, 0.5); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #4c1d95; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #5b21b6; }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #4c1d95 rgba(30, 41, 59, 0.5); }

        .custom-scrollbar-small::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar-small::-webkit-scrollbar-track { background: rgba(51, 65, 85, 0.3); border-radius: 10px; }
        .custom-scrollbar-small::-webkit-scrollbar-thumb { background: #5b21b6; border-radius: 10px; }
        .custom-scrollbar-small::-webkit-scrollbar-thumb:hover { background: #6d28d9; }
        .custom-scrollbar-small { scrollbar-width: thin; scrollbar-color: #5b21b6 rgba(51, 65, 85, 0.3); }
        
        /* Keyframes reference the --card-scale variable from getCardStyle */
        @keyframes float { 
          0%, 100% { transform: translateY(0px) scale(var(--card-scale, 1)); } 
          50% { transform: translateY(-8px) scale(var(--card-scale, 1)); } 
        }
        @keyframes pulse { 
          0%, 100% { transform: scale(var(--card-scale, 1)); } 
          50% { transform: scale(calc(var(--card-scale, 1) * 1.03)); } 
        }
        /* Glow animation is more complex and uses boxShadow from getCardStyle directly in JS */

        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .bg-checkered-pattern {
          background-color: #808080;
          background-image: linear-gradient(45deg, #c0c0c0 25%, transparent 25%), 
                            linear-gradient(-45deg, #c0c0c0 25%, transparent 25%), 
                            linear-gradient(45deg, transparent 75%, #c0c0c0 75%), 
                            linear-gradient(-45deg, transparent 75%, #c0c0c0 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
      `}</style>
    </div>
  );
};