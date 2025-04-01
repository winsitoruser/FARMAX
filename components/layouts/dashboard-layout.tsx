import React from 'react';
import Footer from "@/components/shared/footer";
import { useRouter } from 'next/router';
import Link from 'next/link';
import PosNavbar from '@/components/pos/pos-navbar';
import { 
  FaBoxOpen, 
  FaChartBar, 
  FaClipboardList, 
  FaExchangeAlt, 
  FaCalendarAlt 
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
      <div className="container mx-auto px-4">
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
  
  return (
    <div className="min-h-screen flex flex-col bg-orange-50/30">
      {/* POS Navbar - now sticky */}
      <PosNavbar />
      
      {/* Main Content - add padding-top to account for sticky header */}
      <div className="flex-1 flex flex-col h-full pt-16 md:pt-20">
        {/* Page Content */}
        <div className="flex-1 overflow-auto px-4 py-6 bg-orange-50/30">
          {isInventoryPage && <InventoryNavbar />}
          {children}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DashboardLayout;
