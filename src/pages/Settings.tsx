import SettingsHeader from '@/components/settings/SettingsHeader';
import TemperatureSettingsCard from '@/components/settings/TemperatureSettingsCard';
import AppearanceSettingsCard from '@/components/settings/AppearanceSettingsCard';
import SystemInfoCard from '@/components/settings/SystemInfoCard';
import NetworkSettingsCard from '@/components/settings/NetworkSettingsCard';
import BackupRecoveryCard from '@/components/settings/BackupRecoveryCard';
import SystemControlsCard from '@/components/settings/SystemControlsCard';
import { Settings as SettingsIcon, Thermometer, Palette, Info, Wifi, Database, Power } from 'lucide-react';

const Settings = () => {
  return (
    <div className="min-h-screen bg-background">
      <SettingsHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="hero-section fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="apple-card-elevated p-6 bg-gradient-to-br from-accent/10 to-primary/10">
              <SettingsIcon className="w-16 h-16 text-accent" />
            </div>
          </div>
          <h1 className="hero-title">
            Settings
          </h1>
          <p className="hero-subtitle">
            Configure your NeptuneOS aquarium monitoring system
          </p>
        </div>

        {/* Settings Grid */}
        <div className="space-y-12 pb-12">
          {/* Essential Settings */}
          <section className="slide-up">
            <div className="section-header">
              <div className="w-1 h-8 bg-primary rounded-full mr-4"></div>
              Essential Settings
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Temperature Settings */}
              <div className="apple-card-elevated scale-in">
                <div className="p-6 border-b border-border/50">
                  <div className="flex items-center">
                    <div className="apple-card p-3 bg-gradient-to-br from-warning/10 to-destructive/10 mr-4">
                      <Thermometer className="w-6 h-6 text-warning" />
                    </div>
                    <div>
                      <h3 className="text-headline font-semibold">Temperature</h3>
                      <p className="text-caption text-muted-foreground">Unit preferences</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <TemperatureSettingsCard />
                </div>
              </div>

              {/* Appearance Settings */}
              <div className="apple-card-elevated scale-in">
                <div className="p-6 border-b border-border/50">
                  <div className="flex items-center">
                    <div className="apple-card p-3 bg-gradient-to-br from-accent/10 to-primary/10 mr-4">
                      <Palette className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-headline font-semibold">Appearance</h3>
                      <p className="text-caption text-muted-foreground">Theme & display</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <AppearanceSettingsCard />
                </div>
              </div>

              {/* System Information */}
              <div className="apple-card-elevated scale-in">
                <div className="p-6 border-b border-border/50">
                  <div className="flex items-center">
                    <div className="apple-card p-3 bg-gradient-to-br from-success/10 to-primary/10 mr-4">
                      <Info className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <h3 className="text-headline font-semibold">System Info</h3>
                      <p className="text-caption text-muted-foreground">Hardware details</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <SystemInfoCard />
                </div>
              </div>
            </div>
          </section>

          {/* Advanced Settings */}
          <section className="slide-up">
            <div className="section-header">
              <div className="w-1 h-8 bg-accent rounded-full mr-4"></div>
              Advanced Settings
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Network Settings */}
              <div className="apple-card-elevated scale-in">
                <div className="p-6 border-b border-border/50">
                  <div className="flex items-center">
                    <div className="apple-card p-3 bg-gradient-to-br from-primary/10 to-accent/10 mr-4">
                      <Wifi className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-headline font-semibold">Network</h3>
                      <p className="text-caption text-muted-foreground">Connectivity settings</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <NetworkSettingsCard />
                </div>
              </div>

              {/* Backup & Recovery */}
              <div className="apple-card-elevated scale-in">
                <div className="p-6 border-b border-border/50">
                  <div className="flex items-center">
                    <div className="apple-card p-3 bg-gradient-to-br from-success/10 to-accent/10 mr-4">
                      <Database className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <h3 className="text-headline font-semibold">Backup & Recovery</h3>
                      <p className="text-caption text-muted-foreground">Data management</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <BackupRecoveryCard />
                </div>
              </div>
            </div>
          </section>

          {/* System Controls */}
          <section className="slide-up">
            <div className="section-header">
              <div className="w-1 h-8 bg-destructive rounded-full mr-4"></div>
              System Controls
            </div>
            <div className="apple-card-elevated scale-in">
              <div className="p-6 border-b border-border/50">
                <div className="flex items-center">
                  <div className="apple-card p-3 bg-gradient-to-br from-destructive/10 to-warning/10 mr-4">
                    <Power className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <h3 className="text-headline font-semibold">System Controls</h3>
                    <p className="text-caption text-muted-foreground">Power management & maintenance</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <SystemControlsCard />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Settings;
