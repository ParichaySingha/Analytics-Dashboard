import React, { createContext, useContext, useEffect, useState } from 'react';

export interface ColorPalette {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  primaryHsl: string;
  secondaryHsl: string;
  accentHsl: string;
}

export const predefinedPalettes: ColorPalette[] = [
  {
    id: 'default',
    name: 'Default Blue',
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    primaryHsl: '214 100% 60%',
    secondaryHsl: '270 95% 75%',
    accentHsl: '180 100% 65%'
  },
  {
    id: 'emerald',
    name: 'Emerald Green',
    primary: '#10b981',
    secondary: '#8b5cf6',
    accent: '#f59e0b',
    primaryHsl: '160 84% 39%',
    secondaryHsl: '270 95% 75%',
    accentHsl: '38 92% 50%'
  },
  {
    id: 'rose',
    name: 'Rose Pink',
    primary: '#f43f5e',
    secondary: '#8b5cf6',
    accent: '#f59e0b',
    primaryHsl: '346 87% 61%',
    secondaryHsl: '270 95% 75%',
    accentHsl: '38 92% 50%'
  },
  {
    id: 'purple',
    name: 'Purple',
    primary: '#8b5cf6',
    secondary: '#06b6d4',
    accent: '#f59e0b',
    primaryHsl: '270 95% 75%',
    secondaryHsl: '180 100% 65%',
    accentHsl: '38 92% 50%'
  },
  {
    id: 'orange',
    name: 'Orange',
    primary: '#f97316',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    primaryHsl: '25 95% 53%',
    secondaryHsl: '270 95% 75%',
    accentHsl: '180 100% 65%'
  },
  {
    id: 'teal',
    name: 'Teal',
    primary: '#14b8a6',
    secondary: '#8b5cf6',
    accent: '#f59e0b',
    primaryHsl: '173 80% 40%',
    secondaryHsl: '270 95% 75%',
    accentHsl: '38 92% 50%'
  },
  {
    id: 'indigo',
    name: 'Indigo',
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#f59e0b',
    primaryHsl: '238 100% 67%',
    secondaryHsl: '270 95% 75%',
    accentHsl: '38 92% 50%'
  },
  {
    id: 'chocolate',
    name: 'Chocolate',
    primary: '#d97706',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    primaryHsl: '32 95% 44%',
    secondaryHsl: '270 95% 75%',
    accentHsl: '180 100% 65%'
  }
];

interface ColorContextType {
  selectedPalette: ColorPalette;
  setSelectedPalette: (palette: ColorPalette) => void;
  customColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  setCustomColors: (colors: { primary: string; secondary: string; accent: string }) => void;
  isCustom: boolean;
  setIsCustom: (isCustom: boolean) => void;
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export const useColor = () => {
  const context = useContext(ColorContext);
  if (context === undefined) {
    throw new Error('useColor must be used within a ColorProvider');
  }
  return context;
};

interface ColorProviderProps {
  children: React.ReactNode;
}

export const ColorProvider: React.FC<ColorProviderProps> = ({ children }) => {
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette>(() => {
    const saved = localStorage.getItem('colorPalette');
    if (saved) {
      const parsed = JSON.parse(saved);
      return predefinedPalettes.find(p => p.id === parsed.id) || predefinedPalettes[0];
    }
    return predefinedPalettes[0];
  });

  const [customColors, setCustomColors] = useState(() => {
    const saved = localStorage.getItem('customColors');
    return saved ? JSON.parse(saved) : {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#06b6d4'
    };
  });

  const [isCustom, setIsCustom] = useState(() => {
    const saved = localStorage.getItem('isCustomColor');
    return saved ? JSON.parse(saved) : false;
  });

  // Apply colors to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    
    if (isCustom) {
      // Convert hex to HSL for custom colors
      const primaryHsl = hexToHsl(customColors.primary);
      const secondaryHsl = hexToHsl(customColors.secondary);
      const accentHsl = hexToHsl(customColors.accent);
      
      root.style.setProperty('--primary', primaryHsl);
      root.style.setProperty('--primary-foreground', '0 0% 100%');
      root.style.setProperty('--primary-glow', adjustHslLightness(primaryHsl, 10));
      root.style.setProperty('--secondary', secondaryHsl);
      root.style.setProperty('--secondary-foreground', '0 0% 100%');
      root.style.setProperty('--accent', accentHsl);
      root.style.setProperty('--accent-foreground', '0 0% 100%');
      root.style.setProperty('--ring', primaryHsl);
      root.style.setProperty('--sidebar-primary', primaryHsl);
      root.style.setProperty('--sidebar-ring', primaryHsl);
      
      // Update chart colors
      root.style.setProperty('--chart-1', primaryHsl);
      root.style.setProperty('--chart-2', secondaryHsl);
      root.style.setProperty('--chart-3', accentHsl);
    } else {
      // Use predefined palette
      root.style.setProperty('--primary', selectedPalette.primaryHsl);
      root.style.setProperty('--primary-foreground', '0 0% 100%');
      root.style.setProperty('--primary-glow', adjustHslLightness(selectedPalette.primaryHsl, 10));
      root.style.setProperty('--secondary', selectedPalette.secondaryHsl);
      root.style.setProperty('--secondary-foreground', '0 0% 100%');
      root.style.setProperty('--accent', selectedPalette.accentHsl);
      root.style.setProperty('--accent-foreground', '0 0% 100%');
      root.style.setProperty('--ring', selectedPalette.primaryHsl);
      root.style.setProperty('--sidebar-primary', selectedPalette.primaryHsl);
      root.style.setProperty('--sidebar-ring', selectedPalette.primaryHsl);
      
      // Update chart colors
      root.style.setProperty('--chart-1', selectedPalette.primaryHsl);
      root.style.setProperty('--chart-2', selectedPalette.secondaryHsl);
      root.style.setProperty('--chart-3', selectedPalette.accentHsl);
    }
  }, [selectedPalette, customColors, isCustom]);

  // Save to localStorage
  const handleSetPalette = (palette: ColorPalette) => {
    setSelectedPalette(palette);
    setIsCustom(false);
    localStorage.setItem('colorPalette', JSON.stringify(palette));
    localStorage.setItem('isCustomColor', 'false');
  };

  const handleSetCustomColors = (colors: { primary: string; secondary: string; accent: string }) => {
    setCustomColors(colors);
    setIsCustom(true);
    localStorage.setItem('customColors', JSON.stringify(colors));
    localStorage.setItem('isCustomColor', 'true');
  };

  const handleSetIsCustom = (custom: boolean) => {
    setIsCustom(custom);
    localStorage.setItem('isCustomColor', custom.toString());
  };

  const value: ColorContextType = {
    selectedPalette,
    setSelectedPalette: handleSetPalette,
    customColors,
    setCustomColors: handleSetCustomColors,
    isCustom,
    setIsCustom: handleSetIsCustom,
  };

  return (
    <ColorContext.Provider value={value}>
      {children}
    </ColorContext.Provider>
  );
};

// Helper functions
function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function adjustHslLightness(hsl: string, adjustment: number): string {
  const parts = hsl.split(' ');
  const lightness = parseInt(parts[2].replace('%', ''));
  const newLightness = Math.max(0, Math.min(100, lightness + adjustment));
  return `${parts[0]} ${parts[1]} ${newLightness}%`;
}
