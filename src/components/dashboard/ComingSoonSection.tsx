
import { Lock, Zap, Lightbulb, Droplets, Calendar, Bell } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ComingSoonSection = () => {
  const features = [
    {
      icon: Droplets,
      title: "Water Quality Monitoring",
      description: "pH, ammonia, and nitrate levels",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Calendar,
      title: "Automated Feeding",
      description: "Schedule and track feeding times",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Lightbulb,
      title: "Smart Lighting",
      description: "Circadian rhythm LED control",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Bell,
      title: "Alert System",
      description: "Instant notifications and alerts",
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <Card className="group hover:shadow-xl transition-all duration-500 bg-gradient-to-br from-slate-50/90 to-gray-100/90 dark:from-slate-800/70 dark:to-slate-700/50 backdrop-blur-sm border border-gray-200/50 dark:border-slate-600/30 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-slate-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <CardContent className="p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-700/50 dark:to-slate-700/50 rounded-2xl mb-4">
            <Lock className="w-8 h-8 text-gray-600 dark:text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Advanced Features</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Exciting new capabilities are coming soon to enhance your aquarium management experience
          </p>
          <Badge variant="outline" className="mt-3 px-4 py-2 text-sm font-semibold">Coming Soon</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group/feature hover:scale-105 transition-all duration-300 p-6 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-slate-600/30 hover:shadow-lg"
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4 group-hover/feature:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{feature.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Zap className="w-4 h-4" />
            <span>More features in development</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComingSoonSection;
