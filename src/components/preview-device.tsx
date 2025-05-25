import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

interface PreviewDeviceProps {
  currentDevice: string;
  onDeviceChange: (device: string) => void;
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

export const PreviewDevice: React.FC<PreviewDeviceProps> = ({ currentDevice, onDeviceChange }) => {
  const devices = [
    { device: 'desktop', icon: Monitor, label: 'Desktop Preview' },
    { device: 'tablet', icon: Tablet, label: 'Tablet Preview' },
    { device: 'mobile', icon: Smartphone, label: 'Mobile Preview' }
  ];

  return (
    <>
      {devices.map(item => {
        const IconComponent = item.icon;
        const isActive = currentDevice === item.device;
        
        return (
          <Tooltip key={item.device} content={item.label}>
            <button
              onClick={() => onDeviceChange(item.device)}
              className={`
                w-10 h-10 rounded-md flex items-center justify-center transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900
                ${isActive 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-slate-600/70'
                }
              `}
            >
              <IconComponent className="w-5 h-5" />
            </button>
          </Tooltip>
        );
      })}
    </>
  );
};

// Demo component showcasing the PreviewDevice
export default function PreviewDeviceDemo() {
  const [currentDevice, setCurrentDevice] = useState('desktop');

  const getDeviceFrameStyles = () => {
    switch (currentDevice) {
      case 'desktop':
        return 'w-full max-w-4xl h-96';
      case 'tablet':
        return 'w-full max-w-2xl h-96';
      case 'mobile':
        return 'w-full max-w-sm h-96';
      default:
        return 'w-full max-w-4xl h-96';
    }
  };

  const getDeviceIcon = () => {
    switch (currentDevice) {
      case 'desktop':
        return <Monitor className="w-8 h-8" />;
      case 'tablet':
        return <Tablet className="w-8 h-8" />;
      case 'mobile':
        return <Smartphone className="w-8 h-8" />;
      default:
        return <Monitor className="w-8 h-8" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Preview Device Selector</h1>
        
        {/* Device Selector */}
        <div className="flex items-center space-x-2 mb-8">
          <span className="text-gray-300 mr-4">Preview Mode:</span>
          <PreviewDevice 
            currentDevice={currentDevice} 
            onDeviceChange={setCurrentDevice} 
          />
        </div>

        {/* Device Preview Frame */}
        <div className="flex flex-col items-center">
          <div className={`${getDeviceFrameStyles()} bg-slate-800 rounded-lg border border-slate-700 shadow-xl transition-all duration-300 ease-in-out`}>
            <div className="h-full flex flex-col">
              {/* Mock Browser/App Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <div className="flex items-center space-x-2">
                  {getDeviceIcon()}
                  <span className="text-white font-medium capitalize">{currentDevice} Preview</span>
                </div>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>

              {/* Mock Content Area */}
              <div className="flex-1 p-6 overflow-hidden">
                <div className="space-y-4">
                  <div className="h-8 bg-slate-700 rounded animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-700 rounded animate-pulse"></div>
                    <div className="h-4 bg-slate-700 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-slate-700 rounded animate-pulse w-1/2"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="h-20 bg-slate-700 rounded animate-pulse"></div>
                    <div className="h-20 bg-slate-700 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Device Info */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Currently viewing in <span className="text-purple-400 font-semibold capitalize">{currentDevice}</span> mode
            </p>
          </div>
        </div>

        {/* Component Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-800 rounded-lg">
            <Monitor className="w-6 h-6 text-blue-400 mb-2" />
            <h3 className="font-semibold text-white mb-2">Desktop View</h3>
            <p className="text-gray-300 text-sm">Full-width layout for desktop screens and large displays</p>
          </div>
          <div className="p-4 bg-slate-800 rounded-lg">
            <Tablet className="w-6 h-6 text-green-400 mb-2" />
            <h3 className="font-semibold text-white mb-2">Tablet View</h3>
            <p className="text-gray-300 text-sm">Medium-width layout optimized for tablet devices</p>
          </div>
          <div className="p-4 bg-slate-800 rounded-lg">
            <Smartphone className="w-6 h-6 text-purple-400 mb-2" />
            <h3 className="font-semibold text-white mb-2">Mobile View</h3>
            <p className="text-gray-300 text-sm">Compact layout designed for mobile phones</p>
          </div>
        </div>
      </div>
    </div>
  );
}