
import SettingsHeader from '@/components/settings/SettingsHeader';
import TemperatureSettingsCard from '@/components/settings/TemperatureSettingsCard';
import AppearanceSettingsCard from '@/components/settings/AppearanceSettingsCard';
import SystemInfoCard from '@/components/settings/SystemInfoCard';
import NetworkSettingsCard from '@/components/settings/NetworkSettingsCard';
import BackupRecoveryCard from '@/components/settings/BackupRecoveryCard';
import SystemControlsCard from '@/components/settings/SystemControlsCard';

const Settings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-blue-900 transition-all duration-500">
      <SettingsHeader />

      {/* Settings Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">System Settings</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Configure your NeptuneOS aquarium monitoring system</p>
          </div>

          {/* Compact Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {/* Row 1 */}
            <TemperatureSettingsCard />
            <AppearanceSettingsCard />
            <SystemInfoCard />
            
            {/* Row 2 */}
            <NetworkSettingsCard />
            <div className="md:col-span-2 xl:col-span-2">
              <BackupRecoveryCard />
            </div>
            
            {/* Row 3 */}
            <div className="md:col-span-2 xl:col-span-3">
              <SystemControlsCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
