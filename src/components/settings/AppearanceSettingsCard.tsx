
import { Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useSettings, FontFamily, LayoutDensity } from '@/contexts/SettingsContext';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import ThemePreview from './ThemePreview';
import { Slider } from '@/components/ui/slider';

const AppearanceSettingsCard = () => {
  const { 
    isDarkMode, setIsDarkMode, 
    fontFamily, setFontFamily, 
    fontSize, setFontSize, 
    layoutDensity, setLayoutDensity 
  } = useSettings();
  
  const fontFamilies: { value: FontFamily; label: string; className: string }[] = [
    { value: 'sans', label: 'Inter', className: 'font-sans' },
    { value: 'serif', label: 'Garamond', className: 'font-serif' },
    { value: 'mono', label: 'Source Code', className: 'font-mono' },
  ];

  const layoutDensities: { value: LayoutDensity; label: string }[] = [
    { value: 'comfortable', label: 'Comfortable' },
    { value: 'cozy', label: 'Cozy' },
    { value: 'compact', label: 'Compact' },
  ];

  return (
    <Card className="card-hover bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-purple-200 dark:border-slate-600">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Palette className="w-5 h-5 text-purple-500" />
          <span>Appearance</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-[var(--spacing-card-gap,1.5rem)]">
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
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Typography</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Customize fonts and text size</p>
          </div>
          <div className="pt-2 space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Font Family</Label>
              <RadioGroup
                value={fontFamily}
                onValueChange={(value) => setFontFamily(value as FontFamily)}
                className="grid grid-cols-3 gap-2 pt-2"
              >
                {fontFamilies.map((item) => (
                  <div key={item.value}>
                    <RadioGroupItem value={item.value} id={item.value} className="peer sr-only" />
                    <Label
                      htmlFor={item.value}
                      className={`flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 text-sm hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary font-${item.value}`}
                    >
                      {item.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="font-size" className="text-xs text-muted-foreground">Font Size ({fontSize}%)</Label>
              <Slider
                id="font-size"
                min={80}
                max={120}
                step={10}
                value={[fontSize]}
                onValueChange={(value) => setFontSize(value[0])}
                className="pt-4"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Layout Density</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Adjust spacing and padding</p>
          </div>
          <RadioGroup
            value={layoutDensity}
            onValueChange={(value) => setLayoutDensity(value as LayoutDensity)}
            className="grid grid-cols-3 gap-2 pt-2"
          >
            {layoutDensities.map((item) => (
              <div key={item.value}>
                <RadioGroupItem value={item.value} id={item.value} className="peer sr-only" />
                <Label
                  htmlFor={item.value}
                  className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 text-sm hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
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
