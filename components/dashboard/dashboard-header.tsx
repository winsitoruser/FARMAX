import React, { useState, useEffect } from 'react';
import { FaBell, FaUser, FaSearch, FaChevronDown, FaSignOutAlt, FaCog, FaUserCircle, 
  FaShoppingCart, FaExclamationTriangle, FaHome, FaBoxOpen, FaChartBar, FaUsers, 
  FaCalendarAlt, FaClipboardList, FaFileInvoiceDollar } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/router';

const DashboardHeader: React.FC = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();
  
  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu || showNotifications) {
        const target = event.target as HTMLElement;
        if (!target.closest('.user-menu-container') && !target.closest('.notification-container')) {
          setShowUserMenu(false);
          setShowNotifications(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu, showNotifications]);

  // Navigation items
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <FaHome className="h-4 w-4" /> },
    { name: 'POS', href: '/pos', icon: <FaShoppingCart className="h-4 w-4" /> },
    { name: 'Inventory', href: '/inventory', icon: <FaBoxOpen className="h-4 w-4" /> },
    { name: 'Reports', href: '/reports', icon: <FaChartBar className="h-4 w-4" /> },
    { name: 'Customers', href: '/customers', icon: <FaUsers className="h-4 w-4" /> },
    { name: 'Finance', href: '/finance', icon: <FaFileInvoiceDollar className="h-4 w-4" /> },
    { name: 'Schedule', href: '/schedule', icon: <FaCalendarAlt className="h-4 w-4" /> },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      {/* Main header content */}
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo icon only - with neutral colors */}
        <div className="flex items-center">
          <div className="bg-gray-200 text-gray-600 p-2 rounded-lg">
            <FaShoppingCart className="h-5 w-5" />
          </div>
        </div>
        
        {/* Main navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-gray-100 text-gray-700' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <span className="mr-1.5">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        {/* Right side with search, notifications and user menu */}
        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="w-48 pl-9 pr-4 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-gray-50 text-sm"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
          </div>
          
          {/* Notifications */}
          <div className="relative notification-container">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FaBell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">3</span>
            </Button>
            
            {/* Notification dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-3 border-b border-gray-100">
                  <h3 className="font-medium text-gray-800">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start">
                      <div className="bg-gray-100 p-2 rounded-lg mr-3">
                        <FaExclamationTriangle className="text-gray-500 h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Stock Alert</p>
                        <p className="text-sm text-gray-600">Paracetamol is running low on stock.</p>
                        <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start">
                      <div className="bg-gray-100 p-2 rounded-lg mr-3">
                        <FaShoppingCart className="text-gray-500 h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">New Order</p>
                        <p className="text-sm text-gray-600">New wholesale order placed.</p>
                        <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start">
                      <div className="bg-gray-100 p-2 rounded-lg mr-3">
                        <FaUser className="text-gray-500 h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">New Staff Added</p>
                        <p className="text-sm text-gray-600">Budi has been added as a new staff.</p>
                        <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-2 border-t border-gray-100">
                  <Button 
                    variant="ghost" 
                    className="w-full text-center text-gray-600 hover:text-gray-800 hover:bg-gray-50 text-sm"
                  >
                    View All Notifications
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* User menu */}
          <div className="relative user-menu-container">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                <FaUser className="h-4 w-4" />
              </div>
              <div className="hidden md:flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-1">Admin</span>
                <FaChevronDown className="h-3 w-3 text-gray-500" />
              </div>
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-3 border-b border-gray-100">
                  <p className="font-medium text-gray-800">Admin User</p>
                  <p className="text-sm text-gray-500">admin@farmax.com</p>
                </div>
                <div className="p-2">
                  <button className="flex items-center space-x-2 hover:bg-gray-50 text-gray-700 w-full text-left px-3 py-2 rounded-md">
                    <FaUserCircle className="h-4 w-4 text-gray-500" />
                    <span>My Profile</span>
                  </button>
                  <button className="flex items-center space-x-2 hover:bg-gray-50 text-gray-700 w-full text-left px-3 py-2 rounded-md">
                    <FaCog className="h-4 w-4 text-gray-500" />
                    <span>Settings</span>
                  </button>
                  <button className="flex items-center space-x-2 hover:bg-gray-50 text-red-600 w-full text-left px-3 py-2 rounded-md mt-1 border-t border-gray-100">
                    <FaSignOutAlt className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile navigation - shown only on small screens */}
      <div className="lg:hidden overflow-x-auto flex border-t border-gray-100 bg-white">
        {navItems.map((item) => {
          const isActive = router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-3 text-xs whitespace-nowrap ${
                isActive 
                  ? 'text-gray-700 border-b-2 border-gray-500' 
                  : 'text-gray-600'
              }`}
            >
              <span className="mb-1">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </div>
    </header>
  );
};

export default DashboardHeader;
