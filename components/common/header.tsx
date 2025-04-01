import { useState } from 'react';
import { FaBell, FaEnvelope, FaSearch, FaChevronDown, FaSignOutAlt, FaCog, FaUser, FaBars, FaTimes, FaPrescriptionBottleAlt } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

const Header = () => {
  const [notifications, setNotifications] = useState(3);
  const [messages, setMessages] = useState(2);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-md">
      <div className="bg-gradient-to-r from-orange-600 to-amber-500 h-1"></div>
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-600 hover:bg-orange-50 focus:outline-none"
              aria-label="Toggle sidebar menu"
            >
              <FaBars size={24} />
            </button>
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/dashboard">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-amber-500 rounded-lg overflow-hidden flex items-center justify-center mr-3 shadow-md">
                    <FaPrescriptionBottleAlt className="text-white text-xl" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 text-transparent bg-clip-text">
                      Farmanesia
                    </span>
                    <span className="text-xs text-gray-500">Apotek Digital</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          
          {/* Search */}
          <div className="hidden md:flex items-center max-w-md w-full mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Cari di Farmanesia..."
              />
            </div>
          </div>
          
          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <FaBell className="text-gray-600 text-xl" />
                  {notifications > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                      {notifications}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                  <div className="p-3 hover:bg-gray-50 cursor-pointer border-b">
                    <p className="font-medium text-sm">Stok Obat Hampir Habis</p>
                    <p className="text-xs text-gray-500 mt-1">Paracetamol 500mg tersisa 10 tablet</p>
                    <p className="text-xs text-gray-400 mt-1">2 jam yang lalu</p>
                  </div>
                  <div className="p-3 hover:bg-gray-50 cursor-pointer border-b">
                    <p className="font-medium text-sm">Transaksi Baru</p>
                    <p className="text-xs text-gray-500 mt-1">TRX202503230001 telah selesai</p>
                    <p className="text-xs text-gray-400 mt-1">3 jam yang lalu</p>
                  </div>
                  <div className="p-3 hover:bg-gray-50 cursor-pointer">
                    <p className="font-medium text-sm">Pengingat Pesanan</p>
                    <p className="text-xs text-gray-500 mt-1">Pesanan #ORD12345 menunggu konfirmasi</p>
                    <p className="text-xs text-gray-400 mt-1">5 jam yang lalu</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="p-2 text-center">
                  <Link href="/notifications" className="text-sm text-orange-500 hover:text-orange-600">
                    Lihat Semua Notifikasi
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Messages */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <FaEnvelope className="text-gray-600 text-xl" />
                  {messages > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-green-500 rounded-full">
                      {messages}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Pesan</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                  <div className="p-3 hover:bg-gray-50 cursor-pointer border-b">
                    <div className="flex items-start">
                      <div className="mr-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <FaUser className="text-gray-500" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Budi Santoso</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">Apakah pesanan saya sudah siap diambil?</p>
                        <p className="text-xs text-gray-400 mt-1">10 menit yang lalu</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start">
                      <div className="mr-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <FaUser className="text-gray-500" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Siti Rahayu</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">Tolong konfirmasi stok obat yang saya pesan kemarin</p>
                        <p className="text-xs text-gray-400 mt-1">1 jam yang lalu</p>
                      </div>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="p-2 text-center">
                  <Link href="/messages" className="text-sm text-orange-500 hover:text-orange-600">
                    Lihat Semua Pesan
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-2 cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <Image
                      src="/avatar.png"
                      alt="User Avatar"
                      width={36}
                      height={36}
                      className="object-cover"
                    />
                  </div>
                  <div className="hidden md:flex items-center">
                    <span className="text-sm font-medium mr-1">Admin</span>
                    <FaChevronDown className="text-gray-500 text-xs" />
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <FaUser className="mr-2 text-gray-500" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <FaCog className="mr-2 text-gray-500" />
                  <span>Pengaturan</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50">
                  <FaSignOutAlt className="mr-2" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
