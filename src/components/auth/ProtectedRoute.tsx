
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/dashboard/LoadingScreen';
import Auth from '@/pages/Auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
