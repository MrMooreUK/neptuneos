
import { Camera, WifiOff, Play, Maximize, Minimize } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/contexts/SettingsContext';
import { useSecureConnection } from '@/hooks/useSecureConnection';
import { useState } from 'react';

const LiveCameraFeed = () => {
  const { cameraStreamUrl } = useSettings();
  const { isConnected, lastError } = useSecureConnection(cameraStreamUrl);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoaded(false);
    setImageError(true);
    console.error("Camera stream error - image failed to load");
  };

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
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="p-2 hover:bg-cyan-100 dark:hover:bg-cyan-900/50"
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 pb-4">
          <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 rounded-xl overflow-hidden shadow-inner border border-gray-200/50 dark:border-slate-600/50 relative group/video max-w-md mx-auto">
            {isConnected ? (
              <>
                <img 
                  src={cameraStreamUrl} 
                  alt="Live aquarium feed" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover/video:scale-105"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{ display: imageError ? 'none' : 'block' }}
                />
                {isStreamActive && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 shadow-lg">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    <span>LIVE</span>
                  </div>
                )}
                {(imageError || !imageLoaded) && (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-4">
                    <div className="relative mb-3">
                      <div className="p-4 bg-gray-200/50 dark:bg-slate-600/50 rounded-full">
                        <WifiOff className="w-8 h-8 text-red-500" />
                      </div>
                      <div className="absolute inset-0 bg-red-500/10 rounded-full animate-ping"></div>
                    </div>
                    <p className="font-semibold text-sm mb-1">Stream Not Available</p>
                    <p className="text-xs text-center opacity-75">
                      Camera stream failed to load
                    </p>
                  </div>
                )}
              </>
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
      {isFullscreen && (
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
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/10 p-3"
              >
                <Minimize className="w-5 h-5" />
              </Button>
            </div>

            {/* Fullscreen Video Container */}
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="relative w-full h-full max-w-7xl max-h-full bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden shadow-2xl">
                {isConnected ? (
                  <>
                    <img 
                      src={cameraStreamUrl} 
                      alt="Live aquarium feed" 
                      className="w-full h-full object-contain"
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                      style={{ display: imageError ? 'none' : 'block' }}
                    />
                    {isStreamActive && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 shadow-lg">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span>LIVE</span>
                      </div>
                    )}
                    {(imageError || !imageLoaded) && (
                      <div className="w-full h-full flex flex-col items-center justify-center text-white p-8">
                        <div className="relative mb-6">
                          <div className="p-8 bg-white/10 rounded-full backdrop-blur-sm">
                            <WifiOff className="w-16 h-16 text-red-400" />
                          </div>
                          <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
                        </div>
                        <p className="font-semibold text-xl mb-3">Stream Not Available</p>
                        <p className="text-lg text-center opacity-75">
                          Camera stream failed to load
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white p-8">
                    <div className="relative mb-6">
                      <div className="p-8 bg-white/10 rounded-full backdrop-blur-sm">
                        <WifiOff className="w-16 h-16 text-red-400" />
                      </div>
                      <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
                    </div>
                    <p className="font-semibold text-xl mb-3">Camera Offline</p>
                    <p className="text-lg text-center opacity-75 mb-4">
                      {lastError && `Error: ${lastError}`}
                      {!cameraStreamUrl && 'Camera URL not configured'}
                      {cameraStreamUrl && !lastError && 'Attempting to connect...'}
                    </p>
                    {cameraStreamUrl && !lastError && (
                      <div className="flex items-center space-x-3 text-blue-400">
                        <Play className="w-5 h-5" />
                        <span className="text-lg">Connecting to stream...</span>
                      </div>
                    )}
                  </div>
                )}
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
      )}
    </>
  );
};

export default LiveCameraFeed;
