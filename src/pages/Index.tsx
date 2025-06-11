import { useState, useEffect } from 'react';
import { Fish, Thermometer, Wifi, WifiOff, Camera, Lock, Settings } from 'lucide-react';
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
      // Mock API call - replace with actual endpoint
      const response = await fetch('/api/temperature');
      if (response.ok) {
        const data = await response.json();
        setTemperatureData(data);
      } else {
        throw new Error('API unavailable');
      }
    } catch (error) {
      console.log('Using mock data - API not available');
      // Mock data for demonstration
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
          <img 
            src={isDarkMode ? "/lovable-uploads/e69a2f3e-bce9-40ec-b21b-0c4ee24adebd.png" : "/lovable-uploads/7a639741-946c-4ffe-83f1-6db4098f2d5b.png"}
            alt="NeptuneOS Logo"
            className="w-16 h-16 mx-auto mb-4 wave-animation"
          />
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">Loading NeptuneOS</h2>
          <p className="text-gray-500 dark:text-gray-400">Connecting to aquarium sensors...</p>
        </div>
      </div>
    );
  }

  const avgTemp = temperatureData?.average || 0;
  const avgTempStatus = getTemperatureStatus(avgTemp);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-blue-900 transition-all duration-500">
      {/* Header */}
      <header className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md shadow-lg border-b border-blue-100 dark:border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/7a639741-946c-4ffe-83f1-6db4098f2d5b.png"
                alt="NeptuneOS Logo"
                className="w-20 h-20"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/settings">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Button>
              </Link>
              
              <div className="text-right hidden sm:block">
                <p className="text-xs text-gray-500 dark:text-gray-400">Last Updated</p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {lastUpdated.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Camera Feed */}
          <Card className="card-hover bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-orange-300 dark:border-orange-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                <Camera className="w-5 h-5 text-orange-500" />
                <span>Live Camera Feed</span>
              </CardTitle>
              <Badge variant="outline" className="text-xs">HD</Badge>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-64 text-center">
              <Camera className="w-20 h-20 text-orange-500 mb-4" />
              <h3 className="font-semibold text-orange-600 dark:text-orange-400 mb-2 text-xl">Live Video Stream</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Camera feed will appear here when connected</p>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-lg h-20 flex items-center justify-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Video placeholder</span>
              </div>
            </CardContent>
          </Card>

          {/* Temperature Readings Card */}
          <Card className="card-hover bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-blue-200 dark:border-slate-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                <Thermometer className="w-5 h-5 text-blue-500" />
                <span>Temperature Readings</span>
              </CardTitle>
              <Badge variant="outline" className="text-xs">°{temperatureUnit}</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Sensor 1 */}
                <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-slate-700">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Sensor 1</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {convertTemperature(temperatureData?.sensor1 || 0, temperatureUnit).toFixed(1)}°
                  </p>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${getTemperatureStatus(temperatureData?.sensor1 || 0).color}`}>
                    {getTemperatureStatus(temperatureData?.sensor1 || 0).label}
                  </div>
                </div>

                {/* Sensor 2 */}
                <div className="text-center p-4 rounded-lg bg-cyan-50 dark:bg-slate-700">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Sensor 2</p>
                  <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                    {convertTemperature(temperatureData?.sensor2 || 0, temperatureUnit).toFixed(1)}°
                  </p>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${getTemperatureStatus(temperatureData?.sensor2 || 0).color}`}>
                    {getTemperatureStatus(temperatureData?.sensor2 || 0).label}
                  </div>
                </div>

                {/* Average Temperature */}
                <div className={`text-center p-4 rounded-lg border-2 ${avgTempStatus.color} aqua-glow`}>
                  <p className="text-sm font-medium mb-1">Average</p>
                  <p className="text-3xl font-bold">
                    {convertTemperature(avgTemp, temperatureUnit).toFixed(1)}°
                  </p>
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 bg-white/50 dark:bg-slate-800/50">
                    {avgTempStatus.label}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Locked Add-ons at Bottom */}
        <div className="mt-8">
          <Card className="card-hover bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 border-gray-300 dark:border-slate-500 opacity-75">
            <CardContent className="flex flex-col items-center justify-center h-40 text-center">
              <Lock className="w-12 h-12 text-gray-500 dark:text-gray-400 mb-3" />
              <h3 className="font-semibold text-gray-600 dark:text-gray-300 mb-1">Features Locked</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Lighting • Filtration • Feeding</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Coming Soon</p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Simplified Footer */}
      <footer className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border-t border-blue-100 dark:border-slate-700 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0">
            <Badge variant="outline" className="text-xs">NeptuneOS v1.0</Badge>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
