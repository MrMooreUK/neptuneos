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
import { Waves, Thermometer, Camera } from 'lucide-react';

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="hero-section fade-in">
          <div className="flex items-center justify-center mb-8">
            <div className="icon-container floating-card">
              <Waves className="w-16 h-16 text-primary" style={{ animation: 'wave 4s ease-in-out infinite' }} />
            </div>
          </div>
          <h1 className="hero-title">
            NeptuneOS
          </h1>
          <p className="hero-subtitle">
            Professional aquarium monitoring and management system
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="space-y-16 pb-16">
          {/* System Overview */}
          <section className="slide-up">
            <div className="section-header">
              System Overview
            </div>
            <StatusOverviewGrid avgTemp={avgTemp} lastUpdated={lastUpdated} />
          </section>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Temperature Monitoring */}
            <div className="lg:col-span-1 scale-in">
              <div className="premium-card">
                <div className="p-6 border-b border-border/30">
                  <div className="flex items-center">
                    <div className="icon-container mr-4">
                      <Thermometer className="w-6 h-6 text-warning" />
                    </div>
                    <div>
                      <h3 className="text-headline font-semibold">Temperature Control</h3>
                      <p className="text-caption text-muted-foreground">Real-time monitoring</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <TemperatureMonitoring temperatureData={temperatureData} />
                </div>
              </div>
            </div>

            {/* Camera Feed */}
            <div className="lg:col-span-2 scale-in">
              <div className="premium-card">
                <div className="p-6 border-b border-border/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="icon-container mr-4">
                        <Camera className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-headline font-semibold">Live Aquarium Feed</h3>
                        <p className="text-caption text-muted-foreground">High-definition monitoring</p>
                      </div>
                    </div>
                    <div className="live-indicator">
                      LIVE
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <LiveCameraFeed />
                </div>
              </div>
            </div>
          </div>

          {/* Future Features */}
          <section className="slide-up">
            <div className="section-header">
              Coming Soon
            </div>
            <ComingSoonSection />
          </section>
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
};

export default Index;
