import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { defaultSecurityConfig, validateNetworkEndpoint } from '@/config/security'; // Added validateNetworkEndpoint and defaultSecurityConfig

export type Theme = 'ocean' | 'coral' | 'deep-sea';

interface SettingsContextType {
  temperatureUnit: 'C' | 'F';
  isDarkMode: boolean;
  theme: Theme;
  refreshInterval: number;
  autoRefresh: boolean;
  cameraStreamUrl: string; // Added
  setTemperatureUnit: (unit: 'C' | 'F') => void;
  setIsDarkMode: (isDark: boolean) => void;
  setTheme: (theme: Theme) => void;
  setRefreshInterval: (interval: number) => void;
  setAutoRefresh: (auto: boolean) => void;
  setCameraStreamUrl: (url: string) => void; // Added
  rebootSystem: () => void;
  factoryReset: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [temperatureUnit, setTemperatureUnitState] = useState<'C' | 'F'>('C');
  const [isDarkMode, setIsDarkModeState] = useState(false);
  const [theme, setThemeState] = useState<Theme>('ocean');
  const [refreshInterval, setRefreshIntervalState] = useState(10);
  const [autoRefresh, setAutoRefreshState] = useState(true);
  const [cameraStreamUrl, setCameraStreamUrlState] = useState<string>(defaultSecurityConfig.cameraStreamUrl); // Added state for cameraStreamUrl
  const { toast } = useToast();

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('neptuneOS-settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setTemperatureUnitState(settings.temperatureUnit || 'C');
        setIsDarkModeState(settings.isDarkMode || false);
        setThemeState(settings.theme || 'ocean');
        setRefreshIntervalState(settings.refreshInterval || 10);
        setAutoRefreshState(settings.autoRefresh !== undefined ? settings.autoRefresh : true);
        setCameraStreamUrlState(settings.cameraStreamUrl || defaultSecurityConfig.cameraStreamUrl); // Load cameraStreamUrl
      } catch (error) {
        console.log('Error loading settings from localStorage:', error);
        // Fallback to defaults if parsing fails or specific keys are missing
        setCameraStreamUrlState(defaultSecurityConfig.cameraStreamUrl);
      }
    }
  }, []);

  // Apply dark mode and theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    // Apply theme
    root.classList.remove('theme-ocean', 'theme-coral', 'theme-deep-sea');
    root.classList.add(`theme-${theme}`);
  }, [isDarkMode, theme]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    const settings = {
      temperatureUnit,
      isDarkMode,
      theme,
      refreshInterval,
      autoRefresh,
      cameraStreamUrl // Save cameraStreamUrl
    };
    localStorage.setItem('neptuneOS-settings', JSON.stringify(settings));
  }, [temperatureUnit, isDarkMode, theme, refreshInterval, autoRefresh, cameraStreamUrl]);

  const setTemperatureUnit = (unit: 'C' | 'F') => {
    setTemperatureUnitState(unit);
    toast({
      title: "Temperature Unit Updated",
      description: `Temperature unit changed to °${unit}`,
    });
  };

  const setIsDarkMode = (isDark: boolean) => {
    setIsDarkModeState(isDark);
    toast({
      title: "Theme Updated",
      description: `Switched to ${isDark ? 'dark' : 'light'} mode`,
    });
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    toast({
      title: "Theme Changed",
      description: `Switched to ${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} theme`,
    });
  };

  const setRefreshInterval = (interval: number) => {
    setRefreshIntervalState(interval);
    toast({
      title: "Refresh Interval Updated",
      description: `Data will refresh every ${interval} seconds`,
    });
  };

  const setAutoRefresh = (auto: boolean) => {
    setAutoRefreshState(auto);
    toast({
      title: "Auto Refresh Updated",
      description: `Auto refresh ${auto ? 'enabled' : 'disabled'}`,
    });
  };

  const setCameraStreamUrl = (url: string) => { // Added function to set cameraStreamUrl
    if (validateNetworkEndpoint(url)) {
      setCameraStreamUrlState(url);
      toast({
        title: "Camera Stream URL Updated",
        description: `Camera stream URL configured.`,
      });
    } else {
      toast({
        title: "Invalid URL",
        description: "The provided camera stream URL is not valid. It must be http or https.",
        variant: "destructive",
      });
    }
  };

  const rebootSystem = () => {
    console.log('Rebooting system...');
    toast({
      title: "System Rebooting",
      description: "The system is rebooting. This may take a few minutes.",
    });
  };

  const factoryReset = () => {
    console.log('Factory reset initiated...');
    // Reset settings to defaults
    setTemperatureUnitState('C');
    setIsDarkModeState(false);
    setThemeState('ocean');
    setRefreshIntervalState(10);
    setAutoRefreshState(true);
    setCameraStreamUrlState(defaultSecurityConfig.cameraStreamUrl); // Reset cameraStreamUrl
    localStorage.removeItem('neptuneOS-settings'); // This will cause useEffect to save new defaults on next render.
    toast({
      title: "Factory Reset Complete",
      description: "All settings have been reset to defaults.",
    });
  };

  return (
    <SettingsContext.Provider value={{
      temperatureUnit,
      isDarkMode,
      theme,
      refreshInterval,
      autoRefresh,
      cameraStreamUrl, // Provide cameraStreamUrl
      setTemperatureUnit,
      setIsDarkMode,
      setTheme,
      setRefreshInterval,
      setAutoRefresh,
      setCameraStreamUrl, // Provide setCameraStreamUrl
      rebootSystem,
      factoryReset
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
