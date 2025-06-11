
import { Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ComingSoonSection = () => {
  return (
    <Card className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-slate-800/50 dark:to-slate-700/50 border border-gray-200/50 dark:border-slate-600/30">
      <CardContent className="p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-full">
              <Lock className="w-8 h-8 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Advanced Features</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Automated feeding • Smart lighting • Water quality monitoring</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">Coming Soon</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComingSoonSection;
