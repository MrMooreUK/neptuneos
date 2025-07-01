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
    <div className="flex flex-col gap-6">
      {/* Dark Mode Toggle */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-purple-50 dark:from-slate-800/50 dark:to-purple-900/30 rounded-2xl border border-purple-200/30 dark:border-purple-600/30">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Dark Mode</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Toggle between light and dark themes</p>
        </div>
        <Switch 
          checked={isDarkMode} 
          onCheckedChange={setIsDarkMode}
          className="data-[state=checked]:bg-purple-600"
        />
      </div>

      {/* Typography Settings */}
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Typography</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Customize fonts and text size</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">Font Family</Label>
            <RadioGroup
              value={fontFamily}
              onValueChange={(value) => setFontFamily(value as FontFamily)}
              className="grid grid-cols-3 gap-3"
            >
              {fontFamilies.map((item) => (
                <div key={item.value}>
                  <RadioGroupItem value={item.value} id={item.value} className="peer sr-only" />
                  <Label
                    htmlFor={item.value}
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-800 p-4 text-sm hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:border-purple-300 dark:hover:border-purple-600 peer-data-[state=checked]:border-purple-500 peer-data-[state=checked]:bg-purple-50 dark:peer-data-[state=checked]:bg-purple-900/30 transition-all duration-200 ${item.className}`}
                  >
                    <span className="text-lg mb-1">Aa</span>
                    <span className="text-xs">{item.label}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div>
            <Label htmlFor="font-size" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
              Font Size ({fontSize}%)
            </Label>
            <div className="px-3">
              <Slider
                id="font-size"
                min={80}
                max={120}
                step={10}
                value={[fontSize]}
                onValueChange={(value) => setFontSize(value[0])}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>80%</span>
                <span>100%</span>
                <span>120%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Layout Density */}
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Layout Density</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Adjust spacing and padding</p>
        </div>
        
        <RadioGroup
          value={layoutDensity}
          onValueChange={(value) => setLayoutDensity(value as LayoutDensity)}
          className="grid grid-cols-3 gap-3"
        >
          {layoutDensities.map((item) => (
            <div key={item.value}>
              <RadioGroupItem value={item.value} id={`density-${item.value}`} className="peer sr-only" />
              <Label
                htmlFor={`density-${item.value}`}
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-800 p-4 text-sm hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:border-purple-300 dark:hover:border-purple-600 peer-data-[state=checked]:border-purple-500 peer-data-[state=checked]:bg-purple-50 dark:peer-data-[state=checked]:bg-purple-900/30 transition-all duration-200"
              >
                <div className="flex flex-col space-y-1 items-center">
                  <div className={`w-6 h-4 bg-purple-300 dark:bg-purple-600 rounded ${
                    item.value === 'compact' ? 'space-y-0.5' : 
                    item.value === 'cozy' ? 'space-y-1' : 'space-y-1.5'
                  }`}>
                    <div className="w-full h-0.5 bg-purple-500 dark:bg-purple-400 rounded"></div>
                    <div className="w-full h-0.5 bg-purple-500 dark:bg-purple-400 rounded"></div>
                    <div className="w-full h-0.5 bg-purple-500 dark:bg-purple-400 rounded"></div>
                  </div>
                  <span className="text-xs mt-1">{item.label}</span>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      {/* Theme Preview */}
      <div className="mt-6">
        <ThemePreview />
      </div>
    </div>
  );
};

export default AppearanceSettingsCard;
