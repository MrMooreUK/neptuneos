
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun } from 'lucide-react';

const ThemePreview = () => {
  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2 text-muted-foreground">Live Preview</h4>
      <div className="p-4 rounded-lg bg-background border transition-colors duration-300">
        <Card className="w-full shadow-none border-0 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-md">
                  <Sun className="w-4 h-4 text-primary" />
                </div>
                <span className="text-foreground">Sample Card</span>
              </div>
              <Badge variant="secondary">Info</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between pt-2">
            <p className="text-sm text-muted-foreground">This is a preview.</p>
            <Button size="sm">Click me</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThemePreview;
