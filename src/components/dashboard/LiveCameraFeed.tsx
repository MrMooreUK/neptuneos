
import { Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSecureConnection } from '@/hooks/useSecureConnection';
import { defaultSecurityConfig, validateNetworkEndpoint, logSecurityEvent } from '@/config/security';

const LiveCameraFeed = () => {
  const cameraUrl = defaultSecurityConfig.cameraStreamUrl;
  const { isConnected, lastError, checkConnection } = useSecureConnection(cameraUrl);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const fallback = target.nextElementSibling as HTMLElement;
    if (fallback) fallback.style.display = 'flex';
    
    logSecurityEvent('Camera stream failed to load', { url: cameraUrl, error: lastError });
  };

  const handleRetryConnection = () => {
    logSecurityEvent('Manual connection retry initiated', { url: cameraUrl });
    checkConnection();
  };

  // Validate camera URL on component mount
  if (!validateNetworkEndpoint(cameraUrl)) {
    logSecurityEvent('Invalid camera endpoint detected', { url: cameraUrl });
  }

  return (
    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-orange-200/50 dark:border-orange-600/30">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Camera className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-gray-900 dark:text-gray-100">Live Camera Feed</span>
          </div>
          <Badge 
            variant="outline" 
            className={`text-xs ${isConnected ? 'text-green-600 border-green-200' : 'text-red-600 border-red-200'}`}
          >
            {isConnected ? 'Live' : 'Disconnected'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video bg-gray-100 dark:bg-slate-700 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-slate-600">
          <img 
            src={cameraUrl}
            alt="Live Camera Feed"
            className="w-full h-full object-cover"
            onError={handleImageError}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
          <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
            <div className="text-center space-y-4">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-3" />
              <p className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-1">Camera Unavailable</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {lastError || `Check camera connection at ${cameraUrl}`}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetryConnection}
                className="mt-2"
              >
                Retry Connection
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-700/50 rounded-lg px-4 py-3">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span>Stream: {cameraUrl}</span>
            </span>
          </div>
          <span>{isConnected ? 'Live Feed' : 'Connection Lost'}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveCameraFeed;
