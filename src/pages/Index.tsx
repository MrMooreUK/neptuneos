
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
      <DashboardHeader onRefresh={refetch} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Aquarium <span className="text-blue-600 dark:text-blue-400">Command Center</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Monitor your aquatic ecosystem with real-time temperature tracking, live camera feeds, and system status updates
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="space-y-8">
          {/* Status Overview */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
              System Overview
            </h2>
            <StatusOverviewGrid avgTemp={avgTemp} lastUpdated={lastUpdated} />
          </section>

          {/* Main Monitoring Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Temperature Monitoring - Takes 2 columns */}
            <div className="xl:col-span-2">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <div className="w-1 h-6 bg-cyan-500 rounded-full mr-3"></div>
                Temperature Control
              </h2>
              <TemperatureMonitoring temperatureData={temperatureData} />
            </div>

            {/* Camera Feed - Takes 1 column */}
            <div className="xl:col-span-1">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <div className="w-1 h-6 bg-purple-500 rounded-full mr-3"></div>
                Live Feed
              </h2>
              <LiveCameraFeed />
            </div>
          </div>

          {/* Coming Soon Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <div className="w-1 h-6 bg-orange-500 rounded-full mr-3"></div>
              Future Features
            </h2>
            <ComingSoonSection />
          </section>
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
};

export default Index;
