
import { Camera, Play, Minimize, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CameraDisplay from './CameraDisplay';

interface CameraFullscreenOverlayProps {
  isVisible: boolean;
  streamUrl: string;
  isConnected: boolean;
  imageLoaded: boolean;
  imageError: boolean;
  retryCount: number;
  isMobile: boolean;
  imgRef: React.RefObject<HTMLImageElement>;
  onImageLoad: () => void;
  onImageError: () => void;
  onClose: () => void;
  onForceRefresh: () => void;
}

const CameraFullscreenOverlay = ({
  isVisible,
  streamUrl,
  isConnected,
  imageLoaded,
  imageError,
  retryCount,
  isMobile,
  imgRef,
  onImageLoad,
  onImageError,
  onClose,
  onForceRefresh
}: CameraFullscreenOverlayProps) => {
  if (!isVisible) return null;

  const isStreamActive = isConnected && imageLoaded && !imageError;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in">
      <div className="relative w-full h-full flex flex-col">
        {/* Fullscreen Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Live Camera Feed</h2>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${isStreamActive ? 'bg-green-500' : 'bg-red-500'} ${isStreamActive ? 'animate-pulse' : ''}`}></div>
                <span className="text-white/80 text-sm">
                  {isStreamActive ? 'Live' : 'Offline'}
                  {isMobile && <Smartphone className="w-3 h-3 ml-1 inline" />}
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            {!isStreamActive && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onForceRefresh}
                className="text-white hover:bg-white/10 p-3"
              >
                <Play className="w-5 h-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/10 p-3"
            >
              <Minimize className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Fullscreen Video Container */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="relative w-full h-full max-w-7xl max-h-full bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden shadow-2xl">
            <CameraDisplay
              streamUrl={streamUrl}
              isConnected={isConnected}
              imageLoaded={imageLoaded}
              imageError={imageError}
              retryCount={retryCount}
              isMobile={isMobile}
              imgRef={imgRef}
              onImageLoad={onImageLoad}
              onImageError={onImageError}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Fullscreen Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
          <div className="flex items-center justify-center space-x-8 text-white/80 text-sm">
            <span>Resolution: 1080p</span>
            <span>FPS: 30</span>
            <span>Quality: HD</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraFullscreenOverlay;
