
import { Wifi } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const NetworkSettingsCard = () => {
  return (
    <Card className="card-hover bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-cyan-200 dark:border-slate-600">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wifi className="w-5 h-5 text-cyan-500" />
          <span>Network</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">Connection Status</span>
          <Badge variant="default" className="status-live">Connected</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">SSID</span>
          <span className="font-medium">AquariumNet</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">Signal Strength</span>
          <span className="font-medium">-45 dBm (Excellent)</span>
        </div>
        <Button variant="outline" size="sm" className="w-full mt-4">
          Configure WiFi
        </Button>
      </CardContent>
    </Card>
  );
};

export default NetworkSettingsCard;
