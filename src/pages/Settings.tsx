import { ArrowLeft, Thermometer, Monitor, Wifi, HardDrive, RotateCcw, Power, Download, Upload, Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const Settings = () => {
  const {
    temperatureUnit,
    isDarkMode,
    refreshInterval,
    autoRefresh,
    setTemperatureUnit,
    setIsDarkMode,
    setRefreshInterval,
    setAutoRefresh,
    rebootSystem,
    factoryReset
  } = useSettings();
  
  const { toast } = useToast();

  const handleBackupExport = () => {
    console.log('Exporting backup...');
    toast({
      title: "Backup Export",
      description: "System configuration has been exported successfully.",
    });
  };

  const handleBackupImport = () => {
    console.log('Importing backup...');
    toast({
      title: "Backup Import",
      description: "System configuration has been imported successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-blue-900 transition-all duration-500">
      {/* Header */}
      <header className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md shadow-lg border-b border-blue-100 dark:border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <img 
                src={isDarkMode ? "/lovable-uploads/e69a2f3e-bce9-40ec-b21b-0c4ee24adebd.png" : "/lovable-uploads/7a639741-946c-4ffe-83f1-6db4098f2d5b.png"}
                alt="NeptuneOS Logo"
                className="w-12 h-12"
              />
            </div>
            
            <Badge variant="outline" className="text-xs">NeptuneOS v1.0</Badge>
          </div>
        </div>
      </header>

      {/* Settings Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Temperature Settings */}
          <Card className="card-hover bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-blue-200 dark:border-slate-600">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Thermometer className="w-5 h-5 text-blue-500" />
                <span>Temperature Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Temperature Unit</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Choose between Celsius and Fahrenheit</p>
                </div>
                <div className="flex items-center space-x-3 min-w-fit">
                  <span className={`text-sm font-medium min-w-[24px] text-center ${temperatureUnit === 'C' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>°C</span>
                  <Switch 
                    checked={temperatureUnit === 'F'} 
                    onCheckedChange={(checked) => setTemperatureUnit(checked ? 'F' : 'C')}
                  />
                  <span className={`text-sm font-medium min-w-[24px] text-center ${temperatureUnit === 'F' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>°F</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Auto Refresh</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Automatically update temperature readings</p>
                </div>
                <Switch 
                  checked={autoRefresh} 
                  onCheckedChange={setAutoRefresh}
                />
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Refresh Interval</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">How often to update readings (seconds)</p>
                <div className="flex space-x-2">
                  {[5, 10, 30, 60].map((interval) => (
                    <Button
                      key={interval}
                      variant={refreshInterval === interval ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRefreshInterval(interval)}
                    >
                      {interval}s
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card className="card-hover bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-purple-200 dark:border-slate-600">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5 text-purple-500" />
                <span>Appearance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Dark Mode</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark themes</p>
                </div>
                <Switch 
                  checked={isDarkMode} 
                  onCheckedChange={setIsDarkMode}
                />
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card className="card-hover bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-green-200 dark:border-slate-600">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="w-5 h-5 text-green-500" />
                <span>System Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Uptime</span>
                <span className="font-medium text-green-600 dark:text-green-400">2d 14h 32m</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">CPU Usage</span>
                <span className="font-medium">23%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Memory Usage</span>
                <span className="font-medium">456MB / 1GB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Storage</span>
                <span className="font-medium">12.3GB / 32GB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">IP Address</span>
                <span className="font-mono text-sm text-blue-600 dark:text-blue-400">192.168.1.42</span>
              </div>
            </CardContent>
          </Card>

          {/* Network Settings */}
          <Card className="card-hover bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-cyan-200 dark:border-slate-600">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wifi className="w-5 h-5 text-cyan-500" />
                <span>Network</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Connection Status</span>
                <Badge variant="default" className="status-live">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">SSID</span>
                <span className="font-medium">AquariumNet</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Signal Strength</span>
                <span className="font-medium">-45 dBm (Excellent)</span>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                Configure WiFi
              </Button>
            </CardContent>
          </Card>

          {/* Backup & Recovery */}
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

          {/* System Controls */}
          <Card className="card-hover bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-red-200 dark:border-red-600 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Power className="w-5 h-5 text-red-500" />
                <span>System Controls</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center space-x-2">
                      <RotateCcw className="w-4 h-4" />
                      <span>Reboot System</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reboot System</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to reboot the system? This will temporarily disconnect the monitoring.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button variant="destructive" onClick={rebootSystem}>Reboot Now</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="flex items-center space-x-2">
                      <Power className="w-4 h-4" />
                      <span>Factory Reset</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Factory Reset</DialogTitle>
                      <DialogDescription>
                        This will reset all settings to their default values. This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button variant="destructive" onClick={factoryReset}>Reset Now</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
};

export default Settings;
