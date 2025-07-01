import React from 'react';
import { WifiOff, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CameraDisplayProps {
  streamUrl: string;
  isConnected: boolean;
  imageLoaded: boolean;
  imageError: boolean;
  retryCount: number;
  isMobile: boolean;
  imgRef: React.RefObject<HTMLImageElement>;
  onImageLoad: () => void;
  onImageError: () => void;
  className?: string;
}

const CameraDisplay = ({
  streamUrl,
  isConnected,
  imageLoaded,
  imageError,
  retryCount,
  isMobile,
  imgRef,
  onImageLoad,
  onImageError,
  className
}: CameraDisplayProps) => {
  const getStatusMessage = () => {
    if (!isConnected) return 'Camera disconnected';
    if (imageError) return `Failed to load camera feed (attempt ${retryCount + 1})`;
    if (!imageLoaded) return 'Loading camera feed...';
    return 'Live camera feed active';
  };

  const getAriaLabel = () => {
    if (!isConnected) return 'Camera is offline';
    if (imageError) return 'Camera feed failed to load';
    if (!imageLoaded) return 'Camera feed is loading';
    return 'Live aquarium camera feed showing current view';
  };

  return (
    <div className={cn("relative w-full h-full", className)} role="img" aria-label={getAriaLabel()}>
      {isConnected && !imageError ? (
        <>
          <img
            ref={imgRef}
            src={streamUrl}
            alt="Live aquarium camera feed showing real-time view of the aquarium"
            onLoad={onImageLoad}
            onError={onImageError}
            className={cn(
              "w-full h-full object-cover rounded-lg transition-opacity duration-300",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            loading="lazy"
            crossOrigin="anonymous"
            aria-describedby="camera-status"
          />
          
          {/* Loading overlay */}
          {!imageLoaded && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg"
              aria-live="polite"
              aria-label="Camera feed is loading"
            >
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" aria-hidden="true" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Loading camera feed...
                </p>
                {isMobile && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Mobile connection detected
                  </p>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        // Error state
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg"
          role="alert"
          aria-live="assertive"
        >
          <div className="text-center p-4">
            {!isConnected ? (
              <WifiOff className="w-12 h-12 text-red-500 mx-auto mb-3" aria-hidden="true" />
            ) : (
              <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-3" aria-hidden="true" />
            )}
            
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {!isConnected ? 'Camera Offline' : 'Feed Unavailable'}
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
              {!isConnected 
                ? 'Unable to connect to camera stream. Check network connection and camera settings.'
                : `Failed to load camera feed. ${retryCount > 0 ? `Retry attempt ${retryCount + 1}.` : ''}`
              }
            </p>
            
            {isMobile && imageError && (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                Auto-retry enabled for mobile
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Hidden status for screen readers */}
      <div id="camera-status" className="sr-only" aria-live="polite">
        {getStatusMessage()}
      </div>
    </div>
  );
};

export default CameraDisplay;
