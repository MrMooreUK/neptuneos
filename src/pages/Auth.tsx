
import React, { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-blue-900 flex items-center justify-center p-4">
      {isLoginMode ? (
        <LoginForm onToggleMode={toggleMode} />
      ) : (
        <RegisterForm onToggleMode={toggleMode} />
      )}
    </div>
  );
};

export default Auth;
