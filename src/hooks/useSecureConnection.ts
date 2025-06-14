
import { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { logSecurityEvent, defaultSecurityConfig } from '@/config/security';

interface ConnectionStatus {
  isConnected: boolean;
  lastError?: string;
  retryCount: number;
}

export const useSecureConnection = (endpoint: string) => {
  const [status, setStatus] = useState<ConnectionStatus>({
    isConnected: false,
    retryCount: 0,
    lastError: undefined, // Ensure lastError is initialized
  });

  const checkConnection = useCallback(async () => {
    if (!endpoint) { // Do not attempt if endpoint is empty
      setStatus({
        isConnected: false,
        lastError: 'Endpoint not configured',
        retryCount: 0,
      });
      logSecurityEvent('Connection check skipped: no endpoint', { endpoint });
      return;
    }

    // Reset status slightly for retries or new endpoint to show loading state
    setStatus(prev => ({ ...prev, isConnected: false, lastError: prev.endpointChanged ? undefined : prev.lastError }));


    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), defaultSecurityConfig.connectionTimeout);
      
      // Using 'no-cors' mode for HEAD requests to camera streams which might not support CORS for HEAD.
      // This won't give us the response body or exact status for cross-origin, but can indicate reachability.
      // For image tags, 'no-cors' is implicitly handled by the browser, but fetch needs it specified for certain checks.
      const response = await fetch(endpoint, {
        method: 'HEAD', 
        signal: controller.signal,
        mode: 'no-cors', 
      });
      
      clearTimeout(timeoutId);
      
      // For 'no-cors' with 'HEAD', response.ok might be false even if reachable,
      // but an error thrown (like network error) is a clearer sign of failure.
      // If fetch completes without throwing, we'll assume it's "connectable" for HEAD no-cors.
      // A more robust check would be to attempt to load the image in a hidden element if HEAD is unreliable.
      
      setStatus({ // Explicitly set all fields
        isConnected: true,
        retryCount: 0,
        lastError: undefined,
      });
      
      logSecurityEvent('Connection successful', { endpoint });
    } catch (error) {
      const errorMessage = error instanceof Error ? (error.name === 'AbortError' ? 'Connection timed out' : error.message) : 'Connection failed';
      
      setStatus(prev => ({
        isConnected: false,
        lastError: errorMessage,
        retryCount: prev.retryCount + 1, // This will be reset if endpoint changes via useEffect re-run
      }));
      
      logSecurityEvent('Connection failed', { endpoint, error: errorMessage });
    }
  }, [endpoint]); // Added endpoint to useCallback dependencies

  useEffect(() => {
    // Reset retryCount and lastError when endpoint changes, then check connection.
    setStatus(prev => ({
      isConnected: false, // Assume disconnected when endpoint changes until check completes
      retryCount: 0,
      lastError: undefined,
      endpointChanged: prev.endpoint !== endpoint // A temporary flag to help reset logic, not part of ConnectionStatus interface
    }));
    checkConnection(); // Check immediately when endpoint changes or component mounts
    
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [endpoint, checkConnection]); // checkConnection is now memoized

  return { ...status, checkConnection };
};

