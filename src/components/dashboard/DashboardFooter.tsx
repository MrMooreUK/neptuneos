
const DashboardFooter = () => {
  return (
    <footer className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-slate-700/50 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">NeptuneOS</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Advanced Aquarium Monitoring</p>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © 2024 NeptuneOS. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Built with precision for aquatic excellence
            </p>
          </div>
          
          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <span>v1.0.0</span>
            <span>•</span>
            <span>Status: Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
