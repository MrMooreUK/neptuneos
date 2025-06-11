
import { Fish } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-blue-900 flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Fish className="w-12 h-12 wave-animation text-blue-500 mr-3" />
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">NeptuneOS</h1>
        </div>
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">Loading NeptuneOS</h2>
        <p className="text-gray-500 dark:text-gray-400">Connecting to aquarium sensors...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
