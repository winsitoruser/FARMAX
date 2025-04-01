import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaEllipsisH } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

interface AnalyticsWidgetProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  chart?: React.ReactNode;
  color?: 'primary' | 'success' | 'info' | 'warning' | 'danger';
  trend?: {
    value: number;
    label?: string;
    icon?: React.ReactNode;
  };
  actions?: React.ReactNode;
  className?: string;
  customStyles?: {
    headerBg?: string;
  };
}

const AnalyticsWidget: React.FC<AnalyticsWidgetProps> = ({
  title,
  value,
  subtitle,
  icon,
  chart,
  color = 'primary',
  trend,
  actions,
  className = '',
  customStyles,
}) => {
  // Get the correct color scheme based on the color prop
  const getColorClass = (type: 'bg' | 'text' | 'border') => {
    switch (color) {
      case 'primary':
        return type === 'bg' ? 'bg-blue-500' : 
               type === 'text' ? 'text-blue-500' : 
               'border-blue-500';
      case 'success':
        return type === 'bg' ? 'bg-emerald-500' : 
               type === 'text' ? 'text-emerald-500' : 
               'border-emerald-500';
      case 'info':
        return type === 'bg' ? 'bg-violet-500' : 
               type === 'text' ? 'text-violet-500' : 
               'border-violet-500';
      case 'warning':
        return type === 'bg' ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 
               type === 'text' ? 'text-orange-500' : 
               'border-orange-500';
      case 'danger':
        return type === 'bg' ? 'bg-gradient-to-r from-orange-600 to-rose-500' : 
               type === 'text' ? 'text-orange-600' : 
               'border-orange-600';
      default:
        return type === 'bg' ? 'bg-slate-500' : 
               type === 'text' ? 'text-slate-500' : 
               'border-slate-500';
    }
  };

  return (
    <Card className={`border shadow-sm overflow-hidden relative ${className}`}>
      {/* Futuristic decoration elements */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-25 blur-xl" 
        style={{background: color === 'warning' ? 'radial-gradient(circle, rgba(249,115,22,0.3) 0%, rgba(254,215,170,0) 70%)' : 
                           color === 'danger' ? 'radial-gradient(circle, rgba(239,68,68,0.2) 0%, rgba(254,202,202,0) 70%)' :
                           'radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(186,230,253,0) 70%)'}}></div>
      
      <div className="absolute -left-4 -bottom-4 w-24 h-24 rounded-full opacity-20 blur-lg" 
        style={{background: color === 'warning' ? 'radial-gradient(circle, rgba(251,146,60,0.3) 0%, rgba(251,146,60,0) 70%)' : 
                           color === 'danger' ? 'radial-gradient(circle, rgba(249,115,22,0.2) 0%, rgba(254,215,170,0) 70%)' :
                           'radial-gradient(circle, rgba(96,165,250,0.2) 0%, rgba(219,234,254,0) 70%)'}}></div>
      
      {/* Tech pattern decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-2/3 w-1 h-6 rounded-full" style={{background: color === 'warning' ? '#f97316' : color === 'danger' ? '#ef4444' : '#3b82f6'}}></div>
        <div className="absolute top-2/3 left-1/4 w-1 h-4 rounded-full" style={{background: color === 'warning' ? '#f97316' : color === 'danger' ? '#ef4444' : '#3b82f6'}}></div>
        <div className="absolute top-1/2 left-3/4 w-1 h-8 rounded-full" style={{background: color === 'warning' ? '#f97316' : color === 'danger' ? '#ef4444' : '#3b82f6'}}></div>
        <div className="absolute top-1/3 left-1/5 w-6 h-1 rounded-full" style={{background: color === 'warning' ? '#f97316' : color === 'danger' ? '#ef4444' : '#3b82f6'}}></div>
        <div className="absolute top-2/3 left-2/3 w-4 h-1 rounded-full" style={{background: color === 'warning' ? '#f97316' : color === 'danger' ? '#ef4444' : '#3b82f6'}}></div>
      </div>
      
      {/* Shimmer effect */}
      <div className="absolute -right-20 top-0 h-full w-20 bg-gradient-to-l from-transparent via-white to-transparent opacity-20 animate-shimmer"></div>

      {/* Decorative top bar */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
      
      <CardHeader 
        className={`rounded-t-lg py-4 px-5 text-white ${!customStyles?.headerBg ? getColorClass('bg') : ''}`}
        style={customStyles?.headerBg ? { background: customStyles.headerBg } : {}}
      >
        <div className="flex justify-between items-center">
          {/* Title Content */}
          <div className="flex items-center gap-3">
            {icon && <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">{icon}</div>}
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </div>
          
          {/* Actions */}
          {actions ? actions : (
            <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 text-white hover:bg-white/20">
              <FaEllipsisH className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-5 pb-4 bg-gradient-to-br from-white to-orange-50/30">
        <div className="flex flex-col">
          {/* Value */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-gray-800">{value}</span>
            {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
          </div>
          
          {/* Trend */}
          {trend && (
            <div className="flex items-center mt-2 text-sm">
              <span 
                className={trend.value >= 0 ? "text-emerald-500 flex items-center" : "text-rose-500 flex items-center"}
              >
                {trend.icon}
                {trend.value > 0 ? '+' : ''}{trend.value}%
              </span>
              {trend.label && <span className="text-gray-500 ml-1">{trend.label}</span>}
            </div>
          )}
          
          {/* Chart */}
          {chart && <div className="mt-4">{chart}</div>}
        </div>
        
        {/* Bottom decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-200 to-transparent"></div>
      </CardContent>
    </Card>
  );
};

// Add keyframe animation for shimmer effect
const AnimatedShimmerStyle = () => (
  <style jsx global>{`
    @keyframes shimmer {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(calc(100% + 80px));
      }
    }
    .animate-shimmer {
      animation: shimmer 2.5s infinite;
    }
  `}</style>
);

export default AnalyticsWidget;

// Export the animation styles component for use in the dashboard
export { AnimatedShimmerStyle };
