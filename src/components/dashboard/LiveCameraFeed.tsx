
import { Camera, WifiOff, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSettings } from '@/contexts/SettingsContext';
import { useSecureConnection } from '@/hooks/useSecureConnection';
import { useState } from 'react';

const LiveCameraFeed = () => {
  const { cameraStreamUrl } = useSettings();
  const { isConnected, lastError } = useSecureConnection(cameraStreamUrl);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoaded(false);
    setImageError(true);
    console.error("Camera stream error - image failed to load");
  };

  const isStreamActive = isConnected && imageLoaded && !imageError;

  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-cyan-50/80 to-blue-50/80 dark:from-slate-800/80 dark:to-cyan-900/50 backdrop-blur-sm border border-cyan-200/50 dark:border-cyan-600/30 overflow-hidden h-fit">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <CardHeader className="pb-4 relative z-10">
        <CardTitle className="text-xl font-bold flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/50 dark:to-blue-900/30 rounded-xl">
            <Camera className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
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
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 rounded-xl overflow-hidden shadow-inner border border-gray-200/50 dark:border-slate-600/50 relative group/video">
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
                <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>LIVE</span>
                </div>
              )}
              {(imageError || !imageLoaded) && (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-6">
                  <div className="relative mb-4">
                    <div className="p-6 bg-gray-200/50 dark:bg-slate-600/50 rounded-full">
                      <WifiOff className="w-12 h-12 text-red-500" />
                    </div>
                    <div className="absolute inset-0 bg-red-500/10 rounded-full animate-ping"></div>
                  </div>
                  <p className="font-semibold text-lg mb-2">Stream Not Available</p>
                  <p className="text-sm text-center opacity-75">
                    Camera stream failed to load
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-6">
              <div className="relative mb-4">
                <div className="p-6 bg-gray-200/50 dark:bg-slate-600/50 rounded-full">
                  <WifiOff className="w-12 h-12 text-red-500" />
                </div>
                <div className="absolute inset-0 bg-red-500/10 rounded-full animate-ping"></div>
              </div>
              <p className="font-semibold text-lg mb-2">Camera Offline</p>
              <p className="text-sm text-center opacity-75">
                {lastError && `Error: ${lastError}`}
                {!cameraStreamUrl && 'Camera URL not configured'}
                {cameraStreamUrl && !lastError && 'Attempting to connect...'}
              </p>
              {cameraStreamUrl && !lastError && (
                <div className="mt-4 flex items-center space-x-2 text-blue-500">
                  <Play className="w-4 h-4" />
                  <span className="text-sm">Connecting to stream...</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Stream Info */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>Resolution: 1080p</span>
          <span>FPS: 30</span>
          <span>Quality: HD</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveCameraFeed;
