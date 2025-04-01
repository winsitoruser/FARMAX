import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface InventoryPageHeaderProps {
  title: string;
  subtitle: string;
  actionButtons?: ReactNode;
  gradient?: boolean;
}

const InventoryPageHeader: React.FC<InventoryPageHeaderProps> = ({
  title,
  subtitle,
  actionButtons,
  gradient = true
}) => {
  if (gradient) {
    return (
      <div className="relative mb-6 overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-lg">
        <div className="absolute right-0 top-0 w-72 h-72 rounded-full bg-gradient-to-br from-amber-300 to-orange-500 opacity-20 transform translate-x-16 -translate-y-16"></div>
        <div className="absolute left-0 bottom-0 w-48 h-48 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 opacity-10 transform -translate-x-8 translate-y-12"></div>
        
        <div className="relative py-6 px-6 sm:px-8 z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1 font-sans">{title}</h2>
              <p className="text-orange-100 text-base max-w-lg font-sans leading-relaxed">
                {subtitle}
              </p>
            </div>
            {actionButtons && (
              <div className="flex flex-wrap gap-2">
                {actionButtons}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 font-sans">{title}</h1>
      <p className="text-gray-600 text-base font-sans leading-relaxed">{subtitle}</p>
      {actionButtons && (
        <div className="flex flex-wrap gap-2 mt-4">
          {actionButtons}
        </div>
      )}
    </div>
  );
};

export default InventoryPageHeader;
