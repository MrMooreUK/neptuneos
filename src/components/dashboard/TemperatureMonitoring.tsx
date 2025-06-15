
import { Thermometer, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSettings } from '@/contexts/SettingsContext';
import { convertTemperature, getTemperatureStatus } from '@/utils/temperature';
import { TemperatureData } from '@/hooks/useTemperatureData';

interface TemperatureMonitoringProps {
  temperatureData: TemperatureData | null;
}

const TemperatureMonitoring = ({ temperatureData }: TemperatureMonitoringProps) => {
  const { temperatureUnit } = useSettings();
  const avgTemp = temperatureData?.average || 0;
  const avgTempStatus = getTemperatureStatus(avgTemp);
  const sensor1Status = getTemperatureStatus(temperatureData?.sensor1 || 0);
  const sensor2Status = getTemperatureStatus(temperatureData?.sensor2 || 0);

  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-slate-800/80 dark:to-blue-900/50 backdrop-blur-sm border border-blue-200/50 dark:border-blue-600/30 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <CardHeader className="pb-6 relative z-10">
        <CardTitle className="text-2xl font-bold flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/30 rounded-xl">
              <Thermometer className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <span className="text-gray-900 dark:text-gray-100">Temperature Control</span>
              <p className="text-sm font-normal text-gray-600 dark:text-gray-400 mt-1">Real-time monitoring system</p>
            </div>
          </div>
          <Badge variant="outline" className="text-sm px-3 py-1">°{temperatureUnit}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 relative z-10">
        {/* Main Temperature Display */}
        <div className={`text-center p-8 rounded-2xl border-2 backdrop-blur-sm ${avgTempStatus.color.includes('green') ? 'border-green-200 bg-gradient-to-br from-green-50/90 to-emerald-50/90 dark:border-green-600/30 dark:from-green-900/30 dark:to-emerald-900/20' : avgTempStatus.color.includes('red') ? 'border-red-200 bg-gradient-to-br from-red-50/90 to-rose-50/90 dark:border-red-600/30 dark:from-red-900/30 dark:to-rose-900/20' : 'border-blue-200 bg-gradient-to-br from-blue-50/90 to-cyan-50/90 dark:border-blue-600/30 dark:from-blue-900/30 dark:to-cyan-900/20'}`}>
          <p className="text-sm font-semibold mb-4 text-gray-600 dark:text-gray-300 uppercase tracking-wider">Average Temperature</p>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <p className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-gray-100">
              {convertTemperature(avgTemp, temperatureUnit).toFixed(1)}
            </p>
            <span className="text-2xl text-gray-500 dark:text-gray-400">°{temperatureUnit}</span>
          </div>
          <div className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-bold ${avgTempStatus.color} shadow-lg`}>
            {avgTempStatus.color.includes('green') ? <TrendingUp className="w-4 h-4 mr-2" /> : 
             avgTempStatus.color.includes('red') ? <TrendingDown className="w-4 h-4 mr-2" /> : 
             <Thermometer className="w-4 h-4 mr-2" />}
            {avgTempStatus.label}
          </div>
        </div>

        {/* Individual Sensors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group/sensor hover:scale-105 transition-transform duration-300">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50/90 to-indigo-50/90 dark:from-slate-700/70 dark:to-blue-800/50 border border-blue-200/50 dark:border-slate-600/50 backdrop-blur-sm">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl mr-3 group-hover/sensor:scale-110 transition-transform duration-300">
                  <Thermometer className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Sensor 1</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Intake Monitor</p>
                </div>
              </div>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-3">
                {convertTemperature(temperatureData?.sensor1 || 0, temperatureUnit).toFixed(1)}°
              </p>
              <div className={`inline-block px-4 py-2 rounded-full text-xs font-semibold ${sensor1Status.color} shadow-md`}>
                {sensor1Status.label}
              </div>
            </div>
          </div>

          <div className="group/sensor hover:scale-105 transition-transform duration-300">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-cyan-50/90 to-teal-50/90 dark:from-slate-700/70 dark:to-cyan-800/50 border border-cyan-200/50 dark:border-slate-600/50 backdrop-blur-sm">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-cyan-100 dark:bg-cyan-900/50 rounded-xl mr-3 group-hover/sensor:scale-110 transition-transform duration-300">
                  <Thermometer className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Sensor 2</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Output Monitor</p>
                </div>
              </div>
              <p className="text-4xl font-bold text-cyan-600 dark:text-cyan-400 mb-3">
                {convertTemperature(temperatureData?.sensor2 || 0, temperatureUnit).toFixed(1)}°
              </p>
              <div className={`inline-block px-4 py-2 rounded-full text-xs font-semibold ${sensor2Status.color} shadow-md`}>
                {sensor2Status.label}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemperatureMonitoring;
