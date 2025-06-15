
import React from 'react';
import { HardDrive, Download, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/contexts/SettingsContext';

const BackupRecoveryCard = () => {
  const { toast } = useToast();
  const { 
    temperatureUnit,
    isDarkMode,
    refreshInterval,
    autoRefresh,
    cameraStreamUrl,
    setTemperatureUnit,
    setIsDarkMode,
    setRefreshInterval,
    setAutoRefresh,
    setCameraStreamUrl,
  } = useSettings();

  const handleBackupExport = () => {
    const settingsToExport = {
      temperatureUnit,
      isDarkMode,
      refreshInterval,
      autoRefresh,
      cameraStreamUrl,
    };
    const blob = new Blob([JSON.stringify(settingsToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const date = new Date().toISOString().split('T')[0];
    link.download = `neptuneos-settings-backup-${date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Backup Exported",
      description: "Your settings have been exported successfully.",
    });
  };

  const handleBackupImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedSettings = JSON.parse(event.target?.result as string);
          
          if (
            typeof importedSettings.temperatureUnit === 'string' && (importedSettings.temperatureUnit === 'C' || importedSettings.temperatureUnit === 'F') &&
            typeof importedSettings.isDarkMode === 'boolean' &&
            typeof importedSettings.refreshInterval === 'number' &&
            typeof importedSettings.autoRefresh === 'boolean' &&
            typeof importedSettings.cameraStreamUrl === 'string'
          ) {
            setTemperatureUnit(importedSettings.temperatureUnit);
            setIsDarkMode(importedSettings.isDarkMode);
            setRefreshInterval(importedSettings.refreshInterval);
            setAutoRefresh(importedSettings.autoRefresh);
            setCameraStreamUrl(importedSettings.cameraStreamUrl);

            toast({
              title: "Backup Imported",
              description: "All settings have been restored from the backup file.",
            });
          } else {
            throw new Error("Invalid backup file format or content.");
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          toast({
            title: "Import Failed",
            description: `Could not import settings. ${errorMessage}`,
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <Card className="card-hover bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-orange-200 dark:border-slate-600 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <HardDrive className="w-5 h-5 text-orange-500" />
          <span>Backup & Recovery</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" onClick={handleBackupExport} className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Backup</span>
          </Button>
          <Button variant="outline" onClick={handleBackupImport} className="flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Import Backup</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackupRecoveryCard;
