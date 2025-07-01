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
  
  const fontFamilies: { value: FontFamily; label: string; preview: string }[] = [
    { value: 'sans', label: 'Inter', preview: 'Aa' },
    { value: 'serif', label: 'New York', preview: 'Aa' },
    { value: 'mono', label: 'SF Mono', preview: 'Aa' },
  ];

  const layoutDensities: { value: LayoutDensity; label: string; description: string }[] = [
    { value: 'comfortable', label: 'Comfortable', description: 'More spacing' },
    { value: 'cozy', label: 'Cozy', description: 'Balanced' },
    { value: 'compact', label: 'Compact', description: 'Less spacing' },
  ];

  return (
    <div className="space-y-8">
      {/* Dark Mode Toggle */}
      <div className="flex items-center justify-between p-4 apple-card bg-muted/30">
        <div className="space-y-1">
          <h4 className="text-callout font-semibold">Dark Mode</h4>
          <p className="text-caption text-muted-foreground">Switch between light and dark themes</p>
        </div>
        <Switch 
          checked={isDarkMode} 
          onCheckedChange={setIsDarkMode}
          className="apple-switch"
        />
      </div>

      {/* Typography Settings */}
      <div className="space-y-6">
        <div>
          <h4 className="text-callout font-semibold mb-1">Typography</h4>
          <p className="text-caption text-muted-foreground">Customize fonts and text size</p>
        </div>
        
        {/* Font Family */}
        <div className="space-y-4">
          <Label className="text-callout font-medium">Font Family</Label>
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
                  className="apple-card cursor-pointer flex flex-col items-center justify-center p-4 text-center hover:bg-muted/50 peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:border-primary/20 peer-data-[state=checked]:text-primary transition-all duration-200"
                >
                  <span className={`text-2xl font-bold mb-2 ${item.value === 'serif' ? 'font-serif' : item.value === 'mono' ? 'font-mono' : 'font-sans'}`}>
                    {item.preview}
                  </span>
                  <span className="text-caption font-medium">{item.label}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        {/* Font Size */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-callout font-medium">Font Size</Label>
            <span className="text-caption text-muted-foreground font-mono">{fontSize}%</span>
          </div>
          <div className="px-2">
            <Slider
              value={[fontSize]}
              onValueChange={(value) => setFontSize(value[0])}
              min={80}
              max={120}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-caption text-muted-foreground mt-2">
              <span>80%</span>
              <span>100%</span>
              <span>120%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Layout Density */}
      <div className="space-y-6">
        <div>
          <h4 className="text-callout font-semibold mb-1">Layout Density</h4>
          <p className="text-caption text-muted-foreground">Adjust spacing and padding throughout the interface</p>
        </div>
        
        <RadioGroup
          value={layoutDensity}
          onValueChange={(value) => setLayoutDensity(value as LayoutDensity)}
          className="grid grid-cols-1 gap-3"
        >
          {layoutDensities.map((item) => (
            <div key={item.value}>
              <RadioGroupItem value={item.value} id={`density-${item.value}`} className="peer sr-only" />
              <Label
                htmlFor={`density-${item.value}`}
                className="apple-card cursor-pointer flex items-center justify-between p-4 hover:bg-muted/50 peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:border-primary/20 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col space-y-1">
                    <div className={`w-8 h-1 bg-primary/60 rounded-full`}></div>
                    <div className={`w-6 h-1 bg-primary/40 rounded-full ${item.value === 'compact' ? 'mt-0.5' : item.value === 'cozy' ? 'mt-1' : 'mt-1.5'}`}></div>
                    <div className={`w-4 h-1 bg-primary/30 rounded-full ${item.value === 'compact' ? 'mt-0.5' : item.value === 'cozy' ? 'mt-1' : 'mt-1.5'}`}></div>
                  </div>
                  <div>
                    <div className="text-callout font-medium">{item.label}</div>
                    <div className="text-caption text-muted-foreground">{item.description}</div>
                  </div>
                </div>
                <div className="w-4 h-4 rounded-full border-2 border-border peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/20"></div>
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
