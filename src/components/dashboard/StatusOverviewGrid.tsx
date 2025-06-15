
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
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <Card className="hover:shadow-md transition-shadow bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200/50 dark:border-emerald-600/30">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 truncate">Online</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow bg-blue-50 dark:bg-blue-900/20 border-blue-200/50 dark:border-blue-600/30">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <Thermometer className={`w-4 h-4 flex-shrink-0 ${avgTempStatus.color.includes('green') ? 'text-green-600 dark:text-green-400' : avgTempStatus.color.includes('red') ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`} />
            <div className="min-w-0">
              <p className={`text-sm font-semibold truncate ${avgTempStatus.color.includes('green') ? 'text-green-600 dark:text-green-400' : avgTempStatus.color.includes('red') ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
                {convertTemperature(avgTemp, temperatureUnit).toFixed(1)}°{temperatureUnit}
              </p>
              <p className={`text-xs truncate ${avgTempStatus.color.includes('green') ? 'text-green-600/70 dark:text-green-400/70' : avgTempStatus.color.includes('red') ? 'text-red-600/70 dark:text-red-400/70' : 'text-blue-600/70 dark:text-blue-400/70'}`}>
                {avgTempStatus.label}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow bg-purple-50 dark:bg-purple-900/20 border-purple-200/50 dark:border-purple-600/30">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 truncate">
                {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow bg-orange-50 dark:bg-orange-900/20 border-orange-200/50 dark:border-orange-600/30">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-orange-600 dark:text-orange-400 truncate">2/2</p>
              <p className="text-xs text-orange-600/70 dark:text-orange-400/70 truncate">Active</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusOverviewGrid;
