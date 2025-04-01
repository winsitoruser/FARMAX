import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { format, formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { 
  FaBell, FaExclamationTriangle, FaCheckCircle, FaInfoCircle, 
  FaCog, FaEye, FaSort, FaFilter, FaTrash, FaSyncAlt, FaHistory
} from 'react-icons/fa';

// Interface untuk notifikasi
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'sync_error' | 'sync_warning' | 'sync_success' | 'inventory_alert' | 'system_info';
  timestamp: Date;
  read: boolean;
  relatedEntity?: {
    id: string;
    type: string;
    name: string;
  };
  actionRequired?: boolean;
  actionLink?: string;
}

interface NotificationSettings {
  emailEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  syncErrorsEnabled: boolean;
  syncWarningsEnabled: boolean;
  inventoryAlertsEnabled: boolean;
  systemInfoEnabled: boolean;
}

const SyncNotificationCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [settings, setSettings] = useState<NotificationSettings>({
    emailEnabled: true,
    pushEnabled: true,
    inAppEnabled: true,
    syncErrorsEnabled: true,
    syncWarningsEnabled: true,
    inventoryAlertsEnabled: true,
    systemInfoEnabled: false
  });
  
  // Effect untuk memuat notifikasi
  useEffect(() => {
    fetchNotifications();
  }, [filter]);
  
  const fetchNotifications = () => {
    setIsLoading(true);
    
    // Simulasi fetch data dari API
    setTimeout(() => {
      const mockNotifications = generateMockNotifications();
      
      // Filter notifikasi berdasarkan tab aktif
      let filteredNotifications = mockNotifications;
      
      if (filter === 'unread') {
        filteredNotifications = mockNotifications.filter(n => !n.read);
      } else if (filter === 'action_required') {
        filteredNotifications = mockNotifications.filter(n => n.actionRequired);
      } else if (filter !== 'all') {
        filteredNotifications = mockNotifications.filter(n => n.type === filter);
      }
      
      setNotifications(filteredNotifications);
      setIsLoading(false);
    }, 1000);
  };
  
  // Tandai notifikasi sebagai sudah dibaca
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  // Tandai semua notifikasi sebagai sudah dibaca
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  // Hapus notifikasi
  const deleteNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };
  
  // Update pengaturan notifikasi
  const updateSetting = (setting: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  // Helper untuk mendapatkan ikon berdasarkan tipe notifikasi
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'sync_error':
        return <FaExclamationTriangle className="text-red-500" />;
      case 'sync_warning':
        return <FaExclamationTriangle className="text-amber-500" />;
      case 'sync_success':
        return <FaCheckCircle className="text-green-500" />;
      case 'inventory_alert':
        return <FaExclamationTriangle className="text-blue-500" />;
      case 'system_info':
        return <FaInfoCircle className="text-gray-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };
  
  // Helper untuk mendapatkan label tipe notifikasi
  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'sync_error':
        return <Badge variant="destructive">Error Sinkronisasi</Badge>;
      case 'sync_warning':
        return <Badge className="bg-amber-100 text-amber-800">Peringatan Sinkronisasi</Badge>;
      case 'sync_success':
        return <Badge className="bg-green-100 text-green-800">Sinkronisasi Berhasil</Badge>;
      case 'inventory_alert':
        return <Badge className="bg-blue-100 text-blue-800">Alert Inventaris</Badge>;
      case 'system_info':
        return <Badge variant="outline">Informasi Sistem</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };
  
  const getUnreadCount = (type?: string) => {
    if (!type || type === 'all') {
      return notifications.filter(n => !n.read).length;
    }
    return notifications.filter(n => !n.read && n.type === type).length;
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="relative bg-gradient-to-r from-orange-500 to-amber-500 text-white">
        {/* Elemen dekoratif berbentuk lingkaran dengan blur */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white opacity-10 blur-xl transform translate-x-10 -translate-y-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white opacity-10 blur-xl transform -translate-x-10 translate-y-10"></div>
        
        <div className="flex items-center justify-between z-10">
          <div>
            <CardTitle className="text-lg font-bold">Pusat Notifikasi Sinkronisasi</CardTitle>
            <CardDescription className="text-white/80 mt-1">
              Pemberitahuan terkait sinkronisasi data POS dan inventaris
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-white/20 border-white/30 text-white">
              {getUnreadCount()} belum dibaca
            </Badge>
            <Button 
              variant="secondary"
              size="sm"
              onClick={markAllAsRead}
              disabled={getUnreadCount() === 0}
            >
              <FaEye className="mr-2" size={12} />
              Tandai Semua Dibaca
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b px-4">
            <TabsList className="h-14">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:text-orange-500 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none h-14"
                onClick={() => setFilter('all')}
              >
                Semua
                {getUnreadCount('all') > 0 && (
                  <Badge variant="outline" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {getUnreadCount('all')}
                  </Badge>
                )}
              </TabsTrigger>
              
              <TabsTrigger 
                value="unread" 
                className="data-[state=active]:text-orange-500 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none h-14"
                onClick={() => setFilter('unread')}
              >
                Belum Dibaca
              </TabsTrigger>
              
              <TabsTrigger 
                value="errors" 
                className="data-[state=active]:text-orange-500 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none h-14"
                onClick={() => setFilter('sync_error')}
              >
                Error
                {getUnreadCount('sync_error') > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {getUnreadCount('sync_error')}
                  </Badge>
                )}
              </TabsTrigger>
              
              <TabsTrigger 
                value="warnings" 
                className="data-[state=active]:text-orange-500 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none h-14"
                onClick={() => setFilter('sync_warning')}
              >
                Peringatan
                {getUnreadCount('sync_warning') > 0 && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-amber-500 text-white">
                    {getUnreadCount('sync_warning')}
                  </Badge>
                )}
              </TabsTrigger>
              
              <TabsTrigger 
                value="settings" 
                className="data-[state=active]:text-orange-500 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none h-14"
              >
                Pengaturan
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="focus-visible:outline-none focus-visible:ring-0">
            <div className="p-4 border-b flex justify-between items-center">
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <FaFilter size={12} />
                <span>Filter dan Urutkan</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1 h-8">
                  <FaSort size={12} />
                  <span>Terbaru</span>
                </Button>
                
                <Button variant="outline" size="sm" className="flex items-center gap-1 h-8">
                  <FaFilter size={12} />
                  <span>Filter</span>
                </Button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="p-4 space-y-4">
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>
            ) : notifications.length > 0 ? (
              <div className="divide-y">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-orange-50' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${!notification.read ? 'bg-orange-100' : 'bg-gray-100'}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {notification.title}
                              {!notification.read && (
                                <span className="inline-block w-2 h-2 rounded-full bg-orange-500"></span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">{notification.message}</div>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {getNotificationTypeLabel(notification.type)}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xs text-gray-500">
                            {formatDistanceToNow(notification.timestamp, { addSuffix: true, locale: id })}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {notification.actionRequired && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-7 text-xs"
                              >
                                Tangani Masalah
                              </Button>
                            )}
                            
                            {!notification.read && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => markAsRead(notification.id)}
                              >
                                Tandai Dibaca
                              </Button>
                            )}
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <FaTrash size={12} className="text-gray-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-12 bg-gray-50">
                <FaCheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                <h3 className="text-lg font-medium">Tidak Ada Notifikasi</h3>
                <p className="text-gray-500 mt-2">Semua sistem berjalan dengan baik!</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="settings" className="p-4 space-y-6 focus-visible:outline-none focus-visible:ring-0">
            <div className="grid gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Metode Penerimaan Notifikasi</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email</Label>
                      <div className="text-sm text-gray-500">Terima notifikasi melalui email</div>
                    </div>
                    <Switch 
                      checked={settings.emailEnabled} 
                      onCheckedChange={(checked) => updateSetting('emailEnabled', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notification</Label>
                      <div className="text-sm text-gray-500">Terima notifikasi di perangkat seluler</div>
                    </div>
                    <Switch 
                      checked={settings.pushEnabled} 
                      onCheckedChange={(checked) => updateSetting('pushEnabled', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>In-App Notification</Label>
                      <div className="text-sm text-gray-500">Terima notifikasi di dalam aplikasi</div>
                    </div>
                    <Switch 
                      checked={settings.inAppEnabled} 
                      onCheckedChange={(checked) => updateSetting('inAppEnabled', checked)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Tipe Notifikasi</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Error Sinkronisasi</Label>
                      <div className="text-sm text-gray-500">
                        Notifikasi ketika terjadi error dalam proses sinkronisasi
                      </div>
                    </div>
                    <Switch 
                      checked={settings.syncErrorsEnabled} 
                      onCheckedChange={(checked) => updateSetting('syncErrorsEnabled', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Peringatan Sinkronisasi</Label>
                      <div className="text-sm text-gray-500">
                        Notifikasi ketika ada peringatan dalam proses sinkronisasi
                      </div>
                    </div>
                    <Switch 
                      checked={settings.syncWarningsEnabled} 
                      onCheckedChange={(checked) => updateSetting('syncWarningsEnabled', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Alert Inventaris</Label>
                      <div className="text-sm text-gray-500">
                        Notifikasi terkait perubahan stok yang signifikan
                      </div>
                    </div>
                    <Switch 
                      checked={settings.inventoryAlertsEnabled} 
                      onCheckedChange={(checked) => updateSetting('inventoryAlertsEnabled', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Informasi Sistem</Label>
                      <div className="text-sm text-gray-500">
                        Notifikasi umum tentang sistem
                      </div>
                    </div>
                    <Switch 
                      checked={settings.systemInfoEnabled} 
                      onCheckedChange={(checked) => updateSetting('systemInfoEnabled', checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-6 flex justify-end gap-2">
              <Button variant="outline">Reset ke Default</Button>
              <Button className="bg-orange-500 hover:bg-orange-600">Simpan Pengaturan</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="bg-gray-50 border-t p-4 flex justify-between items-center">
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <FaHistory size={14} />
          <span>
            Update terakhir: {format(new Date(), 'dd MMM yyyy, HH:mm:ss', { locale: id })}
          </span>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={fetchNotifications}
        >
          <FaSyncAlt size={12} />
          <span>Refresh</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

// Generator mock data untuk demo
const generateMockNotifications = (): Notification[] => {
  const now = new Date();
  
  const mockNotifications: Notification[] = [
    {
      id: 'n1',
      title: 'Sinkronisasi Gagal: Database Timeout',
      message: 'Sinkronisasi data POS gagal karena database timeout. Silakan coba lagi.',
      type: 'sync_error',
      timestamp: new Date(now.getTime() - 30 * 60000), // 30 menit yang lalu
      read: false,
      actionRequired: true,
      actionLink: '/inventory/pos-integration/sinkronisasi-data'
    },
    {
      id: 'n2',
      title: 'Stok Tidak Konsisten Terdeteksi',
      message: 'Ditemukan 5 produk dengan stok tidak konsisten antara POS dan inventaris.',
      type: 'sync_warning',
      timestamp: new Date(now.getTime() - 2 * 60 * 60000), // 2 jam yang lalu
      read: false,
      relatedEntity: {
        id: 'p1',
        type: 'product',
        name: 'Multiple Products'
      },
      actionRequired: true
    },
    {
      id: 'n3',
      title: 'Sinkronisasi Sukses',
      message: 'Sinkronisasi data berhasil diselesaikan. 156 produk diperbarui.',
      type: 'sync_success',
      timestamp: new Date(now.getTime() - 5 * 60 * 60000), // 5 jam yang lalu
      read: true
    },
    {
      id: 'n4',
      title: 'Stok Hampir Habis',
      message: 'Paracetamol 500mg tersisa 15 unit, di bawah batas minimum.',
      type: 'inventory_alert',
      timestamp: new Date(now.getTime() - 8 * 60 * 60000), // 8 jam yang lalu
      read: false,
      relatedEntity: {
        id: 'p2',
        type: 'product',
        name: 'Paracetamol 500mg'
      }
    },
    {
      id: 'n5',
      title: 'Pemeliharaan Server Dijadwalkan',
      message: 'Server akan mengalami pemeliharaan pada 5 April 2025 pukul 23:00 WIB.',
      type: 'system_info',
      timestamp: new Date(now.getTime() - 12 * 60 * 60000), // 12 jam yang lalu
      read: true
    },
    {
      id: 'n6',
      title: 'Error Validasi Data',
      message: 'Ditemukan data tidak valid dalam transaksi 15 produk.',
      type: 'sync_error',
      timestamp: new Date(now.getTime() - 24 * 60 * 60000), // 1 hari yang lalu
      read: true,
      actionRequired: false
    },
    {
      id: 'n7',
      title: 'Transaksi Duplikat Terdeteksi',
      message: 'Sistem mendeteksi 3 transaksi duplikat. Transaksi ini tidak disinkronkan.',
      type: 'sync_warning',
      timestamp: new Date(now.getTime() - 36 * 60 * 60000), // 1.5 hari yang lalu
      read: true
    },
    {
      id: 'n8',
      title: 'Sinkronisasi Incremental Berhasil',
      message: 'Sinkronisasi incremental berhasil. 27 transaksi diproses.',
      type: 'sync_success',
      timestamp: new Date(now.getTime() - 48 * 60 * 60000), // 2 hari yang lalu
      read: true
    }
  ];
  
  return mockNotifications;
};

export default SyncNotificationCenter;
