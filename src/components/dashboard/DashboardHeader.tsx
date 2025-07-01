import { Fish, Activity, RefreshCw, Settings, User, LogOut, Sun, Moon, Waves } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';

interface DashboardHeaderProps {
  onRefresh: () => void;
}

const DashboardHeader = ({ onRefresh }: DashboardHeaderProps) => {
  const { user, logout } = useAuth();
  const { isDarkMode, setIsDarkMode } = useSettings();

  const handleLogout = async () => {
    await logout();
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className="professional-card border-0 rounded-none sticky top-0 z-50 border-b border-white/20 dark:border-slate-700/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Branding */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-300 glow-effect">
                  <Fish className="w-8 h-8 text-white wave-animation" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <div className="w-4 h-4 bg-green-500 rounded-full status-indicator"></div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">
                  NeptuneOS
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Professional Aquarium Control</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-2">
              <Badge variant="outline" className="text-xs px-3 py-1 bg-blue-50/80 dark:bg-blue-900/30 border-blue-200 dark:border-blue-600 text-blue-700 dark:text-blue-300">
                v2.0 Pro
              </Badge>
              <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full border border-green-200 dark:border-green-600/30">
                <Activity className="w-3 h-3 text-green-500 animate-pulse" />
                <span className="text-xs font-medium text-green-700 dark:text-green-300">Live</span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* System Status - Mobile */}
            <div className="md:hidden flex items-center space-x-2 px-3 py-2 bg-green-50 dark:bg-green-900/30 rounded-xl border border-green-200 dark:border-green-600/30">
              <Activity className="w-4 h-4 text-green-500 animate-pulse" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Online</span>
            </div>
            
            {/* Dark Mode Toggle */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleDarkMode}
              className="glass-button p-3 rounded-xl transition-all duration-300 hover:scale-105"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-blue-600" />
              )}
            </Button>
            
            {/* Refresh Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onRefresh}
              className="glass-button p-3 rounded-xl transition-all duration-300 hover:scale-105 group"
            >
              <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:rotate-180 transition-transform duration-300" />
            </Button>
            
            {/* Settings Button */}
            <Link to="/settings">
              <Button 
                variant="outline" 
                size="sm" 
                className="glass-button flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Settings</span>
              </Button>
            </Link>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="glass-button flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden sm:inline font-medium">{user?.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 professional-card border border-white/20 dark:border-slate-700/30">
                <DropdownMenuLabel>
                  <div className="flex items-center space-x-3 p-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold">{user?.username}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      <Badge variant="secondary" className="text-xs w-fit bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        {user?.role === 'admin' ? 'Administrator' : 'User'}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/20 dark:bg-slate-700/30" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Subtle wave animation at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 opacity-30">
        <div className="h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse"></div>
      </div>
    </header>
  );
};

export default DashboardHeader;
