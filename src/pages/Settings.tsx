import SettingsHeader from '@/components/settings/SettingsHeader';
import TemperatureSettingsCard from '@/components/settings/TemperatureSettingsCard';
import AppearanceSettingsCard from '@/components/settings/AppearanceSettingsCard';
import SystemInfoCard from '@/components/settings/SystemInfoCard';
import NetworkSettingsCard from '@/components/settings/NetworkSettingsCard';
import BackupRecoveryCard from '@/components/settings/BackupRecoveryCard';
import SystemControlsCard from '@/components/settings/SystemControlsCard';
import { Settings as SettingsIcon, Waves } from 'lucide-react';

const Settings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <SettingsHeader />

      {/* Settings Content */}
      <main className="relative z-10 container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                <SettingsIcon className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-4">
              System Configuration
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Configure your NeptuneOS aquarium monitoring system for optimal performance
            </p>
          </div>

          {/* Professional Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Essential Settings Row */}
            <div className="professional-card overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-b border-white/10">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <Waves className="w-5 h-5 mr-3 text-blue-500" />
                  Temperature Control
                </h3>
              </div>
              <div className="p-6">
                <TemperatureSettingsCard />
              </div>
            </div>
            
            <div className="professional-card overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-white/10">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <SettingsIcon className="w-5 h-5 mr-3 text-purple-500" />
                  Appearance & Theme
                </h3>
              </div>
              <div className="p-6">
                <AppearanceSettingsCard />
              </div>
            </div>
            
            <div className="professional-card overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b border-white/10">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <SettingsIcon className="w-5 h-5 mr-3 text-green-500" />
                  System Information
                </h3>
              </div>
              <div className="p-6">
                <SystemInfoCard />
              </div>
            </div>
            
            {/* Network & Connectivity Row */}
            <div className="professional-card overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b border-white/10">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <SettingsIcon className="w-5 h-5 mr-3 text-orange-500" />
                  Network Settings
                </h3>
              </div>
              <div className="p-6">
                <NetworkSettingsCard />
              </div>
            </div>
            
            <div className="md:col-span-2 professional-card overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border-b border-white/10">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <SettingsIcon className="w-5 h-5 mr-3 text-teal-500" />
                  Backup & Recovery
                </h3>
              </div>
              <div className="p-6">
                <BackupRecoveryCard />
              </div>
            </div>
            
            {/* System Controls Row */}
            <div className="md:col-span-2 xl:col-span-3 professional-card overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-red-500/10 to-pink-500/10 border-b border-white/10">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <SettingsIcon className="w-5 h-5 mr-3 text-red-500" />
                  System Controls
                </h3>
              </div>
              <div className="p-6">
                <SystemControlsCard />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
