import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Define proper types for user settings values
type UserSettingValue = string | number | boolean | object | null;

interface UserSettingsAPI {
  getAllUserSettings: () => Promise<Record<string, UserSettingValue>>;
  setUserSetting: (key: string, value: UserSettingValue) => Promise<void>;
}

const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

const userSettingsAPI: UserSettingsAPI = {
  getAllUserSettings: async () => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/user/settings`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user settings');
    }
    return response.json();
  },

  setUserSetting: async (key: string, value: UserSettingValue) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/user/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ key, value }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save user setting');
    }
  },
};

export const useUserSettings = () => {
  const queryClient = useQueryClient();
  const token = getAuthToken();

  const settingsQuery = useQuery({
    queryKey: ['userSettings'],
    queryFn: userSettingsAPI.getAllUserSettings,
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const setSettingMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: UserSettingValue }) => 
      userSettingsAPI.setUserSetting(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
    },
  });

  return {
    settings: settingsQuery.data || {},
    isLoading: settingsQuery.isLoading,
    error: settingsQuery.error,
    setSetting: setSettingMutation.mutate,
    isSettingSaving: setSettingMutation.isPending,
  };
};

export { userSettingsAPI };
