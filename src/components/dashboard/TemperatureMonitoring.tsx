
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
    <div className="space-y-6">
      {/* Main Temperature Display */}
      <div className="text-center p-6 glass-card">
        <div className="flex items-center justify-center mb-4">
          <Thermometer className="w-8 h-8 text-primary mr-3" />
          <div>
            <h3 className="text-lg font-semibold">Average Temperature</h3>
            <p className="text-sm text-muted-foreground">°{temperatureUnit}</p>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-5xl font-bold text-foreground">
            {convertTemperature(avgTemp, temperatureUnit).toFixed(1)}°
          </p>
        </div>
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${avgTempStatus.color}`}>
          {avgTempStatus.color.includes('green') ? <TrendingUp className="w-4 h-4 mr-2" /> : 
           avgTempStatus.color.includes('red') ? <TrendingDown className="w-4 h-4 mr-2" /> : 
           <Thermometer className="w-4 h-4 mr-2" />}
          {avgTempStatus.label}
        </div>
      </div>

      {/* Individual Sensors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-4 text-center">
          <div className="flex items-center justify-center mb-3">
            <Thermometer className="w-5 h-5 text-primary mr-2" />
            <span className="text-sm font-medium">Sensor 1</span>
          </div>
          <p className="text-2xl font-bold text-foreground mb-2">
            {convertTemperature(temperatureData?.sensor1 || 0, temperatureUnit).toFixed(1)}°
          </p>
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${sensor1Status.color}`}>
            {sensor1Status.label}
          </div>
        </div>

        <div className="glass-card p-4 text-center">
          <div className="flex items-center justify-center mb-3">
            <Thermometer className="w-5 h-5 text-primary mr-2" />
            <span className="text-sm font-medium">Sensor 2</span>
          </div>
          <p className="text-2xl font-bold text-foreground mb-2">
            {convertTemperature(temperatureData?.sensor2 || 0, temperatureUnit).toFixed(1)}°
          </p>
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${sensor2Status.color}`}>
            {sensor2Status.label}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemperatureMonitoring;
