import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  FaShoppingCart, FaCog, FaTags, FaUser, 
  FaSearch, FaBell, FaSignOutAlt, FaMoon, FaSun, FaPrescriptionBottleAlt, FaBars
} from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DashonicHeaderProps {
  toggleSidebar: () => void;
}

const DashonicHeader: React.FC<DashonicHeaderProps> = ({ toggleSidebar }) => {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const getPageTitle = () => {
    const path = router.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/pos/kasir') return 'Kasir';
    if (path === '/pos/discounts') return 'Diskon & Promosi';
    if (path.startsWith('/inventory')) return 'Inventori';
    if (path.startsWith('/finance')) return 'Keuangan';
    if (path.startsWith('/reports')) return 'Laporan';
    if (path.startsWith('/customers')) return 'Pelanggan';
    if (path.startsWith('/settings')) return 'Pengaturan';
    return 'Dashboard';
  };

  const isKasirPage = router.pathname === '/pos/kasir';
  const isDiscountsPage = router.pathname === '/pos/discounts';
  const isPosSection = router.pathname.startsWith('/pos');

  return (
    <header className="bg-white shadow-sm z-50 sticky top-0">
      {/* Top decorative gradient bar - made thicker for more visibility */}
      <div className="h-2 bg-gradient-to-r from-orange-500 to-red-500"></div>
      
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
          
          {/* POS quick navigation (only show on POS pages) */}
          {isPosSection && (
            <div className="hidden md:flex gap-2 ml-5">
              <Link href="/pos/kasir">
                <Button 
                  variant={isKasirPage ? "default" : "ghost"} 
                  size="sm" 
                  className={`text-sm h-9 px-4 ${isKasirPage ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'}`}
                >
                  <FaShoppingCart className="mr-2 text-sm" />
                  Kasir
                </Button>
              </Link>
              <Link href="/pos/discounts">
                <Button 
                  variant={isDiscountsPage ? "default" : "ghost"} 
                  size="sm" 
                  className={`text-sm h-9 px-4 ${isDiscountsPage ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'}`}
                >
                  <FaTags className="mr-2 text-sm" />
                  Diskon
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Dark mode toggle */}
          <Button variant="ghost" size="sm" className="p-0 w-9 h-9" onClick={toggleDarkMode}>
            {darkMode ? <FaSun className="text-lg text-amber-500" /> : <FaMoon className="text-lg text-gray-600" />}
          </Button>
          
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 w-9 h-9 relative">
                <FaBell className="text-lg text-gray-600" />
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold">3</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 p-0">
              <DropdownMenuLabel className="py-2 px-3 font-medium">Notifikasi</DropdownMenuLabel>
              <DropdownMenuSeparator className="m-0" />
              
              {/* Notification items */}
              <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                {[1, 2, 3].map((item) => (
                  <DropdownMenuItem key={item} className="p-3 focus:bg-orange-50">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-gray-800">Stok Menipis</span>
                      <span className="text-xs text-gray-500">Produk Paracetamol tersisa 5 item</span>
                      <span className="text-xs text-gray-400 mt-1">2 jam yang lalu</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              
              <DropdownMenuSeparator className="m-0" />
              <Link href="/notifications" className="block py-2 px-4 text-center text-sm text-orange-500 hover:bg-orange-50">
                Lihat Semua
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-9">
                <div className="flex items-center gap-2">
                  <Avatar className="w-9 h-9">
                    <AvatarImage src="/avatars/admin-avatar.png" alt="Admin" />
                    <AvatarFallback className="bg-gradient-to-br from-orange-500 to-amber-500 text-white text-sm">AD</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-sm font-medium">Admin</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="flex flex-col space-y-0.5">
                <span className="font-medium text-sm">Admin User</span>
                <span className="text-xs text-gray-500">admin@farmanesia.com</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <FaUser className="mr-2 h-3 w-3" />
                <span className="text-xs">Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FaCog className="mr-2 h-3 w-3" />
                <span className="text-xs">Pengaturan</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <FaSignOutAlt className="mr-2 h-3 w-3" />
                <span className="text-xs">Keluar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashonicHeader;
