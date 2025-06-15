
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
        {/* Main Content Grid */}
        <div className="space-y-8">
          {/* Camera Feed at the top */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <div className="w-1 h-6 bg-purple-500 rounded-full mr-3"></div>
              Live Feed
            </h2>
            <LiveCameraFeed />
          </section>

          {/* Status Overview */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
              System Overview
            </h2>
            <StatusOverviewGrid avgTemp={avgTemp} lastUpdated={lastUpdated} />
          </section>

          {/* Temperature Monitoring */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <div className="w-1 h-6 bg-cyan-500 rounded-full mr-3"></div>
              Temperature Control
            </h2>
            <TemperatureMonitoring temperatureData={temperatureData} />
          </section>

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
