import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  FaBars, FaSearch, FaBell, FaUser, FaSignOutAlt, 
  FaPrescriptionBottleAlt, FaEnvelope, FaCog
} from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface EnhancedHeaderProps {
  toggleSidebar: () => void;
  isCompact?: boolean; // For sidebar state awareness
}

// Unified header component for all modules
const EnhancedHeader: React.FC<EnhancedHeaderProps> = ({ 
  toggleSidebar,
  isCompact = true
}) => {
  const [unreadMessages, setUnreadMessages] = useState(3);
  const [unreadNotifications, setUnreadNotifications] = useState(5);
  const router = useRouter();

  // Hide header on dashboard page
  if (router.pathname === '/dashboard') {
    return null;
  }

  const getPageTitle = () => {
    const path = router.pathname;
    if (path.startsWith('/dashboard')) return 'Dashboard';
    if (path.startsWith('/inventory')) return 'Inventaris';
    if (path.startsWith('/finance')) return 'Keuangan';
    if (path.startsWith('/pos/kasir')) return 'Kasir';
    if (path.startsWith('/pos/discounts')) return 'Diskon & Promosi';
    if (path.startsWith('/pos')) return 'Point of Sales';
    if (path.startsWith('/customers')) return 'Pelanggan';
    if (path.startsWith('/settings')) return 'Pengaturan';
    return 'FARMAX';
  };

  return (
    <header className="bg-white shadow-md z-50 sticky top-0">
      {/* Top decorative gradient bar */}
      <div className="h-2 bg-gradient-to-r from-orange-500 to-red-600"></div>
      
      {/* Main header content */}
      <div className="max-w-[1280px] mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Menu toggle button */}
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-1.5 rounded-md hover:bg-orange-50 transition-colors text-gray-600"
          >
            <FaBars className="w-5 h-5" />
          </button>
          
          {/* Logo and title */}
          <Link href="/dashboard" className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
              <FaPrescriptionBottleAlt className="text-white text-xl" />
            </div>
            <div className="ml-3 hidden md:flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-500 text-transparent bg-clip-text">
                Farmanesia
              </span>
              <span className="text-xs text-gray-500 -mt-1">Apotek Digital</span>
            </div>
          </Link>
          
          {/* Page title */}
          <div className="hidden md:block">
            <div className="h-8 border-l-2 border-orange-200 mx-4"></div>
          </div>
          <h1 className="text-lg font-medium text-gray-800">{getPageTitle()}</h1>
        </div>
        
        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari..."
              className="pl-10 pr-4 py-1.5 rounded-lg bg-gray-100 border-0 text-sm text-gray-600 focus:ring-1 focus:ring-orange-500 w-40 lg:w-52 h-9"
            />
          </div>
          
          {/* Messages */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 rounded-md hover:bg-orange-50 transition-colors relative text-gray-600">
                <FaEnvelope className="w-5 h-5" />
                {unreadMessages > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/3 bg-orange-500 rounded-full">
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Pesan Terbaru</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-56 overflow-y-auto">
                {[...Array(unreadMessages)].map((_, i) => (
                  <DropdownMenuItem key={i} className="flex items-start gap-2 py-2 cursor-pointer">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/images/avatars/user${i+1}.png`} />
                      <AvatarFallback className="bg-orange-100 text-orange-700">U{i+1}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700">Pesan Penting #{i+1}</span>
                      <span className="text-xs text-gray-500 line-clamp-1">Info tentang pesanan obat baru...</span>
                      <span className="text-xs text-orange-500 mt-0.5">Baru saja</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer justify-center">
                <span className="text-sm text-orange-600 font-medium">Lihat Semua Pesan</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 rounded-md hover:bg-orange-50 transition-colors relative text-gray-600">
                <FaBell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/3 bg-red-500 rounded-full">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-56 overflow-y-auto">
                {[...Array(unreadNotifications)].map((_, i) => (
                  <DropdownMenuItem key={i} className="flex items-start gap-2 py-2 cursor-pointer">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      i % 3 === 0 ? 'bg-orange-100 text-orange-600' : 
                      i % 3 === 1 ? 'bg-red-100 text-red-600' : 
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      <FaBell className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700">Stok Menipis</span>
                      <span className="text-xs text-gray-500 line-clamp-1">Paracetamol hampir habis...</span>
                      <span className="text-xs text-orange-500 mt-0.5">5 menit yang lalu</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer justify-center">
                <span className="text-sm text-orange-600 font-medium">Lihat Semua Notifikasi</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-1 rounded-md hover:bg-orange-50 transition-colors">
                <Avatar className="h-9 w-9 border border-orange-200">
                  <AvatarImage src="/images/avatars/admin.png" alt="Admin User" />
                  <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white">FX</AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-700">Admin Farmanesia</span>
                  <span className="text-xs text-gray-500">Administrator</span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <FaUser className="h-4 w-4 text-orange-500" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <FaCog className="h-4 w-4 text-orange-500" />
                <span>Pengaturan</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <FaSignOutAlt className="h-4 w-4 text-orange-500" />
                <span>Keluar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default EnhancedHeader;
