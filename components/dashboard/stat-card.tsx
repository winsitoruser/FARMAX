import React from 'react';
import { Card } from '@/components/ui/card';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: number;
  period: string;
  colorScheme: 'orange' | 'green' | 'blue' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ 
  icon, 
  title, 
  value, 
  change, 
  period, 
  colorScheme 
}) => {
  const getColorClass = () => {
    switch (colorScheme) {
      case 'orange':
        return {
          bgGradient: 'from-orange-500 to-amber-400',
          iconBg: 'bg-orange-100',
          iconText: 'text-orange-600',
          changePositive: 'text-orange-600',
          changeNegative: 'text-red-500'
        };
      case 'green':
        return {
          bgGradient: 'from-emerald-500 to-teal-400',
          iconBg: 'bg-emerald-100',
          iconText: 'text-emerald-600',
          changePositive: 'text-emerald-600',
          changeNegative: 'text-red-500'
        };
      case 'blue':
        return {
          bgGradient: 'from-blue-500 to-cyan-400',
          iconBg: 'bg-blue-100',
          iconText: 'text-blue-600',
          changePositive: 'text-blue-600',
          changeNegative: 'text-red-500'
        };
      case 'purple':
        return {
          bgGradient: 'from-purple-500 to-violet-400',
          iconBg: 'bg-purple-100',
          iconText: 'text-purple-600',
          changePositive: 'text-purple-600',
          changeNegative: 'text-red-500'
        };
      default:
        return {
          bgGradient: 'from-orange-500 to-amber-400',
          iconBg: 'bg-orange-100',
          iconText: 'text-orange-600',
          changePositive: 'text-orange-600',
          changeNegative: 'text-red-500'
        };
    }
  };

  const colors = getColorClass();
  const isPositive = change >= 0;

  return (
    <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
      {/* Top colored strip */}
      <div className={`h-1 w-full bg-gradient-to-r ${colors.bgGradient}`}></div>
      
      <div className="p-5">
        <div className="flex items-start justify-between">
          {/* Icon */}
          <div className={`${colors.iconBg} p-3 rounded-lg ${colors.iconText}`}>
            {icon}
          </div>
          
          {/* Change indicator */}
          <div className="flex items-center">
            {isPositive ? (
              <>
                <FaArrowUp className={`mr-1 ${colors.changePositive}`} />
                <span className={`text-sm font-medium ${colors.changePositive}`}>
                  {change > 0 ? `+${change}%` : '0%'}
                </span>
              </>
            ) : (
              <>
                <FaArrowDown className="mr-1 text-red-500" />
                <span className="text-sm font-medium text-red-500">
                  {change}%
                </span>
              </>
            )}
          </div>
        </div>
        
        {/* Stat details */}
        <div className="mt-4">
          <h3 className="text-gray-500 text-sm">{title}</h3>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{period}</p>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
