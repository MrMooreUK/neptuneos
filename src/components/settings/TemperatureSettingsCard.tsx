
import { Thermometer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useSettings } from '@/contexts/SettingsContext';

const TemperatureSettingsCard = () => {
  const {
    temperatureUnit,
    refreshInterval,
    autoRefresh,
    setTemperatureUnit,
    setRefreshInterval,
    setAutoRefresh
  } = useSettings();

  return (
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
          <div className="flex items-center space-x-3">
            <span className={`text-sm font-medium w-6 text-center ${temperatureUnit === 'C' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>°C</span>
            <Switch 
              checked={temperatureUnit === 'F'} 
              onCheckedChange={(checked) => setTemperatureUnit(checked ? 'F' : 'C')}
            />
            <span className={`text-sm font-medium w-6 text-center ${temperatureUnit === 'F' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>°F</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1 pr-4">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Auto Refresh</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Automatically update temperature readings</p>
          </div>
          <div className="flex items-center justify-center w-[7.25rem]">
            <Switch 
              checked={autoRefresh} 
              onCheckedChange={setAutoRefresh}
            />
          </div>
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
  );
};

export default TemperatureSettingsCard;
