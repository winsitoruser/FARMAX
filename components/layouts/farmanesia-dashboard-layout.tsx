import React, { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PosNavbar from '@/components/pos/pos-navbar';
import Footer from '@/components/shared/footer';
import VerticalSidebar from '@/components/shared/vertical-sidebar';
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
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    
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

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="fixed top-0 right-0 left-0 z-50 bg-white shadow-sm">
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-600 to-amber-500"></div>
        <PosNavbar 
          scrolled={scrolled} 
          sidebarCollapsed={sidebarCollapsed} 
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          showBilling={true}
          showBusinessSettings={true}
        />
      </div>

      {/* Vertical Sidebar */}
      <VerticalSidebar />
      
      {/* Content Area with padding-top to account for fixed header */}
      <div className="flex flex-1 mt-[4.5rem] ml-16 transition-all duration-300">
        {/* Main scrollable content - full width without sidebar */}
        <div className="flex-1 overflow-y-auto transition-all duration-300">
          {/* Title and Period Selector */}
          {title && mounted && (
            <div className="bg-white border-b border-orange-100 p-4 sticky top-0 z-10">
              <div className="max-w-[1280px] mx-auto flex justify-between items-center">
                <h1 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
                  {title}
                </h1>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Periode:</span>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="h-8 w-32 text-xs bg-white border-orange-200">
                      <SelectValue placeholder="Pilih periode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Hari Ini</SelectItem>
                      <SelectItem value="week">Minggu Ini</SelectItem>
                      <SelectItem value="month">Bulan Ini</SelectItem>
                      <SelectItem value="year">Tahun Ini</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          
          <main className="p-4 md:p-6">
            <div className="max-w-[1280px] mx-auto">
              {children}
            </div>
          </main>
          
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default FarmanesiaDashboardLayout;
