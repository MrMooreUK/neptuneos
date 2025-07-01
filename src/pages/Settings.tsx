import SettingsHeader from '@/components/settings/SettingsHeader';
import TemperatureSettingsCard from '@/components/settings/TemperatureSettingsCard';
import AppearanceSettingsCard from '@/components/settings/AppearanceSettingsCard';
import SystemInfoCard from '@/components/settings/SystemInfoCard';
import NetworkSettingsCard from '@/components/settings/NetworkSettingsCard';
import BackupRecoveryCard from '@/components/settings/BackupRecoveryCard';
import SystemControlsCard from '@/components/settings/SystemControlsCard';

const Settings = () => {
  return (
    <div className="min-h-screen bg-background">
      <SettingsHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Configure your NeptuneOS aquarium monitoring system
          </p>
        </div>

        {/* Settings Grid */}
        <div className="space-y-8">
          {/* Essential Settings */}
          <div>
            <h2 className="section-title">Essential Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Temperature</h3>
                <TemperatureSettingsCard />
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Appearance</h3>
                <AppearanceSettingsCard />
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">System Info</h3>
                <SystemInfoCard />
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div>
            <h2 className="section-title">Advanced Settings</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Network</h3>
                <NetworkSettingsCard />
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Backup & Recovery</h3>
                <BackupRecoveryCard />
              </div>
            </div>
          </div>

          {/* System Controls */}
          <div>
            <h2 className="section-title">System Controls</h2>
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Power Management</h3>
              <SystemControlsCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
