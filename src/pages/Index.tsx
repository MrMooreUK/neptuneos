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
    <div className="min-h-screen bg-background">
      <DashboardHeader onRefresh={refetch} />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            NeptuneOS Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage your aquarium system
          </p>
        </div>

        {/* System Overview */}
        <div className="mb-8">
          <h2 className="section-title">System Overview</h2>
          <StatusOverviewGrid avgTemp={avgTemp} lastUpdated={lastUpdated} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Temperature Monitoring */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Temperature Control</h3>
              <TemperatureMonitoring temperatureData={temperatureData} />
            </div>
          </div>

          {/* Camera Feed */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Live Camera Feed</h3>
                <span className="status-online">LIVE</span>
              </div>
              <LiveCameraFeed />
            </div>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="mb-8">
          <h2 className="section-title">Coming Soon</h2>
          <ComingSoonSection />
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
};

export default Index;
