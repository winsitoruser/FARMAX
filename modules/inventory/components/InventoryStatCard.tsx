import React, { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { IconType } from 'react-icons';

interface InventoryStatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtitle?: string;
  gradient?: boolean;
  color?: 'orange' | 'red' | 'amber' | 'green';
}

const InventoryStatCard: React.FC<InventoryStatCardProps> = ({
  title,
  value,
  icon,
  subtitle,
  gradient = false,
  color = 'orange'
}) => {
  const getGradient = () => {
    switch (color) {
      case 'red':
        return 'from-red-500 to-orange-500';
      case 'amber':
        return 'from-amber-500 to-orange-500';
      case 'green':
        return 'from-green-500 to-teal-500';
      default:
        return 'from-orange-500 to-amber-500';
    }
  };

  const getIconBg = () => {
    switch (color) {
      case 'red':
        return 'bg-red-50 text-red-600';
      case 'amber':
        return 'bg-amber-50 text-amber-600';
      case 'green':
        return 'bg-green-50 text-green-600';
      default:
        return 'bg-orange-50 text-orange-600';
    }
  };

  return (
    <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-200">
      {gradient && (
        <div className={`h-1.5 bg-gradient-to-r ${getGradient()}`}></div>
      )}
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 mb-1 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-full ${getIconBg()} flex items-center justify-center`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryStatCard;
