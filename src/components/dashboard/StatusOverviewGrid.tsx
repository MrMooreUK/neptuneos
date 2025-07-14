import { Wifi, Thermometer, RefreshCw, Activity, Droplets, Zap, Shield, Heart } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { convertTemperature, getTemperatureStatus } from '@/utils/temperature';

interface StatusOverviewGridProps {
  avgTemp: number;
  lastUpdated: Date;
}

const StatusOverviewGrid = ({ avgTemp, lastUpdated }: StatusOverviewGridProps) => {
  const { temperatureUnit } = useSettings();
  const avgTempStatus = getTemperatureStatus(avgTemp);

  const getTemperatureColor = () => {
    if (avgTempStatus.color.includes('green')) return 'text-success';
    if (avgTempStatus.color.includes('red')) return 'text-destructive';
    return 'text-primary';
  };

  const statusCards = [
    {
      icon: Wifi,
      label: 'System Status',
      value: 'Online',
      color: 'text-success'
    },
    {
      icon: Thermometer,
      label: 'Temperature',
      value: `${convertTemperature(avgTemp, temperatureUnit).toFixed(1)}°${temperatureUnit}`,
      color: getTemperatureColor()
    },
    {
      icon: Activity,
      label: 'Sensors Active',
      value: '2/2',
      color: 'text-success'
    },
    {
      icon: RefreshCw,
      label: 'Last Updated',
      value: lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      color: 'text-muted-foreground'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {statusCards.map((card, index) => (
        <div key={index} className="glass-card p-4 text-center">
          <div className="flex items-center justify-center mb-3">
            <card.icon className={`w-5 h-5 ${card.color}`} />
          </div>
          <div className="space-y-1">
            <div className={`text-lg font-semibold ${card.color}`}>
              {card.value}
            </div>
            <div className="text-sm text-muted-foreground">
              {card.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusOverviewGrid;
