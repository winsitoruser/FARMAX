import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  FaBell, FaSearch, FaUser, FaCog, FaSignOutAlt, 
  FaBars, FaTimes, FaSun, FaMoon
} from 'react-icons/fa';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PosNavbarProps {
  scrolled: boolean;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const PosNavbar: React.FC<PosNavbarProps> = ({ scrolled, sidebarCollapsed, toggleSidebar }) => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Stock Paracetamol hampir habis", time: "5 menit yang lalu", read: false },
    { id: 2, message: "Ada pembaruan sistem tersedia", time: "1 jam yang lalu", read: false },
    { id: 3, message: "Laporan penjualan mingguan tersedia", time: "5 jam yang lalu", read: true }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Logic to actually change the theme would go here
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search logic would go here
    console.log("Searching for:", searchTerm);
  };

  return (
    <header className={`sticky top-0 z-30 bg-white border-b ${scrolled ? 'border-gray-200 shadow-sm' : 'border-transparent'} transition-all duration-200`}>
      <div className="px-4 flex h-16 items-center justify-between">
        {/* Left side with hamburger */}
        <div className="flex items-center">
          <button
            type="button"
            className="p-2 rounded-md text-gray-500 hover:text-orange-500 hover:bg-orange-50 focus:outline-none"
            onClick={toggleSidebar}
          >
            <FaBars className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </button>
          
          {/* Brand/Title - Only visible on desktop */}
          <div className="hidden md:block ml-4">
            <h1 className="text-lg font-semibold text-gray-800">Point of Sale</h1>
          </div>
        </div>
        
        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="Cari produk, transaksi, pelanggan..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </form>
        </div>
        
        {/* Right side - Icons */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <button
            type="button"
            className="p-2 rounded-md text-gray-500 hover:text-orange-500 hover:bg-orange-50 focus:outline-none"
            onClick={toggleDarkMode}
          >
            {darkMode ? (
              <FaSun className="h-5 w-5" />
            ) : (
              <FaMoon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </button>
          
          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              className="p-2 rounded-md text-gray-500 hover:text-orange-500 hover:bg-orange-50 focus:outline-none"
              onClick={toggleNotifications}
            >
              <FaBell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                  {unreadCount}
                </span>
              )}
              <span className="sr-only">View notifications</span>
            </button>
            
            {showNotifications && (
              <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
                <div className="p-3 flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-700">Notifikasi</h3>
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-orange-600 hover:text-orange-800"
                  >
                    Tandai semua sudah dibaca
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 hover:bg-gray-50 ${
                        !notification.read ? 'bg-orange-50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <span className="h-2 w-2 bg-orange-500 rounded-full"></span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 flex justify-center">
                  <Link 
                    href="/notifications"
                    className="text-xs text-orange-600 hover:text-orange-800 font-medium"
                  >
                    Lihat semua notifikasi
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center text-gray-700 hover:text-orange-500 focus:outline-none">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white">
                  <FaUser className="h-4 w-4" />
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <FaUser className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FaCog className="mr-2 h-4 w-4" />
                <span>Pengaturan</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">
                <FaSignOutAlt className="mr-2 h-4 w-4" />
                <span>Keluar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default PosNavbar;
