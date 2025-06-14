
import React, { useState } from 'react'; // Added useState
import { Wifi, Shield, AlertTriangle, Edit3 } from 'lucide-react'; // Added Edit3
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSecureConnection } from '@/hooks/useSecureConnection';
import { validateNetworkEndpoint } from '@/config/security';
import { useSettings } from '@/contexts/SettingsContext'; // Added useSettings
import ConfigureCameraDialog from './ConfigureCameraDialog'; // Added ConfigureCameraDialog

const NetworkSettingsCard = () => {
  const { cameraStreamUrl, setCameraStreamUrl } = useSettings(); // Use settings context
  const { isConnected, lastError, checkConnection, retryCount } = useSecureConnection(cameraStreamUrl); // Pass dynamic URL
  const isSecureEndpoint = validateNetworkEndpoint(cameraStreamUrl); // Validate dynamic URL
  const [isConfigureCameraOpen, setIsConfigureCameraOpen] = useState(false);

  const handleSaveCameraUrl = (newUrl: string) => {
    setCameraStreamUrl(newUrl);
    // The useSecureConnection hook will automatically re-check due to dependency change
  };

  return (
    <>
      <Card className="card-hover bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-cyan-200 dark:border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wifi className="w-5 h-5 text-cyan-500" />
            <span>Network Security & Camera</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">Connection Status</span>
            <Badge variant={isConnected ? "default" : "destructive"} className={isConnected ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}>
              {isConnected ? 'Connected' : `Disconnected (Retries: ${retryCount})`}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">Camera Stream</span>
            <span className="font-medium text-xs truncate max-w-[150px] sm:max-w-[200px]" title={cameraStreamUrl}>{cameraStreamUrl}</span>
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
                {isSecureEndpoint ? 'Validated (HTTP/S)' : 'Unvalidated Protocol'}
              </span>
            </div>
          </div>
          
          {lastError && !isConnected && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Last Error</span>
              <span className="font-medium text-xs text-red-500 truncate max-w-[150px] sm:max-w-[200px]" title={lastError}>{lastError}</span>
            </div>
          )}
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={checkConnection}>
              Test Connection
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setIsConfigureCameraOpen(true)}>
              <Edit3 className="w-4 h-4 mr-2" />
              Configure Camera
            </Button>
          </div>
        </CardContent>
      </Card>
      <ConfigureCameraDialog
        isOpen={isConfigureCameraOpen}
        onOpenChange={setIsConfigureCameraOpen}
        currentUrl={cameraStreamUrl}
        onSave={handleSaveCameraUrl}
      />
    </>
  );
};

export default NetworkSettingsCard;

