
import { Power, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useSettings } from '@/contexts/SettingsContext';

const SystemControlsCard = () => {
  const { rebootSystem, factoryReset } = useSettings();

  return (
    <Card className="card-hover bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-red-200 dark:border-red-600 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Power className="w-5 h-5 text-red-500" />
          <span>System Controls</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <RotateCcw className="w-4 h-4" />
                <span>Reboot System</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reboot System</DialogTitle>
                <DialogDescription>
                  Are you sure you want to reboot the system? This will temporarily disconnect the monitoring.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive" onClick={rebootSystem}>Reboot Now</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="flex items-center space-x-2">
                <Power className="w-4 h-4" />
                <span>Factory Reset</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Factory Reset</DialogTitle>
                <DialogDescription>
                  This will reset all settings to their default values. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive" onClick={factoryReset}>Reset Now</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemControlsCard;
