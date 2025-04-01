import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCashRegister, FaChartLine, FaUsers, FaPercentage, FaBoxOpen, FaStore, FaCalendarAlt, FaTimes, FaBars } from 'react-icons/fa';

interface FloatingMenuProps {}

const FloatingMenu: React.FC<FloatingMenuProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { icon: <FaCashRegister size={20} />, label: 'Kasir', href: '/pos/kasir' },
    { icon: <FaChartLine size={20} />, label: 'Penjualan', href: '/pos/penjualan' },
    { icon: <FaUsers size={20} />, label: 'Customer', href: '/pos/customer' },
    { icon: <FaPercentage size={20} />, label: 'Promo', href: '/pos/promo' },
    { icon: <FaBoxOpen size={20} />, label: 'Inventory', href: '/pos/inventory' },
    { icon: <FaStore size={20} />, label: 'Toko Online', href: '/pos/toko-online' },
    { icon: <FaCalendarAlt size={20} />, label: 'Jadwal Karyawan', href: '/pos/jadwal' },
  ];

  // Gradient colors for each menu item - more vibrant and professional
  const gradientColors = [
    'from-orange-500 to-red-500',       // Kasir
    'from-amber-500 to-orange-600',     // Penjualan
    'from-orange-400 to-amber-500',     // Customer
    'from-red-400 to-orange-500',       // Promo
    'from-amber-400 to-yellow-500',     // Inventory
    'from-orange-500 to-amber-400',     // Toko Online
    'from-red-500 to-orange-400',       // Jadwal Karyawan
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle Button with rotation animation */}
      <motion.button
        className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg z-20 border-2 border-white overflow-hidden"
        onClick={toggleMenu}
        whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 135 : 0 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Decorative inner circles */}
        <div className="absolute w-10 h-10 rounded-full bg-white opacity-10 animate-ping-slow"></div>
        <div className="absolute w-8 h-8 rounded-full bg-white opacity-5"></div>
        
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        
        {/* Decorative outer circle */}
        <motion.div 
          className="absolute inset-0 rounded-full border-2 border-white opacity-30"
          animate={{ scale: isOpen ? 1.2 : 1, opacity: isOpen ? 0.5 : 0.3 }}
          transition={{ duration: 0.5, repeat: isOpen ? Infinity : 0, repeatType: "reverse" }}
        ></motion.div>
      </motion.button>

      {/* Menu Items with staggered animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-24 right-0 flex flex-col-reverse gap-4 items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {menuItems.map((item, index) => {
              const isActive = router.pathname.includes(item.href);
              
              return (
                <motion.div
                  key={item.href}
                  className="relative flex items-center gap-3"
                  initial={{ opacity: 0, x: 50, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 50, scale: 0.8 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.06,
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                  }}
                >
                  {/* Tooltip Label */}
                  <motion.div
                    className="bg-white px-3 py-2 rounded-lg shadow-md text-gray-800 font-medium relative"
                    initial={{ opacity: 0, x: 20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.06 + 0.1 }}
                  >
                    {item.label}
                    {/* Tooltip arrow */}
                    <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-white"></div>
                  </motion.div>
                  
                  {/* Icon Button with decorative elements */}
                  <Link href={item.href} passHref>
                    <motion.a
                      className={`relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r ${gradientColors[index]} text-white shadow-md
                        hover:shadow-lg transition-all duration-300 ease-in-out
                        ${isActive ? 'ring-2 ring-white ring-opacity-70' : ''}`}
                      whileHover={{ 
                        scale: 1.15, 
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Decorative elements */}
                      <motion.div 
                        className="absolute inset-0 rounded-full bg-white opacity-20"
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileHover={{ scale: 1.2, opacity: 0.2 }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                      ></motion.div>
                      
                      {/* Small decorative circles */}
                      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-white opacity-40"></div>
                      <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-white opacity-40"></div>
                      
                      {/* Icon */}
                      <motion.div whileHover={{ rotate: 10, scale: 1.1 }}>
                        {item.icon}
                      </motion.div>
                    </motion.a>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingMenu;
