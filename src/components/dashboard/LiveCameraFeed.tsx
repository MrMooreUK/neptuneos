import { useState } from 'react';
import { Camera, AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const LiveCameraFeed = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  
  const cameraUrl = 'http://localhost:8080/?action=stream';

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
    setIsConnected(true);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
    setIsConnected(false);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    // Force reload by changing the key
    const img = document.querySelector('#camera-stream') as HTMLImageElement;
    if (img) {
      img.src = `${cameraUrl}?t=${Date.now()}`;
    }
  };

  return (
    <div className="camera-container relative">
      {/* Stream Status Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className={`text-xs font-medium ${
            isConnected ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20'
          }`}>
            {isConnected ? (
              <>
                <Wifi className="w-3 h-3 mr-1" />
                Connected
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 mr-1" />
                Disconnected
              </>
            )}
          </Badge>
          
          {!hasError && !isLoading && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs font-medium">
              1080p • 30fps
            </Badge>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleRetry}
          className="apple-button-secondary p-2 h-auto bg-background/80 backdrop-blur-sm"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4">
            <div className="apple-card p-4 bg-background/80">
              <Camera className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <div className="text-center">
              <p className="text-callout font-medium">Connecting to camera...</p>
              <p className="text-caption text-muted-foreground">Please wait</p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-6 text-center max-w-md mx-auto p-6">
            <div className="apple-card p-4 bg-destructive/10">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-headline font-semibold">Camera Unavailable</h3>
              <p className="text-body text-muted-foreground">
                Unable to connect to the camera feed. This could be due to:
              </p>
              <ul className="text-caption text-muted-foreground space-y-1 text-left">
                <li>• Camera service not running</li>
                <li>• Network connectivity issues</li>
                <li>• Camera hardware problems</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleRetry}
                className="apple-button-primary"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Connection
              </Button>
              <Button 
                variant="outline"
                className="apple-button-secondary"
                onClick={() => window.open('/camera-help', '_blank')}
              >
                Get Help
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Camera Stream */}
             <div className="relative w-full h-full min-h-[300px] bg-gradient-to-br from-muted to-muted/50 rounded-lg overflow-hidden">
        <img
          id="camera-stream"
          src={cameraUrl}
          alt="Live aquarium camera feed"
          className="w-full h-full object-cover"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ display: hasError ? 'none' : 'block' }}
        />

        {/* Decorative Corner Elements */}
        {!hasError && !isLoading && (
          <>
            <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary/30 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-primary/30 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-primary/30 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary/30 rounded-br-lg"></div>
          </>
        )}
      </div>

      {/* Recording Indicator */}
      {!hasError && !isLoading && (
        <div className="absolute bottom-4 right-4">
          <div className="flex items-center space-x-2 apple-card bg-background/80 backdrop-blur-sm px-3 py-2">
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
            <span className="text-caption font-medium">REC</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveCameraFeed;
