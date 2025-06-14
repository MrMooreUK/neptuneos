
import { Camera, WifiOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSettings } from '@/contexts/SettingsContext'; // Import useSettings
import { useSecureConnection } from '@/hooks/useSecureConnection'; // Import useSecureConnection
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

const LiveCameraFeed = () => {
  const { cameraStreamUrl } = useSettings(); // Get cameraStreamUrl from context
  const { isConnected, lastError } = useSecureConnection(cameraStreamUrl); // Check connection to the dynamic URL

  return (
    <Card className="card-hover bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg border-cyan-100 dark:border-slate-700 overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-cyan-700 dark:text-cyan-400">
          <Camera className="w-6 h-6" />
          <span>Live Camera Feed</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-gray-200 dark:bg-slate-700 rounded-lg overflow-hidden flex items-center justify-center">
          {isConnected ? (
            <img 
              src={cameraStreamUrl} 
              alt="Live aquarium feed" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // This is a simple way to show an error message if the image fails to load
                // e.g., if the stream URL is valid but the stream itself is down or returns non-image content
                // For more robust handling, we might replace the img with a message.
                console.error("Camera stream error:", e);
                (e.target as HTMLImageElement).style.display = 'none'; 
                // Optionally, show a placeholder or error message here
                // For now, if image errors, it will show the parent div's background
              }}
            />
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 p-4">
              <WifiOff className="w-12 h-12 mx-auto mb-2 text-red-500" />
              <p className="font-semibold">Camera Offline</p>
              {lastError && <p className="text-xs mt-1">Error: {lastError}</p>}
              {!cameraStreamUrl && <p className="text-xs mt-1">Camera URL not configured.</p>}
              {cameraStreamUrl && !lastError && <Skeleton className="w-full h-full" />} {/* Show skeleton while trying to connect if no error yet */}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveCameraFeed;

