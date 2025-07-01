import { useEffect } from 'react';
import { logSecurityEvent } from '@/config/security';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import LoadingScreen from '@/components/dashboard/LoadingScreen';
import StatusOverviewGrid from '@/components/dashboard/StatusOverviewGrid';
import LiveCameraFeed from '@/components/dashboard/LiveCameraFeed';
import TemperatureMonitoring from '@/components/dashboard/TemperatureMonitoring';
import ComingSoonSection from '@/components/dashboard/ComingSoonSection';
import DashboardFooter from '@/components/dashboard/DashboardFooter';
import { useTemperatureData } from '@/hooks/useTemperatureData';
import { Waves, Thermometer, Camera, Settings, Activity, Droplets } from 'lucide-react';

const Index = () => {
  const { data: temperatureData, isLoading, refetch, dataUpdatedAt } = useTemperatureData();

  useEffect(() => {
    logSecurityEvent('Dashboard initialized');
  }, []);

  if (isLoading || !temperatureData) {
    return <LoadingScreen />;
  }

  const avgTemp = temperatureData.average;
  const lastUpdated = new Date(dataUpdatedAt);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <DashboardHeader onRefresh={refetch} />

      <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
              <Waves className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent mb-4">
            NeptuneOS Control Center
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Professional aquarium monitoring and management system
          </p>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          
          {/* Left Column - Temperature & Status */}
          <div className="xl:col-span-1 space-y-6">
            {/* Quick Stats Card */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 dark:border-slate-700/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Activity className="w-6 h-6 mr-3 text-blue-500" />
                  System Status
                </h3>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl">
                  <div className="flex items-center">
                    <Thermometer className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">Temperature</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{avgTemp.toFixed(1)}°C</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl">
                  <div className="flex items-center">
                    <Droplets className="w-5 h-5 text-green-600 mr-3" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">Water Quality</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">Optimal</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl">
                  <div className="flex items-center">
                    <Camera className="w-5 h-5 text-purple-600 mr-3" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">Camera Feed</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">Live</span>
                </div>
              </div>
            </div>

            {/* Temperature Monitoring */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-b border-white/10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Thermometer className="w-6 h-6 mr-3 text-cyan-500" />
                  Temperature Control
                </h3>
              </div>
              <div className="p-6">
                <TemperatureMonitoring temperatureData={temperatureData} />
              </div>
            </div>
          </div>

          {/* Center Column - Camera Feed */}
          <div className="xl:col-span-2">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden h-full">
              <div className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-white/10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Camera className="w-6 h-6 mr-3 text-purple-500" />
                  Live Aquarium Feed
                  <div className="ml-auto flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-sm text-red-500 font-medium">LIVE</span>
                  </div>
                </h3>
              </div>
              <div className="p-6">
                <LiveCameraFeed />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - System Overview */}
        <div className="mb-8">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-teal-500/10 to-blue-500/10 border-b border-white/10">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <Settings className="w-6 h-6 mr-3 text-teal-500" />
                System Overview
              </h3>
            </div>
            <div className="p-6">
              <StatusOverviewGrid avgTemp={avgTemp} lastUpdated={lastUpdated} />
            </div>
          </div>
        </div>

        {/* Future Features Section */}
        <div className="mb-8">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b border-white/10">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <Waves className="w-6 h-6 mr-3 text-orange-500" />
                Future Features
              </h3>
            </div>
            <div className="p-6">
              <ComingSoonSection />
            </div>
          </div>
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
};

export default Index;
