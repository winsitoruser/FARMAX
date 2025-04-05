import React, { useState } from 'react';
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

const VerticalSidebar: React.FC = () => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(true);
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
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
      className={`fixed left-0 top-16 bottom-0 bg-white shadow-lg transition-all duration-300 z-40 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
      style={{ 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', 
        borderRight: '1px solid rgba(0, 0, 0, 0.05)' 
      }}
    >
      <div className="flex flex-col h-full">
        {/* Toggle button */}
        <div className="flex justify-center p-3 border-b">
          <button 
            onClick={toggleSidebar} 
            className="rounded-full p-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow-md transition-all"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <FaBars size={14} />
          </button>
        </div>
        
        {/* Menu Items */}
        <div className="flex-1 py-3 overflow-y-auto">
          <ul className="px-2 space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = router.pathname === item.path || router.pathname.startsWith(`${item.path}/`);
              
              return (
                <li key={index} className="relative group">
                  <Link href={item.path}>
                    <div
                      className={`flex items-center rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md'
                          : 'text-gray-700 hover:bg-orange-50'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <Icon className={`${collapsed ? 'mx-auto' : 'mr-3'} text-lg`} />
                      </div>
                      
                      {!collapsed && (
                        <span className="whitespace-nowrap text-sm">{item.label}</span>
                      )}
                      
                      {/* Tooltip on hover when collapsed */}
                      {collapsed && (
                        <div className="absolute left-14 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <div className="bg-gray-800 text-white px-3 py-2 rounded shadow-lg whitespace-nowrap text-sm">
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
        <div className="p-2 border-t">
          <button 
            className={`flex items-center rounded-lg p-3 w-full cursor-pointer transition-all duration-200 text-gray-700 hover:bg-orange-50 group relative`}
          >
            <div className="flex items-center justify-center">
              <FaSignOutAlt className={`${collapsed ? 'mx-auto' : 'mr-3'} text-lg`} />
            </div>
            
            {!collapsed && (
              <span className="whitespace-nowrap text-sm">Logout</span>
            )}
            
            {/* Tooltip for logout when collapsed */}
            {collapsed && (
              <div className="absolute left-14 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="bg-gray-800 text-white px-3 py-2 rounded shadow-lg whitespace-nowrap text-sm">
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

export default VerticalSidebar;
