import React, { useState, useEffect } from 'react';
import DashonicSidebar from './dashonic-sidebar';
import EnhancedHeader from './enhanced-header';
import Footer from '@/components/dashboard/footer';
import { useRouter } from 'next/router';

interface DashonicLayoutProps {
  children: React.ReactNode;
}

const DashonicLayout: React.FC<DashonicLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCompactMode, setIsCompactMode] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
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

export default DashonicLayout;
