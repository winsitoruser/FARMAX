import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  FaTachometerAlt, FaShoppingCart, FaBoxOpen, FaChartBar,
  FaFileInvoiceDollar, FaUserFriends, FaCog, FaCalendarAlt,
  FaUsers, FaStore, FaClipboardList, FaTags, FaReceipt
} from 'react-icons/fa';
import { Badge } from '@/components/ui/badge';

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path?: string;
  badge?: {
    text: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  submenu?: MenuItem[];
  divider?: boolean;
}

interface DashonicSidebarProps {
  isOpen: boolean;
  isCompact: boolean;
  toggleSidebar: () => void;
  toggleCompactMode: () => void;
}

// Define the main menu items
const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: <FaTachometerAlt />,
    path: '/dashboard',
  },
  {
    title: 'Point of Sale',
    icon: <FaShoppingCart />,
    submenu: [
      { title: 'Kasir', icon: <FaShoppingCart />, path: '/pos/kasir' },
      { title: 'Diskon & Promosi', icon: <FaTags />, path: '/pos/discounts' },
      { title: 'Transaksi', icon: <FaReceipt />, path: '/pos/transactions' }
    ]
  },
  {
    title: 'Inventori',
    icon: <FaBoxOpen />,
    submenu: [
      { title: 'Produk', icon: <FaStore />, path: '/inventory/products' },
      { title: 'Kategori', icon: <FaClipboardList />, path: '/inventory/categories' },
      { title: 'Stok', icon: <FaBoxOpen />, path: '/inventory/stock' },
    ]
  },
  {
    title: 'Keuangan',
    icon: <FaFileInvoiceDollar />,
    submenu: [
      { title: 'Transaksi', icon: <FaFileInvoiceDollar />, path: '/finance/transactions' },
      { title: 'Pengeluaran', icon: <FaFileInvoiceDollar />, path: '/finance/expenses' },
      { title: 'Pendapatan', icon: <FaChartBar />, path: '/finance/revenue' },
    ]
  },
  {
    title: 'Laporan',
    icon: <FaChartBar />,
    path: '/reports',
    badge: {
      text: 'Baru',
      variant: 'destructive',
    }
  },
  {
    title: 'Pelanggan',
    icon: <FaUserFriends />,
    path: '/customers',
  },
  {
    title: 'Supplier',
    icon: <FaUsers />,
    path: '/suppliers',
  },
  {
    title: 'Pengaturan',
    icon: <FaCog />,
    path: '/settings',
  },
];

const DashonicSidebar: React.FC<DashonicSidebarProps> = ({
  isOpen,
  isCompact,
  toggleSidebar,
  toggleCompactMode
}) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const router = useRouter();

  // Set expanded menu based on current route
  useEffect(() => {
    const newExpandedMenus: string[] = [];
    menuItems.forEach(item => {
      if (item.submenu && item.submenu.some(subItem => router.pathname === subItem.path)) {
        newExpandedMenus.push(item.title);
      }
    });
    setExpandedMenus(newExpandedMenus);
  }, [router.pathname]);

  const toggleSubmenu = (title: string) => {
    setExpandedMenus(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title) 
        : [...prev, title]
    );
  };

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  const isSubmenuActive = (submenu: MenuItem[] | undefined) => {
    if (!submenu) return false;
    return submenu.some(item => isActive(item.path || ''));
  };

  return (
    <div 
      className={`fixed inset-y-0 left-0 z-40 flex flex-col transition-all duration-300 ease-in-out bg-white shadow-md ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${
        isCompact ? 'w-16' : 'w-60'
      }`}
    >
      {/* Top decorative gradient */}
      <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500 w-full"></div>

      {/* Sidebar content */}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50">
        <ul className="px-2 space-y-1">
          {menuItems.map((item, index) => (
            <li key={index} className="relative group">
              {item.path && !item.submenu ? (
                <Link 
                  href={item.path}
                  className={`flex items-center rounded-md py-2.5 px-3 text-sm transition-colors ${
                    isActive(item.path) 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium shadow-sm' 
                      : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                  } ${isCompact ? 'justify-center' : ''}`}
                >
                  <span className="text-lg">
                    {item.icon}
                  </span>
                  
                  {!isCompact && (
                    <span className="ml-3 text-sm font-medium">{item.title}</span>
                  )}
                  
                  {!isCompact && item.badge && (
                    <Badge 
                      variant={item.badge.variant} 
                      className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0"
                    >
                      {item.badge.text}
                    </Badge>
                  )}
                  
                  {isCompact && item.badge && (
                    <Badge 
                      variant={item.badge.variant} 
                      className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 text-[9px] px-1 py-0 bg-red-500 text-white min-w-0"
                    >
                      {item.badge.text}
                    </Badge>
                  )}
                </Link>
              ) : item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.title)}
                    className={`flex items-center w-full rounded-md py-2.5 px-3 text-sm transition-colors ${
                      expandedMenus.includes(item.title) || isSubmenuActive(item.submenu)
                        ? 'bg-orange-50 text-orange-600 font-medium' 
                        : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                    } ${isCompact ? 'justify-center' : ''}`}
                  >
                    <span className="text-lg">
                      {item.icon}
                    </span>
                    
                    {!isCompact && (
                      <>
                        <span className="ml-3 text-sm font-medium flex-grow">{item.title}</span>
                        <svg 
                          className={`w-5 h-5 transition-transform duration-200 ${expandedMenus.includes(item.title) ? 'transform rotate-180' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </button>
                  
                  {/* Submenu for expanded view */}
                  {!isCompact && (
                    <div 
                      className={`mt-1 ml-6 space-y-1 border-l border-orange-100 pl-2 overflow-hidden transition-all duration-200 ease-in-out ${
                        expandedMenus.includes(item.title) 
                          ? 'max-h-40 opacity-100' 
                          : 'max-h-0 opacity-0'
                      }`}
                    >
                      {item.submenu.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          href={subItem.path || '#'}
                          className={`flex items-center py-2 px-3 rounded-md text-sm transition-colors ${
                            isActive(subItem.path || '')
                              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium shadow-sm'
                              : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                          }`}
                        >
                          <span className="text-sm mr-2">
                            {subItem.icon}
                          </span>
                          <span className="text-xs font-medium">{subItem.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                  
                  {/* Hover submenu for compact view */}
                  {isCompact && item.submenu && (
                    <div className="absolute left-full top-0 ml-2 hidden group-hover:block z-50">
                      <div className="bg-white shadow-lg rounded-md py-2 w-48 border border-gray-100">
                        <p className="px-3 py-1 text-xs font-medium text-gray-400 border-b border-gray-100">
                          {item.title}
                        </p>
                        <ul className="mt-1">
                          {item.submenu.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <Link
                                href={subItem.path || '#'}
                                className={`flex items-center px-3 py-1.5 text-sm transition-colors ${
                                  isActive(subItem.path || '')
                                    ? 'bg-orange-50 text-orange-600'
                                    : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                                }`}
                              >
                                <span className="text-xs mr-2">
                                  {subItem.icon}
                                </span>
                                <span className="text-xs">{subItem.title}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Sidebar footer with toggle for compact mode */}
      <div className="p-3 border-t border-gray-200">
        <button 
          onClick={toggleCompactMode}
          className="w-full flex items-center justify-center rounded-md py-2 text-gray-500 hover:bg-orange-50 hover:text-orange-600 transition-colors"
        >
          {isCompact ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          )}
          {!isCompact && <span className="ml-2 text-sm font-medium">Kompres Menu</span>}
        </button>
      </div>
    </div>
  );
};

export default DashonicSidebar;
