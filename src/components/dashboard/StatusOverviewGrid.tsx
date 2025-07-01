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

  const statusCards = [
    {
      icon: Wifi,
      label: 'System Status',
      value: 'Online',
      subtext: 'All systems operational',
      color: 'emerald',
      gradient: 'from-emerald-500 to-green-500',
      bgGradient: 'from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30',
      borderColor: 'border-emerald-200/50 dark:border-emerald-600/30',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      hasIndicator: true
    },
    {
      icon: Thermometer,
      label: 'Water Temperature',
      value: `${convertTemperature(avgTemp, temperatureUnit).toFixed(1)}°${temperatureUnit}`,
      subtext: avgTempStatus.label,
      color: avgTempStatus.color.includes('green') ? 'green' : avgTempStatus.color.includes('red') ? 'red' : 'blue',
      gradient: avgTempStatus.color.includes('green') ? 'from-green-500 to-emerald-500' : avgTempStatus.color.includes('red') ? 'from-red-500 to-orange-500' : 'from-blue-500 to-cyan-500',
      bgGradient: avgTempStatus.color.includes('green') ? 'from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30' : avgTempStatus.color.includes('red') ? 'from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30' : 'from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30',
      borderColor: avgTempStatus.color.includes('green') ? 'border-green-200/50 dark:border-green-600/30' : avgTempStatus.color.includes('red') ? 'border-red-200/50 dark:border-red-600/30' : 'border-blue-200/50 dark:border-blue-600/30',
      textColor: avgTempStatus.color.includes('green') ? 'text-green-700 dark:text-green-300' : avgTempStatus.color.includes('red') ? 'text-red-700 dark:text-red-300' : 'text-blue-700 dark:text-blue-300',
      iconColor: avgTempStatus.color.includes('green') ? 'text-green-600 dark:text-green-400' : avgTempStatus.color.includes('red') ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400',
      hasIndicator: false
    },
    {
      icon: Droplets,
      label: 'Water Quality',
      value: 'Optimal',
      subtext: 'pH 7.2 • Clean',
      color: 'cyan',
      gradient: 'from-cyan-500 to-teal-500',
      bgGradient: 'from-cyan-50 to-teal-50 dark:from-cyan-900/30 dark:to-teal-900/30',
      borderColor: 'border-cyan-200/50 dark:border-cyan-600/30',
      textColor: 'text-cyan-700 dark:text-cyan-300',
      iconColor: 'text-cyan-600 dark:text-cyan-400',
      hasIndicator: true
    },
    {
      icon: Heart,
      label: 'Fish Health',
      value: 'Excellent',
      subtext: 'Active & feeding',
      color: 'pink',
      gradient: 'from-pink-500 to-rose-500',
      bgGradient: 'from-pink-50 to-rose-50 dark:from-pink-900/30 dark:to-rose-900/30',
      borderColor: 'border-pink-200/50 dark:border-pink-600/30',
      textColor: 'text-pink-700 dark:text-pink-300',
      iconColor: 'text-pink-600 dark:text-pink-400',
      hasIndicator: true
    },
    {
      icon: Zap,
      label: 'Power Status',
      value: 'Stable',
      subtext: '230V • 2.1A',
      color: 'yellow',
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30',
      borderColor: 'border-yellow-200/50 dark:border-yellow-600/30',
      textColor: 'text-yellow-700 dark:text-yellow-300',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      hasIndicator: false
    },
    {
      icon: Shield,
      label: 'Security',
      value: 'Protected',
      subtext: 'All sensors active',
      color: 'indigo',
      gradient: 'from-indigo-500 to-purple-500',
      bgGradient: 'from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30',
      borderColor: 'border-indigo-200/50 dark:border-indigo-600/30',
      textColor: 'text-indigo-700 dark:text-indigo-300',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      hasIndicator: true
    },
    {
      icon: RefreshCw,
      label: 'Last Updated',
      value: lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      subtext: 'Auto-refresh active',
      color: 'purple',
      gradient: 'from-purple-500 to-violet-500',
      bgGradient: 'from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30',
      borderColor: 'border-purple-200/50 dark:border-purple-600/30',
      textColor: 'text-purple-700 dark:text-purple-300',
      iconColor: 'text-purple-600 dark:text-purple-400',
      hasIndicator: false
    },
    {
      icon: Activity,
      label: 'Active Sensors',
      value: '8/8',
      subtext: 'All operational',
      color: 'emerald',
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30',
      borderColor: 'border-emerald-200/50 dark:border-emerald-600/30',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      hasIndicator: true
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-4">
      {statusCards.map((card, index) => (
        <div
          key={index}
          className={`relative group metric-card bg-gradient-to-br ${card.bgGradient} ${card.borderColor} hover:shadow-xl transition-all duration-300 hover:scale-105`}
        >
          {/* Gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
          
          {/* Status indicator */}
          {card.hasIndicator && (
            <div className="absolute top-3 right-3">
              <div className={`w-2 h-2 rounded-full ${card.iconColor.replace('text-', 'bg-')} animate-pulse`}></div>
            </div>
          )}
          
          <div className="relative z-10 flex flex-col items-center text-center p-4 space-y-3">
            <div className={`p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300`}>
              <card.icon className={`w-6 h-6 ${card.iconColor}`} />
            </div>
            
            <div className="space-y-1">
              <div className={`text-lg font-bold ${card.textColor} data-display`}>
                {card.value}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {card.label}
              </div>
              <div className={`text-xs ${card.textColor} opacity-70`}>
                {card.subtext}
              </div>
            </div>
          </div>
          
          {/* Animated border */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm`}></div>
        </div>
      ))}
    </div>
  );
};

export default StatusOverviewGrid;
