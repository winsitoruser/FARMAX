import React, { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/router';
import DashonicSidebar from './dashonic-sidebar';
import EnhancedHeader from './enhanced-header';
import Footer from '@/components/dashboard/footer';
import Image from 'next/image';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FarmanesiaDashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const FarmanesiaDashboardLayout: React.FC<FarmanesiaDashboardLayoutProps> = ({ children, title }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCompactMode, setIsCompactMode] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        setIsMobile(width < 1024);
        if (width < 1024) {
          setIsSidebarOpen(false);
        } else {
          // Keep sidebar in collapsed state on desktop
          setIsSidebarOpen(false);
        }
      }
    };

    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > 10) {
          setScrolled(true);
        } else {
          setScrolled(false);
        }
      }
    };

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
      }
      setMounted(false);
    };
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

        {/* Main content */}
        <main className="flex-1 overflow-auto px-3 pt-3 md:px-4 md:pt-4">
          <div className="max-w-[1280px] mx-auto">
            {/* Content */}
            {children}
          </div>
        </main>

        {/* Footer */}
        <Footer 
          themeColor="gray"
          showSocialLinks={false}
          statusOnline={true}
          companyName="PT.Farmanesia Teknologi Solusi"
        />
      </div>
    </div>
  );
};

export default FarmanesiaDashboardLayout;
