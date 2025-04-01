import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

interface MenuCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  colorScheme: 'orange' | 'green' | 'blue' | 'purple';
}

const MenuCard: React.FC<MenuCardProps> = ({ 
  icon, 
  title, 
  description, 
  link,
  colorScheme
}) => {
  const getColorClass = () => {
    switch (colorScheme) {
      case 'orange':
        return {
          gradient: 'from-orange-500 to-amber-400',
          iconBg: 'bg-orange-100',
          iconText: 'text-orange-600',
          hoverBg: 'hover:bg-orange-50'
        };
      case 'green':
        return {
          gradient: 'from-emerald-500 to-teal-400',
          iconBg: 'bg-emerald-100',
          iconText: 'text-emerald-600',
          hoverBg: 'hover:bg-emerald-50'
        };
      case 'blue':
        return {
          gradient: 'from-blue-500 to-cyan-400',
          iconBg: 'bg-blue-100',
          iconText: 'text-blue-600',
          hoverBg: 'hover:bg-blue-50'
        };
      case 'purple':
        return {
          gradient: 'from-purple-500 to-violet-400',
          iconBg: 'bg-purple-100',
          iconText: 'text-purple-600',
          hoverBg: 'hover:bg-purple-50'
        };
      default:
        return {
          gradient: 'from-orange-500 to-amber-400',
          iconBg: 'bg-orange-100',
          iconText: 'text-orange-600',
          hoverBg: 'hover:bg-orange-50'
        };
    }
  };

  const colors = getColorClass();

  return (
    <Link href={link} className="block">
      <Card className={`h-full border border-gray-200 shadow-sm ${colors.hoverBg} hover:shadow-md transition-all duration-200 cursor-pointer relative overflow-hidden`}>
        {/* Top colored strip */}
        <div className={`h-1 w-full bg-gradient-to-r ${colors.gradient}`}></div>
        
        <div className="p-5">
          <div className="flex items-start">
            {/* Icon */}
            <div className={`${colors.iconBg} p-3 rounded-lg ${colors.iconText}`}>
              {icon}
            </div>
            
            {/* Content */}
            <div className="ml-4">
              <h3 className="font-medium text-gray-800">{title}</h3>
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default MenuCard;
