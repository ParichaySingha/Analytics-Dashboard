import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface GeneralPreferences {
  dashboardName: string;
  timezone: string;
  autoRefresh: boolean;
  soundAlerts: boolean;
  dataRetention: string;
  backupFrequency: string;
  chartStyle: string;
  animations: boolean;
  reducedMotion: boolean;
}

export const TIMEZONE_OPTIONS = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)', offset: '+00:00' },
  { value: 'America/New_York', label: 'Eastern Time (ET)', offset: '-05:00/-04:00' },
  { value: 'America/Chicago', label: 'Central Time (CT)', offset: '-06:00/-05:00' },
  { value: 'America/Denver', label: 'Mountain Time (MT)', offset: '-07:00/-06:00' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)', offset: '-08:00/-07:00' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)', offset: '-09:00/-08:00' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HST)', offset: '-10:00' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)', offset: '+00:00/+01:00' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)', offset: '+01:00/+02:00' },
  { value: 'Europe/Berlin', label: 'Central European Time (CET)', offset: '+01:00/+02:00' },
  { value: 'Europe/Rome', label: 'Central European Time (CET)', offset: '+01:00/+02:00' },
  { value: 'Europe/Madrid', label: 'Central European Time (CET)', offset: '+01:00/+02:00' },
  { value: 'Europe/Amsterdam', label: 'Central European Time (CET)', offset: '+01:00/+02:00' },
  { value: 'Europe/Stockholm', label: 'Central European Time (CET)', offset: '+01:00/+02:00' },
  { value: 'Europe/Vienna', label: 'Central European Time (CET)', offset: '+01:00/+02:00' },
  { value: 'Europe/Zurich', label: 'Central European Time (CET)', offset: '+01:00/+02:00' },
  { value: 'Europe/Athens', label: 'Eastern European Time (EET)', offset: '+02:00/+03:00' },
  { value: 'Europe/Helsinki', label: 'Eastern European Time (EET)', offset: '+02:00/+03:00' },
  { value: 'Europe/Moscow', label: 'Moscow Time (MSK)', offset: '+03:00' },
  { value: 'Asia/Dubai', label: 'Gulf Standard Time (GST)', offset: '+04:00' },
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST)', offset: '+05:30' },
  { value: 'Asia/Shanghai', label: 'China Standard Time (CST)', offset: '+08:00' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)', offset: '+09:00' },
  { value: 'Asia/Seoul', label: 'Korea Standard Time (KST)', offset: '+09:00' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)', offset: '+10:00/+11:00' },
  { value: 'Australia/Melbourne', label: 'Australian Eastern Time (AET)', offset: '+10:00/+11:00' },
  { value: 'Australia/Perth', label: 'Australian Western Time (AWT)', offset: '+08:00' },
  { value: 'Pacific/Auckland', label: 'New Zealand Time (NZST)', offset: '+12:00/+13:00' },
  { value: 'America/Sao_Paulo', label: 'Brasília Time (BRT)', offset: '-03:00' },
  { value: 'America/Argentina/Buenos_Aires', label: 'Argentina Time (ART)', offset: '-03:00' },
  { value: 'America/Toronto', label: 'Eastern Time (ET)', offset: '-05:00/-04:00' },
  { value: 'America/Vancouver', label: 'Pacific Time (PT)', offset: '-08:00/-07:00' },
  { value: 'America/Mexico_City', label: 'Central Time (CT)', offset: '-06:00/-05:00' },
];

interface PreferencesContextType {
  preferences: GeneralPreferences;
  updatePreferences: (updates: Partial<GeneralPreferences>) => void;
  savePreferences: () => Promise<void>;
  isLoading: boolean;
  resetToDefaults: () => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

const defaultPreferences: GeneralPreferences = {
  dashboardName: 'AI Analytics Dashboard',
  timezone: 'UTC',
  autoRefresh: true,
  soundAlerts: false,
  dataRetention: '90d',
  backupFrequency: 'weekly',
  chartStyle: 'modern',
  animations: true,
  reducedMotion: false,
};

interface PreferencesProviderProps {
  children: ReactNode;
}

export const PreferencesProvider: React.FC<PreferencesProviderProps> = ({ children }) => {
  const [preferences, setPreferences] = useState<GeneralPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const loadPreferences = () => {
      try {
        const savedPreferences = localStorage.getItem('generalPreferences');
        if (savedPreferences) {
          const parsedPreferences = JSON.parse(savedPreferences);
          setPreferences({ ...defaultPreferences, ...parsedPreferences });
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
        setPreferences(defaultPreferences);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('generalPreferences', JSON.stringify(preferences));
      } catch (error) {
        console.error('Error saving preferences:', error);
      }
    }
  }, [preferences, isLoading]);

  const updatePreferences = (updates: Partial<GeneralPreferences>) => {
    // Basic validation
    const validatedUpdates: Partial<GeneralPreferences> = {};
    
    if (updates.dashboardName !== undefined) {
      validatedUpdates.dashboardName = updates.dashboardName.trim() || defaultPreferences.dashboardName;
    }
    
    if (updates.timezone !== undefined) {
      const validTimezones = TIMEZONE_OPTIONS.map(tz => tz.value);
      validatedUpdates.timezone = validTimezones.includes(updates.timezone) ? updates.timezone : defaultPreferences.timezone;
    }
    
    if (updates.dataRetention !== undefined) {
      const validRetention = ['30d', '90d', '180d', '365d', 'forever'];
      validatedUpdates.dataRetention = validRetention.includes(updates.dataRetention) ? updates.dataRetention : defaultPreferences.dataRetention;
    }
    
    if (updates.backupFrequency !== undefined) {
      const validFrequencies = ['daily', 'weekly', 'monthly', 'manual'];
      validatedUpdates.backupFrequency = validFrequencies.includes(updates.backupFrequency) ? updates.backupFrequency : defaultPreferences.backupFrequency;
    }
    
    if (updates.chartStyle !== undefined) {
      const validStyles = ['modern', 'classic', 'minimal', 'colorful'];
      validatedUpdates.chartStyle = validStyles.includes(updates.chartStyle) ? updates.chartStyle : defaultPreferences.chartStyle;
    }
    
    // Boolean fields don't need validation
    if (updates.autoRefresh !== undefined) validatedUpdates.autoRefresh = updates.autoRefresh;
    if (updates.soundAlerts !== undefined) validatedUpdates.soundAlerts = updates.soundAlerts;
    if (updates.animations !== undefined) validatedUpdates.animations = updates.animations;
    if (updates.reducedMotion !== undefined) validatedUpdates.reducedMotion = updates.reducedMotion;
    
    setPreferences(prev => ({ ...prev, ...validatedUpdates }));
  };

  const savePreferences = async (): Promise<void> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      localStorage.setItem('generalPreferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw error;
    }
  };

  const resetToDefaults = () => {
    setPreferences(defaultPreferences);
  };

  const value: PreferencesContextType = {
    preferences,
    updatePreferences,
    savePreferences,
    isLoading,
    resetToDefaults,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = (): PreferencesContextType => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};
