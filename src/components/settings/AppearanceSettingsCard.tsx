
import { Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useSettings } from '@/contexts/SettingsContext';

const AppearanceSettingsCard = () => {
  const { isDarkMode, setIsDarkMode } = useSettings();

  return (
    <Card className="card-hover bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-purple-200 dark:border-slate-600">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Palette className="w-5 h-5 text-purple-500" />
          <span>Appearance</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Dark Mode</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark themes</p>
          </div>
          <Switch 
            checked={isDarkMode} 
            onCheckedChange={setIsDarkMode}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceSettingsCard;
