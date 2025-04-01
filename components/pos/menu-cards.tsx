import React from 'react';
import Link from 'next/link';
import { 
  FaCashRegister, 
  FaChartBar, 
  FaBoxOpen, 
  FaUsers
} from 'react-icons/fa';

// Define a type for the menu items to ensure consistency
interface MenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  href: string;
  description: string;
}

interface MenuCardProps {
  title: string;
  icon: any;
  href: string;
  description?: string;
  iconBgColor?: string;
}

const MenuCard = ({ title, icon: Icon, href, description, iconBgColor = "bg-orange-500" }: MenuCardProps) => {
  return (
    <Link href={href}>
      <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 neo-shadow h-full border border-gray-100">
        {/* Card decor elements */}
        <div className="absolute -top-5 -right-5 w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full opacity-30"></div>
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full opacity-20"></div>
        
        {/* Card content */}
        <div className="p-6 relative z-10 flex flex-col h-full">
          <div className={`w-16 h-16 ${iconBgColor} rounded-2xl shadow-lg flex items-center justify-center mb-4 text-white transform transition-transform group-hover:scale-110`}>
            <Icon className="h-7 w-7" />
          </div>
          
          <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">{title}</h3>
          
          {description && (
            <p className="text-gray-600 text-sm mb-4">{description}</p>
          )}
          
          <div className="mt-auto">
            <div className="inline-flex items-center text-orange-500 font-medium text-sm">
              Buka Menu
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          
          {/* Animated dot decoration */}
          <div className="absolute bottom-3 right-3 flex space-x-1">
            <div className="h-1.5 w-1.5 bg-orange-300 opacity-40 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
            <div className="h-1.5 w-1.5 bg-orange-400 opacity-60 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
            <div className="h-1.5 w-1.5 bg-orange-500 opacity-80 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
          </div>
        </div>
        
        {/* Bottom gradient accent */}
        <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400"></div>
      </div>
    </Link>
  );
};

const MenuCards = () => {
  // Essential menu items - minimize to just essential operations
  const menuItems = [
    { 
      id: 'kasir', 
      icon: FaCashRegister, 
      label: 'Kasir', 
      href: '/pos/kasir', 
      description: 'Proses transaksi penjualan'
    },
    { 
      id: 'penjualan', 
      icon: FaChartBar, 
      label: 'Laporan', 
      href: '/pos/penjualan', 
      description: 'Laporan penjualan & keuangan'
    },
    { 
      id: 'inventory', 
      icon: FaBoxOpen, 
      label: 'Inventory', 
      href: '/pos/inventory', 
      description: 'Kelola stok produk'
    },
  ];

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <MenuCard 
            key={item.id} 
            title={item.label} 
            icon={item.icon} 
            href={item.href} 
            description={item.description} 
          />
        ))}
      </div>
    </div>
  );
};

export default MenuCards;
