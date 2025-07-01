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
    if (avgTempStatus.color.includes('green')) return 'text-green-600';
    if (avgTempStatus.color.includes('red')) return 'text-red-600';
    return 'text-blue-600';
  };

  const statusCards = [
    {
      icon: Wifi,
      label: 'System Status',
      value: 'Online',
      color: 'text-green-600',
      iconColor: 'text-green-600'
    },
    {
      icon: Thermometer,
      label: 'Water Temperature',
      value: `${convertTemperature(avgTemp, temperatureUnit).toFixed(1)}°${temperatureUnit}`,
      color: getTemperatureColor(),
      iconColor: getTemperatureColor()
    },
    {
      icon: Droplets,
      label: 'Water Quality',
      value: 'Optimal',
      color: 'text-blue-600',
      iconColor: 'text-blue-600'
    },
    {
      icon: Heart,
      label: 'Fish Health',
      value: 'Excellent',
      color: 'text-green-600',
      iconColor: 'text-green-600'
    },
    {
      icon: Zap,
      label: 'Power Status',
      value: 'Stable',
      color: 'text-yellow-600',
      iconColor: 'text-yellow-600'
    },
    {
      icon: Shield,
      label: 'Security',
      value: 'Protected',
      color: 'text-purple-600',
      iconColor: 'text-purple-600'
    },
    {
      icon: RefreshCw,
      label: 'Last Updated',
      value: lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      color: 'text-gray-600',
      iconColor: 'text-gray-600'
    },
    {
      icon: Activity,
      label: 'Active Sensors',
      value: '8/8',
      color: 'text-green-600',
      iconColor: 'text-green-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
      {statusCards.map((card, index) => (
        <div key={index} className="metric-card text-center">
          <div className="flex justify-center mb-3">
            <card.icon className={`w-6 h-6 ${card.iconColor}`} />
          </div>
          
          <div className={`text-2xl font-bold ${card.color} mb-1`}>
            {card.value}
          </div>
          
          <div className="text-sm text-muted-foreground">
            {card.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusOverviewGrid;
