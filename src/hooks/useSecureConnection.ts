
import { useState, useEffect } from 'react';
import { logSecurityEvent, defaultSecurityConfig } from '@/config/security';

interface ConnectionStatus {
  isConnected: boolean;
  lastError?: string;
  retryCount: number;
}

export const useSecureConnection = (endpoint: string) => {
  const [status, setStatus] = useState<ConnectionStatus>({
    isConnected: false,
    retryCount: 0
  });

  const checkConnection = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), defaultSecurityConfig.connectionTimeout);
      
      const response = await fetch(endpoint, {
        method: 'HEAD',
        signal: controller.signal,
        mode: 'no-cors' // Allow cross-origin for camera streams
      });
      
      clearTimeout(timeoutId);
      
      setStatus(prev => ({
        isConnected: true,
        retryCount: 0,
        lastError: undefined
      }));
      
      logSecurityEvent('Connection successful', { endpoint });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection failed';
      
      setStatus(prev => ({
        isConnected: false,
        lastError: errorMessage,
        retryCount: prev.retryCount + 1
      }));
      
      logSecurityEvent('Connection failed', { endpoint, error: errorMessage });
    }
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [endpoint]);

  return { ...status, checkConnection };
};
