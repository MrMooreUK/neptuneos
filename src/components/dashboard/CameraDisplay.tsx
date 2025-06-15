
import { WifiOff, Smartphone } from 'lucide-react';

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
  className = ""
}: CameraDisplayProps) => {
  const isStreamActive = isConnected && imageLoaded && !imageError;

  if (!isConnected) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-4 ${className}`}>
        <div className="relative mb-3">
          <div className="p-4 bg-gray-200/50 dark:bg-slate-600/50 rounded-full">
            <WifiOff className="w-8 h-8 text-red-500" />
          </div>
          <div className="absolute inset-0 bg-red-500/10 rounded-full animate-ping"></div>
        </div>
        <p className="font-semibold text-sm mb-1">Camera Offline</p>
        <p className="text-xs text-center opacity-75">
          Camera URL not configured or attempting to connect...
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <img 
        ref={imgRef}
        src={streamUrl}
        alt="Live aquarium feed" 
        className="w-full h-full object-cover transition-transform duration-300 group-hover/video:scale-105"
        onLoad={onImageLoad}
        onError={onImageError}
        style={{ display: imageError ? 'none' : 'block' }}
        crossOrigin="anonymous"
      />
      {isStreamActive && (
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 shadow-lg">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
          <span>LIVE</span>
        </div>
      )}
      {(imageError || !imageLoaded) && (
        <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-4">
          <div className="relative mb-3">
            <div className="p-4 bg-gray-200/50 dark:bg-slate-600/50 rounded-full">
              <WifiOff className="w-8 h-8 text-red-500" />
            </div>
            <div className="absolute inset-0 bg-red-500/10 rounded-full animate-ping"></div>
          </div>
          <p className="font-semibold text-sm mb-1">Stream Not Available</p>
          <p className="text-xs text-center opacity-75 mb-2">
            {isMobile ? 'Mobile stream issue detected' : 'Camera stream failed to load'}
          </p>
          {retryCount > 0 && (
            <p className="text-xs text-blue-500">Retry {retryCount}/3</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CameraDisplay;
