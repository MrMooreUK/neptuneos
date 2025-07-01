import { Camera, WifiOff, Play, Maximize, Smartphone, Video, Eye, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/contexts/SettingsContext';
import { useSecureConnection } from '@/hooks/useSecureConnection';
import { useState } from 'react';
import { useCameraStream } from '@/hooks/useCameraStream';
import CameraDisplay from './CameraDisplay';
import CameraFullscreenOverlay from './CameraFullscreenOverlay';

const LiveCameraFeed = () => {
  const { cameraStreamUrl } = useSettings();
  const { isConnected, lastError } = useSecureConnection(cameraStreamUrl);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const streamUrl = cameraStreamUrl ? `${cameraStreamUrl}?t=${Date.now()}` : '';
  const {
    imageLoaded,
    imageError,
    retryCount,
    imgRef,
    handleImageLoad,
    handleImageError,
    forceRefresh,
    isMobile
  } = useCameraStream(streamUrl);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const isStreamActive = isConnected && imageLoaded && !imageError;

  return (
    <>
      {/* Professional Camera Feed Interface */}
      <div className={`relative ${isFullscreen ? 'hidden' : ''}`}>
        {/* Stream Status Bar */}
        <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800/50 dark:to-blue-900/30 rounded-2xl border border-white/20 dark:border-slate-700/30">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className={`w-4 h-4 rounded-full ${isStreamActive ? 'bg-green-500' : 'bg-red-500'}`}>
                {isStreamActive && <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>}
              </div>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {isStreamActive ? 'LIVE STREAM' : 'STREAM OFFLINE'}
              </span>
              <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                <Video className="w-3 h-3" />
                <span>1080p • 30fps • HD Quality</span>
                {isMobile && (
                  <>
                    <span>•</span>
                    <Smartphone className="w-3 h-3" />
                    <span>Mobile Optimized</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {!isStreamActive && (
              <Button
                variant="ghost"
                size="sm"
                onClick={forceRefresh}
                className="glass-button p-2 rounded-xl hover:scale-105 transition-all duration-300"
              >
                <Play className="w-4 h-4 text-green-600" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="glass-button p-2 rounded-xl hover:scale-105 transition-all duration-300"
            >
              <Maximize className="w-4 h-4 text-blue-600" />
            </Button>
          </div>
        </div>

        {/* Main Camera Display */}
        <div className="relative group">
          <div className="aspect-video bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10 dark:border-slate-700/30 relative">
            {/* Decorative corners */}
            <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-cyan-400 rounded-tl-lg opacity-60"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-cyan-400 rounded-tr-lg opacity-60"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-cyan-400 rounded-bl-lg opacity-60"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-cyan-400 rounded-br-lg opacity-60"></div>
            
            {isConnected ? (
              <CameraDisplay
                streamUrl={streamUrl}
                isConnected={isConnected}
                imageLoaded={imageLoaded}
                imageError={imageError}
                retryCount={retryCount}
                isMobile={isMobile}
                imgRef={imgRef}
                onImageLoad={handleImageLoad}
                onImageError={handleImageError}
                className="relative w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/80 p-8">
                <div className="relative mb-6">
                  <div className="p-6 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full backdrop-blur-sm border border-red-500/30">
                    <WifiOff className="w-12 h-12 text-red-400" />
                  </div>
                  <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-white">Camera Feed Unavailable</h3>
                <p className="text-sm text-center opacity-75 mb-4 max-w-md">
                  {lastError && `Connection Error: ${lastError}`}
                  {!cameraStreamUrl && 'Camera stream URL not configured in settings'}
                  {cameraStreamUrl && !lastError && 'Attempting to establish connection...'}
                </p>
                
                {cameraStreamUrl && !lastError && (
                  <div className="flex items-center space-x-2 text-cyan-400 bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-500/30">
                    <Zap className="w-4 h-4 animate-pulse" />
                    <span className="text-sm font-medium">Connecting to stream...</span>
                  </div>
                )}
                
                <div className="mt-8 grid grid-cols-3 gap-4 text-center opacity-50">
                  <div className="flex flex-col items-center space-y-1">
                    <Eye className="w-5 h-5" />
                    <span className="text-xs">No Signal</span>
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <Video className="w-5 h-5" />
                    <span className="text-xs">Standby</span>
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <Camera className="w-5 h-5" />
                    <span className="text-xs">Offline</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Overlay gradient for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none"></div>
            
            {/* Live indicator overlay */}
            {isStreamActive && (
              <div className="absolute top-6 left-6 flex items-center space-x-2 bg-red-500/90 text-white px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>LIVE</span>
              </div>
            )}
          </div>
          
          {/* Professional info panel */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl border border-blue-200/30 dark:border-blue-600/30">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">1080p</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Resolution</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl border border-green-200/30 dark:border-green-600/30">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">30fps</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Frame Rate</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl border border-purple-200/30 dark:border-purple-600/30">
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">HD</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Quality</div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Overlay */}
      <CameraFullscreenOverlay
        isVisible={isFullscreen}
        streamUrl={streamUrl}
        isConnected={isConnected}
        imageLoaded={imageLoaded}
        imageError={imageError}
        retryCount={retryCount}
        isMobile={isMobile}
        imgRef={imgRef}
        onImageLoad={handleImageLoad}
        onImageError={handleImageError}
        onClose={toggleFullscreen}
        onForceRefresh={forceRefresh}
      />
    </>
  );
};

export default LiveCameraFeed;
