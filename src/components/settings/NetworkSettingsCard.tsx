
import { Wifi, Shield, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSecureConnection } from '@/hooks/useSecureConnection';
import { defaultSecurityConfig, validateNetworkEndpoint } from '@/config/security';

const NetworkSettingsCard = () => {
  const { isConnected, lastError, checkConnection } = useSecureConnection(defaultSecurityConfig.cameraStreamUrl);
  const isSecureEndpoint = validateNetworkEndpoint(defaultSecurityConfig.cameraStreamUrl);

  return (
    <Card className="card-hover bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-cyan-200 dark:border-slate-600">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wifi className="w-5 h-5 text-cyan-500" />
          <span>Network Security</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">Connection Status</span>
          <Badge variant={isConnected ? "default" : "destructive"} className={isConnected ? "status-live" : ""}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">Camera Stream</span>
          <span className="font-medium text-xs">{defaultSecurityConfig.cameraStreamUrl}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">Endpoint Security</span>
          <div className="flex items-center space-x-2">
            {isSecureEndpoint ? (
              <Shield className="w-4 h-4 text-green-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
            )}
            <span className="font-medium text-xs">
              {isSecureEndpoint ? 'Validated' : 'Unvalidated'}
            </span>
          </div>
        </div>
        
        {lastError && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">Last Error</span>
            <span className="font-medium text-xs text-red-500">{lastError}</span>
          </div>
        )}
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={checkConnection}>
            Test Connection
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Configure Network
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkSettingsCard;
