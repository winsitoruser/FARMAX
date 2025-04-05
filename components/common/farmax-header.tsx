import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaBell, 
  FaEnvelope, 
  FaUser, 
  FaCreditCard, 
  FaSignOutAlt, 
  FaCog,
  FaBuilding,
  FaChartLine,
  FaFileInvoiceDollar
} from 'react-icons/fa';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const FarmaxHeader: React.FC = () => {
  // State untuk badge notifikasi dan pesan
  const [notifications, setNotifications] = useState<number>(3);
  const [messages, setMessages] = useState<number>(5);

  // Contoh data notifikasi
  const notificationItems = [
    { id: 1, title: 'Pembaruan Sistem', message: 'Sistem akan diperbarui pada tanggal 5 April 2025', time: '10 menit yang lalu' },
    { id: 2, title: 'Stok Menipis', message: 'Beberapa produk memiliki stok yang rendah', time: '30 menit yang lalu' },
    { id: 3, title: 'Pembayaran Berhasil', message: 'Pembayaran untuk Invoice #INV-2023 berhasil', time: '1 jam yang lalu' },
  ];

  // Contoh data pesan
  const messageItems = [
    { id: 1, name: 'Supplier Obat', message: 'Pesanan Anda telah dikirim', time: '5 menit yang lalu', avatar: '/avatars/supplier.png' },
    { id: 2, name: 'Tim Support', message: 'Tiket #45982 telah ditanggapi', time: '1 jam yang lalu', avatar: '/avatars/support.png' },
    { id: 3, name: 'Distributor Farmasi', message: 'Katalog produk baru tersedia', time: '3 jam yang lalu', avatar: '/avatars/distributor.png' },
  ];

  // Mark all notifications as read
  const markAllNotificationsAsRead = () => {
    setNotifications(0);
  };

  // Mark all messages as read
  const markAllMessagesAsRead = () => {
    setMessages(0);
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      {/* Top decorative gradient bar */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-500 h-1"></div>
      
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center group">
              <div className="w-10 h-10 flex items-center justify-center mr-3 group-hover:scale-105 transition-all duration-200">
                <Image 
                  src="/farmanesia-logo.png" 
                  alt="Farmanesia Logo" 
                  width={40} 
                  height={40} 
                  className="rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">FARMAX</span>
                <span className="text-xs text-gray-500">Pharmacy Management System</span>
              </div>
            </Link>
          </div>
          
          {/* Right side - Icons */}
          <div className="flex items-center space-x-3">
            {/* Manage Business Tab */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="relative p-2 rounded-md text-gray-600 hover:text-orange-600 hover:bg-orange-50 focus:outline-none transition-colors duration-200 transform hover:scale-105"
                  aria-label="Manage Business"
                >
                  <FaBuilding className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Manage Business</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  <FaChartLine className="h-4 w-4 text-orange-500" />
                  <span>Analytics</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  <FaBuilding className="h-4 w-4 text-orange-500" />
                  <span>Business Settings</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Notification Icon */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="relative p-2 rounded-md text-gray-600 hover:text-orange-600 hover:bg-orange-50 focus:outline-none transition-colors duration-200 transform hover:scale-105"
                  aria-label="Notifications"
                >
                  <FaBell className="h-5 w-5" />
                  {notifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-orange-500 border-none text-[10px]">
                      {notifications}
                    </Badge>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex justify-between items-center">
                  <span>Notifikasi</span>
                  {notifications > 0 && (
                    <button 
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Tandai semua telah dibaca
                    </button>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  {notificationItems.map((item) => (
                    <DropdownMenuItem key={item.id} className="flex flex-col items-start p-3 cursor-pointer hover:bg-orange-50">
                      <div className="flex items-start gap-3 w-full">
                        <div className="bg-gradient-to-br from-orange-600 to-amber-500 rounded-full p-2 mt-0.5 shadow-sm">
                          <FaBell className="h-3 w-3 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{item.message}</p>
                          <p className="text-xs text-orange-600 mt-1">{item.time}</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-2 cursor-pointer flex justify-center">
                  <span className="text-xs text-orange-600 hover:text-orange-700 font-medium">Lihat semua notifikasi</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Message Icon */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="relative p-2 rounded-md text-gray-600 hover:text-orange-600 hover:bg-orange-50 focus:outline-none transition-colors duration-200 transform hover:scale-105"
                  aria-label="Messages"
                >
                  <FaEnvelope className="h-5 w-5" />
                  {messages > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-orange-500 border-none text-[10px]">
                      {messages}
                    </Badge>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex justify-between items-center">
                  <span>Pesan</span>
                  {messages > 0 && (
                    <button 
                      onClick={markAllMessagesAsRead}
                      className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Tandai semua telah dibaca
                    </button>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  {messageItems.map((item) => (
                    <DropdownMenuItem key={item.id} className="flex flex-col items-start p-3 cursor-pointer hover:bg-orange-50">
                      <div className="flex items-start gap-3 w-full">
                        <Avatar className="h-8 w-8 mt-0.5">
                          <AvatarImage src={item.avatar} />
                          <AvatarFallback className="bg-orange-500 text-white text-xs">{item.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{item.message}</p>
                          <p className="text-xs text-orange-600 mt-1">{item.time}</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-2 cursor-pointer flex justify-center">
                  <span className="text-xs text-orange-600 hover:text-orange-700 font-medium">Lihat semua pesan</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Billing Management */}
            <Link 
              href="/billing"
              className="p-2 rounded-md text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors duration-200 transform hover:scale-105 block"
              aria-label="Billing Management"
            >
              <FaFileInvoiceDollar className="h-5 w-5" />
            </Link>
            
            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  type="button"
                  className="flex items-center space-x-2 p-1 rounded-md hover:bg-orange-50 focus:outline-none transition-colors duration-200"
                >
                  <Avatar className="h-8 w-8 border-2 border-orange-200">
                    <AvatarImage src="/avatars/admin.png" />
                    <AvatarFallback className="bg-gradient-to-br from-orange-600 to-amber-500 text-white">AF</AvatarFallback>
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
      </div>
    </header>
  );
};

export default FarmaxHeader;
