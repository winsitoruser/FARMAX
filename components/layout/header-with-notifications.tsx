import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Menu, MessageSquare, Search, Settings, User, LogOut, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// Interface untuk notifikasi
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'sync_error' | 'sync_warning' | 'sync_success' | 'inventory_alert' | 'system_info';
  timestamp: Date;
  read: boolean;
  actionLink?: string;
}

const HeaderWithNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Effect untuk memuat notifikasi
  useEffect(() => {
    // Simulasi fetch notifikasi dari API
    const mockNotifications = generateMockNotifications();
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
    
    // Simulasi notifikasi baru yang masuk setiap 30 detik
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance untuk notifikasi baru
        const newNotification = generateRandomNotification();
        setNotifications(prev => [newNotification, ...prev].slice(0, 20)); // Batasi hingga 20 notifikasi
        setUnreadCount(prev => prev + 1);
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handler untuk menandai notifikasi sebagai telah dibaca
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };
  
  // Handler untuk menandai semua notifikasi sebagai telah dibaca
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };
  
  // Helper untuk mendapatkan ikon berdasarkan tipe notifikasi
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'sync_error':
        return <div className="w-2 h-2 rounded-full bg-red-500"></div>;
      case 'sync_warning':
        return <div className="w-2 h-2 rounded-full bg-amber-500"></div>;
      case 'sync_success':
        return <div className="w-2 h-2 rounded-full bg-green-500"></div>;
      case 'inventory_alert':
        return <div className="w-2 h-2 rounded-full bg-blue-500"></div>;
      case 'system_info':
        return <div className="w-2 h-2 rounded-full bg-gray-500"></div>;
      default:
        return <div className="w-2 h-2 rounded-full bg-gray-500"></div>;
    }
  };
  
  return (
    <header className="border-b bg-gradient-to-r from-orange-500 to-amber-500 text-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Branding */}
          <div className="flex items-center">
            <div className="relative z-10">
              {/* Logo placeholder - replace with actual Farmanesia logo */}
              <div className="h-8 w-36 bg-white p-1 rounded flex items-center">
                <span className="text-orange-500 font-bold">Farmanesia</span>
              </div>
            </div>
            
            {/* Decorative circular elements with subtle blur */}
            <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-white opacity-10 blur-xl transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          
          {/* Search */}
          <div className="hidden md:block flex-1 mx-10">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-white/60" />
              </div>
              <input
                type="search"
                placeholder="Cari..."
                className="w-full max-w-md pl-10 py-1.5 rounded bg-white/20 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          </div>
          
          {/* Right menu items */}
          <div className="flex items-center space-x-1 md:space-x-4">
            {/* Messages */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 text-white hover:bg-white/20">
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Pesan</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="py-2 px-3 text-sm text-center text-gray-500">
                  Tidak ada pesan baru
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Notifications */}
            <DropdownMenu 
              open={isNotificationOpen} 
              onOpenChange={setIsNotificationOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 text-white hover:bg-white/20">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between py-2 px-3">
                  <DropdownMenuLabel className="text-base">Notifikasi</DropdownMenuLabel>
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-7 text-xs">
                      Tandai Semua Dibaca
                    </Button>
                  )}
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`py-2 px-3 border-b last:border-b-0 hover:bg-gray-50 ${!notification.read ? 'bg-orange-50' : ''}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex gap-3">
                          <div className="pt-1">{getNotificationIcon(notification.type)}</div>
                          <div>
                            <div className="font-medium text-sm">{notification.title}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{notification.message}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              {format(new Date(notification.timestamp), 'dd MMM, HH:mm', { locale: id })}
                            </div>
                            {notification.actionLink && (
                              <Link href={notification.actionLink} passHref>
                                <Button variant="link" size="sm" className="h-6 p-0 text-xs text-orange-500">
                                  Lihat Detail
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-gray-500">
                      Tidak ada notifikasi
                    </div>
                  )}
                </div>
                <div className="p-2 text-center border-t">
                  <Link href="/inventory/pos-integration/notifications" passHref>
                    <Button variant="ghost" size="sm" className="text-xs w-full justify-center text-orange-500">
                      Lihat Semua Notifikasi
                    </Button>
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1 rounded text-white hover:bg-white/20">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src="/images/user-avatar.jpg" />
                    <AvatarFallback className="bg-white/20 text-white text-xs">FA</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <div className="text-xs font-medium leading-none">Admin Apotek</div>
                    <div className="text-xs text-white/80 leading-none mt-0.5">Apotek Pusat</div>
                  </div>
                  <ChevronDown className="h-4 w-4 ml-1 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Pengaturan</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden h-9 w-9 rounded-full p-0 text-white hover:bg-white/20">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Generator mock data untuk demo
const generateMockNotifications = (): Notification[] => {
  const now = new Date();
  
  const mockNotifications: Notification[] = [
    {
      id: 'n1',
      title: 'Sinkronisasi Gagal',
      message: 'Sinkronisasi data POS gagal. Silakan coba lagi.',
      type: 'sync_error',
      timestamp: new Date(now.getTime() - 30 * 60000), // 30 menit yang lalu
      read: false,
      actionLink: '/inventory/pos-integration/sinkronisasi-data'
    },
    {
      id: 'n2',
      title: 'Stok Tidak Konsisten',
      message: 'Ditemukan 5 produk dengan stok tidak konsisten antara POS dan inventaris.',
      type: 'sync_warning',
      timestamp: new Date(now.getTime() - 2 * 60 * 60000), // 2 jam yang lalu
      read: false,
      actionLink: '/inventory/pos-integration/stok-product'
    },
    {
      id: 'n3',
      title: 'Sinkronisasi Sukses',
      message: 'Sinkronisasi data berhasil diselesaikan. 156 produk diperbarui.',
      type: 'sync_success',
      timestamp: new Date(now.getTime() - 5 * 60 * 60000), // 5 jam yang lalu
      read: true
    }
  ];
  
  return mockNotifications;
};

// Generator notifikasi acak untuk simulasi
const generateRandomNotification = (): Notification => {
  const now = new Date();
  const types: ('sync_error' | 'sync_warning' | 'sync_success' | 'inventory_alert' | 'system_info')[] = 
    ['sync_error', 'sync_warning', 'sync_success', 'inventory_alert', 'system_info'];
  
  const titles = [
    'Sinkronisasi Gagal',
    'Stok Menipis',
    'Sinkronisasi Selesai',
    'Ketersediaan Produk',
    'Update Sistem'
  ];
  
  const messages = [
    'Sinkronisasi data POS gagal karena masalah koneksi.',
    'Stok Paracetamol 500mg hampir habis.',
    'Sinkronisasi data berhasil, 48 produk diperbarui.',
    'Ditemukan 3 produk dengan perbedaan data stok.',
    'Sistem akan diperbarui pada pukul 23:00 WIB.'
  ];
  
  const randomType = types[Math.floor(Math.random() * types.length)];
  const randomTitle = titles[Math.floor(Math.random() * titles.length)];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  
  return {
    id: `n-${Date.now()}`,
    title: randomTitle,
    message: randomMessage,
    type: randomType,
    timestamp: now,
    read: false,
    actionLink: Math.random() > 0.5 ? '/inventory/pos-integration' : undefined
  };
};

export default HeaderWithNotifications;
