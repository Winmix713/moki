import React from 'react';

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const ColorInput: React.FC<ColorInputProps> = ({ label, value, onChange }) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Validate hex color format
    if (newValue.match(/^#[0-9A-Fa-f]{0,6}$/)) {
      onChange(newValue);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div>
      <label className="text-sm text-gray-300 mb-1 block">{label}</label>
      <div className="flex items-center space-x-2">
        <input
          type="color"
          value={value}
          onChange={handleColorChange}
          className="w-10 h-10 p-0 border-none rounded-md cursor-pointer bg-transparent appearance-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-slate-800 focus:ring-purple-500 focus:outline-none"
          style={{
            WebkitAppearance: 'none',
            MozAppearance: 'none'
          }}
        />
        <input
          type="text"
          value={value}
          onChange={handleTextChange}
          className="flex-1 px-3 py-2 text-sm bg-slate-700/50 text-white border border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          placeholder="#000000"
        />
      </div>
    </div>
  );
};

// Demo component to show the ColorInput in action
export default function ColorInputDemo() {
  const [primaryColor, setPrimaryColor] = React.useState('#3b82f6');
  const [secondaryColor, setSecondaryColor] = React.useState('#8b5cf6');
  const [accentColor, setAccentColor] = React.useState('#f59e0b');

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white mb-8">Color Input Component</h1>
        
        <ColorInput
          label="Primary Color"
          value={primaryColor}
          onChange={setPrimaryColor}
        />
        
        <ColorInput
          label="Secondary Color"
          value={secondaryColor}
          onChange={setSecondaryColor}
        />
        
        <ColorInput
          label="Accent Color"
          value={accentColor}
          onChange={setAccentColor}
        />

        {/* Preview section */}
        <div className="mt-8 p-4 bg-slate-800 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Color Preview</h3>
          <div className="flex space-x-4">
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-lg mb-2"
                style={{ backgroundColor: primaryColor }}
              ></div>
              <p className="text-xs text-gray-400">Primary</p>
            </div>
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-lg mb-2"
                style={{ backgroundColor: secondaryColor }}
              ></div>
              <p className="text-xs text-gray-400">Secondary</p>
            </div>
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-lg mb-2"
                style={{ backgroundColor: accentColor }}
              ></div>
              <p className="text-xs text-gray-400">Accent</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}