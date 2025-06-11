
import { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import LoadingScreen from '@/components/dashboard/LoadingScreen';
import StatusOverviewGrid from '@/components/dashboard/StatusOverviewGrid';
import LiveCameraFeed from '@/components/dashboard/LiveCameraFeed';
import TemperatureMonitoring from '@/components/dashboard/TemperatureMonitoring';
import ComingSoonSection from '@/components/dashboard/ComingSoonSection';
import DashboardFooter from '@/components/dashboard/DashboardFooter';

interface TemperatureData {
  sensor1: number;
  sensor2: number;
  average: number;
  timestamp: string;
}

const Index = () => {
  const [temperatureData, setTemperatureData] = useState<TemperatureData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  const { refreshInterval, autoRefresh } = useSettings();

  const fetchTemperatureData = async () => {
    try {
      const response = await fetch('/api/temperature');
      if (response.ok) {
        const data = await response.json();
        setTemperatureData(data);
      } else {
        throw new Error('API unavailable');
      }
    } catch (error) {
      console.log('Using mock data - API not available');
      const mockData: TemperatureData = {
        sensor1: 25.8,
        sensor2: 26.2,
        average: 26.0,
        timestamp: new Date().toISOString()
      };
      setTemperatureData(mockData);
    } finally {
      setIsLoading(false);
      setLastUpdated(new Date());
    }
  };

  useEffect(() => {
    fetchTemperatureData();
    if (autoRefresh) {
      const interval = setInterval(fetchTemperatureData, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, autoRefresh]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const avgTemp = temperatureData?.average || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-blue-900">
      <DashboardHeader onRefresh={fetchTemperatureData} />

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
