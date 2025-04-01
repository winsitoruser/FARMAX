import React, { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/router';
import DashonicSidebar from './dashonic-sidebar';
import EnhancedHeader from './enhanced-header';
import Footer from '@/components/dashboard/footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCompactMode, setIsCompactMode] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 1024);
      if (width < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCompactMode = () => {
    setIsCompactMode(!isCompactMode);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <DashonicSidebar 
        isOpen={isSidebarOpen} 
        isCompact={isCompactMode}
        toggleSidebar={toggleSidebar}
        toggleCompactMode={toggleCompactMode}
      />

      {/* Main content */}
      <div className={`flex flex-col flex-1 transition-all duration-300 w-full ${
        isCompactMode ? 'lg:ml-16' : 'lg:ml-60'
      }`}>
        {/* Unified header component handles visibility internally */}
        <EnhancedHeader toggleSidebar={toggleSidebar} isCompact={isCompactMode} />

        {/* Page content */}
        <main className="flex-1 overflow-auto p-3 md:p-4">
          <div className="max-w-[1280px] mx-auto px-0">
            {children}
          </div>
        </main>

        {/* Footer */}
        <Footer 
          themeColor="orange"
          showSocialLinks={false}
          statusOnline={true}
        />
      </div>
    </div>
  );
};

export default CustomerLayout;
