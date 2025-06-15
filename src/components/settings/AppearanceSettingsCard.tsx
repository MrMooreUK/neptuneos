
import { Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useSettings, Theme } from '@/contexts/SettingsContext';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import ThemePreview from './ThemePreview';

const AppearanceSettingsCard = () => {
  const { isDarkMode, setIsDarkMode, theme, setTheme } = useSettings();

  const themes: { value: Theme; label: string; }[] = [
    { value: 'ocean', label: 'Ocean' },
    { value: 'coral', label: 'Coral' },
    { value: 'deep-sea', label: 'Deep Sea' },
  ];

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
        
        <div className="space-y-2">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Theme</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Select a color theme for the UI</p>
          </div>
          <RadioGroup
            value={theme}
            onValueChange={(value) => setTheme(value as Theme)}
            className="grid grid-cols-3 gap-2 pt-2 sm:gap-4"
          >
            {themes.map((item) => (
              <div key={item.value}>
                <RadioGroupItem value={item.value} id={item.value} className="peer sr-only" />
                <Label
                  htmlFor={item.value}
                  className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  {item.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <ThemePreview />

      </CardContent>
    </Card>
  );
};

export default AppearanceSettingsCard;
