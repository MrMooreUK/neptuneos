// Security configuration and validation utilities
export interface SecurityConfig {
  cameraStreamUrl: string;
  apiBaseUrl: string;
  enableSecurityLogging: boolean;
  connectionTimeout: number;
  maxRetries: number;
}

export const defaultSecurityConfig: SecurityConfig = {
  cameraStreamUrl: '/stream', // Use nginx proxy path
  apiBaseUrl: '/api',
  enableSecurityLogging: true,
  connectionTimeout: 5000,
  maxRetries: 3
};

export const validateNetworkEndpoint = (url: string): boolean => {
  // Allow relative paths starting with /
  if (url.startsWith('/')) {
    return true;
  }
  try {
    const urlObj = new URL(url);
    // Allow local network ranges for aquarium monitoring
    const allowedProtocols = ['http:', 'https:'];
    return allowedProtocols.includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// Define proper type for security event details
type SecurityEventDetails = Record<string, unknown> | string | number | boolean | null | undefined;

export const logSecurityEvent = (event: string, details?: SecurityEventDetails) => {
  if (defaultSecurityConfig.enableSecurityLogging) {
    console.log(`[SECURITY] ${new Date().toISOString()}: ${event}`, details);
  }
};
