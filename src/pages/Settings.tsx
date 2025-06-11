
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TemperatureSettingsCard />
          <AppearanceSettingsCard />
          <SystemInfoCard />
          <NetworkSettingsCard />
          <BackupRecoveryCard />
          <SystemControlsCard />
        </div>
      </main>
    </div>
  );
};

export default Settings;
