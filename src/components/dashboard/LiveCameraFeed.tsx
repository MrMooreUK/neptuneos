import { useState } from 'react';
import { Camera, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LiveCameraFeed = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const cameraUrl = 'http://localhost:8080/?action=stream';

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    const img = document.querySelector('#camera-stream') as HTMLImageElement;
    if (img) {
      img.src = `${cameraUrl}?t=${Date.now()}`;
    }
  };

  return (
    <div className="camera-container relative">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Connecting to camera...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <div className="text-center max-w-md p-6">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Camera Unavailable</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Unable to connect to the camera feed. Please check the camera service.
            </p>
            <Button onClick={handleRetry} className="btn-primary">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Camera Stream */}
      <div className="relative w-full h-full min-h-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        <img
          id="camera-stream"
          src={cameraUrl}
          alt="Live aquarium camera feed"
          className="w-full h-full object-cover"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ display: hasError ? 'none' : 'block' }}
        />

        {/* Stream Info Overlay */}
        {!hasError && !isLoading && (
          <div className="absolute top-4 right-4">
            <div className="bg-black/50 text-white px-2 py-1 rounded text-xs">
              1080p • LIVE
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveCameraFeed;
