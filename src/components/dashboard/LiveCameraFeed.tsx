
import { Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const LiveCameraFeed = () => {
  return (
    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-orange-200/50 dark:border-orange-600/30">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Camera className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-gray-900 dark:text-gray-100">Live Camera Feed</span>
          </div>
          <Badge variant="outline" className="text-xs text-green-600 border-green-200">Live</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video bg-gray-100 dark:bg-slate-700 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-slate-600">
          <img 
            src="http://192.168.10.148:5000/"
            alt="Live Camera Feed"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
            <div className="text-center">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-3" />
              <p className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-1">Camera Unavailable</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Check camera connection at 192.168.10.148:5000</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-700/50 rounded-lg px-4 py-3">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Stream: 192.168.10.148:5000</span>
            </span>
          </div>
          <span>Live Feed</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveCameraFeed;
