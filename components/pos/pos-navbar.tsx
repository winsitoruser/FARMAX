import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import useSidebar from '@/hooks/use-sidebar';
import { 
  FaSearch, 
  FaBell, 
  FaUser, 
  FaBars, 
  FaTimes, 
  FaMoon, 
  FaSignOutAlt, 
  FaCog, 
  FaFileInvoiceDollar, 
  FaEnvelope,
  FaBuilding,
  FaChartLine,
  FaChevronDown
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';

interface PosNavbarProps {
  scrolled: boolean;
  sidebarCollapsed?: boolean;
  toggleSidebar?: () => void;
  showBilling?: boolean;
  showBusinessSettings?: boolean;
}

const PosNavbar: React.FC<PosNavbarProps> = ({ 
  scrolled = false, 
  sidebarCollapsed = true, 
  toggleSidebar = () => {}, 
  showBilling = true,
  showBusinessSettings = true
}) => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const { isOpen, toggle } = useSidebar();
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Produk hampir kadaluarsa", time: "2 jam yang lalu", read: false, url: "/inventory/expiry" },
    { id: 2, message: "Stok obat sedang menipis", time: "6 jam yang lalu", read: false, url: "/inventory/products" },
    { id: 3, message: "Laporan bulanan sudah tersedia", time: "1 hari yang lalu", read: true, url: "/finance/reports" }
  ]);
  const [messages, setMessages] = useState(3);
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);
  
  // Mounted check for client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // If not mounted, show a placeholder to prevent layout shift
  if (!mounted) {
    return <div className="h-16 bg-white" />;
  }
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative z-[150]">
      {/* Decorative top gradient bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-600 to-amber-500"></div>
      
      <header className="w-full h-16 bg-white border-b border-gray-100 px-4 transition-all duration-200 shadow-sm">
        {/* Subtle decorative pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
        
        <div className="max-w-[1280px] relative z-10 h-full mx-auto flex items-center justify-between">
          {/* Left section with Logo & Brand */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center group">
              <div className="h-10 flex items-center justify-center group-hover:scale-105 transition-all duration-200">
                <Image
                  src="/assets/images/farmanesia.png"
                  alt="Farmanesia Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                  priority
                  onError={(e) => {
                    // Fallback jika logo tidak dapat dimuat
                    e.currentTarget.src = "/farmanesia-logo.png";
                  }}
                />
              </div>
              <div className="ml-2">
                <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-500">Farmanesia</h1>
                <p className="text-[10px] text-gray-500 -mt-1">Pharmacy System</p>
              </div>
            </Link>
          </div>
          
          {/* Center section - Search */}
          <div className="flex-1 hidden md:flex justify-center max-w-md mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari produk, supplier, atau transaksi..."
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Right section with actions */}
          <div className="flex items-center space-x-3">
            {/* Billing Management Button */}
            {showBilling && (
              <Link href="/finance/billing" className="hidden md:block">
                <Button className="bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg border-0 mr-1">
                  <FaFileInvoiceDollar className="mr-2 h-4 w-4" />
                  Billing Management
                </Button>
              </Link>
            )}
            
            {/* Business Settings */}
            {showBusinessSettings && (
              <button className="relative p-2 rounded-md hover:bg-orange-50 text-gray-600 hover:text-orange-600">
                <FaBuilding className="h-5 w-5" />
              </button>
            )}
            
            {/* Notification */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative p-2 rounded-md hover:bg-orange-50 text-gray-600 hover:text-orange-600">
                  <FaBell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 min-w-4 flex items-center justify-center p-0 bg-orange-500">
                      {unreadCount}
                    </Badge>
                  )}
                </button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-sm">Notifikasi</h2>
                    <Button variant="ghost" size="sm" onClick={() => markAllAsRead()} className="h-auto p-1 text-xs text-orange-600 hover:text-orange-700">
                      Tandai dibaca
                    </Button>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length > 0 ? (
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.map((notification) => (
                      <DropdownMenuItem key={notification.id} className="p-0 focus:bg-orange-50">
                        <Link href={notification.url} className="w-full px-2 py-2 flex gap-2">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${notification.read ? 'bg-gray-100' : 'bg-orange-100'}`}>
                            <FaBell className={`h-4 w-4 ${notification.read ? 'text-gray-500' : 'text-orange-600'}`} />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className={`text-sm line-clamp-1 ${notification.read ? 'font-normal text-gray-600' : 'font-medium text-gray-900'}`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500">
                              {notification.time}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-orange-500" />
                          )}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center text-sm text-gray-500">
                    <p>Tidak ada notifikasi</p>
                  </div>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/notifications" className="w-full text-center text-sm text-orange-600 hover:text-orange-700 cursor-pointer justify-center">
                    Lihat semua notifikasi
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Messages */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative p-2 rounded-md hover:bg-orange-50 text-gray-600 hover:text-orange-600">
                  <FaEnvelope className="h-5 w-5" />
                  {messages > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 min-w-4 flex items-center justify-center p-0 bg-orange-500">
                      {messages}
                    </Badge>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Messages</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* Message content */}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-1 p-1 rounded-md hover:bg-orange-50">
                  <Avatar className="h-7 w-7 border border-gray-200">
                    <AvatarImage src="/images/avatar.png" alt="User" />
                    <AvatarFallback className="bg-orange-100 text-orange-600 text-xs">AP</AvatarFallback>
                  </Avatar>
                  <FaChevronDown className="h-3 w-3 text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2">
                  <FaUser className="h-4 w-4 text-gray-500" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <FaCog className="h-4 w-4 text-gray-500" />
                  <span>Pengaturan</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <FaMoon className="h-4 w-4 text-gray-500" />
                  <span>Mode Gelap</span>
                  <div className="ml-auto">
                    <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 text-red-600">
                  <FaSignOutAlt className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Sidebar Toggle Button */}
            <button 
              onClick={toggle}
              className="flex items-center justify-center ml-2 w-9 h-9 rounded-lg text-gray-600 bg-gray-100 hover:bg-orange-50 hover:text-orange-500 transition-colors duration-200"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
        
        {/* Bottom decorative dots */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1 pb-1">
          <div className="h-1 w-1 rounded-full bg-orange-300 opacity-70"></div>
          <div className="h-1 w-1 rounded-full bg-amber-300 opacity-70"></div>
          <div className="h-1 w-1 rounded-full bg-orange-300 opacity-70"></div>
        </div>
      </header>
    </div>
  );
};

export default PosNavbar;
