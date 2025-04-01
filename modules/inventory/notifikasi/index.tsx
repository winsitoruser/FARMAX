import React, { useState } from 'react';
import { 
  FaBell, FaCalendarTimes, FaBoxOpen, FaExchangeAlt, 
  FaList, FaCheckCircle, FaTimesCircle, FaFilter, FaSearch
} from 'react-icons/fa';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { format, formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { formatRupiah } from '@/lib/utils';

// Data sample notifikasi
const sampleNotifications = [
  {
    id: 'N001',
    type: 'expiry',
    title: 'Produk akan kedaluwarsa',
    description: 'Paracetamol 500mg (Batch: B-2023-001) akan kedaluwarsa dalam 10 hari',
    date: '2025-03-20T14:30:00',
    branch: 'Apotek Pusat - Jakarta',
    branchId: 'BR001',
    isRead: true,
    priority: 'high',
    link: '/inventory/kedaluwarsa',
    productId: 'P001',
    batchId: 'B-2023-001',
    expiryDate: '2025-04-10',
    daysUntilExpiry: 10,
    quantity: 120,
    value: 1500000
  },
  {
    id: 'N002',
    type: 'stock',
    title: 'Stok menipis',
    description: 'Amoxicillin 500mg mencapai batas minimum stok',
    date: '2025-03-28T09:15:00',
    branch: 'Cabang Bandung',
    branchId: 'BR002',
    isRead: false,
    priority: 'medium',
    link: '/inventory/dashboard',
    productId: 'P006',
    currentStock: 50,
    minStock: 60,
    value: 1750000
  },
  {
    id: 'N003',
    type: 'transfer',
    title: 'Permintaan transfer stok baru',
    description: 'Cabang Medan meminta transfer 10 produk',
    date: '2025-03-29T11:20:00',
    branch: 'Cabang Medan',
    branchId: 'BR004',
    isRead: false,
    priority: 'medium',
    link: '/inventory/transfer-stok',
    transferId: 'TR001',
    requestedItems: 10,
    requestedValue: 3200000
  },
  {
    id: 'N004',
    type: 'expiry',
    title: 'Produk sudah kedaluwarsa',
    description: 'Omeprazole 20mg (Batch: B-2023-042) telah kedaluwarsa 5 hari yang lalu',
    date: '2025-03-25T08:45:00',
    branch: 'Cabang Surabaya',
    branchId: 'BR003',
    isRead: true,
    priority: 'high',
    link: '/inventory/kedaluwarsa',
    productId: 'P007',
    batchId: 'B-2023-042',
    expiryDate: '2025-03-20',
    daysUntilExpiry: -5,
    quantity: 85,
    value: 1190000
  },
  {
    id: 'N005',
    type: 'disposal',
    title: 'Pemusnahan dijadwalkan',
    description: 'Pemusnahan obat batch B-2022-001 dijadwalkan pada 5 April 2025',
    date: '2025-03-28T13:10:00',
    branch: 'Apotek Pusat - Jakarta',
    branchId: 'BR001',
    isRead: false,
    priority: 'low',
    link: '/inventory/kedaluwarsa/pemusnahan',
    disposalId: 'D001',
    scheduledDate: '2025-04-05',
    items: 8,
    disposalValue: 2850000
  },
  {
    id: 'N006',
    type: 'stock',
    title: 'Stok berlebih',
    description: 'Vitamin C 1000mg melebihi batas maksimum stok',
    date: '2025-03-27T15:45:00',
    branch: 'Cabang Bandung',
    branchId: 'BR002',
    isRead: true,
    priority: 'low',
    link: '/inventory/dashboard',
    productId: 'P010',
    currentStock: 1200,
    maxStock: 1000,
    value: 18000000
  },
  {
    id: 'N007',
    type: 'expiry',
    title: 'Produk akan kedaluwarsa',
    description: 'Antasida Tablet (Batch: B-2023-058) akan kedaluwarsa dalam 15 hari',
    date: '2025-03-26T10:30:00',
    branch: 'Cabang Medan',
    branchId: 'BR004',
    isRead: false,
    priority: 'medium',
    link: '/inventory/kedaluwarsa',
    productId: 'P003',
    batchId: 'B-2023-058',
    expiryDate: '2025-04-15',
    daysUntilExpiry: 15,
    quantity: 200,
    value: 2000000
  },
  {
    id: 'N008',
    type: 'transfer',
    title: 'Transfer stok selesai',
    description: 'Transfer dari Apotek Pusat ke Cabang Surabaya telah diterima',
    date: '2025-03-24T16:20:00',
    branch: 'Cabang Surabaya',
    branchId: 'BR003',
    isRead: true,
    priority: 'low',
    link: '/inventory/transfer-stok',
    transferId: 'TR007',
    completedItems: 15,
    transferValue: 4500000
  }
];

// Data ringkasan notifikasi
const notificationSummary = {
  expiry: 12,
  urgent: 5,
  unread: 15,
  stock: 8,
  transfer: 6,
  disposal: 2
};

const NotifikasiInventaris: React.FC = () => {
  const [activeTab, setActiveTab] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBranch, setFilterBranch] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterRead, setFilterRead] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 6;
  
  // Filter notifikasi berdasarkan tab
  const filterNotificationsByTab = (notifications: any[], tab: string) => {
    if (tab === 'semua') return notifications;
    return notifications.filter(notif => notif.type === tab);
  };
  
  // Filter notifikasi berdasarkan pencarian dan filter
  const filteredNotifications = sampleNotifications.filter(notif => {
    // Filter berdasarkan tab
    if (activeTab !== 'semua' && notif.type !== activeTab) {
      return false;
    }
    
    // Filter berdasarkan cabang
    if (filterBranch !== 'all' && notif.branchId !== filterBranch) {
      return false;
    }
    
    // Filter berdasarkan prioritas
    if (filterPriority !== 'all' && notif.priority !== filterPriority) {
      return false;
    }
    
    // Filter berdasarkan status baca
    if (filterRead === 'read' && !notif.isRead) {
      return false;
    } else if (filterRead === 'unread' && notif.isRead) {
      return false;
    }
    
    // Filter berdasarkan pencarian
    if (
      searchQuery && 
      !notif.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !notif.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    return true;
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Helper untuk mendapatkan ikon notifikasi
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'expiry':
        return <FaCalendarTimes className="text-red-500" />;
      case 'stock':
        return <FaBoxOpen className="text-amber-500" />;
      case 'transfer':
        return <FaExchangeAlt className="text-blue-500" />;
      case 'disposal':
        return <FaList className="text-purple-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };
  
  // Helper untuk mendapatkan warna prioritas
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Helper untuk mendapatkan label prioritas
  const getPriorityLabel = (priority: string): string => {
    switch (priority) {
      case 'high':
        return 'Tinggi';
      case 'medium':
        return 'Sedang';
      case 'low':
        return 'Rendah';
      default:
        return priority;
    }
  };
  
  // Helper untuk mendapatkan waktu relatif
  const getRelativeTime = (dateString: string): string => {
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true,
      locale: id
    });
  };
  
  // Handler untuk menandai semua sebagai terbaca
  const markAllAsRead = () => {
    console.log('Menandai semua notifikasi sebagai terbaca');
    // Implementasi API untuk menandai semua sebagai terbaca
  };
  
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Notifikasi Inventaris</h1>
          <p className="text-gray-500">Pantau peringatan stok, kedaluwarsa, dan pergerakan</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead}>
            <FaCheckCircle className="mr-2 h-4 w-4" />
            <span>Tandai Semua Terbaca</span>
          </Button>
        </div>
      </div>
      
      {/* Ringkasan notifikasi */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <Card className="overflow-hidden">
          <CardContent className="p-2">
            <div className="flex items-center space-x-3">
              <div className="bg-gray-100 p-2 rounded-full">
                <FaBell className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <div className="text-lg font-bold">{notificationSummary.unread}</div>
                <p className="text-xs text-gray-500">Belum Dibaca</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardContent className="p-2">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-2 rounded-full">
                <FaCalendarTimes className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <div className="text-lg font-bold">{notificationSummary.expiry}</div>
                <p className="text-xs text-gray-500">Kedaluwarsa</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardContent className="p-2">
            <div className="flex items-center space-x-3">
              <div className="bg-amber-100 p-2 rounded-full">
                <FaBoxOpen className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <div className="text-lg font-bold">{notificationSummary.stock}</div>
                <p className="text-xs text-gray-500">Stok</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardContent className="p-2">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <FaExchangeAlt className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <div className="text-lg font-bold">{notificationSummary.transfer}</div>
                <p className="text-xs text-gray-500">Transfer</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardContent className="p-2">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-full">
                <FaList className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <div className="text-lg font-bold">{notificationSummary.disposal}</div>
                <p className="text-xs text-gray-500">Pemusnahan</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardContent className="p-2">
            <div className="flex items-center space-x-3">
              <div className="bg-pink-100 p-2 rounded-full">
                <FaTimesCircle className="h-5 w-5 text-pink-500" />
              </div>
              <div>
                <div className="text-lg font-bold">{notificationSummary.urgent}</div>
                <p className="text-xs text-gray-500">Mendesak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle>Filter Notifikasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
            <div>
              <Input
                placeholder="Cari notifikasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                icon={<FaSearch className="text-gray-400" />}
              />
            </div>
            <div>
              <Select value={filterBranch} onValueChange={setFilterBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Cabang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Cabang</SelectItem>
                  <SelectItem value="BR001">Apotek Pusat - Jakarta</SelectItem>
                  <SelectItem value="BR002">Cabang Bandung</SelectItem>
                  <SelectItem value="BR003">Cabang Surabaya</SelectItem>
                  <SelectItem value="BR004">Cabang Medan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Prioritas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Prioritas</SelectItem>
                  <SelectItem value="high">Prioritas Tinggi</SelectItem>
                  <SelectItem value="medium">Prioritas Sedang</SelectItem>
                  <SelectItem value="low">Prioritas Rendah</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={filterRead} onValueChange={setFilterRead}>
                <SelectTrigger>
                  <SelectValue placeholder="Status Baca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="read">Sudah Dibaca</SelectItem>
                  <SelectItem value="unread">Belum Dibaca</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setSearchQuery('');
              setFilterBranch('all');
              setFilterPriority('all');
              setFilterRead('all');
            }}
          >
            <FaFilter className="mr-2 h-4 w-4" />
            <span>Reset Filter</span>
          </Button>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full max-w-xl">
          <TabsTrigger value="semua">Semua</TabsTrigger>
          <TabsTrigger value="expiry">Kedaluwarsa</TabsTrigger>
          <TabsTrigger value="stock">Stok</TabsTrigger>
          <TabsTrigger value="transfer">Transfer</TabsTrigger>
          <TabsTrigger value="disposal">Pemusnahan</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-4 space-y-4">
          {paginatedNotifications.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4">
                {paginatedNotifications.map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={`overflow-hidden border-l-4 ${
                      notification.isRead ? 'border-l-gray-200' : 
                      notification.priority === 'high' ? 'border-l-red-500' :
                      notification.priority === 'medium' ? 'border-l-amber-500' :
                      'border-l-blue-500'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10 mt-1">
                          <AvatarFallback className="bg-orange-100">
                            {getNotificationIcon(notification.type)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{notification.title}</h4>
                            <div className="flex items-center gap-2">
                              <Badge className={getPriorityColor(notification.priority)}>
                                {getPriorityLabel(notification.priority)}
                              </Badge>
                              {!notification.isRead && (
                                <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                              )}
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600">{notification.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                            <span>{notification.branch}</span>
                            <span>•</span>
                            <span>{getRelativeTime(notification.date)}</span>
                            
                            {notification.type === 'expiry' && (
                              <>
                                <span>•</span>
                                <span className={notification.daysUntilExpiry < 0 ? 'text-red-600' : 'text-amber-600'}>
                                  {notification.daysUntilExpiry < 0 
                                    ? `Kedaluwarsa ${Math.abs(notification.daysUntilExpiry)} hari yang lalu` 
                                    : `${notification.daysUntilExpiry} hari lagi`
                                  }
                                </span>
                              </>
                            )}
                            
                            {notification.type === 'stock' && (
                              <>
                                <span>•</span>
                                <span>
                                  {notification.currentStock} / {
                                    notification.minStock || notification.maxStock
                                  } unit
                                </span>
                              </>
                            )}
                          </div>
                          
                          <div className="flex justify-between items-center pt-2">
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="p-0 h-auto text-orange-600 hover:text-orange-800"
                            >
                              Lihat Detail
                            </Button>
                            
                            {!notification.isRead && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8"
                              >
                                <FaCheckCircle className="mr-2 h-3 w-3" />
                                <span>Tandai Terbaca</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, filteredNotifications.length)} - {Math.min(currentPage * itemsPerPage, filteredNotifications.length)} dari {filteredNotifications.length} notifikasi
                </div>
                
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    
                    {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            isActive={currentPage === pageNumber}
                            onClick={() => setCurrentPage(pageNumber)}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages || totalPages === 0}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <FaBell className="h-12 w-12 text-gray-300" />
                  <h3 className="text-xl font-medium text-gray-900">Tidak ada notifikasi</h3>
                  <p className="text-sm text-gray-500">
                    Tidak ada notifikasi yang sesuai dengan filter yang Anda pilih
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotifikasiInventaris;
