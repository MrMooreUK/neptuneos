
import { Wifi, Thermometer, RefreshCw, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useSettings } from '@/contexts/SettingsContext';
import { convertTemperature, getTemperatureStatus } from '@/utils/temperature';

interface StatusOverviewGridProps {
  avgTemp: number;
  lastUpdated: Date;
}

const StatusOverviewGrid = ({ avgTemp, lastUpdated }: StatusOverviewGridProps) => {
  const { temperatureUnit } = useSettings();
  const avgTempStatus = getTemperatureStatus(avgTemp);

  return (
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
  );
};

export default StatusOverviewGrid;
