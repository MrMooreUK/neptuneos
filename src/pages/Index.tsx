
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-blue-900">
      <DashboardHeader onRefresh={refetch} />

      <main className="container mx-auto px-6 py-8 space-y-8">
        <StatusOverviewGrid avgTemp={avgTemp} lastUpdated={lastUpdated} />
        <LiveCameraFeed />
        <TemperatureMonitoring temperatureData={temperatureData} />
        <ComingSoonSection />
      </main>

      <DashboardFooter />
    </div>
  );
};

export default Index;
