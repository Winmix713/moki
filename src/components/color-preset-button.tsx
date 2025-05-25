import React, { useState } from 'react';

interface ColorPreset {
  name: string;
  colors: string[];
}

interface ColorPresetButtonProps {
  preset: ColorPreset;
  onApply: () => void;
}

// Custom Tooltip component
const Tooltip: React.FC<{ content: string; children: React.ReactNode }> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg whitespace-nowrap z-10">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export const ColorPresetButton: React.FC<ColorPresetButtonProps> = ({ preset, onApply }) => {
  return (
    <Tooltip content={`Apply ${preset.name} color scheme`}>
      <button
        onClick={onApply}
        className="group aspect-square p-0 min-w-0 w-12 h-12 rounded-md overflow-hidden border-2 border-slate-600 hover:border-white/50 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        style={{ background: `linear-gradient(135deg, ${preset.colors[0]}, ${preset.colors[1]})` }}
      />
    </Tooltip>
  );
};

// Demo component showcasing the ColorPresetButton
export default function ColorPresetDemo() {
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  const colorPresets: ColorPreset[] = [
    {
      name: 'Ocean Breeze',
      colors: ['#0ea5e9', '#06b6d4']
    },
    {
      name: 'Sunset Glow',
      colors: ['#f97316', '#f59e0b']
    },
    {
      name: 'Forest Green',
      colors: ['#059669', '#10b981']
    },
    {
      name: 'Purple Dream',
      colors: ['#8b5cf6', '#a855f7']
    },
    {
      name: 'Rose Garden',
      colors: ['#ec4899', '#f43f5e']
    },
    {
      name: 'Night Sky',
      colors: ['#1e293b', '#475569']
    },
    {
      name: 'Coral Reef',
      colors: ['#fb7185', '#fbbf24']
    },
    {
      name: 'Arctic Blue',
      colors: ['#3b82f6', '#8b5cf6']
    },
    {
      name: 'Emerald Mint',
      colors: ['#10b981', '#34d399']
    },
    {
      name: 'Autumn Leaves',
      colors: ['#dc2626', '#ea580c']
    },
    {
      name: 'Lavender Fields',
      colors: ['#a78bfa', '#c084fc']
    },
    {
      name: 'Golden Hour',
      colors: ['#fbbf24', '#f59e0b']
    }
  ];

  const handleApplyPreset = (preset: ColorPreset) => {
    setSelectedPreset(preset.name);
    console.log(`Applied ${preset.name} color scheme:`, preset.colors);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Color Preset Buttons</h1>
        <p className="text-gray-400 mb-8">Hover over the buttons to see tooltips, click to apply color schemes</p>
        
        {selectedPreset && (
          <div className="mb-6 p-4 bg-slate-800 rounded-lg">
            <p className="text-green-400">✓ Applied: <span className="font-semibold">{selectedPreset}</span></p>
          </div>
        )}

        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-4">
          {colorPresets.map((preset, index) => (
            <ColorPresetButton
              key={index}
              preset={preset}
              onApply={() => handleApplyPreset(preset)}
            />
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold text-white mb-4">Component Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-800 rounded-lg">
              <h3 className="font-semibold text-white mb-2">Interactive Effects</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Hover scaling animation</li>
                <li>• Border color transitions</li>
                <li>• Focus ring for accessibility</li>
                <li>• Smooth gradient backgrounds</li>
              </ul>
            </div>
            <div className="p-4 bg-slate-800 rounded-lg">
              <h3 className="font-semibold text-white mb-2">Tooltip System</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Hover-triggered tooltips</li>
                <li>• Proper positioning</li>
                <li>• Arrow indicators</li>
                <li>• Dynamic content</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}