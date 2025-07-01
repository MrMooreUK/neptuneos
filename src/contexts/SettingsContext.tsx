import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTheme } from 'next-themes';
import { useToast } from '@/hooks/use-toast';
import { defaultSecurityConfig, validateNetworkEndpoint } from '@/config/security';
import { useAuth } from '@/contexts/AuthContext';
import { useUserSettings } from '@/hooks/useUserSettingsAPI';

export type FontFamily = 'sans' | 'serif' | 'mono';
export type LayoutDensity = 'comfortable' | 'cozy' | 'compact';

interface SettingsContextType {
  temperatureUnit: 'C' | 'F';
  isDarkMode: boolean;
  fontFamily: FontFamily;
  fontSize: number;
  layoutDensity: LayoutDensity;
  refreshInterval: number;
  autoRefresh: boolean;
  cameraStreamUrl: string;
  setTemperatureUnit: (unit: 'C' | 'F') => void;
  setIsDarkMode: (isDark: boolean) => void;
  setFontFamily: (font: FontFamily) => void;
  setFontSize: (size: number) => void;
  setLayoutDensity: (density: LayoutDensity) => void;
  setRefreshInterval: (interval: number) => void;
  setAutoRefresh: (auto: boolean) => void;
  setCameraStreamUrl: (url: string) => void;
  rebootSystem: () => void;
  factoryReset: () => void;
  isLoading: boolean;
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
  const { isAuthenticated } = useAuth();
  const { settings, setSetting, isLoading } = useUserSettings();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  // Default values
  const temperatureUnit = settings.temperatureUnit || 'C';
  const isDarkMode = theme === 'dark';
  const fontFamily = settings.fontFamily || 'sans';
  const fontSize = settings.fontSize || 100;
  const layoutDensity = settings.layoutDensity || 'comfortable';
  const refreshInterval = settings.refreshInterval || 10;
  const autoRefresh = settings.autoRefresh !== undefined ? settings.autoRefresh : true;
  const cameraStreamUrl = settings.cameraStreamUrl || defaultSecurityConfig.cameraStreamUrl;

  // Apply settings to DOM
  useEffect(() => {
    if (isAuthenticated) {
      const root = document.documentElement;
      
      // Apply font family
      root.classList.remove('font-family-serif', 'font-family-mono');
      if (fontFamily === 'serif') root.classList.add('font-family-serif');
      if (fontFamily === 'mono') root.classList.add('font-family-mono');
      
      // Apply font size
      root.style.setProperty('--font-scale', `${fontSize / 100}`);
      
      // Apply layout density
      root.classList.remove('density-cozy', 'density-compact');
      if (layoutDensity === 'cozy') root.classList.add('density-cozy');
      if (layoutDensity === 'compact') root.classList.add('density-compact');
    }
  }, [isAuthenticated, fontFamily, fontSize, layoutDensity]);

  // Sync theme with user settings
  useEffect(() => {
    if (settings.isDarkMode !== undefined && settings.isDarkMode !== isDarkMode) {
      setTheme(settings.isDarkMode ? 'dark' : 'light');
    }
  }, [settings.isDarkMode, isDarkMode, setTheme]);

  const setTemperatureUnit = (unit: 'C' | 'F') => {
    setSetting({ key: 'temperatureUnit', value: unit });
    toast({
      title: "Temperature Unit Updated",
      description: `Temperature unit changed to °${unit}`,
    });
  };

  const setIsDarkMode = (isDark: boolean) => {
    setTheme(isDark ? 'dark' : 'light');
    setSetting({ key: 'isDarkMode', value: isDark });
    toast({
      title: "Theme Updated",
      description: `Switched to ${isDark ? 'dark' : 'light'} mode`,
    });
  };

  const setFontFamily = (font: FontFamily) => {
    setSetting({ key: 'fontFamily', value: font });
    toast({
      title: "Font Changed",
      description: `UI font set to ${font.charAt(0).toUpperCase() + font.slice(1)}`,
    });
  };

  const setFontSize = (size: number) => {
    setSetting({ key: 'fontSize', value: size });
    toast({
      title: "Font Size Updated",
      description: `Base font size set to ${size}%`,
    });
  };

  const setLayoutDensity = (density: LayoutDensity) => {
    setSetting({ key: 'layoutDensity', value: density });
    toast({
      title: "Layout Density Changed",
      description: `Layout density set to ${density.charAt(0).toUpperCase() + density.slice(1)}`,
    });
  };

  const setRefreshInterval = (interval: number) => {
    setSetting({ key: 'refreshInterval', value: interval });
    toast({
      title: "Refresh Interval Updated",
      description: `Data will refresh every ${interval} seconds`,
    });
  };

  const setAutoRefresh = (auto: boolean) => {
    setSetting({ key: 'autoRefresh', value: auto });
    toast({
      title: "Auto Refresh Updated",
      description: `Auto refresh ${auto ? 'enabled' : 'disabled'}`,
    });
  };

  const setCameraStreamUrl = (url: string) => {
    if (validateNetworkEndpoint(url)) {
      setSetting({ key: 'cameraStreamUrl', value: url });
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
    const defaultSettings = {
      temperatureUnit: 'C',
      isDarkMode: false,
      fontFamily: 'sans',
      fontSize: 100,
      layoutDensity: 'comfortable',
      refreshInterval: 10,
      autoRefresh: true,
      cameraStreamUrl: defaultSecurityConfig.cameraStreamUrl,
    };
    
    Object.entries(defaultSettings).forEach(([key, value]) => {
      setSetting({ key, value });
    });
    
    setTheme('light');
    
    toast({
      title: "Factory Reset Complete",
      description: "All settings have been reset to defaults.",
    });
  };

  return (
    <SettingsContext.Provider value={{
      temperatureUnit,
      isDarkMode,
      fontFamily,
      fontSize,
      layoutDensity,
      refreshInterval,
      autoRefresh,
      cameraStreamUrl,
      setTemperatureUnit,
      setIsDarkMode,
      setFontFamily,
      setFontSize,
      setLayoutDensity,
      setRefreshInterval,
      setAutoRefresh,
      setCameraStreamUrl,
      rebootSystem,
      factoryReset,
      isLoading,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
