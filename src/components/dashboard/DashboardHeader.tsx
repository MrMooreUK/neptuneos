
import { Fish, Activity, RefreshCw, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface DashboardHeaderProps {
  onRefresh: () => void;
}

const DashboardHeader = ({ onRefresh }: DashboardHeaderProps) => {
  return (
    <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg shadow-sm border-b border-blue-200/50 dark:border-slate-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Fish className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">NeptuneOS</h1>
            <Badge variant="outline" className="ml-2 text-xs">v1.0</Badge>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <Activity className="w-4 h-4 text-green-500" />
              <span className="hidden sm:inline">System Online</span>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onRefresh}
              className="p-2"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            
            <Link to="/settings">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
