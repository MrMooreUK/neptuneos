
import { useQuery } from '@tanstack/react-query';
import { useSettings } from '@/contexts/SettingsContext';
import { logSecurityEvent, defaultSecurityConfig } from '@/config/security';

export interface TemperatureData {
  sensor1: number;
  sensor2: number;
  average: number;
  timestamp: string;
}

const fetchTemperatureData = async (): Promise<TemperatureData> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), defaultSecurityConfig.connectionTimeout);

    const response = await fetch(defaultSecurityConfig.apiBaseUrl + '/temperature', {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      logSecurityEvent('Temperature data fetched successfully');
      return data;
    } else {
      throw new Error(`API responded with status: ${response.status}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logSecurityEvent('API request failed, using mock data', { error: errorMessage });

    console.log('Using mock data - API not available');
    const mockData: TemperatureData = {
      sensor1: 25.8,
      sensor2: 26.2,
      average: 26.0,
      timestamp: new Date().toISOString(),
    };
    return mockData;
  }
};

export const useTemperatureData = () => {
  const { refreshInterval, autoRefresh } = useSettings();

  return useQuery({
    queryKey: ['temperature'],
    queryFn: fetchTemperatureData,
    refetchInterval: autoRefresh ? refreshInterval * 1000 : false,
    staleTime: refreshInterval * 1000,
  });
};
