
import { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export const useCameraStream = (streamUrl: string) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const isMobile = useIsMobile();
  const imgRef = useRef<HTMLImageElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
    setRetryCount(0);
    console.log("Camera stream loaded successfully");
  };

  const handleImageError = () => {
    setImageLoaded(false);
    setImageError(true);
    console.error("Camera stream error - image failed to load", { retryCount, isMobile });
    
    // Auto-retry on mobile with exponential backoff
    if (isMobile && retryCount < 3) {
      const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
      timeoutRef.current = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        if (imgRef.current) {
          imgRef.current.src = `${streamUrl}?t=${Date.now()}`;
        }
      }, delay);
    }
  };

  const forceRefresh = () => {
    setRetryCount(0);
    setImageError(false);
    if (imgRef.current) {
      imgRef.current.src = `${streamUrl}?t=${Date.now()}`;
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    imageLoaded,
    imageError,
    retryCount,
    imgRef,
    handleImageLoad,
    handleImageError,
    forceRefresh,
    isMobile
  };
};
