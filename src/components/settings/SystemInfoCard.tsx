
import { Monitor } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SystemInfoCard = () => {
  return (
    <Card className="card-hover bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-green-200 dark:border-slate-600">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Monitor className="w-5 h-5 text-green-500" />
          <span>System Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">Uptime</span>
          <span className="font-medium text-green-600 dark:text-green-400">2d 14h 32m</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">CPU Usage</span>
          <span className="font-medium">23%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">Memory Usage</span>
          <span className="font-medium">456MB / 1GB</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">Storage</span>
          <span className="font-medium">12.3GB / 32GB</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">IP Address</span>
          <span className="font-mono text-sm text-blue-600 dark:text-blue-400">192.168.1.42</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemInfoCard;
