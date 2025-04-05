import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  FaHome, 
  FaShoppingCart, 
  FaBoxes, 
  FaUsers, 
  FaChartLine, 
  FaCog, 
  FaSignOutAlt,
  FaMoneyBillWave,
  FaTruck,
  FaBell,
  FaBars,
  FaCalendarAlt
} from 'react-icons/fa';
import useSidebar from '@/hooks/use-sidebar';

const CollapsedSidebar = () => {
  const router = useRouter();
  const { isOpen, toggle } = useSidebar();
  
  const menuItems = [
    { icon: FaHome, label: 'Dashboard', path: '/dashboard' },
    { icon: FaShoppingCart, label: 'POS', path: '/pos' },
    { icon: FaBoxes, label: 'Inventory', path: '/inventory' },
    { icon: FaTruck, label: 'Purchasing', path: '/purchasing' },
    { icon: FaMoneyBillWave, label: 'Finance', path: '/finance' },
    { icon: FaUsers, label: 'Customers', path: '/customers' },
    { icon: FaChartLine, label: 'Reports', path: '/reports' },
    { icon: FaCalendarAlt, label: 'Schedule', path: '/schedule' },
    { icon: FaBell, label: 'Notifications', path: '/notifications' },
    { icon: FaCog, label: 'Settings', path: '/settings' },
  ];

  return (
    <div 
      className={`fixed left-0 top-0 h-screen z-40 bg-white shadow-lg transition-all duration-300 ${isOpen ? 'w-56' : 'w-16'}`}
    >
      <div className="flex flex-col h-full">
        {/* Logo and toggle button */}
        <div className="flex items-center p-4 border-b">
          {isOpen && (
            <div className="font-bold text-lg text-orange-600 mr-2">
              FARMAX
            </div>
          )}
          <button 
            onClick={toggle} 
            className={`rounded-full p-2 bg-orange-100 hover:bg-orange-200 text-orange-600 transition-all ${isOpen ? 'ml-auto' : 'mx-auto'}`}
          >
            <FaBars size={16} />
          </button>
        </div>
        
        {/* Menu Items */}
        <div className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-2 px-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = router.pathname === item.path || router.pathname.startsWith(`${item.path}/`);
              
              return (
                <li key={index} className="relative group">
                  <Link href={item.path}>
                    <div
                      className={`flex items-center rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                          : 'text-gray-700 hover:bg-orange-50'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <Icon className={`${isOpen ? 'mr-3' : ''} text-xl`} />
                      </div>
                      
                      {isOpen && (
                        <span className="whitespace-nowrap">{item.label}</span>
                      )}
                      
                      {/* Tooltip on hover when collapsed */}
                      {!isOpen && (
                        <div className="absolute left-14 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <div className="bg-gray-800 text-white px-3 py-2 rounded shadow-lg whitespace-nowrap">
                            {item.label}
                          </div>
                          <div className="absolute top-3 -left-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        
        {/* Logout Button */}
        <div className="p-4 border-t">
          <button 
            className={`flex items-center rounded-lg p-3 w-full cursor-pointer transition-all duration-200 text-gray-700 hover:bg-orange-50 group`}
          >
            <div className="flex items-center justify-center">
              <FaSignOutAlt className={`${isOpen ? 'mr-3' : ''} text-xl`} />
            </div>
            
            {isOpen && (
              <span className="whitespace-nowrap">Logout</span>
            )}
            
            {/* Tooltip for logout when collapsed */}
            {!isOpen && (
              <div className="absolute left-14 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="bg-gray-800 text-white px-3 py-2 rounded shadow-lg whitespace-nowrap">
                  Logout
                </div>
                <div className="absolute top-3 -left-1 w-2 h-2 bg-gray-800 rotate-45"></div>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollapsedSidebar;
