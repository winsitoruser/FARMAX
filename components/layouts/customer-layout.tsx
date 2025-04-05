import React, { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PosNavbar from '@/components/pos/pos-navbar';
import Footer from '@/components/shared/footer';
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
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      // Keep window resize logic for responsiveness
      const width = window.innerWidth;
    };

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Implementation of actual dark mode would go here
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen flex flex-col bg-orange-50/30">
      {/* Header */}
      <div className="fixed top-0 right-0 left-0 z-50 bg-white shadow-sm">
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-600 to-amber-500"></div>
        <PosNavbar 
          scrolled={scrolled} 
          sidebarCollapsed={sidebarCollapsed} 
          toggleSidebar={toggleSidebar}
          showBilling={true}
          showBusinessSettings={true}
        />
      </div>
      
      <div className="flex flex-1 pt-16">
        {/* Main Content - full width without sidebar */}
        <div className="flex-1 transition-all duration-300">
          <main className="p-4 md:p-6">
            <div className="max-w-[1280px] mx-auto">
              {children}
            </div>
          </main>
          
          <Footer themeColor="orange" />
        </div>
      </div>
    </div>
  );
};

export default CustomerLayout;
