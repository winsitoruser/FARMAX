import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { 
  FaChartBar, FaBell, FaExclamationTriangle, 
  FaHistory, FaSync, FaBoxes, FaStore, FaDownload
} from 'react-icons/fa';

// Import komponen-komponen integrasi
import RealTimeStockTracker from './real-time/real-time-tracker';
import ErrorDashboard from './error-handling/error-dashboard';
import SyncNotificationCenter from './notifications/sync-notification-center';
import SalesTrendsChart from './analytics/sales-trends-chart';
import InventoryImpactChart from './analytics/inventory-impact-chart';
import TopProductsChart from './analytics/top-products-chart';
import BranchPerformanceChart from './analytics/branch-performance-chart';
import StockMovementAnalytics from './analytics/stock-movement-analytics';

const IntegratedPOSInventory: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [interval, setInterval] = useState('daily');
  const [isLoading, setIsLoading] = useState(false);
  
  // Data dummy untuk analytics
  const analyticsData = {
    salesTrends: {
      // Data untuk SalesTrendsChart
    },
    inventoryImpact: {
      // Data untuk InventoryImpactChart
    },
    topProducts: {
      // Data untuk TopProductsChart
    },
    branchPerformance: {
      // Data untuk BranchPerformanceChart
    }
  };
  
  const branches = [
    { id: 'all', name: 'Semua Cabang' },
    { id: 'branch-1', name: 'Apotek Pusat - Jakarta' },
    { id: 'branch-2', name: 'Cabang Bandung' },
    { id: 'branch-3', name: 'Cabang Surabaya' },
    { id: 'branch-4', name: 'Cabang Medan' }
  ];
  
  const intervals = [
    { id: 'daily', name: 'Harian' },
    { id: 'weekly', name: 'Mingguan' },
    { id: 'monthly', name: 'Bulanan' }
  ];
  
  // Mengubah filter dan memuat ulang data
  const applyFilters = () => {
    setIsLoading(true);
    
    // Logika untuk memuat data berdasarkan filter
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  // Ekspor data ke Excel/CSV
  const exportData = () => {
    alert('Ekspor data akan diunduh sebagai file Excel');
  };
  
  // Render status sinkronisasi
  const renderSyncStatus = () => {
    const syncData = {
      lastSync: new Date(Date.now() - 45 * 60000), // 45 menit yang lalu
      status: 'success', // success, warning, error
      unsyncedItems: 0,
      scheduleStatus: 'active' // active, paused
    };
    
    return (
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${
          syncData.status === 'success' ? 'bg-green-500' : 
          syncData.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
        }`}></div>
        
        <div className="text-sm">
          <div className="font-medium">
            {syncData.status === 'success' 
              ? 'Sinkronisasi Lengkap' 
              : syncData.status === 'warning'
                ? 'Perlu Perhatian'
                : 'Error Sinkronisasi'
            }
          </div>
          <div className="text-gray-500">
            Terakhir: {format(syncData.lastSync, 'dd MMM yyyy, HH:mm', { locale: id })}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Header Utama */}
      <Card className="overflow-hidden">
        <CardHeader className="relative bg-gradient-to-r from-orange-500 to-amber-500 text-white pb-12">
          {/* Elemen dekoratif berbentuk lingkaran dengan blur */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white opacity-10 blur-xl transform translate-x-20 -translate-y-20"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white opacity-10 blur-xl transform -translate-x-20 translate-y-20"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10">
            <div>
              <CardTitle className="text-2xl font-bold">Integrasi POS & Inventaris</CardTitle>
              <CardDescription className="text-white/80 mt-1">
                Solusi terintegrasi untuk monitoring, analisis, dan pengelolaan data POS dan inventaris
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-3">
              {renderSyncStatus()}
              
              <Button 
                variant="secondary"
                size="sm"
                className="flex items-center gap-1"
              >
                <FaSync size={14} />
                <span>Sinkronkan Sekarang</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative -mt-8 z-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="overflow-hidden border-none shadow-lg">
            <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
            <CardContent className="p-6 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Transaksi POS</p>
                  <h3 className="text-2xl font-bold mt-1">2,845</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 flex items-center justify-center">
                  <FaBoxes className="text-orange-500" size={20} />
                </div>
              </div>
              <div className="text-xs text-green-500 mt-2">
                +12.5% dari bulan lalu
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-none shadow-lg">
            <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
            <CardContent className="p-6 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Cabang Aktif</p>
                  <h3 className="text-2xl font-bold mt-1">4</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 flex items-center justify-center">
                  <FaStore className="text-orange-500" size={20} />
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Semua cabang terintegrasi
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-none shadow-lg">
            <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
            <CardContent className="p-6 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pergerakan Stok</p>
                  <h3 className="text-2xl font-bold mt-1">12,487</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 flex items-center justify-center">
                  <FaHistory className="text-orange-500" size={20} />
                </div>
              </div>
              <div className="text-xs text-blue-500 mt-2">
                5,620 masuk | 6,867 keluar
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-none shadow-lg">
            <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
            <CardContent className="p-6 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Error & Notifikasi</p>
                  <h3 className="text-2xl font-bold mt-1">3</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 flex items-center justify-center">
                  <FaBell className="text-orange-500" size={20} />
                </div>
              </div>
              <div className="text-xs text-amber-500 mt-2">
                1 error | 2 peringatan
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
      
      {/* Tabs Utama */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full h-12">
          <TabsTrigger 
            value="dashboard" 
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger 
            value="realtime" 
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            Real-Time
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            Notifikasi
          </TabsTrigger>
          <TabsTrigger 
            value="errors" 
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            Error
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            Analitik
          </TabsTrigger>
        </TabsList>
        
        {/* Tab Content: Dashboard */}
        <TabsContent value="dashboard" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Integrasi</CardTitle>
              <CardDescription>
                Tampilan terintegrasi dari data POS dan inventaris
              </CardDescription>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <DatePickerWithRange
                  className="w-full sm:w-auto"
                  value={dateRange}
                  onChange={setDateRange}
                />
                
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Pilih cabang" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(branch => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={interval} onValueChange={setInterval}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Interval" />
                  </SelectTrigger>
                  <SelectContent>
                    {intervals.map(int => (
                      <SelectItem key={int.id} value={int.id}>
                        {int.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={applyFilters}
                >
                  Terapkan Filter
                </Button>
                
                <Button 
                  variant="outline"
                  className="ml-auto"
                  onClick={exportData}
                >
                  <FaDownload className="mr-2" size={14} />
                  Export
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <RealTimeStockTracker />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SalesTrendsChart data={analyticsData.salesTrends} isLoading={isLoading} />
                <InventoryImpactChart data={analyticsData.inventoryImpact} isLoading={isLoading} />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopProductsChart data={analyticsData.topProducts} isLoading={isLoading} />
                <BranchPerformanceChart data={analyticsData.branchPerformance} isLoading={isLoading} />
              </div>
              
              <ErrorDashboard />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab Content: Real-Time */}
        <TabsContent value="realtime" className="focus-visible:outline-none focus-visible:ring-0">
          <RealTimeStockTracker />
        </TabsContent>
        
        {/* Tab Content: Notifications */}
        <TabsContent value="notifications" className="focus-visible:outline-none focus-visible:ring-0">
          <SyncNotificationCenter />
        </TabsContent>
        
        {/* Tab Content: Errors */}
        <TabsContent value="errors" className="focus-visible:outline-none focus-visible:ring-0">
          <ErrorDashboard />
        </TabsContent>
        
        {/* Tab Content: Analytics */}
        <TabsContent value="analytics" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
          <Card>
            <CardHeader>
              <CardTitle>Analitik Integrasi POS & Inventaris</CardTitle>
              <CardDescription>
                Analisis mendalam tentang performa penjualan dan dampaknya pada inventaris
              </CardDescription>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <DatePickerWithRange
                  className="w-full sm:w-auto"
                  value={dateRange}
                  onChange={setDateRange}
                />
                
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Pilih cabang" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(branch => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={interval} onValueChange={setInterval}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Interval" />
                  </SelectTrigger>
                  <SelectContent>
                    {intervals.map(int => (
                      <SelectItem key={int.id} value={int.id}>
                        {int.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={applyFilters}
                >
                  Terapkan Filter
                </Button>
                
                <Button 
                  variant="outline"
                  className="ml-auto"
                  onClick={exportData}
                >
                  <FaDownload className="mr-2" size={14} />
                  Export
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <StockMovementAnalytics 
                filters={{
                  startDate: dateRange.from,
                  endDate: dateRange.to,
                  branchId: selectedBranch,
                  interval: interval as 'daily' | 'weekly' | 'monthly'
                }}
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SalesTrendsChart data={analyticsData.salesTrends} isLoading={isLoading} />
                <InventoryImpactChart data={analyticsData.inventoryImpact} isLoading={isLoading} />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopProductsChart data={analyticsData.topProducts} isLoading={isLoading} />
                <BranchPerformanceChart data={analyticsData.branchPerformance} isLoading={isLoading} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegratedPOSInventory;
