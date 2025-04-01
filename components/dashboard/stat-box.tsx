import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface StatBoxProps {
  title: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  cardColor?: string;
  valueColor?: string;
  titleColor?: string;
  borderLeft?: boolean;
  valueFontSize?: 'sm' | 'md' | 'lg' | 'xl';
}

const StatBox: React.FC<StatBoxProps> = ({
  title,
  value,
  trend,
  trendLabel,
  icon,
  iconBg = 'bg-blue-100',
  iconColor = 'text-blue-600',
  cardColor = 'bg-white',
  valueColor = 'text-gray-800',
  titleColor = 'text-gray-500',
  borderLeft = false,
  valueFontSize = 'lg'
}) => {
  
  const getValueClass = () => {
    switch (valueFontSize) {
      case 'sm': return 'text-lg';
      case 'md': return 'text-xl';
      case 'lg': return 'text-2xl';
      case 'xl': return 'text-3xl';
      default: return 'text-2xl';
    }
  };
  
  const getTrendColor = () => {
    if (trend === undefined || trend === 0) return 'text-gray-500';
    return trend > 0 ? 'text-green-500' : 'text-red-500';
  };
  
  const trendIcon = trend === undefined ? null : trend > 0 ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />;
  
  return (
    <Card className={`${cardColor} border shadow-sm ${borderLeft ? 'border-l-4 border-l-blue-500' : ''}`}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${titleColor}`}>{title}</p>
            <h3 className={`${getValueClass()} font-bold tracking-tight ${valueColor} mt-1`}>
              {value}
            </h3>
            
            {trend !== undefined && (
              <div className="flex items-center mt-1">
                <span className={`flex items-center text-xs font-medium ${getTrendColor()}`}>
                  {trendIcon}
                  <span className="ml-1">{Math.abs(trend)}%</span>
                </span>
                {trendLabel && <span className="ml-1.5 text-xs text-gray-500">{trendLabel}</span>}
              </div>
            )}
          </div>
          
          {icon && (
            <div className={`${iconBg} ${iconColor} p-3 rounded-lg`}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatBox;
