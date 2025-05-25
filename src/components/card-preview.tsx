import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

interface CardPreviewProps {
  cardStyle: React.CSSProperties;
  previewDevice: string;
  hoverEffects: boolean;
  previewMode: boolean;
  textContent: {
    title: string;
    subtitle: string;
    footer: string;
  };
  contentLayout: string;
  iconStyle: string;
  animationEnabled: boolean;
  animationType: string;
}

export const CardPreview: React.FC<CardPreviewProps> = ({
  cardStyle,
  previewDevice,
  hoverEffects,
  previewMode,
  textContent,
  contentLayout,
  iconStyle,
  animationEnabled,
  animationType
}) => {
  const getDevicePreviewStyle = () => {
    switch (previewDevice) {
      case 'mobile':
        return { 
          width: '320px', 
          height: '580px', 
          border: '12px solid #222', 
          borderRadius: '44px', 
          boxShadow: '0 0 40px rgba(0,0,0,0.4)', 
          background: '#111', 
          padding: '10px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        };
      case 'tablet':
        return { 
          width: '600px', 
          height: '820px', 
          border: '14px solid #262626', 
          borderRadius: '24px', 
          boxShadow: '0 0 45px rgba(0,0,0,0.35)', 
          background: '#181818', 
          padding: '12px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        };
      default: // desktop
        return {}; // No specific frame for desktop, card uses its own scale
    }
  };

  const deviceStyle = getDevicePreviewStyle();
  const finalCardStyle = previewDevice !== 'desktop' 
    ? {...cardStyle, transform: 'scale(1)'} 
    : cardStyle;

  return (
    <div style={deviceStyle} className={previewDevice !== 'desktop' ? 'm-auto' : ''}>
      <motion.div 
        style={finalCardStyle} 
        className={`p-6 flex flex-col justify-between relative shadow-2xl group ${
          hoverEffects && !previewMode ? 'hover:scale-[1.03] hover:shadow-3xl' : ''
        }`}
        whileHover={hoverEffects && !previewMode ? { scale: 1.03 } : {}}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {contentLayout === 'default' && (
          <>
            <div className="relative z-10">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 backdrop-blur-sm border border-white/20
                  ${iconStyle === 'gradient' ? 'bg-gradient-to-br from-white/30 to-white/10' : 
                   iconStyle === 'outline' ? 'border-2 border-white/50' : 'bg-white/20'}`}>
                <Icon 
                  icon="lucide:sparkles" 
                  className={`w-6 h-6 ${iconStyle === 'gradient' ? 'text-white' : 'text-pink-300'}`} 
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 shadow-sm tracking-tight">{textContent.title}</h3>
              <p className="text-white/80 text-sm leading-relaxed shadow-sm">{textContent.subtitle}</p>
            </div>
            <div className="relative z-10 flex items-center justify-between mt-4">
              <div className="text-xs text-white/60">{textContent.footer}</div>
              <div className="flex space-x-1">
                {[1,2,3].map(i => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 bg-white/${60 - i*10} rounded-full ${
                      animationEnabled && animationType === 'pulse' && cardStyle.animation !== 'none' ? 'animate-pulse' : ''
                    }`} 
                    style={{animationDelay: `${i*0.1}s`}}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};