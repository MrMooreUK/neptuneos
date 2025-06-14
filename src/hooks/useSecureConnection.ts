
import { useState, useEffect, useCallback } from 'react';
import { logSecurityEvent, defaultSecurityConfig } from '@/config/security';

interface ConnectionStatus {
  isConnected: boolean;
  lastError?: string;
  retryCount: number;
  endpoint?: string; // Added to store the endpoint this status refers to
}

export const useSecureConnection = (endpoint: string) => {
  const [status, setStatus] = useState<ConnectionStatus>({
    isConnected: false,
    retryCount: 0,
    lastError: undefined,
    endpoint: undefined, // Initialize endpoint as undefined
  });

  const checkConnection = useCallback(async () => {
    if (!endpoint) {
      setStatus({
        isConnected: false,
        lastError: 'Endpoint not configured',
        retryCount: 0,
        endpoint: endpoint, // Store current (empty) endpoint
      });
      logSecurityEvent('Connection check skipped: no endpoint', { endpoint });
      return;
    }

    // Indicate "checking" status. lastError is managed by useEffect or subsequent updates.
    setStatus(prev => ({ ...prev, isConnected: false }));

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), defaultSecurityConfig.connectionTimeout);
      
      const response = await fetch(endpoint, {
        method: 'HEAD', 
        signal: controller.signal,
        mode: 'no-cors', 
      });
      
      clearTimeout(timeoutId);
      
      setStatus({
        isConnected: true,
        retryCount: 0,
        lastError: undefined,
        endpoint: endpoint, // Store the successfully connected endpoint
      });
      
      logSecurityEvent('Connection successful', { endpoint });
    } catch (error) {
      const errorMessage = error instanceof Error ? (error.name === 'AbortError' ? 'Connection timed out' : error.message) : 'Connection failed';
      
      setStatus(prev => ({
        isConnected: false,
        lastError: errorMessage,
        retryCount: prev.retryCount + 1,
        endpoint: endpoint, // Store the endpoint that failed
      }));
      
      logSecurityEvent('Connection failed', { endpoint, error: errorMessage });
    }
  }, [endpoint]);

  useEffect(() => {
    setStatus(prevStatus => {
      const endpointHasActuallyChanged = prevStatus.endpoint !== endpoint;
      return {
        isConnected: false,
        retryCount: 0,
        // Reset lastError if the endpoint truly changed or if it's the initial load (prevStatus.endpoint is undefined)
        lastError: endpointHasActuallyChanged ? undefined : prevStatus.lastError,
        endpoint: endpoint, // Store the new endpoint
      };
    });
    checkConnection();
    
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, [endpoint, checkConnection]);

  return { ...status, checkConnection };
};
