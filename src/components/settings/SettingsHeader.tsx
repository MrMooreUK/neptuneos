
import { ArrowLeft, Fish } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const SettingsHeader = () => {
  return (
    <header className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md shadow-lg border-b border-blue-100 dark:border-slate-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center">
              <Fish className="w-8 h-8 text-blue-500 mr-3" />
              <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">NeptuneOS</h1>
            </div>
          </div>
          
          <Badge variant="outline" className="text-xs">NeptuneOS v1.0</Badge>
        </div>
      </div>
    </header>
  );
};

export default SettingsHeader;
