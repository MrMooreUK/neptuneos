
import { Monitor } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSystemInfo } from '@/hooks/useSystemInfo';
import { Skeleton } from '@/components/ui/skeleton';

// Helper function to format uptime
const formatUptime = (seconds: number) => {
  if (isNaN(seconds) || seconds < 0) {
    return 'N/A';
  }
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  return `${d}d ${h}h ${m}m`;
};

const SystemInfoCard = () => {
  const { data, isLoading, error } = useSystemInfo();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
        </div>
      );
    }

    if (error || !data) {
      return <p className="text-sm text-red-500">Could not load system information.</p>;
    }

    return (
      <>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">Uptime</span>
          <span className="font-medium text-green-600 dark:text-green-400">{formatUptime(data.uptime)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">CPU Usage</span>
          <span className="font-medium">{data.cpuUsage.toFixed(1)}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">Memory Usage</span>
          <span className="font-medium">{data.memory.used.toFixed(0)}MB / {(data.memory.total / 1024).toFixed(0)}GB</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">Storage</span>
          <span className="font-medium">{data.storage.used.toFixed(1)}GB / {data.storage.total.toFixed(0)}GB</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">IP Address</span>
          <span className="font-mono text-sm text-blue-600 dark:text-blue-400">{data.ipAddress}</span>
        </div>
      </>
    );
  };

  return (
    <Card className="card-hover bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-green-200 dark:border-slate-600">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Monitor className="w-5 h-5 text-green-500" />
          <span>System Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default SystemInfoCard;
