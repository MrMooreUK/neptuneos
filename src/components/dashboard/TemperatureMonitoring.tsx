
import { Thermometer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSettings } from '@/contexts/SettingsContext';
import { convertTemperature, getTemperatureStatus } from '@/utils/temperature';

interface TemperatureData {
  sensor1: number;
  sensor2: number;
  average: number;
  timestamp: string;
}

interface TemperatureMonitoringProps {
  temperatureData: TemperatureData | null;
}

const TemperatureMonitoring = ({ temperatureData }: TemperatureMonitoringProps) => {
  const { temperatureUnit } = useSettings();
  const avgTemp = temperatureData?.average || 0;
  const avgTempStatus = getTemperatureStatus(avgTemp);

  return (
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
  );
};

export default TemperatureMonitoring;
