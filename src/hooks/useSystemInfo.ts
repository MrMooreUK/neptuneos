
import { useQuery } from '@tanstack/react-query';
import { logSecurityEvent, defaultSecurityConfig } from '@/config/security';

export interface SystemInfo {
  uptime: number; // in seconds
  cpuUsage: number; // percentage
  memory: {
    used: number; // in MB
    total: number; // in MB
  };
  storage: {
    used: number; // in GB
    total: number; // in GB
  };
  ipAddress: string;
}

const fetchSystemInfo = async (): Promise<SystemInfo> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), defaultSecurityConfig.connectionTimeout);

    const response = await fetch(defaultSecurityConfig.apiBaseUrl + '/system-info', {
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      logSecurityEvent('System info data fetched successfully');
      return data;
    } else {
      throw new Error(`API responded with status: ${response.status}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logSecurityEvent('API request for system info failed, using mock data', { error: errorMessage });
    
    console.log('Using mock system info - API not available');
    const mockData: SystemInfo = {
      uptime: (2 * 24 * 60 * 60) + (14 * 60 * 60) + (32 * 60) + Math.floor(Math.random() * 60), // 2d 14h 32m in seconds + random seconds
      cpuUsage: 23 + Math.random() * 5,
      memory: {
        used: 456 + Math.random() * 50,
        total: 1024, // 1GB in MB
      },
      storage: {
        used: 12.3,
        total: 32,
      },
      ipAddress: '192.168.1.42',
    };
    return mockData;
  }
};

export const useSystemInfo = () => {
  return useQuery({
    queryKey: ['systemInfo'],
    queryFn: fetchSystemInfo,
    refetchInterval: 5000, // Refetch every 5 seconds
    staleTime: 5000,
  });
};
