import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  FaChartLine, FaFileInvoiceDollar, FaMoneyBillWave, FaWallet, 
  FaExchangeAlt, FaChartBar, FaCog, FaArrowLeft, FaBars, 
  FaChevronLeft, FaChevronRight, FaTimes, FaUserCircle, FaBook,
  FaCalculator, FaPercent, FaReceipt, FaBuilding, FaIdCard,
  FaClipboardList, FaServer, FaChevronDown
} from 'react-icons/fa';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PosNavbar from '@/components/pos/pos-navbar';

interface FinanceLayoutProps {
  children: React.ReactNode;
}

// Menu items for finance sidebar
const financeMenuItems = [
  {
    title: 'Dashboard',
    icon: <FaChartLine className="h-5 w-5" />,
    path: '/finance',
  },
  {
    title: 'Buku Besar',
    icon: <FaBook className="h-5 w-5" />,
    path: '/finance/ledger',
  },
  {
    title: 'Pemasukan',
    icon: <FaMoneyBillWave className="h-5 w-5" />,
    path: '/finance/income',
  },
  {
    title: 'Pengeluaran',
    icon: <FaWallet className="h-5 w-5" />,
    path: '/finance/expenses',
  },
  {
    title: 'Faktur',
    icon: <FaFileInvoiceDollar className="h-5 w-5" />,
    path: '/finance/invoices',
  },
  {
    title: 'Transfer',
    icon: <FaExchangeAlt className="h-5 w-5" />,
    path: '/finance/transfers',
  },
  {
    title: 'Laporan',
    icon: <FaChartBar className="h-5 w-5" />,
    path: '/finance/reports',
  },
  {
    title: 'Manajemen Pajak',
    icon: <FaPercent className="h-5 w-5" />,
    children: [
      {
        title: 'Dashboard Pajak',
        path: '/finance/tax',
        icon: <FaChartLine className="h-4 w-4" />,
      },
      {
        title: 'PPN',
        path: '/finance/tax/ppn',
        icon: <FaCalculator className="h-4 w-4" />,
      },
      {
        title: 'PPh 21',
        path: '/finance/tax/pph21',
        icon: <FaIdCard className="h-4 w-4" />,
      },
      {
        title: 'PPh Badan',
        path: '/finance/tax/pphbadan',
        icon: <FaBuilding className="h-4 w-4" />,
      },
      {
        title: 'Faktur Pajak',
        path: '/finance/tax/invoices',
        icon: <FaReceipt className="h-4 w-4" />,
      },
      {
        title: 'Integrasi DJP',
        path: '/finance/tax/integration',
        icon: <FaServer className="h-4 w-4" />,
      },
    ],
  },
  {
    title: 'Pengaturan',
    icon: <FaCog className="h-5 w-5" />,
    path: '/finance/settings',
  },
];

export default function FinanceLayout({ children }: FinanceLayoutProps) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [isCompact, setIsCompact] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    'Manajemen Pajak': false
  });
  const [hoverMenuItem, setHoverMenuItem] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 1024);
      if (width < 1024) {
        setIsSidebarOpen(false);
      } else {
        // Keep sidebar in compact state on desktop by default
        setIsSidebarOpen(false);
      }
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCompactMode = () => {
    setIsCompact(!isCompact);
  };

  const isActive = (path: string) => {
    return router.pathname === path || router.pathname.startsWith(`${path}/`);
  };

  // Toggle menu expansion
  const toggleMenu = (title: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Animated gradient style
  const AnimatedGradientStyle = () => {
    return (
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .bg-animated-gradient {
          background: linear-gradient(-45deg, #ff7e5f, #feb47b, #ffb56b, #ff8e53);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }
        
        .bg-radial-gradient {
          background: radial-gradient(circle, rgba(255,154,0,0.1) 0%, rgba(255,154,0,0) 70%);
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .neo-shadow {
          box-shadow: 8px 8px 16px #e6e6e6, -8px -8px 16px #ffffff;
        }
        
        .hover-scale {
          transition: transform 0.3s ease;
        }
        
        .hover-scale:hover {
          transform: translateY(-5px);
        }
        
        .sidebar-transition {
          transition: all 0.3s ease;
        }
      `}</style>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="fixed top-0 right-0 left-0 z-50 bg-white shadow-sm">
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-600 to-amber-500"></div>
        <PosNavbar 
          scrolled={scrolled} 
          sidebarCollapsed={isCompact} 
          toggleSidebar={toggleSidebar}
          showBilling={true}
          showBusinessSettings={true}
        />
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed top-16 pt-4 left-0 z-30 h-full bg-white border-r border-orange-100 transition-all duration-300 sidebar-transition
            ${isSidebarOpen ? 'translate-x-0 shadow-lg' : 'translate-x-[-100%] lg:translate-x-0'}
            ${isCompact ? 'w-16 lg:w-16' : 'w-72 lg:w-72'}
          `}
        >
          {/* Logo */}
          <div className={`flex items-center h-16 px-4 border-b border-gray-200 ${isCompact ? 'justify-center' : 'justify-between'}`}>
            <Link href="/finance" className="flex items-center">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xl">
                  F
                </div>
                {!isCompact && (
                  <span className="ml-2 text-xl font-semibold text-gray-800">Finance</span>
                )}
              </div>
            </Link>
            
            <div className="flex items-center space-x-1">
              {!isCompact && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleCompactMode}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaChevronLeft className="h-4 w-4" />
                </Button>
              )}
              
              {isCompact && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleCompactMode}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaChevronRight className="h-4 w-4" />
                </Button>
              )}
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleSidebar}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* User profile */}
          {!isCompact && (
            <div className="px-4 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-600">
                  <FaUserCircle className="h-6 w-6" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">Farmasi Admin</p>
                  <p className="text-xs text-gray-500">Manajemen Keuangan</p>
                </div>
              </div>
            </div>
          )}

          {/* Menu items */}
          <div className="flex-grow overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <ul className="space-y-1 px-2">
              {financeMenuItems.map((item) => (
                <li key={item.title} className="relative group">
                  {item.children ? (
                    <div 
                      className={`flex items-center px-3 py-2 rounded-lg group transition-colors text-gray-700 hover:bg-orange-50 hover:text-orange-600 cursor-pointer ${expandedMenus[item.title] ? 'bg-orange-50' : ''}`}
                      onClick={() => toggleMenu(item.title)}
                      onMouseEnter={() => setHoverMenuItem(item.title)}
                      onMouseLeave={() => setHoverMenuItem(null)}
                    >
                      <span className={`text-gray-500 group-hover:text-orange-600 ${expandedMenus[item.title] ? 'text-orange-600' : ''}`}>
                        {item.icon}
                      </span>
                      {!isCompact && (
                        <span className={`ml-3 text-sm font-medium ${expandedMenus[item.title] ? 'text-orange-600' : ''}`}>{item.title}</span>
                      )}
                      {!isCompact && (
                        <FaChevronDown className={`h-4 w-4 ml-auto text-gray-500 group-hover:text-orange-600 transition-transform ${expandedMenus[item.title] ? 'transform rotate-180 text-orange-600' : ''}`} />
                      )}
                      
                      {/* Floating submenu on hover when compact */}
                      {isCompact && hoverMenuItem === item.title && (
                        <div className="absolute left-16 bg-white rounded-lg shadow-lg border border-orange-100 min-w-48 z-50 overflow-hidden">
                          <div className="py-2 px-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                            <span className="font-medium text-orange-800">{item.title}</span>
                          </div>
                          <div className="py-2">
                            {item.children.map((child) => (
                              <Link
                                key={child.title}
                                href={child.path}
                                className={`flex items-center px-4 py-2 text-sm transition-colors ${
                                  isActive(child.path) 
                                    ? 'bg-orange-50 text-orange-600'
                                    : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                                }`}
                              >
                                <span className={`${isActive(child.path) ? 'text-orange-600' : 'text-gray-500'} mr-2`}>
                                  {child.icon}
                                </span>
                                <span>{child.title}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.path}
                      className={`flex items-center px-3 py-2 rounded-lg group transition-colors ${
                        isActive(item.path) 
                          ? 'bg-orange-50 text-orange-600'
                          : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                      } ${isCompact ? 'justify-center' : ''} relative`}
                      onMouseEnter={() => setHoverMenuItem(item.title)}
                      onMouseLeave={() => setHoverMenuItem(null)}
                    >
                      <span className={`${isActive(item.path) ? 'text-orange-600' : 'text-gray-500 group-hover:text-orange-600'}`}>
                        {item.icon}
                      </span>
                      
                      {!isCompact && (
                        <span className="ml-3 text-sm font-medium">{item.title}</span>
                      )}
                      
                      {/* Floating label on hover when compact */}
                      {isCompact && hoverMenuItem === item.title && (
                        <div className="absolute left-16 bg-white rounded-lg shadow-lg border border-orange-100 py-2 px-3 min-w-32 z-50">
                          <span className="text-sm font-medium text-orange-800">{item.title}</span>
                        </div>
                      )}
                    </Link>
                  )}
                  {item.children && (
                    <ul className={`pl-4 ${expandedMenus[item.title] ? 'block' : 'hidden'}`}>
                      {item.children.map((child) => (
                        <li key={child.title} className="relative group">
                          <Link
                            href={child.path}
                            className={`flex items-center px-3 py-2 rounded-lg group transition-colors ${
                              isActive(child.path) 
                                ? 'bg-orange-50 text-orange-600'
                                : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                            } ${isCompact ? 'justify-center' : ''}`}
                          >
                            <span className={`${isActive(child.path) ? 'text-orange-600' : 'text-gray-500 group-hover:text-orange-600'}`}>
                              {child.icon}
                            </span>
                            
                            {!isCompact && (
                              <span className="ml-3 text-sm font-medium">{child.title}</span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Back link */}
          <div className="p-4 border-t border-gray-200">
            <Link 
              href="/pos" 
              className={`flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors ${isCompact ? 'justify-center' : ''}`}
            >
              <FaArrowLeft className={`${isCompact ? '' : 'mr-2'} h-5 w-5 text-gray-500`} />
              {!isCompact && <span className="text-sm font-medium">Kembali</span>}
            </Link>
          </div>
        </aside>
        
        {/* Mobile menu button */}
        <button 
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md border border-gray-200 text-gray-700"
        >
          <FaBars className="h-5 w-5" />
        </button>

        {/* Main content */}
        <div className={`flex-1 transition-all duration-300 ${isCompact ? 'lg:ml-20' : 'lg:ml-64'}`}>
          {/* Page content */}
          <main className="min-h-screen flex flex-col overflow-hidden bg-gradient-to-b from-orange-50/20 to-white/80">
            {/* Decorative elements */}
            <div className="fixed top-40 right-10 w-64 h-64 bg-orange-200 rounded-full opacity-10 blur-3xl -z-10"></div>
            <div className="fixed bottom-40 left-10 w-80 h-80 bg-amber-300 rounded-full opacity-10 blur-3xl -z-10"></div>
            
            {/* Header Dekoratif dengan Gradien */}
            <div className="relative mb-8 overflow-hidden bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-6 shadow-lg mx-4 md:mx-6 mt-4 md:mt-6">
              <div className="relative z-10">
                <h1 className="text-2xl font-bold text-white">Manajemen Keuangan</h1>
                <p className="text-orange-100 mt-1">Kelola semua transaksi keuangan, pembelian, penjualan, dan laporan keuangan apotek Anda dengan mudah.</p>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-10 w-24 h-24 bg-white opacity-10 rounded-full transform -translate-x-6 translate-y-12"></div>
              <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white opacity-10 rounded-full"></div>
              
              {/* Pill Decorations */}
              <div className="absolute bottom-3 right-6 flex space-x-1">
                <div className="h-1.5 w-6 bg-white opacity-30 rounded-full"></div>
                <div className="h-1.5 w-10 bg-white opacity-50 rounded-full"></div>
                <div className="h-1.5 w-4 bg-white opacity-20 rounded-full"></div>
              </div>
            </div>

            {/* Main Content Container */}
            <div className="flex-1 overflow-auto px-4 md:px-6 pb-6">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-orange-100 neo-shadow mb-6">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
