import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import PosNavbar from '@/components/pos/pos-navbar';
import {
  FaTachometerAlt, FaShoppingCart, FaBoxOpen, FaChartBar,
  FaFileInvoiceDollar, FaUserFriends, FaCog, FaCalendarAlt,
  FaUsers, FaStore, FaClipboardList, FaChevronDown, FaChevronRight,
  FaBars, FaTimes, FaSignOutAlt, FaUserCircle, FaEnvelope, FaBell
} from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/shared/footer';

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  badge?: {
    text: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  divider?: boolean;
}

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: <FaTachometerAlt />,
    path: '/dashboard',
  },
  {
    title: 'POS',
    icon: <FaShoppingCart />,
    path: '/pos',
  },
  {
    title: 'Inventory',
    icon: <FaBoxOpen />,
    children: [
      { title: 'Products', icon: <FaStore />, path: '/products' },
      { title: 'Categories', icon: <FaClipboardList />, path: '/categories' },
      { title: 'Stock', icon: <FaBoxOpen />, path: '/stock' },
    ]
  },
  {
    title: 'Finance',
    icon: <FaFileInvoiceDollar />,
    children: [
      { title: 'Transactions', icon: <FaFileInvoiceDollar />, path: '/finance/transactions' },
      { title: 'Expenses', icon: <FaFileInvoiceDollar />, path: '/finance/expenses' },
      { title: 'Revenue', icon: <FaChartBar />, path: '/finance/revenue' },
    ]
  },
  {
    title: 'Reports',
    icon: <FaChartBar />,
    path: '/reports',
    badge: {
      text: 'New',
      variant: 'destructive',
    }
  },
  { divider: true } as MenuItem,
  {
    title: 'Customers',
    icon: <FaUserFriends />,
    path: '/customers',
  },
  {
    title: 'Suppliers',
    icon: <FaUsers />,
    path: '/suppliers',
  },
  {
    title: 'Calendar',
    icon: <FaCalendarAlt />,
    path: '/calendar',
  },
  { divider: true } as MenuItem,
  {
    title: 'Settings',
    icon: <FaCog />,
    path: '/settings',
  },
];

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
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

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [router.asPath, isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleSubMenu = (title: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const isActive = (path: string) => {
    return router.pathname === path || router.pathname.startsWith(`${path}/`);
  };

  const isMenuActive = (item: MenuItem) => {
    if (item.path) {
      return isActive(item.path);
    }
    if (item.children) {
      return item.children.some(child => child.path && isActive(child.path));
    }
    return false;
  };

  return (
    <div className="min-h-screen flex flex-col bg-orange-50/30">
      {/* Header with Farmanesia logo */}
      <PosNavbar 
        scrolled={scrolled} 
        sidebarCollapsed={isSidebarCollapsed} 
        toggleSidebar={toggleSidebar} 
      />
      
      <div className="flex flex-1 pt-16">
        {/* Mobile overlay */}
        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={toggleSidebar}
          />
        )}

        {/* Sidebar */}
        <div 
          className={`fixed lg:static inset-y-0 left-0 z-30 flex flex-col transition-all duration-300 ease-in-out bg-white border-r border-gray-200 shadow-sm pt-16 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } ${
            isSidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Logo */}
          <div className={`flex items-center justify-between h-16 px-4 border-b border-gray-200 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <Link href="/dashboard" className="flex items-center">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xl">
                  F
                </div>
                {!isSidebarCollapsed && (
                  <span className="ml-2 text-xl font-semibold text-gray-800">FARMAX</span>
                )}
              </div>
            </Link>
            {!isSidebarCollapsed && !isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden" 
                onClick={toggleSidebar}
              >
                <FaTimes className="h-5 w-5" />
              </Button>
            )}
            {!isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                className={isSidebarCollapsed ? 'absolute right-2 top-2' : ''}
                onClick={toggleSidebarCollapse}
              >
                {isSidebarCollapsed ? <FaChevronRight className="h-4 w-4" /> : <FaChevronDown className="h-4 w-4" />}
              </Button>
            )}
          </div>

          {/* User profile */}
          {!isSidebarCollapsed && (
            <div className="px-4 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 border-2 border-orange-100">
                  <AvatarImage src="/images/avatar.png" alt="User" />
                  <AvatarFallback className="bg-orange-100 text-orange-600">AU</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">Admin User</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          )}

          {/* Menu items */}
          <div className="flex-grow overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <ul className="space-y-1 px-2">
              {menuItems.map((item, index) => 
                item.divider ? (
                  <li key={`divider-${index}`} className="my-3 border-t border-gray-200"></li>
                ) : (
                  <li key={item.title}>
                    {item.path ? (
                      <Link
                        href={item.path}
                        className={`flex items-center px-3 py-2 rounded-md group transition-colors ${
                          isMenuActive(item) 
                            ? 'bg-orange-50 text-orange-600'
                            : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                        } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                      >
                        <span className={`${isMenuActive(item) ? 'text-orange-600' : 'text-gray-500 group-hover:text-orange-600'}`}>
                          {item.icon}
                        </span>
                        
                        {!isSidebarCollapsed && (
                          <>
                            <span className="ml-3 text-sm font-medium flex-grow">{item.title}</span>
                            
                            {item.badge && (
                              <Badge variant={item.badge.variant} className="ml-auto">
                                {item.badge.text}
                              </Badge>
                            )}
                          </>
                        )}
                        
                        {isSidebarCollapsed && item.badge && (
                          <Badge 
                            variant={item.badge.variant} 
                            className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 text-xs h-4 min-w-4"
                          />
                        )}
                      </Link>
                    ) : (
                      <>
                        <button
                          onClick={() => toggleSubMenu(item.title)}
                          className={`w-full flex items-center px-3 py-2 rounded-md group transition-colors ${
                            isMenuActive(item) 
                              ? 'bg-orange-50 text-orange-600'
                              : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                          } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                        >
                          <span className={`${isMenuActive(item) ? 'text-orange-600' : 'text-gray-500 group-hover:text-orange-600'}`}>
                            {item.icon}
                          </span>
                          
                          {!isSidebarCollapsed && (
                            <>
                              <span className="ml-3 text-sm font-medium flex-grow">{item.title}</span>
                              
                              {openMenus[item.title] ? (
                                <FaChevronDown className="h-3 w-3 text-gray-500" />
                              ) : (
                                <FaChevronRight className="h-3 w-3 text-gray-500" />
                              )}
                            </>
                          )}
                        </button>
                        
                        {!isSidebarCollapsed && item.children && openMenus[item.title] && (
                          <AnimatePresence>
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="mt-1 ml-6 space-y-1"
                            >
                              {item.children.map(child => (
                                <li key={child.title}>
                                  <Link
                                    href={child.path || '#'}
                                    className={`flex items-center px-3 py-2 rounded-md text-sm group transition-colors ${
                                      isActive(child.path || '')
                                        ? 'bg-orange-50 text-orange-600'
                                        : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                                    }`}
                                  >
                                    <span className={`w-4 h-4 ${isActive(child.path || '') ? 'text-orange-600' : 'text-gray-500 group-hover:text-orange-600'}`}>
                                      {child.icon}
                                    </span>
                                    <span className="ml-3 text-sm font-medium">{child.title}</span>
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          </AnimatePresence>
                        )}
                        
                        {isSidebarCollapsed && item.children && (
                          <div className="absolute left-full ml-2 top-0 z-50 transform -translate-y-1/4 hidden group-hover:block">
                            <div className="bg-white shadow-lg rounded-md py-2 w-48">
                              <ul className="space-y-1">
                                {item.children.map(child => (
                                  <li key={child.title}>
                                    <Link
                                      href={child.path || '#'}
                                      className={`flex items-center px-3 py-2 rounded-md text-sm group transition-colors ${
                                        isActive(child.path || '')
                                          ? 'bg-orange-50 text-orange-600'
                                          : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                                      }`}
                                    >
                                      <span className={`w-4 h-4 ${isActive(child.path || '') ? 'text-orange-600' : 'text-gray-500 group-hover:text-orange-600'}`}>
                                        {child.icon}
                                      </span>
                                      <span className="ml-3 text-sm font-medium">{child.title}</span>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Sidebar footer */}
          {!isSidebarCollapsed && (
            <div className="p-4 border-t border-gray-200">
              <Button variant="outline" className="w-full flex items-center justify-center">
                <FaSignOutAlt className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className={`flex-1 transition-all duration-300 ${
          isSidebarOpen && !isSidebarCollapsed ? 'lg:ml-64' : isSidebarOpen && isSidebarCollapsed ? 'lg:ml-20' : '0'
        }`}>
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

export default SidebarLayout;
