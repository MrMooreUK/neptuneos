
import { Fish, Activity, RefreshCw, Settings, User, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardHeaderProps {
  onRefresh: () => void;
}

const DashboardHeader = ({ onRefresh }: DashboardHeaderProps) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-lg border-b border-blue-200/30 dark:border-slate-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                <Fish className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  NeptuneOS
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Aquarium Management System</p>
              </div>
            </div>
            <Badge variant="outline" className="ml-4 text-xs px-3 py-1 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-600">
              v1.0
            </Badge>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-green-50 dark:bg-green-900/30 rounded-full border border-green-200 dark:border-green-600/30">
              <Activity className="w-4 h-4 text-green-500 animate-pulse" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">System Online</span>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onRefresh}
              className="p-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-colors duration-200"
            >
              <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </Button>
            
            <Link to="/settings">
              <Button variant="outline" size="sm" className="flex items-center space-x-2 px-4 py-2 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 border-gray-200 dark:border-slate-600 rounded-xl transition-all duration-200">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Settings</span>
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center space-x-2 px-3 py-2 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 border-gray-200 dark:border-slate-600 rounded-xl transition-all duration-200">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline font-medium">{user?.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.username}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    <Badge variant="secondary" className="text-xs w-fit">
                      {user?.role}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
