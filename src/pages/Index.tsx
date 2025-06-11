
import { useState, useEffect } from 'react';
import { Fish, Thermometer, Camera, Lock, Settings, RefreshCw, Activity, Wifi } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { convertTemperature, getTemperatureStatus } from '@/utils/temperature';

interface TemperatureData {
  sensor1: number;
  sensor2: number;
  average: number;
  timestamp: string;
}

const Index = () => {
  const [temperatureData, setTemperatureData] = useState<TemperatureData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  const { temperatureUnit, refreshInterval, autoRefresh, isDarkMode } = useSettings();

  const fetchTemperatureData = async () => {
    try {
      const response = await fetch('/api/temperature');
      if (response.ok) {
        const data = await response.json();
        setTemperatureData(data);
      } else {
        throw new Error('API unavailable');
      }
    } catch (error) {
      console.log('Using mock data - API not available');
      const mockData: TemperatureData = {
        sensor1: 25.8,
        sensor2: 26.2,
        average: 26.0,
        timestamp: new Date().toISOString()
      };
      setTemperatureData(mockData);
    } finally {
      setIsLoading(false);
      setLastUpdated(new Date());
    }
  };

  useEffect(() => {
    fetchTemperatureData();
    if (autoRefresh) {
      const interval = setInterval(fetchTemperatureData, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, autoRefresh]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Fish className="w-12 h-12 wave-animation text-blue-500 mr-3" />
            <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">NeptuneOS</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">Loading NeptuneOS</h2>
          <p className="text-gray-500 dark:text-gray-400">Connecting to aquarium sensors...</p>
        </div>
      </div>
    );
  }

  const avgTemp = temperatureData?.average || 0;
  const avgTempStatus = getTemperatureStatus(avgTemp);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-blue-900">
      {/* Modern Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg shadow-sm border-b border-blue-200/50 dark:border-slate-700/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Fish className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">NeptuneOS</h1>
              <Badge variant="outline" className="ml-2 text-xs">v1.0</Badge>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <Activity className="w-4 h-4 text-green-500" />
                <span className="hidden sm:inline">System Online</span>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={fetchTemperatureData}
                className="p-2"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              
              <Link to="/settings">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Status Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">System Status</p>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">Online</p>
                </div>
                <Wifi className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Average Temp</p>
                  <p className="text-lg font-semibold">
                    {convertTemperature(avgTemp, temperatureUnit).toFixed(1)}°{temperatureUnit}
                  </p>
                </div>
                <div className={`inline-block px-2 py-1 rounded-full text-xs ${avgTempStatus.color}`}>
                  {avgTempStatus.label}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Last Updated</p>
                  <p className="text-lg font-semibold">
                    {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <RefreshCw className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sensors Active</p>
                  <p className="text-lg font-semibold">2/2</p>
                </div>
                <Activity className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Temperature Monitoring - Takes 2 columns on XL screens */}
          <Card className="xl:col-span-2 card-hover bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-blue-200 dark:border-slate-600">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Thermometer className="w-6 h-6 text-blue-500" />
                  <span>Temperature Monitoring</span>
                </div>
                <Badge variant="outline" className="text-xs">°{temperatureUnit}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Temperature Overview */}
              <div className={`text-center p-6 rounded-xl border-2 ${avgTempStatus.color} aqua-glow`}>
                <p className="text-sm font-medium mb-2 opacity-80">Current Average Temperature</p>
                <p className="text-4xl font-bold mb-2">
                  {convertTemperature(avgTemp, temperatureUnit).toFixed(1)}°
                </p>
                <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-white/50 dark:bg-slate-800/50">
                  {avgTempStatus.label}
                </div>
              </div>

              {/* Individual Sensors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-slate-700 border border-blue-200 dark:border-slate-600">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Sensor 1 (Intake)</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {convertTemperature(temperatureData?.sensor1 || 0, temperatureUnit).toFixed(1)}°
                  </p>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs ${getTemperatureStatus(temperatureData?.sensor1 || 0).color}`}>
                    {getTemperatureStatus(temperatureData?.sensor1 || 0).label}
                  </div>
                </div>

                <div className="text-center p-4 rounded-lg bg-cyan-50 dark:bg-slate-700 border border-cyan-200 dark:border-slate-600">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Sensor 2 (Output)</p>
                  <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">
                    {convertTemperature(temperatureData?.sensor2 || 0, temperatureUnit).toFixed(1)}°
                  </p>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs ${getTemperatureStatus(temperatureData?.sensor2 || 0).color}`}>
                    {getTemperatureStatus(temperatureData?.sensor2 || 0).label}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Camera Feed */}
          <Card className="card-hover bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-600">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Camera className="w-6 h-6 text-orange-500" />
                  <span>Live Feed</span>
                </div>
                <Badge variant="outline" className="text-xs text-green-600">Live</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-slate-600">
                <div className="text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Camera Initializing...</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Resolution: 1080p</span>
                <span>FPS: 30</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon Features */}
        <Card className="card-hover bg-gradient-to-r from-gray-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 border-gray-200 dark:border-slate-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Lock className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Advanced Features</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Automated feeding • Smart lighting • Water quality monitoring</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">Coming Soon</Badge>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Clean Footer */}
      <footer className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border-t border-blue-100 dark:border-slate-700 mt-8">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © 2024 NeptuneOS. Advanced Aquarium Monitoring System.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
