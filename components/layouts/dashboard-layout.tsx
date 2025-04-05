import React, { useState, useEffect } from 'react';
import Footer from "@/components/shared/footer";
import { useRouter } from 'next/router';
import Link from 'next/link';
import PosNavbar from '@/components/pos/pos-navbar';
import { 
  FaBoxOpen, 
  FaChartBar, 
  FaClipboardList, 
  FaExchangeAlt, 
  FaCalendarAlt,
  FaHome,
  FaShoppingCart,
  FaUsers,
  FaMoneyBillWave,
  FaCogs,
  FaChevronRight
} from 'react-icons/fa';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const InventoryNavbar: React.FC = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  const navItems = [
    { 
      name: 'Produk', 
      href: '/inventory/products', 
      icon: <FaBoxOpen className="w-4 h-4" /> 
    },
    { 
      name: 'Stock Opname', 
      href: '/inventory/stocktake', 
      icon: <FaClipboardList className="w-4 h-4" /> 
    },
    { 
      name: 'Kadaluarsa', 
      href: '/inventory/expiry', 
      icon: <FaCalendarAlt className="w-4 h-4" /> 
    },
    { 
      name: 'Laporan', 
      href: '/inventory/reports', 
      icon: <FaChartBar className="w-4 h-4" /> 
    },
    { 
      name: 'Penyesuaian', 
      href: '/inventory/adjustment', 
      icon: <FaExchangeAlt className="w-4 h-4" /> 
    }
  ];

  return (
    <div className="bg-white shadow-sm border-b mb-6">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="flex space-x-6 overflow-x-auto py-3">
          {navItems.map((item) => {
            const isActive = currentPath === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-orange-50 text-orange-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const router = useRouter();
  const isInventoryPage = router.pathname.startsWith('/inventory');
  const [scrolled, setScrolled] = useState(false);
  
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
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed header with gradient decoration */}
      <div className="fixed top-0 left-0 right-0 bg-orange-600 shadow-md z-50 w-full">
        {/* Gradient decoration bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-600 to-amber-500"></div>
        
        <div className="relative">
          <PosNavbar 
            scrolled={scrolled} 
            sidebarCollapsed={true}
            toggleSidebar={() => {}} 
            showBilling={true}
            showBusinessSettings={true}
          />
        </div>
      </div>
      
      {/* Main content - no sidebar */}
      <div className="pt-16"> {/* Space for header */}
        <div className="flex">
          {/* Main content area without sidebar margin */}
          <main className="w-full">
            {/* Inventory sub-navigation if on inventory page */}
            {isInventoryPage && (
              <div 
                className="sticky bg-white border-b border-orange-100 shadow-sm"
                style={{ top: '4rem', zIndex: 20 }}
              >
                <InventoryNavbar />
              </div>
            )}
            
            {/* Page content */}
            <div className="px-4 py-6 mx-auto max-w-[1280px]">
              {children}
            </div>
            
            {/* Footer */}
            <div className="border-t border-orange-100 bg-white">
              <div className="max-w-[1280px] mx-auto">
                <Footer />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
