import React from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface SimpleHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backUrl?: string;
  children?: React.ReactNode;
}

const SimpleHeader: React.FC<SimpleHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  backUrl = '/dashboard',
  children
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 py-4 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center">
            {showBackButton && (
              <button 
                onClick={handleBack}
                className="mr-3 p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-600"
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>
            )}
            
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
          </div>
          
          {children && (
            <div className="flex mt-2 sm:mt-0">
              {children}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default SimpleHeader;
