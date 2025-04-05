import React, { useState, useEffect } from 'react';
import Footer from "@/components/shared/footer";
import { useRouter } from 'next/router';
import Link from 'next/link';
import PosNavbar from '@/components/pos/pos-navbar';
import CollapsedSidebar from '@/components/shared/collapsed-sidebar';
import useSidebar from '@/hooks/use-sidebar';
import { 
  FaCalendarDay, 
  FaCalendarAlt, 
  FaUserClock, 
  FaExchangeAlt, 
  FaArrowLeft,
  FaHome
} from 'react-icons/fa';

interface SchedulerLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
}

const SchedulerLayout = ({ children, showBackButton = true }: SchedulerLayoutProps) => {
  const router = useRouter();
  const currentPath = router.pathname;
  const [scrolled, setScrolled] = useState(false);
  const { isOpen } = useSidebar();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Beranda', path: '/schedule', icon: <FaHome className="w-4 h-4" /> },
    { name: 'Jadwal Shift', path: '/schedule/shifts', icon: <FaCalendarDay className="w-4 h-4" /> },
    { name: 'Jadwal Karyawan', path: '/schedule/employees', icon: <FaUserClock className="w-4 h-4" /> },
    { name: 'Template Jadwal', path: '/schedule/templates', icon: <FaCalendarAlt className="w-4 h-4" /> },
    { name: 'Penukaran Shift', path: '/schedule/exchanges', icon: <FaExchangeAlt className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-orange-50/30">
      {/* Header */}
      <div className="fixed top-0 right-0 left-0 z-50 bg-white shadow-sm">
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-600 to-amber-500"></div>
        <PosNavbar 
          scrolled={scrolled}
          showBilling={true}
          showBusinessSettings={true}
        />
      </div>
      
      {/* Collapsible Sidebar */}
      <CollapsedSidebar />
      
      {/* Content Area with padding-top to account for fixed header */}
      <div className={`flex flex-1 mt-[4.5rem] ${isOpen ? 'ml-56' : 'ml-16'} transition-all duration-300`}>
        {/* Decorative Elements - Left */}
        <div className="fixed left-[70px] top-[120px] opacity-5 z-0">
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="95" stroke="#FB923C" strokeWidth="10"/>
            <circle cx="100" cy="100" r="70" stroke="#F59E0B" strokeWidth="10"/>
            <circle cx="100" cy="100" r="45" stroke="#F97316" strokeWidth="10"/>
          </svg>
        </div>
        
        {/* Decorative Elements - Right */}
        <div className="fixed right-4 bottom-[100px] opacity-5 z-0">
          <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M150 0L173.612 103.882L277.94 103.882L192.164 168.235L215.776 272.118L130 207.765L44.2244 272.118L67.8356 168.235L-18 103.882L86.3884 103.882L110 0Z" fill="#F97316" fillOpacity="0.2"/>
            <path d="M150 40L167.163 124.127L251.688 124.127L183.262 175.873L200.426 260L132 208.254L63.5743 260L80.7376 175.873L12.3115 124.127L96.8372 124.127L114 40Z" fill="#FB923C" fillOpacity="0.2"/>
            <path d="M150 80L161.339 138.958L220.539 138.958L172.6 176.042L183.939 235L136 197.916L88.0607 235L99.3996 176.042L51.4606 138.958L110.661 138.958L122 80Z" fill="#FDBA74" fillOpacity="0.2"/>
          </svg>
        </div>
        
        {/* Main scrollable content */}
        <div className="flex-1 overflow-y-auto w-full relative z-10">
          <div className="max-w-[1280px] mx-auto px-4 py-6 w-full">
            {/* Back button and section title */}
            <div className="flex items-center justify-between mb-6">
              {showBackButton && (
                <Link href="/dashboard" className="flex items-center text-sm text-gray-600 hover:text-orange-600 transition-colors group">
                  <span className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center mr-2 group-hover:bg-orange-50 transition-colors">
                    <FaArrowLeft className="w-3.5 h-3.5 text-orange-500" />
                  </span>
                  <span>Kembali ke Dashboard</span>
                </Link>
              )}
              
              <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent flex items-center">
                <div className="relative">
                  <span className="animate-pulse absolute -left-7 -top-5">✨</span>
                  Manajemen Jadwal
                  <span className="animate-pulse absolute -right-7 -top-5">✨</span>
                </div>
              </div>
              
              <div className="w-28">
                {/* Placeholder to balance the layout */}
              </div>
            </div>
            
            {/* Navigation with decorative elements */}
            <div className="mb-6 bg-white rounded-lg shadow-sm border border-orange-100 overflow-hidden relative">
              {/* Pill decorations */}
              <div className="absolute -left-4 -top-4 w-8 h-8 rounded-full bg-orange-500/10"></div>
              <div className="absolute -right-4 -bottom-4 w-8 h-8 rounded-full bg-amber-500/10"></div>
              
              <div className="flex space-x-1 overflow-x-auto py-3 px-4 scrollbar-hide relative z-10">
                {navItems.map((item) => {
                  const isActive = currentPath === item.path;
                  return (
                    <Link 
                      key={item.path}
                      href={item.path}
                      className={`
                        flex items-center px-4 py-2.5 rounded-md transition-all whitespace-nowrap text-sm font-medium
                        ${isActive 
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md' 
                          : 'hover:bg-orange-50 text-gray-700 hover:text-orange-600'
                        }
                      `}
                    >
                      <span className={`mr-2 ${isActive ? 'animate-pulse' : ''}`}>{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
            
            {/* Main content with decorative border */}
            <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-6 mb-6 relative overflow-hidden">
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden">
                <div className="absolute transform -rotate-45 bg-gradient-to-r from-orange-500/10 to-amber-500/5 h-10 w-32 -left-8 -top-8"></div>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                <div className="absolute transform rotate-45 bg-gradient-to-r from-amber-500/5 to-orange-500/10 h-10 w-32 -right-8 -top-8"></div>
              </div>
              
              <div className="relative z-10">
                {children}
              </div>
            </div>
          </div>
          
          {/* Footer with orange theme */}
          <div className="bg-white border-t mt-auto">
            <div className="max-w-[1280px] mx-auto">
              <Footer themeColor="orange" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulerLayout;
