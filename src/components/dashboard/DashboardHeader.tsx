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
    <header className="navigation-bar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="apple-card p-2 bg-gradient-to-br from-primary/10 to-accent/10">
                <Fish className="w-6 h-6 text-primary" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-headline font-bold text-foreground">
                  NeptuneOS
                </h1>
                <p className="text-caption text-muted-foreground hidden sm:block">
                  v2.0 Pro
                </p>
              </div>
            </div>
            
            {/* System Status Badge */}
            <div className="hidden md:flex items-center">
              <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs font-medium">
                <div className="status-dot-green mr-2"></div>
                System Online
              </Badge>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Dark Mode Toggle */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleDarkMode}
              className="apple-button-secondary p-2.5 h-auto"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-warning" />
              ) : (
                <Moon className="w-4 h-4 text-accent" />
              )}
            </Button>
            
            {/* Refresh Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onRefresh}
              className="apple-button-secondary p-2.5 h-auto"
            >
              <RefreshCw className="w-4 h-4 text-primary" />
            </Button>
            
            {/* Settings Button */}
            <Link to="/settings">
              <Button 
                variant="outline" 
                size="sm" 
                className="apple-button-secondary flex items-center space-x-2 px-3 py-2.5 h-auto"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline text-callout">Settings</span>
              </Button>
            </Link>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="apple-button-secondary flex items-center space-x-2 px-3 py-2.5 h-auto"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                  <span className="hidden sm:inline text-callout font-medium">{user?.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 apple-card-elevated border-border/50">
                <DropdownMenuLabel className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <p className="text-body font-semibold">{user?.username}</p>
                      <p className="text-caption text-muted-foreground">{user?.email}</p>
                      <Badge variant="secondary" className="text-xs w-fit bg-primary/10 text-primary border-primary/20">
                        {user?.role === 'admin' ? 'Administrator' : 'User'}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-destructive hover:bg-destructive/10 cursor-pointer m-2 rounded-lg"
                >
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
