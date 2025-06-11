
import SettingsHeader from '@/components/settings/SettingsHeader';
import TemperatureSettingsCard from '@/components/settings/TemperatureSettingsCard';
import AppearanceSettingsCard from '@/components/settings/AppearanceSettingsCard';
import SystemInfoCard from '@/components/settings/SystemInfoCard';
import NetworkSettingsCard from '@/components/settings/NetworkSettingsCard';
import BackupRecoveryCard from '@/components/settings/BackupRecoveryCard';
import SystemControlsCard from '@/components/settings/SystemControlsCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Monitor, Network, Shield } from 'lucide-react';

const Settings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-blue-900 transition-all duration-500">
      <SettingsHeader />

      {/* Settings Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">System Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Configure your NeptuneOS aquarium monitoring system</p>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
              <TabsTrigger value="general" className="flex items-center space-x-2">
                <SettingsIcon className="w-4 h-4" />
                <span className="hidden sm:inline">General</span>
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center space-x-2">
                <Monitor className="w-4 h-4" />
                <span className="hidden sm:inline">System</span>
              </TabsTrigger>
              <TabsTrigger value="network" className="flex items-center space-x-2">
                <Network className="w-4 h-4" />
                <span className="hidden sm:inline">Network</span>
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Advanced</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TemperatureSettingsCard />
                <AppearanceSettingsCard />
              </div>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SystemInfoCard />
                <div className="lg:col-span-2">
                  <BackupRecoveryCard />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="network" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <NetworkSettingsCard />
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <SystemControlsCard />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Settings;
