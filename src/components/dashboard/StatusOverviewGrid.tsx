
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-900/10 border-emerald-200/50 dark:border-emerald-600/30 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardContent className="p-3 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300 mb-1">System Status</p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Online</p>
              <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">All systems operational</p>
            </div>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <Wifi className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/10 border-blue-200/50 dark:border-blue-600/30 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardContent className="p-3 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">Average Temp</p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {convertTemperature(avgTemp, temperatureUnit).toFixed(1)}°{temperatureUnit}
              </p>
              <p className={`text-xs font-medium ${avgTempStatus.color.includes('green') ? 'text-green-600 dark:text-green-400' : avgTempStatus.color.includes('red') ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
                {avgTempStatus.label}
              </p>
            </div>
            <div className={`p-2 rounded-lg group-hover:scale-110 transition-transform duration-300 ${avgTempStatus.color.includes('green') ? 'bg-green-100 dark:bg-green-900/30' : avgTempStatus.color.includes('red') ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
              <Thermometer className={`w-5 h-5 ${avgTempStatus.color.includes('green') ? 'text-green-600 dark:text-green-400' : avgTempStatus.color.includes('red') ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/10 border-purple-200/50 dark:border-purple-600/30 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardContent className="p-3 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-purple-700 dark:text-purple-300 mb-1">Last Updated</p>
              <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-xs text-purple-600/70 dark:text-purple-400/70">
                {lastUpdated.toLocaleDateString()}
              </p>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <RefreshCw className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/10 border-orange-200/50 dark:border-orange-600/30 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardContent className="p-3 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-orange-700 dark:text-orange-300 mb-1">Sensors Active</p>
              <p className="text-xl font-bold text-orange-600 dark:text-orange-400">2/2</p>
              <p className="text-xs text-orange-600/70 dark:text-orange-400/70">All sensors online</p>
            </div>
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <Activity className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusOverviewGrid;
