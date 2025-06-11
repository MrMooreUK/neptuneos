
import { HardDrive, Download, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const BackupRecoveryCard = () => {
  const { toast } = useToast();

  const handleBackupExport = () => {
    console.log('Exporting backup...');
    toast({
      title: "Backup Export",
      description: "System configuration has been exported successfully.",
    });
  };

  const handleBackupImport = () => {
    console.log('Importing backup...');
    toast({
      title: "Backup Import",
      description: "System configuration has been imported successfully.",
    });
  };

  return (
    <Card className="card-hover bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-orange-200 dark:border-slate-600 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <HardDrive className="w-5 h-5 text-orange-500" />
          <span>Backup & Recovery</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" onClick={handleBackupExport} className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Backup</span>
          </Button>
          <Button variant="outline" onClick={handleBackupImport} className="flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Import Backup</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackupRecoveryCard;
