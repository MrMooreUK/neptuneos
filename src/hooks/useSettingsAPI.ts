import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Define proper types for settings values
type SettingValue = string | number | boolean | object | null;

interface Setting {
  key: string;
  value: SettingValue;
}

interface TemperatureReading {
  id: number;
  sensorId: number;
  temperature: number;
  unit: string;
  timestamp: string;
}

interface SettingsAPI {
  getAllSettings: () => Promise<Record<string, SettingValue>>;
  getSetting: (key: string) => Promise<SettingValue>;
  setSetting: (key: string, value: SettingValue) => Promise<void>;
  logTemperature: (sensorId: number, temperature: number, unit: string) => Promise<void>;
  getTemperatureHistory: (sensorId?: number, limit?: number) => Promise<TemperatureReading[]>;
}

const settingsAPI: SettingsAPI = {
  getAllSettings: async () => {
    const response = await fetch(`${API_BASE_URL}/api/settings`);
    if (!response.ok) {
      throw new Error('Failed to fetch settings');
    }
    return response.json();
  },

  getSetting: async (key: string) => {
    const response = await fetch(`${API_BASE_URL}/api/settings/${key}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch setting');
    }
    const data = await response.json();
    return data.value;
  },

  setSetting: async (key: string, value: SettingValue) => {
    const response = await fetch(`${API_BASE_URL}/api/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key, value }),
    });
    if (!response.ok) {
      throw new Error('Failed to save setting');
    }
  },

  logTemperature: async (sensorId: number, temperature: number, unit: string) => {
    const response = await fetch(`${API_BASE_URL}/api/temperature/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sensorId, temperature, unit }),
    });
    if (!response.ok) {
      throw new Error('Failed to log temperature');
    }
  },

  getTemperatureHistory: async (sensorId?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (sensorId) params.append('sensorId', sensorId.toString());
    if (limit) params.append('limit', limit.toString());
    
    const response = await fetch(`${API_BASE_URL}/api/temperature/history?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch temperature history');
    }
    return response.json();
  },
};

export const useSettings = () => {
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({
    queryKey: ['settings'],
    queryFn: settingsAPI.getAllSettings,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const setSettingMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: SettingValue }) => 
      settingsAPI.setSetting(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  const logTemperatureMutation = useMutation({
    mutationFn: ({ sensorId, temperature, unit }: { sensorId: number; temperature: number; unit: string }) =>
      settingsAPI.logTemperature(sensorId, temperature, unit),
  });

  return {
    settings: settingsQuery.data || {},
    isLoading: settingsQuery.isLoading,
    error: settingsQuery.error,
    setSetting: setSettingMutation.mutate,
    logTemperature: logTemperatureMutation.mutate,
    isSettingSaving: setSettingMutation.isPending,
  };
};

export const useTemperatureHistory = (sensorId?: number, limit?: number) => {
  return useQuery({
    queryKey: ['temperatureHistory', sensorId, limit],
    queryFn: () => settingsAPI.getTemperatureHistory(sensorId, limit),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export { settingsAPI };
