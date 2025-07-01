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
      color: 'text-success',
      bgColor: 'bg-success/10',
      iconColor: 'text-success'
    },
    {
      icon: Thermometer,
      label: 'Water Temperature',
      value: `${convertTemperature(avgTemp, temperatureUnit).toFixed(1)}°${temperatureUnit}`,
      color: getTemperatureColor(),
      bgColor: avgTempStatus.color.includes('green') ? 'bg-success/10' : 
               avgTempStatus.color.includes('red') ? 'bg-destructive/10' : 'bg-primary/10',
      iconColor: getTemperatureColor()
    },
    {
      icon: Droplets,
      label: 'Water Quality',
      value: 'Optimal',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary'
    },
    {
      icon: Heart,
      label: 'Fish Health',
      value: 'Excellent',
      color: 'text-success',
      bgColor: 'bg-success/10',
      iconColor: 'text-success'
    },
    {
      icon: Zap,
      label: 'Power Status',
      value: 'Stable',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      iconColor: 'text-warning'
    },
    {
      icon: Shield,
      label: 'Security',
      value: 'Protected',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      iconColor: 'text-accent'
    },
    {
      icon: RefreshCw,
      label: 'Last Updated',
      value: lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
      iconColor: 'text-muted-foreground'
    },
    {
      icon: Activity,
      label: 'Active Sensors',
      value: '8/8',
      color: 'text-success',
      bgColor: 'bg-success/10',
      iconColor: 'text-success'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
      {statusCards.map((card, index) => (
        <div
          key={index}
          className="metric-card group hover:scale-105 transition-all duration-300"
        >
          <div className={`apple-card p-3 ${card.bgColor} mb-3 w-fit mx-auto`}>
            <card.icon className={`w-5 h-5 ${card.iconColor}`} />
          </div>
          
          <div className="space-y-1">
            <div className={`metric-value ${card.color}`}>
              {card.value}
            </div>
            <div className="metric-label">
              {card.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusOverviewGrid;
