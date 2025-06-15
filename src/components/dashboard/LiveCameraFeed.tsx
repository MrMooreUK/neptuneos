
import { Camera, WifiOff, Play, Maximize, Smartphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      {/* Regular Card View */}
      <Card className={`group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-cyan-50/80 to-blue-50/80 dark:from-slate-800/80 dark:to-cyan-900/50 backdrop-blur-sm border border-cyan-200/50 dark:border-cyan-600/30 overflow-hidden h-fit ${isFullscreen ? 'hidden' : ''}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardHeader className="pb-3 relative z-10">
          <CardTitle className="text-lg font-bold flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/50 dark:to-blue-900/30 rounded-xl">
                <Camera className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <span className="text-gray-900 dark:text-gray-100">Live Camera Feed</span>
                <div className="flex items-center mt-1">
                  <div className={`w-2 h-2 rounded-full mr-2 ${isStreamActive ? 'bg-green-500' : 'bg-red-500'} ${isStreamActive ? 'animate-pulse' : ''}`}></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
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
                  onClick={forceRefresh}
                  className="p-2 hover:bg-cyan-100 dark:hover:bg-cyan-900/50"
                >
                  <Play className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="p-2 hover:bg-cyan-100 dark:hover:bg-cyan-900/50"
              >
                <Maximize className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 pb-4">
          <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 rounded-xl overflow-hidden shadow-inner border border-gray-200/50 dark:border-slate-600/50 relative group/video max-w-md mx-auto">
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
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-4">
                <div className="relative mb-3">
                  <div className="p-4 bg-gray-200/50 dark:bg-slate-600/50 rounded-full">
                    <WifiOff className="w-8 h-8 text-red-500" />
                  </div>
                  <div className="absolute inset-0 bg-red-500/10 rounded-full animate-ping"></div>
                </div>
                <p className="font-semibold text-sm mb-1">Camera Offline</p>
                <p className="text-xs text-center opacity-75">
                  {lastError && `Error: ${lastError}`}
                  {!cameraStreamUrl && 'Camera URL not configured'}
                  {cameraStreamUrl && !lastError && 'Attempting to connect...'}
                </p>
                {cameraStreamUrl && !lastError && (
                  <div className="mt-3 flex items-center space-x-2 text-blue-500">
                    <Play className="w-3 h-3" />
                    <span className="text-xs">Connecting to stream...</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Stream Info */}
          <div className="mt-3 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>Resolution: 1080p</span>
            <span>FPS: 30</span>
            <span>Quality: HD</span>
          </div>
        </CardContent>
      </Card>

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
