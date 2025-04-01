import React from 'react';
import Link from 'next/link';
import { FaHeart, FaGithub, FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';

interface FooterProps {
  showSocialLinks?: boolean;
  showCopyrightYear?: boolean;
  companyName?: string;
  version?: string;
  statusOnline?: boolean;
  showAppVersion?: boolean;
  themeColor?: 'orange' | 'blue' | 'green' | 'purple' | 'gray';
}

const Footer: React.FC<FooterProps> = ({
  showSocialLinks = true,
  showCopyrightYear = true,
  companyName = 'PT.Farmanesia Teknologi Solusi',
  version = '1.0.0',
  statusOnline = true,
  showAppVersion = true,
  themeColor = 'orange'
}) => {
  const currentYear = new Date().getFullYear();
  
  const getThemeColor = () => {
    switch (themeColor) {
      case 'orange': return {
        text: 'text-orange-600',
        bg: 'bg-orange-500',
        hover: 'hover:text-orange-700',
        gradient: 'from-orange-500 to-amber-400'
      };
      case 'blue': return {
        text: 'text-blue-600',
        bg: 'bg-blue-500',
        hover: 'hover:text-blue-700',
        gradient: 'from-blue-500 to-indigo-600'
      };
      case 'green': return {
        text: 'text-emerald-600',
        bg: 'bg-emerald-500',
        hover: 'hover:text-emerald-700',
        gradient: 'from-emerald-500 to-green-600'
      };
      case 'purple': return {
        text: 'text-purple-600',
        bg: 'bg-purple-500',
        hover: 'hover:text-purple-700',
        gradient: 'from-purple-500 to-violet-600'
      };
      case 'gray': return {
        text: 'text-gray-600',
        bg: 'bg-gray-500',
        hover: 'hover:text-gray-700',
        gradient: 'from-gray-500 to-gray-600'
      };
      default: return {
        text: 'text-orange-600',
        bg: 'bg-orange-500',
        hover: 'hover:text-orange-700',
        gradient: 'from-orange-500 to-amber-400'
      };
    }
  };

  const colors = getThemeColor();
  
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="text-sm text-gray-600">
              Made with <FaHeart className={`inline ${colors.text} animate-pulse`} /> by {companyName}
            </div>
            
            {showAppVersion && (
              <div className="ml-4 text-xs text-gray-500">v{version}</div>
            )}
            
            {statusOnline && (
              <div className="ml-4 flex items-center">
                <div className={`h-2 w-2 rounded-full ${colors.bg} mr-1 animate-pulse`}></div>
                <span className="text-xs text-gray-500">Online</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row items-center">
            {showSocialLinks && (
              <div className="flex space-x-4 mb-2 md:mb-0 md:mr-6">
                <Link href="#" className={`text-gray-400 ${colors.hover}`}>
                  <FaGithub size={18} />
                </Link>
                <Link href="#" className={`text-gray-400 ${colors.hover}`}>
                  <FaTwitter size={18} />
                </Link>
                <Link href="#" className={`text-gray-400 ${colors.hover}`}>
                  <FaFacebook size={18} />
                </Link>
                <Link href="#" className={`text-gray-400 ${colors.hover}`}>
                  <FaLinkedin size={18} />
                </Link>
              </div>
            )}
            
            {showCopyrightYear && (
              <div className="text-sm text-gray-500">
                {currentYear} {companyName}. All rights reserved.
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
