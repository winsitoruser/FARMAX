import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import PosNavbar from '@/components/pos/pos-navbar';
import Footer from '@/components/shared/footer';
import { 
  FaClipboardList, 
  FaShoppingCart, 
  FaHistory, 
  FaChartLine, 
  FaUserTie,
  FaArrowLeft,
  FaHome,
  FaTachometerAlt
} from 'react-icons/fa';

interface PurchasingLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
}

const PurchasingLayout = ({ children, showBackButton = true }: PurchasingLayoutProps) => {
  const router = useRouter();
  const currentPath = router.pathname;
  const currentTab = router.query.tab || '';
  const [scrolled, setScrolled] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  
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
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const navItems = [
    { name: 'Dashboard', path: '/purchasing', icon: <FaTachometerAlt className="w-4 h-4" /> },
    { name: 'Pemesanan Baru', path: '/purchasing?tab=new', icon: <FaClipboardList className="w-4 h-4" /> },
    { name: 'Pesanan Tertunda', path: '/purchasing?tab=pending', icon: <FaShoppingCart className="w-4 h-4" /> },
    { name: 'Riwayat Pesanan', path: '/purchasing?tab=history', icon: <FaHistory className="w-4 h-4" /> },
    { name: 'Analisis Supplier', path: '/purchasing?tab=analysis', icon: <FaChartLine className="w-4 h-4" /> },
    { name: 'Supplier', path: '/purchasing/suppliers', icon: <FaUserTie className="w-4 h-4" /> }
  ];

  const isActive = (path: string) => {
    if (path.includes('?tab=')) {
      // For tab URLs, check if the current tab parameter matches
      const tabParam = path.split('?tab=')[1];
      return currentPath === '/purchasing' && currentTab === tabParam;
    }
    // For regular paths, just check the path
    return currentPath === path;
  };

  return (
    <div className="h-screen flex flex-col">
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
      
      {/* Content Area with padding-top to account for fixed header */}
      <div className="flex flex-1 mt-[4.5rem]">
        {/* Main scrollable content */}
        <div className="flex-1 overflow-y-auto w-full">
          <div className="max-w-[1280px] mx-auto px-4 py-4 w-full">
            {/* Back button and section title */}
            <div className="flex items-center justify-between mb-4">
              {showBackButton && (
                <Link href="/dashboard" className="flex items-center text-sm text-gray-600 hover:text-orange-600 transition-colors">
                  <FaArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                  <span>Kembali ke Dashboard</span>
                </Link>
              )}
              
              <div className="text-lg font-bold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
                Manajemen Pembelian
              </div>
              
              <div className="w-28">
                {/* Placeholder to balance the layout */}
              </div>
            </div>
            
            {/* Navigation */}
            <div className="mb-6 bg-white rounded-lg shadow-sm border border-orange-100 overflow-hidden">
              <div className="flex space-x-1 overflow-x-auto py-2 px-2 scrollbar-hide">
                {navItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link 
                      key={item.path}
                      href={item.path}
                      className={`
                        flex items-center px-3 py-2 rounded-md transition-all whitespace-nowrap text-sm
                        ${active 
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm' 
                          : 'hover:bg-orange-50 text-gray-700 hover:text-orange-600'
                        }
                      `}
                    >
                      <span className="mr-1.5">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
            
            {/* Main content */}
            <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-4 mb-6">
              {children}
            </div>
          </div>
          
          {/* Footer */}
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

export default PurchasingLayout;
