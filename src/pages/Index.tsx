
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
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg shadow-sm border-b border-blue-200/50 dark:border-slate-700/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
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
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Status Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-green-200/50 dark:border-green-600/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">System Status</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">Online</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Wifi className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-blue-200/50 dark:border-blue-600/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Average Temp</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {convertTemperature(avgTemp, temperatureUnit).toFixed(1)}°{temperatureUnit}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${avgTempStatus.color.includes('green') ? 'bg-green-100 dark:bg-green-900/30' : avgTempStatus.color.includes('red') ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                  <Thermometer className={`w-6 h-6 ${avgTempStatus.color.includes('green') ? 'text-green-600 dark:text-green-400' : avgTempStatus.color.includes('red') ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-purple-200/50 dark:border-purple-600/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Last Updated</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <RefreshCw className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-orange-200/50 dark:border-orange-600/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Sensors Active</p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">2/2</p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <Activity className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Camera Feed - Now positioned above temperature monitoring */}
        <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-orange-200/50 dark:border-orange-600/30">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Camera className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-gray-900 dark:text-gray-100">Live Camera Feed</span>
              </div>
              <Badge variant="outline" className="text-xs text-green-600 border-green-200">Live</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video bg-gray-100 dark:bg-slate-700 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-slate-600">
              <div className="text-center">
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                <p className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-1">Camera Initializing...</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">HD live feed will appear here</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-700/50 rounded-lg px-4 py-3">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Resolution: 1080p</span>
                </span>
                <span>FPS: 30</span>
              </div>
              <span>Stream Quality: HD</span>
            </div>
          </CardContent>
        </Card>

        {/* Temperature Monitoring - Now below live feed */}
        <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-blue-200/50 dark:border-blue-600/30">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Thermometer className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-gray-900 dark:text-gray-100">Temperature Monitoring</span>
              </div>
              <Badge variant="outline" className="text-xs">°{temperatureUnit}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Temperature Overview */}
            <div className={`text-center p-8 rounded-xl border-2 ${avgTempStatus.color.includes('green') ? 'border-green-200 bg-green-50 dark:border-green-600/30 dark:bg-green-900/20' : avgTempStatus.color.includes('red') ? 'border-red-200 bg-red-50 dark:border-red-600/30 dark:bg-red-900/20' : 'border-blue-200 bg-blue-50 dark:border-blue-600/30 dark:bg-blue-900/20'}`}>
              <p className="text-sm font-medium mb-3 text-gray-600 dark:text-gray-400">Current Average Temperature</p>
              <p className="text-5xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                {convertTemperature(avgTemp, temperatureUnit).toFixed(1)}°
              </p>
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${avgTempStatus.color}`}>
                {avgTempStatus.label}
              </div>
            </div>

            {/* Individual Sensors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-6 rounded-xl bg-blue-50 dark:bg-slate-700/50 border border-blue-200 dark:border-slate-600">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                    <Thermometer className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Sensor 1 (Intake)</p>
                </div>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-3">
                  {convertTemperature(temperatureData?.sensor1 || 0, temperatureUnit).toFixed(1)}°
                </p>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTemperatureStatus(temperatureData?.sensor1 || 0).color}`}>
                  {getTemperatureStatus(temperatureData?.sensor1 || 0).label}
                </div>
              </div>

              <div className="text-center p-6 rounded-xl bg-cyan-50 dark:bg-slate-700/50 border border-cyan-200 dark:border-slate-600">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg mr-3">
                    <Thermometer className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Sensor 2 (Output)</p>
                </div>
                <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-3">
                  {convertTemperature(temperatureData?.sensor2 || 0, temperatureUnit).toFixed(1)}°
                </p>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTemperatureStatus(temperatureData?.sensor2 || 0).color}`}>
                  {getTemperatureStatus(temperatureData?.sensor2 || 0).label}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon Features */}
        <Card className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-slate-800/50 dark:to-slate-700/50 border border-gray-200/50 dark:border-slate-600/30">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-full">
                  <Lock className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Advanced Features</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Automated feeding • Smart lighting • Water quality monitoring</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">Coming Soon</Badge>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border-t border-blue-100 dark:border-slate-700 mt-12">
        <div className="container mx-auto px-6 py-6">
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
