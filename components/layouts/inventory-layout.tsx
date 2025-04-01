import React from 'react';
import Footer from "@/components/shared/footer";
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  FaBoxOpen, 
  FaClipboardList, 
  FaCalendarAlt, 
  FaChartBar, 
  FaExchangeAlt, 
  FaArrowLeft,
  FaHome
} from 'react-icons/fa';

interface InventoryLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
}

const InventoryLayout = ({ children, showBackButton = true }: InventoryLayoutProps) => {
  const router = useRouter();
  const currentPath = router.pathname;

  const navItems = [
    { name: 'Beranda', path: '/inventory', icon: <FaHome className="w-4 h-4" /> },
    { name: 'Produk', path: '/inventory/products', icon: <FaBoxOpen className="w-4 h-4" /> },
    { name: 'Stock Opname', path: '/inventory/stocktake', icon: <FaClipboardList className="w-4 h-4" /> },
    { name: 'Kadaluarsa', path: '/inventory/expiry', icon: <FaCalendarAlt className="w-4 h-4" /> },
    { name: 'Laporan', path: '/inventory/reports', icon: <FaChartBar className="w-4 h-4" /> },
    { name: 'Penyesuaian', path: '/inventory/adjustment', icon: <FaExchangeAlt className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="relative h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-500"></div>
        
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {showBackButton && (
            <Link href="/dashboard" className="flex items-center text-sm text-gray-600 hover:text-orange-600 transition-colors">
              <FaArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              <span>Kembali ke Dashboard</span>
            </Link>
          )}
          
          <div className="text-lg font-bold text-orange-700">Manajemen Inventori</div>
          
          <div className="w-28">
            {/* Placeholder to balance the header */}
          </div>
        </div>
        
        {/* Navigation */}
        <div className="max-w-7xl mx-auto px-4 pb-2">
          <div className="flex space-x-1 overflow-x-auto pb-1 scrollbar-hide">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <Link 
                  key={item.path}
                  href={item.path}
                  className={`px-4 py-2 rounded-md text-sm flex items-center whitespace-nowrap transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md' 
                      : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                  }`}
                >
                  {React.cloneElement(item.icon, { 
                    className: `mr-1.5 ${isActive ? 'text-white' : 'text-gray-400'}`
                  })}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Page Content */}
        <div className="flex-1 overflow-auto px-4 py-6 bg-gray-50">
          {/* Main Content */}
          <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm">
            {children}
          </div>
        </div>
      </div>
      
      {/* Footer sudah ada di shared/footer, tidak perlu ditambahkan di sini */}
    </div>
  );
};

export default InventoryLayout;
