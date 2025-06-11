
import { ArrowLeft } from 'lucide-react';
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
            <img 
              src="/lovable-uploads/7a639741-946c-4ffe-83f1-6db4098f2d5b.png"
              alt="NeptuneOS Logo"
              className="w-40 h-40"
            />
          </div>
          
          <Badge variant="outline" className="text-xs">NeptuneOS v1.0</Badge>
        </div>
      </div>
    </header>
  );
};

export default SettingsHeader;
