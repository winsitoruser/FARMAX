import React from 'react';
import { FaHeart } from 'react-icons/fa';

interface FooterProps {
  themeColor?: 'orange' | 'blue' | 'green' | 'purple' | 'gray';
}

const Footer: React.FC<FooterProps> = ({ themeColor = 'gray' }) => {
  const currentYear = new Date().getFullYear();

  const getThemeColor = () => {
    switch (themeColor) {
      case 'orange': return {
        bg: 'bg-gradient-to-r from-orange-50 to-amber-50',
        border: 'border-orange-100',
        text: 'text-orange-500',
        gradient: 'from-orange-500 to-amber-500'
      };
      case 'blue': return {
        bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
        border: 'border-blue-100',
        text: 'text-blue-500',
        gradient: 'from-blue-500 to-indigo-500'
      };
      case 'green': return {
        bg: 'bg-gradient-to-r from-emerald-50 to-green-50',
        border: 'border-emerald-100',
        text: 'text-emerald-500',
        gradient: 'from-emerald-500 to-green-500'
      };
      case 'purple': return {
        bg: 'bg-gradient-to-r from-purple-50 to-violet-50',
        border: 'border-purple-100',
        text: 'text-purple-500',
        gradient: 'from-purple-500 to-violet-500'
      };
      case 'gray': return {
        bg: 'bg-white',
        border: 'border-gray-200',
        text: 'text-gray-500',
        gradient: 'from-gray-500 to-gray-600'
      };
      default: return {
        bg: 'bg-white',
        border: 'border-gray-200',
        text: 'text-gray-500',
        gradient: 'from-gray-500 to-gray-600'
      };
    }
  };

  const colors = getThemeColor();

  return (
    <footer className={`${colors.bg} border-t ${colors.border} py-4 px-6 mt-auto`}>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-700 text-sm font-medium">
              &copy; {currentYear} <span className={`bg-gradient-to-r ${colors.gradient} text-transparent bg-clip-text font-bold`}>FARMAX</span>. All rights reserved.
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-gray-700 text-sm mr-2">Made with</p>
            <FaHeart className={`${colors.text} h-3 w-3 mx-1`} />
            <p className="text-gray-700 text-sm ml-1">by PT.Farmanesia Teknologi Solusi</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
