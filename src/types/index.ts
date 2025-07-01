// Core application types

export type SettingValue = string | number | boolean | object | null;
export type UserSettingValue = string | number | boolean | object | null;

// Temperature related types
export interface TemperatureData {
  sensor1: number;
  sensor2: number;
  average: number;
  timestamp: string;
}

export interface TemperatureReading {
  id: number;
  sensorId: number;
  temperature: number;
  unit: string;
  timestamp: string;
}

export interface TemperatureStatus {
  label: string;
  color: string;
}

export type TemperatureUnit = 'C' | 'F';

// User and Authentication types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Settings types
export interface AppSettings {
  temperatureUnit: TemperatureUnit;
  refreshInterval: number;
  cameraStreamUrl: string;
  enableNotifications: boolean;
  darkMode: boolean;
  autoRefresh: boolean;
}

// Camera and streaming types
export interface CameraStreamState {
  isConnected: boolean;
  imageLoaded: boolean;
  imageError: boolean;
  retryCount: number;
  lastError?: string;
}

export interface StreamConfig {
  url: string;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  fps: number;
  resolution: string;
}

// System information types
export interface SystemInfo {
  uptime: string;
  cpu: number;
  memory: number;
  storage: number;
  network: string;
  temperature?: number;
}

// Network types
export interface NetworkConfig {
  ssid: string;
  password?: string;
  security: 'WPA2' | 'WPA3' | 'WEP' | 'OPEN';
  ipAddress?: string;
  isConnected: boolean;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

// Form types
export interface LoginFormData {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

// Hook return types
export interface UseSettingsReturn {
  settings: Record<string, SettingValue>;
  isLoading: boolean;
  error: Error | null;
  setSetting: (key: string, value: SettingValue) => void;
  isSettingSaving: boolean;
}

export interface UseTemperatureReturn {
  data: TemperatureData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

// Event types
export interface SecurityEvent {
  type: 'login' | 'logout' | 'failed_login' | 'settings_change' | 'system_access';
  userId?: string;
  timestamp: string;
  details: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Environment configuration
export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  VITE_API_BASE_URL: string;
  VITE_CAMERA_STREAM_URL: string;
  VITE_ENABLE_CAMERA: boolean;
  VITE_ENABLE_FUTURE_FEATURES: boolean;
}