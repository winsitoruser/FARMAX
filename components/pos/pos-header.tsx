import React from 'react';
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Button } from "@/components/ui/button";

interface PosHeaderProps {
  title: string;
  description: string;
  breadcrumbs: { title: string; href: string }[];
  actionButtons?: React.ReactNode;
}

const PosHeader: React.FC<PosHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  actionButtons,
}) => {
  return (
    <div className="relative overflow-hidden">
      {/* Decorative background with orange theme */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 opacity-90"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
      <div className="absolute bottom-0 left-10 w-24 h-24 bg-white opacity-10 rounded-full transform -translate-x-6 translate-y-12"></div>
      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white opacity-10 rounded-full"></div>
      
      {/* Pill Decorations */}
      <div className="absolute bottom-3 right-6 flex space-x-1">
        <div className="h-1.5 w-6 bg-white opacity-30 rounded-full"></div>
        <div className="h-1.5 w-10 bg-white opacity-50 rounded-full"></div>
        <div className="h-1.5 w-4 bg-white opacity-20 rounded-full"></div>
      </div>
      
      <div className="relative px-6 py-4 md:px-8 md:py-6 z-10">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <Breadcrumbs
            segments={breadcrumbs.map(({ title, href }) => ({ title, href }))}
            className="text-orange-100"
          />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-xl md:text-2xl font-bold text-white">{title}</h1>
            <p className="text-orange-100 mt-1 text-sm md:text-base">{description}</p>
          </div>
          
          {actionButtons && (
            <div className="flex flex-wrap gap-2 items-center">
              {actionButtons}
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom decorative line */}
      <div className="h-1 bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400"></div>
    </div>
  );
};

export default PosHeader;
