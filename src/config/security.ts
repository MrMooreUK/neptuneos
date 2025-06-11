
// Security configuration and validation utilities
export interface SecurityConfig {
  cameraStreamUrl: string;
  apiBaseUrl: string;
  enableSecurityLogging: boolean;
  connectionTimeout: number;
  maxRetries: number;
}

export const defaultSecurityConfig: SecurityConfig = {
  cameraStreamUrl: 'http://192.168.10.148:5000/',
  apiBaseUrl: '/api',
  enableSecurityLogging: true,
  connectionTimeout: 5000,
  maxRetries: 3
};

export const validateNetworkEndpoint = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    // Allow local network ranges for aquarium monitoring
    const allowedProtocols = ['http:', 'https:'];
    return allowedProtocols.includes(urlObj.protocol);
  } catch {
    return false;
  }
};

export const logSecurityEvent = (event: string, details?: any) => {
  if (defaultSecurityConfig.enableSecurityLogging) {
    console.log(`[SECURITY] ${new Date().toISOString()}: ${event}`, details);
  }
};
