import { Fish, RefreshCw, Settings, User, LogOut, Sun, Moon } from 'lucide-react';
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
    <header className="header">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary rounded-lg">
                <Fish className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">NeptuneOS</h1>
                <p className="text-xs text-muted-foreground">v2.0</p>
              </div>
            </div>
            
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              System Online
            </Badge>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Dark Mode Toggle */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleDarkMode}
              className="p-2"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
            
            {/* Refresh Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onRefresh}
              className="p-2"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            
            {/* Settings Button */}
            <Link to="/settings">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </Link>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user?.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.username}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
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
