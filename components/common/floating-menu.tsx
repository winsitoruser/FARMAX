import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FaHome, 
  FaShoppingCart, 
  FaBoxes, 
  FaChartLine, 
  FaEllipsisH,
  FaTimes
} from 'react-icons/fa';

const FloatingMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <FaHome className="w-5 h-5" />,
      bgColor: 'bg-blue-500'
    },
    {
      name: 'Kasir',
      href: '/pos/kasir',
      icon: <FaShoppingCart className="w-5 h-5" />,
      bgColor: 'bg-green-500'
    },
    {
      name: 'Produk',
      href: '/products',
      icon: <FaBoxes className="w-5 h-5" />,
      bgColor: 'bg-purple-500'
    },
    {
      name: 'Laporan',
      href: '/reports',
      icon: <FaChartLine className="w-5 h-5" />,
      bgColor: 'bg-orange-500'
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-2 flex flex-col-reverse space-y-reverse space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center p-3 rounded-full shadow-lg text-white ${item.bgColor} transform transition-transform duration-200 hover:scale-110`}
              onClick={() => setIsOpen(false)}
            >
              <span className="sr-only">{item.name}</span>
              {item.icon}
              <span className="ml-2 absolute right-full mr-3 whitespace-nowrap bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 transition-opacity group-hover:opacity-100">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      )}
      
      <button
        onClick={toggleMenu}
        className={`p-4 rounded-full shadow-lg text-white transition-all duration-300 ${
          isOpen ? 'bg-red-500 rotate-45' : 'bg-orange-500'
        }`}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <FaTimes className="w-6 h-6" /> : <FaEllipsisH className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default FloatingMenu;
